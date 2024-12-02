import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import React, { Dispatch, ReactNode, SetStateAction, useCallback, useEffect } from 'react'
import { KeyedMutator } from 'swr'
import { getAlgoliaKey } from '../../network/lib/organization'
import { createPostAtom } from '../atoms/displayAtom'
import {
  meilisearchClientAtom,
  metaDataAtom,
  searchKeyAtom,
  showIntercomChatAtom,
} from '../atoms/orgAtom'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionFilters, ISubmissionPaginate } from '../interfaces/ISubmission'
import CreatePost from './CreatePost'
import DashboardLoadingPage from './DashboardLoadingPage'
import PublicBoardMenu from './PublicBoardMenu'
import { useTranslation } from 'next-i18next'
import PrivateOrg from './PrivateOrg'
import { cn, initIntercom } from '@/lib/utils'
import BoardAndDashboardWrapper from './BoardAndDashboardWrapper'
import PopupWrapper from './PopupWrapper'
import Script from 'next/script'
import { useTheme } from 'next-themes'
import SelfServeDropdown from './SelfServeDropdown'
import FBAIBot from './FBAIBot'
import { useIntercom } from 'react-use-intercom'
import { isMember } from '@/lib/acl'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import Tinybird from './Tinybird'

const PublicBoardWrapper: React.FC<{
  children: ReactNode
  wide?: boolean
  mutateSubmissions?: KeyedMutator<any[]>
  setFilters?: Dispatch<SetStateAction<ISubmissionFilters>>
  filters?: ISubmissionFilters
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate | undefined
  mutateChangelogs?: KeyedMutator<any[]>
  setActiveSubmissionId?: Dispatch<SetStateAction<string>> | undefined
  submissionResults?: ISubmission[] | undefined
  hideMobilePadding?: boolean
  fullWidth?: boolean
  module?: 'feedback' | 'help_center' | 'changelog' | 'survey'
}> = ({
  children,
  wide = false,
  mutateSubmissions,
  setFilters,
  filters,
  rawSubmissionData,
  mutateChangelogs,
  submissionResults,
  setActiveSubmissionId,
  hideMobilePadding = false,
  fullWidth = false,
  module = 'feedback',
}) => {
  const [createPost, setCreatePost] = useAtom(createPostAtom)
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)

  const [showChat, setShowChat] = useAtom(showIntercomChatAtom)
  const [searchKey, setSearchKey] = useAtom(searchKeyAtom)
  const [metaData, setMetaData] = useAtom(metaDataAtom)

  const router = useRouter()
  const { t } = useTranslation()
  const { boot } = useIntercom()
  const { systemTheme } = useTheme()
  const activeTheme = org.settings.customTheme.enabled
    ? 'dark'
    : org.settings.defaultTheme !== 'client'
    ? org.settings.defaultTheme
    : systemTheme

  const updateMetadata = useCallback(
    (newMetadata: any) => {
      setMetaData((prevMetadata) => ({
        ...prevMetadata,
        ...newMetadata,
      }))
    },
    [setMetaData]
  )

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      if (!e.data || e.data.target !== 'FeaturebaseWidget') return

      switch (e.data.data.action) {
        case 'updateMetadata':
          updateMetadata(e.data.data.metadata)
          break

        default:
          return
      }
    }

    window?.addEventListener('message', handler)

    return () => window.removeEventListener('message', handler)
  }, []) // empty array => run only once

  useEffect(() => {
    getAlgoliaKey()
      .then((res) => {
        if (res?.data?.publicKey) {
          setSearchKey(res.data.publicKey)
          setMeilisearchClient(
            instantMeiliSearch(
              process.env.NEXT_PUBLIC_MEILISEARCH_HOST as string,
              res.data.publicKey
            ).searchClient
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [user])

  useEffect(() => {
    if (user && org && org.subscriptionStatus === 'trial_ended' && isMember(user?.id, org)) {
      if (!router.pathname.includes('pricing')) {
        router.push('/dashboard/settings/pricing')
      }
    }
  }, [router, org, user])

  useEffect(() => {
    const win = window as any

    if (typeof win.Featurebase !== 'function') {
      win.Featurebase = function () {
        // eslint-disable-next-line prefer-rest-params
        ;(win.Featurebase.q = win.Featurebase.q || []).push(arguments)
      }
    }

    if (activeTheme) {
      win.Featurebase(
        'initialize_survey_widget',
        {
          organization: org.name, // required
          placement: 'bottom-right', // optional (bottom-right or bottom-left)
          theme: activeTheme, // optional (light or dark)
          email: user?.email, // optional - add user email
          userHash: user?.featurebaseUserHash,
        },
        (err: any) => {
          // Callback function. Called when identify completed.
          if (err) {
            // console.error(err);
          } else {
            // console.log("Data sent successfully!");
          }
        }
      )
    }
  }, [activeTheme, user])

  useEffect(() => {
    if (user && org && isMember(user.id, org)) {
      initIntercom(user, org, boot, setShowChat)

      window.Featurebase('initialize_feedback_widget', {
        organization: 'feedback',
        theme: activeTheme,
        userHash: user.featurebaseUserHash,
      })
    }
  }, [org, user, activeTheme])

  if (typeof window !== 'undefined' && !(window as any).FEATUREBASE_ENV) {
    ;(window as any).FEATUREBASE_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT
  }

  if (org) {
    return (
      <BoardAndDashboardWrapper>
        <Tinybird module={module} />

        <div>
          <style>
            {`
            :root {
              .dark {
                // --background: 224 22% 20%;
              }
            }
            `}
          </style>
          <PrivateOrg />
          <Script
            src={
              process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
                ? 'https://sdk.fbasedev.com/dist/sdk.js'
                : 'https://do.featurebase.app/js/sdk.js'
            }
            id="featurebase-sdk"
          />

          {isMember(user?.id, org) ? (
            <>
              <FBAIBot />
              <SelfServeDropdown />
            </>
          ) : null}

          {router.pathname !== '/' && !isMember(user?.id, org) && !org?.whitelabel && (
            <a
              className="fixed bottom-0 right-0 xl:right-[10vw] z-50"
              href={`https://featurebase.app?utm_source=${
                org?.name ? org.name : 'feedback'
              }&utm_medium=feedback-board&utm_campaign=powered-by&utm_id=${org?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <button className="px-1.5 py-0.5 text-xs rounded-r-none xl:rounded-tr-md rounded-b-none font-semibold text-background-accent dark:text-foreground shadow-none white-btn dark:bg-secondary dark:border-border hover:dark:bg-border rounded-mdinline-flex border-gray-100/50 hover:border-gray-100 ">
                {t('powered-by-featurebase')}
              </button>
            </a>
          )}

          <PublicBoardMenu
            setActiveSubmissionId={setActiveSubmissionId}
            mutateChangelogs={mutateChangelogs}
            setFilters={setFilters}
            filters={filters}
          />

          <div className={cn('mt-8 md:px-6 xl:px-0', !hideMobilePadding && 'px-4')}>
            <div className={`${wide ? 'max-w-9xl' : !fullWidth ? 'max-w-5xl' : ''}  mx-auto`}>
              {children}
            </div>
          </div>
          {mutateSubmissions && (org.settings.anyoneCanSubmit || user) && (
            <PopupWrapper
              hasPadding={false}
              fixToTop={true}
              isOpen={createPost}
              setIsOpen={setCreatePost}
              medium={true}
            >
              <CreatePost
                rawSubmissionData={rawSubmissionData}
                isOpen={createPost}
                mutateSubmissions={mutateSubmissions}
                setIsOpen={setCreatePost}
                submissionResults={submissionResults}
              />
            </PopupWrapper>
          )}
        </div>
      </BoardAndDashboardWrapper>
    )
  } else {
    return <DashboardLoadingPage />
  }
}

export default PublicBoardWrapper
