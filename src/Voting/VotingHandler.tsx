import { BanIcon, BellIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import React, { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr/dist/types'
import { downvote, upvote } from '../../network/lib/submission'
import { authenitcateModalAtom } from '../atoms/authAtom'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import { cn } from '@/lib/utils'
import Survey from './Survey'
import { AnimatePresence } from 'framer-motion'
import { getOrganization } from 'network/lib/organization'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { Button } from './radix/Button'
import { isMember } from '@/lib/acl'

// Shortened upvote count for number over 1000
export function shortenNumber(num: number): string {
  if (num < 1000) return num.toString()

  const units: string[] = ['k', 'M', 'B', 'T']
  let unitIndex = 0

  while (num >= 1000 && unitIndex < units.length) {
    num /= 1000
    unitIndex++
  }

  return `${num.toFixed(1)}${units[unitIndex - 1]}`
}

const VotingHandler: React.FC<{
  submission: ISubmission
  small: boolean
  width?: number
  mutateSubmissions: KeyedMutator<any>
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate
  widget?: boolean
  subscribe?: boolean
  justVoted?: boolean
  setJustVoted?: React.Dispatch<React.SetStateAction<boolean>>
  renderDate?: Date | undefined
  setLocalAuthenitacteModal?: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  submission,
  small = false,
  mutateSubmissions,
  rawSubmissionData,
  widget = false,
  subscribe = false,
  justVoted,
  setJustVoted,
  width,
  renderDate,
  setLocalAuthenitacteModal,
}) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [activeVotePromise, setActiveVotePromise] = useState({ active: false, action: '' })
  const { t } = useTranslation()

  const hideCount = isMember(user?.id, org)
    ? false
    : submission.upvoted
    ? false
    : org?.settings.hideVoteCountUntilVoted || false

  const addUpvoterPicture = (
    recentUpvoters: { name: string; profilePicture: string; id: string }[],
    upvote: boolean
  ) => {
    if (user) {
      if (upvote && recentUpvoters.filter((upvoter) => upvoter.id === user.id).length === 0) {
        return [
          { name: user?.name, profilePicture: user?.profilePicture, id: user?.id },
          ...recentUpvoters,
        ]
      } else {
        return recentUpvoters.filter((upvoter) => upvoter.id !== user.id)
      }
    } else {
      return recentUpvoters
    }
  }

  const generateNewSubmissionData = (
    oldResults: ISubmission[],
    voteType: 'upvote' | 'downvote'
  ) => {
    return oldResults.map((sub) => {
      if (sub.id !== submission.id) {
        return sub
      }

      const isUpvoting = voteType === 'upvote'
      const wasUpvoted = sub.upvoted
      const wasDownvoted = sub.downvoted

      // Determine the new state after the vote
      let newUpvoted = isUpvoting && !wasUpvoted
      let newDownvoted = !isUpvoting && !wasDownvoted

      // Adjust the upvote count based on the new voting state
      let upvoteAdjustment = 0
      if (newUpvoted) {
        upvoteAdjustment = wasDownvoted ? 2 : 1
      } else if (newDownvoted) {
        upvoteAdjustment = wasUpvoted ? -2 : -1
      } else if (wasUpvoted || wasDownvoted) {
        // Undoing a vote
        upvoteAdjustment = wasUpvoted ? -1 : 1
      }

      return {
        ...sub,
        upvoted: newUpvoted,
        downvoted: newDownvoted,
        upvotes: sub.upvotes + upvoteAdjustment,
      }
    })
  }

  const mutateSubmissionsAfterVote = (upvote: boolean) => {
    if (!rawSubmissionData) {
      mutateSubmissions()
      return
    }

    if (!Array.isArray(rawSubmissionData)) {
      // Mutate data for single submission
      mutateSubmissions(
        {
          ...rawSubmissionData,
          results: generateNewSubmissionData(
            rawSubmissionData.results,
            upvote ? 'upvote' : 'downvote'
          ),
        },
        false
      )
    } else if (Array.isArray(rawSubmissionData)) {
      mutateSubmissions(
        rawSubmissionData.map((entry) => ({
          ...entry,
          results: generateNewSubmissionData(entry.results, upvote ? 'upvote' : 'downvote'),
        })),
        false
      )
    }
  }

  const handleVote = (type: 'upvote' | 'downvote', token?: string) => {
    if (type === 'upvote') {
      upvote(submission.id, token)
        .then((res) => {
          if (res.data.success) {
            mutateSubmissionsAfterVote(true)
          }
        })
        .catch((err: AxiosError) => toast.error(err.response?.data.message))
    } else {
      downvote(submission.id, token)
        .then((res) => {
          if (res.data.success) {
            mutateSubmissionsAfterVote(false)
          }
        })
        .catch((err: AxiosError) => toast.error(err.response?.data.message))
    }
  }

  useEffect(() => {
    if (
      user &&
      activeVotePromise.active &&
      (activeVotePromise.action === 'upvote' || activeVotePromise.action === 'downvote')
    ) {
      getOrganization()
        .then((res) => {
          handleVote(activeVotePromise.action as any, res.data.csrfToken)
          setActiveVotePromise({ action: '', active: false })
        })
        .catch((err: AxiosError) => toast.error(err.response?.data.message))
    }
  }, [user, activeVotePromise])

  const isIframeContext = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.parent !== window
  }, [])

  const onVote = (type: 'upvote' | 'downvote') => {
    if (subscribe) {
      if (user) {
        handleVote(type)
      } else {
        setLocalAuthenitacteModal ? setLocalAuthenitacteModal(true) : setAuthenitacteModal(true)
        setActiveVotePromise({ action: type, active: true })
      }
    } else {
      if ((!isIframeContext && org.settings.anyoneCanUpvote) || user) {
        handleVote(type)
      } else {
        setLocalAuthenitacteModal ? setLocalAuthenitacteModal(true) : setAuthenitacteModal(true)

        setActiveVotePromise({ action: type, active: true })
      }
    }
  }

  const renderSmallUpvoterButton = () => {
    return (
      <button
        onClick={() => onVote('upvote')}
        className={`flex px-2 py-1 ${
          shortenNumber(submission.upvotes).toString().length > 2 ? 'w-16' : 'w-14'
        } items-center justify-center text-gray-500 border  rounded-md shadow-none white-btn dark:text-foreground dark:border-border bg-gray-50/50 border-gray-100/50 dark:bg-secondary dark:hover:bg-border`}
      >
        <ChevronUpIcon
          className={`${
            submission.upvoted
              ? `dark:text-accent text-accent`
              : `dark:text-foreground/60 text-background-accent/80`
          } flex-shrink-0 mr-2 w-5 h-5`}
        />
        <p className={hideCount ? 'blur-[3px] transform-gpu dark:text-foreground' : 'font-medium'}>
          {hideCount ? '76' : shortenNumber(submission.upvotes)}
        </p>
      </button>
    )
  }

  const renderLargeUpvoteButton = () => {
    return (
      <button
        key={submission.id + 'vote'}
        onClick={() => {
          if (!org?.settings.downvotesEnabled) {
            onVote('upvote')
            if (setJustVoted) {
              submission.upvoted ? setJustVoted(false) : setJustVoted(true)
            }
          }
        }}
        className={cn(
          !org?.settings.downvotesEnabled && 'cursor-pointer',
          'unstyled-button flex flex-shrink-0  flex-col items-center justify-center w-14 sm:w-16 py-2 border-l border-gray-100/60 dark:border-dark-accent/40 hover:dark:border-dark-accent main-transition group dark:hover:bg-border/50 hover:bg-gray-100/40 hover:border-gray-100',
          submission.upvoted &&
            'bg-gradient-to-r from-accent/5  hover:bg-accent/10 border-accent/20 dark:border-accent/20 hover:border-accent/30  dark:hover:border-l-accent dark:hover:border-accent/20 dark:hover:bg-border/20',
          submission.downvoted &&
            'bg-gradient-to-r from-rose-400/5  hover:bg-rose-400/10 border-rose-400/20 dark:border-rose-400/20 hover:border-rose-400/30  dark:hover:border-l-rose-400 dark:hover:border-rose-400/20 dark:hover:bg-rose-400/20',
          widget && 'ml-2'
        )}
      >
        <div
          className={`${
            org?.settings.downvotesEnabled
              ? ''
              : `group-hover:text-background-accent group-hover:dark:text-foreground`
          } main-transition cursor-pointer text-background-accent/70  dark:text-background-accent  flex flex-col items-center justify-center pb-1  px-2 rounded-md`}
        >
          <ChevronUpIcon
            onClick={() => {
              if (org?.settings.downvotesEnabled) {
                onVote('upvote')
                if (setJustVoted) {
                  submission.upvoted ? setJustVoted(false) : setJustVoted(true)
                }
              }
            }}
            className={`${
              submission.upvoted
                ? `text-accent hover:text-accent`
                : org?.settings.downvotesEnabled &&
                  'hover:text-background-accent hover:dark:text-foreground'
            }  flex-shrink-0 w-6 h-6 group-focus:-translate-y-2 group-hover:-translate-y-0.5 cursor-pointer main-transition`}
          />
          <p
            className={`text-sm font-semibold text-gray-400 dark:text-gray-100 ${
              hideCount ? 'blur-[3px] transform-gpu dark:text-foreground' : ''
            }`}
          >
            {hideCount ? '0' : shortenNumber(submission.upvotes)}
          </p>

          {org?.settings.downvotesEnabled && (
            <ChevronDownIcon
              onClick={() => onVote('downvote')}
              className={`${
                submission.downvoted
                  ? 'text-red-400 hover:text-red-300'
                  : org?.settings.downvotesEnabled &&
                    'hover:text-background-accent hover:dark:text-foreground'
              } main-transition group-hover:translate-y-0.5 w-6 h-6 cursor-pointer`}
            />
          )}
        </div>
      </button>
    )
  }

  if (subscribe) {
    return (
      <div className="relative w-full py-4 sm:p-4 ">
        <svg
          className="absolute bottom-0 right-0 w-10 h-10 m-5 text-gray-200 md:h-6 md:w-6 lg:h-8 lg:w-8 dark:text-border"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.1 2.4C11.4 4.5 2.8 33 3.4 34.6C4.2 36.6 7.1 36.3 9.6 33.9C11.7 31.9 12.3 31.9 20.7 32.9C34.3 34.6 34.8 34.5 36.4 30.7C38.6 25.3 39.3 22.7 38.3 23.3C37.8 23.6 36.7 25.8 36 28.1L34.6 32.3L22.7 31.6C12.6 31 10.5 31.1 8.3 32.5C7 33.4 5.6 33.9 5.3 33.6C5 33.3 5.7 30.5 6.8 27.3C8 24.1 10 17.6 11.5 12.8C14.3 3.2 15.7 1.3 16.6 5.9C17.3 9.4 22.9 14.9 29 18C33.1 20.1 33.7 20.9 32.1 22.5C31.7 23.1 31 24.8 30.6 26.5C30 29.4 30 29.4 31.5 27.5C32.4 26.4 33.3 24.5 33.6 23.3C34 21.8 34.7 21.3 35.8 21.7C38.5 22.7 37 21.5 28.9 16.2C20.5 10.7 20 10.1 18.5 5C17.4 1.2 15 0.0999947 13.1 2.4Z"
            fill="currentColor"
          />
          <path
            d="M1.4 14.6C-0.7 17.7 0.5 22.3 3.4 22.8C5.2 23.2 5.3 23.1 3.7 21.5C0.7 18.6 2.2 14.5 7 12.7C7.9 12.4 7.3 12.1 5.8 12.1C3.9 12 2.5 12.8 1.4 14.6Z"
            fill={org.color}
          />
          <path
            d="M42.8 24.2C45.6 25.6 46.6 29.3 45.1 32.6C44.2 34.6 43.3 35 40 35C37.5 35 36.1 35.4 36.5 36C36.8 36.5 38.9 37 41 37C45.5 37 48 34.4 48 29.8C48 26.6 44.9 23 42.3 23.1C40.9 23.1 41 23.4 42.8 24.2Z"
            fill="currentColor"
          />
          <path
            d="M17 35.5C17 36.4 18.1 37.5 19.5 38C21.7 38.8 21.8 39.2 20.8 42C19.6 45.6 19.7 45.8 23.6 46.5C26.2 46.9 26.8 46.5 29.8 41.8C34.2 34.9 33.4 33.4 28.7 39.8C26.1 43.4 24.6 44.8 23.5 44.3C22.5 44 22.1 43.1 22.5 42.1C22.9 41.2 23.3 38.9 23.6 37C23.8 35.1 23.7 34.3 23.4 35.2C22.7 37.4 19 37.6 19 35.5C19 34.7 18.6 34 18 34C17.5 34 17 34.7 17 35.5Z"
            fill="currentColor"
          />
        </svg>

        <h2 className="text-base font-semibold text-gray-600 dark:text-gray-50">
          {t('subscribe-to-post')}
        </h2>
        <p className="relative mt-2 text-sm text-gray-400 dark:text-foreground">
          {t('get-notified-by-email-when-there-are-changes')}
        </p>
        <Button className="mt-3" size={'sm'} onClick={() => onVote('upvote')}>
          {submission.upvoted && user ? (
            <BanIcon className="w-4 h-4 mr-1" />
          ) : (
            <BellIcon className="w-4 h-4 mr-1" />
          )}

          {submission.upvoted && user ? t('unsubscribe') : t('get-notified')}
        </Button>
      </div>
    )
  } else {
    if (small) {
      return renderSmallUpvoterButton()
    } else {
      return (
        <AnimatePresence>
          {justVoted && (
            <div className="hidden sm:flex">
              <Survey
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
                renderDate={renderDate}
                submission={submission}
                isVoteSurvey={true}
                justVoted={justVoted}
                key={submission.id + 'survey'}
                setJustVoted={setJustVoted}
                width={width}
                submissionId={submission.id}
              />
            </div>
          )}
          {renderLargeUpvoteButton()}
        </AnimatePresence>
      )
    }
  }
}

export default VotingHandler
