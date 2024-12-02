import React, { useEffect, useState } from 'react'
import PopupWrapper from './PopupWrapper'
import { MergeIcon } from './PostSearchWithAlgolia'
import { mergeSubmission } from '../../network/lib/submission'
import { toast } from 'sonner'
import ConfirmationModal from './ConfirmationModal'
import useSWR, { KeyedMutator } from 'swr'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { cn, isPlan } from '@/lib/utils'
import { useSimilarPostsAndArticles, useSubmissionsWithFiltering } from '@/data/submission'
import PostSearchWithAI from './PostSearchWithAI'
import { useCurrentOrganization } from '@/data/organization'
import { searchKeyAtom, upgradePlanAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'

const MergePopup: React.FC<{
  activeSubId?: string
  mutateSubmissions: KeyedMutator<any[]> | undefined
  toggleOpen?: boolean
  close?: () => void
  callBack?: Function
  activeTitle: string
  closeSubmissionModal?: () => void
  isPending: boolean
  rawSubmissionData: any
  activityMutate?: () => void
  activeSubIds?: string[]
  onlyPopup?: boolean
  resetActiveIds?: () => void
  commentsMutate?: () => void
  customIconClasses?: string
  similarPostView?: boolean
  defaultMergingPostId?: string
  dropdownButton?: boolean
  defaultSearchQuery?: string
  submissionKey?: string
}> = ({
  activeSubId,
  toggleOpen,
  callBack,
  close,
  activeTitle,
  closeSubmissionModal,
  isPending,
  rawSubmissionData,
  mutateSubmissions,
  activityMutate,
  activeSubIds,
  onlyPopup,
  resetActiveIds,
  commentsMutate,
  customIconClasses,
  similarPostView,
  defaultMergingPostId,
  dropdownButton,
  defaultSearchQuery,
  submissionKey,
}) => {
  const [open, setOpen] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [mergingPostId, setMergingPostId] = useState(
    defaultMergingPostId ? defaultMergingPostId : ''
  )
  const [mergingPostIdTitle, setMergingPostTitle] = useState('')
  const [searchingForQuery, setSearchingForQuery] = useState(
    defaultSearchQuery ? defaultSearchQuery : ''
  )
  const [searchKey, setSearchKey] = useAtom(searchKeyAtom)
  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)

  const [reverseMerge, setReverseMerge] = useState(toggleOpen !== undefined ? true : false)
  const { mutate: mutateLocalComments } = useSWR(
    open && activeSubId ? [`/v1/comment`, { submissionId: activeSubId, sortBy: 'best' }] : null
  )
  const {
    data: similarSubmissions,
    mutate: mutateSimilarSubmissions,
    rawData,
  } = useSimilarPostsAndArticles(
    !onlyPopup && !dropdownButton && submissionKey ? submissionKey : '',
    searchKey
  )

  const { org } = useCurrentOrganization()

  const searchQuery = searchingForQuery
    ? `q=${searchingForQuery}&id!=${activeSubIds ? activeSubIds : activeSubId}`
    : `sortBy=trending&id!=${activeSubIds ? activeSubIds : activeSubId}`

  const { mutateSubmissions: mutateSubmissionsSearch } = useSubmissionsWithFiltering(
    !defaultMergingPostId && open ? searchQuery : null,
    org,
    2
  )

  const approvePost = () => {
    if (mutateSubmissions && rawSubmissionData) {
      if (Array.isArray(rawSubmissionData)) {
        mutateSubmissions(
          rawSubmissionData.map((entry) => ({
            ...entry,
            results: entry.results.map((result: any) =>
              activeSubIds
                ? activeSubIds?.includes(result.id)
                : result.id === activeSubId
                ? {
                    ...result,
                    inReview: false,
                    mergedToSubmissionId: mergingPostId,
                  }
                : result
            ),
          }))
        )
      } else {
        mutateSubmissions()
      }
    }
  }

  const removePostMutation = () => {
    if (mutateSubmissions && rawSubmissionData) {
      if (Array.isArray(rawSubmissionData)) {
        mutateSubmissions(
          rawSubmissionData.map((entry) => ({
            ...entry,
            results: entry.results.filter((result: any) =>
              activeSubIds ? !activeSubIds?.includes(result.id) : result.id !== activeSubId
            ),
          }))
        )
      } else {
        mutateSubmissions()
      }
    }
  }

  useEffect(() => {
    if (toggleOpen) {
      setOpen(true)
    }
  }, [toggleOpen])

  useEffect(() => {
    if (!open) {
      close && close()
    }
  }, [open])

  const mergePost = (reverseMerge: boolean) => {
    if (mergingPostId) {
      mergeSubmission({
        mergeParentId: reverseMerge ? mergingPostId || '' : activeSubId || '',
        submissionIds: activeSubIds
          ? activeSubIds
          : reverseMerge
          ? [activeSubId || '']
          : [mergingPostId || ''],
      })
        .then(async (resp) => {
          toast.success('Post merged successfully')
          mutateSubmissions && (await mutateSubmissions())
          similarSubmissions &&
            mutateSimilarSubmissions(
              {
                results: rawData?.results?.map((entry: any) => {
                  if (entry.indexUid !== 'posts') {
                    return entry
                  }
                  return {
                    ...entry,
                    hits: entry.hits.filter((result: any) => result.id !== mergingPostId),
                  }
                }),
              },
              false
            )
          setOpen(false)
          commentsMutate ? commentsMutate() : mutateLocalComments()
          setMergingPostId('')
          setMergingPostTitle('')
          callBack && callBack()
          close && close()
          activityMutate && activityMutate()
          resetActiveIds && resetActiveIds()
          if (reverseMerge) {
            approvePost()
            removePostMutation()
            closeSubmissionModal && closeSubmissionModal()
          }
          if (!defaultMergingPostId) {
            mutateSubmissionsSearch()
          }
        })
        .catch((err) => {
          console.log(err)
          toast.error(err?.response?.data?.message || 'Something went wrong')
        })
    }
  }

  const shortTitle = (title: string) => {
    if (title.length > 40) {
      return title.substring(0, 40) + '...'
    }
    if (!activeSubIds) {
      // Add quotes to title if merging multiple posts
      return `"${title}"`
    }
    return title
  }

  return (
    <div>
      <PopupWrapper hasPadding={false} isOpen={open} setIsOpen={setOpen}>
        <ConfirmationModal
          callBack={() => mergePost(reverseMerge)}
          description={`All of ${shortTitle(
            reverseMerge ? activeTitle : mergingPostIdTitle
          )} upvoters and comments will be moved to ${shortTitle(
            reverseMerge ? mergingPostIdTitle : activeTitle
          )} and ${shortTitle(
            reverseMerge ? activeTitle : mergingPostIdTitle
          )} will be removed from public view.`}
          title={`Are you sure you want to merge ${shortTitle(
            reverseMerge ? activeTitle : mergingPostIdTitle
          )} to ${shortTitle(reverseMerge ? mergingPostIdTitle : activeTitle)}?`}
          open={confirm}
          setOpen={setConfirm}
          buttonTxt="Merge posts"
        ></ConfirmationModal>
        {open && (
          <div>
            <div className="p-4">
              <h2 className="text-base font-medium text-gray-500 dark:text-white">
                {reverseMerge
                  ? 'Merge ' + shortTitle(activeTitle) + ' into an existing post'
                  : 'Merge other posts to' + ' ' + shortTitle(activeTitle)}
              </h2>
              <p className="mt-2 text-sm text-gray-400 dark:text-foreground">
                {reverseMerge
                  ? 'The comments and upvoters of ' +
                    (activeSubIds ? 'the ' + activeTitle : 'this post') +
                    ' will be moved over to the post you select below, and ' +
                    shortTitle(activeTitle) +
                    ' will be removed from the public view.'
                  : 'By selecting a post from the bottom, all of its comments and votes will be moved to ' +
                    shortTitle(activeTitle) +
                    ' and the selected post will be removed from the public view.'}
              </p>
            </div>
            <div className="overflow-hidden border-t rounded-b-md dark:border-dark-accent/80">
              {/* <PostSearchWithAlgolia
                callBack={(postId, title) => {
                  setMergingPostId(postId)
                  setMergingPostTitle(title)
                  setConfirm(true)
                }}
                value={search}
                isMerge={true}
                removeSubmissionWithIDs={activeSubIds ? activeSubIds : [activeSubId || '']}
              /> */}
              <PostSearchWithAI
                fullSearchQuery={searchQuery}
                callBack={(postId, title) => {
                  setMergingPostId(postId)
                  setMergingPostTitle(title)
                  setConfirm(true)
                }}
                isMerge={true}
                setSearchingForQuery={setSearchingForQuery}
                defaultSearchQuery={defaultSearchQuery}
              />
            </div>
          </div>
        )}
      </PopupWrapper>
      {toggleOpen !== undefined || onlyPopup ? (
        <></>
      ) : (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button className="relative p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={cn(
                  'w-5 h-5 text-background-accent/80 dark:text-background-accent',
                  customIconClasses
                )}
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <circle cx="7" cy="18" r="2" />
                <circle cx="7" cy="6" r="2" />
                <circle cx="17" cy="12" r="2" />
                <line x1="7" y1="8" x2="7" y2="16" />
                <path d="M7 8a4 4 0 0 0 4 4h4" />
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52" align="end">
            <DropdownMenuItem
              onSelect={() => {
                if (!isPlan(org?.plan, 'pro')) {
                  setUpgradePlan({
                    plan: 'starter',
                    title: 'Post merging is',
                  })
                  return
                }
                setReverseMerge(false)
                if (defaultMergingPostId) {
                  mergePost(false)
                } else {
                  setOpen(true)
                }
              }}
              key="merge"
            >
              <div className="h-4 flex-shrink-0 w-4 mr-1.5 secondary-svg">
                <MergeIcon />
              </div>{' '}
              {similarPostView ? 'Bring post here' : ' Merge others to this'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                if (!isPlan(org?.plan, 'pro')) {
                  setUpgradePlan({
                    plan: 'starter',
                    title: 'Post merging is',
                  })
                  return
                }
                setReverseMerge(true)
                if (defaultMergingPostId) {
                  mergePost(true)
                } else {
                  setOpen(true)
                }
              }}
              key="merge-reverse"
            >
              <div className="h-4 flex-shrink-0 w-4 mr-1.5 secondary-svg">
                <MergeIcon />
              </div>
              {similarPostView ? 'Push current post there' : 'Merge to existing'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}

export default MergePopup
