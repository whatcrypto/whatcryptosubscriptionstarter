import React, { useEffect, useState } from 'react'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import { IOrganization } from '../interfaces/IOrganization'
import MergePopup from './MergePopup'
import Tooltip from './Tooltip'
import {
  BanIcon,
  ChatAlt2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DotsHorizontalIcon,
  EyeIcon,
  EyeOffIcon,
  LinkIcon,
  LockClosedIcon,
  MailIcon,
  MailOpenIcon,
  PencilIcon,
  PlusCircleIcon,
  SparklesIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import { KeyedMutator } from 'swr'
import { updateSubmissionInfo } from '../../network/lib/submission'
import VotingHandler from './VotingHandler'
import Category from './Category'
import TagBullet from './TagBullet'
import { getQuarter } from 'date-fns'
import Status from './Status'
import { dateDifference, getETADate } from './MainPostView'
import MRRBadge from './MRRBadge'
import DeeperInsightPopup from './DeeperInsightPopup'
import {
  cn,
  generateRoadmapFilter,
  getETAQuarter,
  getSubmissionSimilarKey,
  isPlan,
  isPostPrivateWithUsers,
  keepPostBetweenAuthor,
  removePostBetweenAuthor,
  retrieveDateWithoutTimezone,
} from '@/lib/utils'
import AssignPicker from './AssignPicker'
import { mutateSubmissionItems, performSubmissionMutation } from '@/lib/submissionMutator'
import { toast } from 'sonner'
import { useActivityFeed } from '@/data/comment'
import chroma from 'chroma-js'
import { getBoardUrl } from '@/pages/widget/changelogPopup'
import sanitizeUrl from '@/lib/sanitizeUrl'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import PrioritizationOptions from './PrioritizationOptions'
import {
  changeValueEffort,
  displayedValueEffortColor,
  displayedValueEffortScore,
} from '@/lib/valueEffort'
import { DatePicker } from './radix/DatePicker'
import TrackedUserPreview from './TrackedUserPreview'
import TagComponent from './Tag'
import MultiselectButton from './MultiselectButton'
import AuthorDisplayer from './AuthorDisplayer'
import { useIsMounted } from '@/lib/hooks'
import { can, isMember } from '@/lib/acl'
import SimpleTooltip from './SimpleTooltip'
import {
  roadmapCurrentSubmissionParentFilterAtom,
  submissionActiveFilterURIAtom,
} from '@/atoms/submissionAtom'
import { useAtom } from 'jotai'
import { useSubmissionsWithFiltering } from '@/data/submission'
import Loader from './Loader'
import useSubmissionUrl from '@/hooks/submissionUrlSyncer'
import { upgradePlanAtom } from '@/atoms/orgAtom'
import ModularComboBox from './radix/ModularComboBox'
import MessageComponent from './MessageComponent'
import { Popover, PopoverContent, PopoverTrigger } from './radix/Popover'
import { AnimatePresence, motion } from 'framer-motion'
import { banUser } from 'network/lib/organization'

const ManagePost: React.FC<{
  isSmall?: boolean
  large: boolean
  submission: ISubmission
  org: IOrganization
  rawSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate
  setOpen: React.Dispatch<React.SetStateAction<boolean>> | undefined
  mutateSubmissions: KeyedMutator<any[]>
  setDisplayedLinearPage: React.Dispatch<React.SetStateAction<'New issue' | 'Link existing'>>
  setPushToLinearPopup: React.Dispatch<React.SetStateAction<boolean>>
  setPushToClickupPopup: React.Dispatch<React.SetStateAction<boolean>>
  setPushToGithubPopup: React.Dispatch<React.SetStateAction<boolean>>
  setPushToDevOpsPopup: React.Dispatch<React.SetStateAction<boolean>>
  setDisplayedDevOpsPage: React.Dispatch<React.SetStateAction<'New work item' | 'Link existing'>>
  setUnlinkConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  setClickupUnlinkConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  setDisplayedJiraPage: React.Dispatch<React.SetStateAction<'New issue' | 'Link existing'>>
  setDisplayedClickupPage: React.Dispatch<React.SetStateAction<'New issue' | 'Link existing'>>
  setDisplayedGithubPage: React.Dispatch<React.SetStateAction<'New issue' | 'Link existing'>>
  setPushToJiraPopup: React.Dispatch<React.SetStateAction<boolean>>
  setJiraUnlinkConfirmation: React.Dispatch<React.SetStateAction<boolean>>
  setBanUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setNewPostData: React.Dispatch<
    React.SetStateAction<{
      content: string
      title: string
    }>
  >
  setEnableEditing: React.Dispatch<React.SetStateAction<boolean>>
  setDeletePost: React.Dispatch<React.SetStateAction<boolean>>
  timeFrame?: any
  widget?: boolean
  setAddUpvoters: React.Dispatch<React.SetStateAction<boolean>>
  setMetaDataPopup: React.Dispatch<React.SetStateAction<boolean>>
  renderDate?: Date
  setAuthenitacteModal?: React.Dispatch<React.SetStateAction<boolean>>
  commentsMutate?: KeyedMutator<any[]>
  timezone?: string
  fullWidth?: boolean
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>>
  roadmapView?: boolean
}> = ({
  isSmall = false,
  large,
  submission,
  org,
  rawSubmissionData,
  setOpen,
  mutateSubmissions,
  setPushToLinearPopup,
  setPushToClickupPopup,
  setDisplayedLinearPage,
  setDisplayedClickupPage,
  setDisplayedGithubPage,
  setDisplayedDevOpsPage,
  setUnlinkConfirmation,
  setClickupUnlinkConfirmation,
  setDisplayedJiraPage,
  setPushToJiraPopup,
  setJiraUnlinkConfirmation,
  setPushToGithubPopup,
  setPushToDevOpsPopup,
  setEnableEditing,
  setNewPostData,
  setDeletePost,
  timeFrame,
  widget,
  setAddUpvoters,
  setMetaDataPopup,
  renderDate,
  setAuthenitacteModal,
  commentsMutate,
  timezone,
  fullWidth,
  setActiveSubmissionId,
  roadmapView,
  setBanUserModalOpen,
}) => {
  const { user } = useUser()
  const turnOffComments = () => {
    updateSubmissionInfo({
      submissionId: submission?.id,
      commentsAllowed: !submission?.commentsAllowed,
    })
      .then((resp) => {
        if (resp.data.success) {
          mutateSubmissions()
        }
      })
      .catch(() => {
        toast.error('Failed to disable comments.')
      })
  }
  const { t, i18n } = useTranslation()
  const [openInsights, setOpenInsights] = React.useState(false)
  const hideStatus =
    user && isMember(user.id, org) ? false : org?.settings?.hideStatusFromPublic || false
  const { activityMutate } = useActivityFeed({ submissionId: submission.id }, org)
  const { restoreUrl, setUrl } = useSubmissionUrl()

  const isMounted = useIsMounted()

  const isAuthorAdmin =
    isMember(submission.user?._id, org) || !submission.user?.email ? true : false

  const [activeFilterURI, setActiveFilterURI] = useAtom(submissionActiveFilterURIAtom)
  const [paginatingMoreLoader, setPaginatingMoreLoader] = React.useState(false)
  const [parentFilters, setParentFilters] = useAtom(roadmapCurrentSubmissionParentFilterAtom)
  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)
  const [customModal, setCustomModal] = useState<any>(null)

  const {
    size,
    setSize,
    totalSubmissionResults,
    data: rawAllSubmissionData,
  } = useSubmissionsWithFiltering(
    setActiveSubmissionId
      ? roadmapView
        ? parentFilters
          ? generateRoadmapFilter(parentFilters)
          : null
        : activeFilterURI
      : null,
    org,
    roadmapView ? 1 : 2
  )

  let canLoadMore = totalSubmissionResults ? size * 10 < totalSubmissionResults : false

  const totalPages = Array.isArray(rawAllSubmissionData) ? rawAllSubmissionData.length : 0

  // Test

  useEffect(() => {
    if (totalPages === size && paginatingMoreLoader) {
      setPaginatingMoreLoader(false)
      // Set active submission id to the first submission of the new page
      if (setActiveSubmissionId) {
        try {
          if (Array.isArray(rawAllSubmissionData) && rawAllSubmissionData.length > 0) {
            const newSub = rawAllSubmissionData?.[totalPages - 1]?.results?.[0]
            if (newSub) {
              setActiveSubmissionId(newSub?.id)
              setUrl(newSub?.slug)
            }
          }
        } catch (e) {
          console.error('Error setting active submission id')
        }
      }
    }
  }, [totalPages, size, rawAllSubmissionData, paginatingMoreLoader])

  const navigatePosts = (previous: boolean) => {
    if (
      !Array.isArray(rawAllSubmissionData) ||
      rawAllSubmissionData.length === 0 ||
      paginatingMoreLoader
    ) {
      return
    }

    let found = false
    let requestMore = false

    for (let page = 0; page < rawAllSubmissionData.length && !found; page++) {
      const results = rawAllSubmissionData[page].results
      if (!results || results.length === 0) continue

      const currentIndex = results.findIndex((sub: ISubmission) => sub.id === submission.id)
      if (currentIndex !== -1) {
        found = true
        const targetIndex = previous ? currentIndex - 1 : currentIndex + 1
        const targetPage =
          previous && targetIndex < 0
            ? page - 1
            : !previous && targetIndex >= results.length
            ? page + 1
            : page

        if (targetPage >= 0 && targetPage < rawAllSubmissionData.length) {
          const targetResults = rawAllSubmissionData[targetPage].results
          const targetItemIndex =
            previous && targetIndex < 0
              ? targetResults.length - 1
              : !previous && targetIndex >= results.length
              ? 0
              : targetIndex

          if (targetItemIndex >= 0 && targetItemIndex < targetResults.length) {
            updateActiveSubmission(targetResults[targetItemIndex])
            return
          }
        }

        // If navigational intent is to move forward and no more local items are available
        requestMore = !previous && targetPage >= rawAllSubmissionData.length
      }
    }

    if (requestMore && canLoadMore) {
      setSize(size + 1)
      setPaginatingMoreLoader(true)
    }
  }

  function updateActiveSubmission(submission: ISubmission | undefined) {
    if (submission && setActiveSubmissionId && setUrl) {
      setActiveSubmissionId(submission.id)
      setUrl(submission.slug)
    }
  }

  const containerVariants = {
    initial: { gap: 0 },
    expanded: { gap: '0.5rem', transition: { duration: 0.3, ease: 'easeInOut' } },
  }

  const popoverVariants = {
    initial: { opacity: 0, scale: 0.8, width: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      width: 'auto',
      transition: { duration: 0.3, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      width: 0,
      transition: { duration: 0.2, ease: 'easeIn' },
    },
  }

  const renderManagePostMenu = () => {
    return (
      <div className="flex items-center p-1 -m-1">
        {can(user?.id, 'set_post_pinned', org) && (
          <Tooltip
            dontTruncate={true}
            child={
              <button
                onClick={() => {
                  mutateSubmissionItems(
                    'pinned',
                    !submission?.pinned,
                    mutateSubmissions,
                    rawSubmissionData,
                    submission.id
                  )
                  updateSubmissionInfo({
                    submissionId: submission?.id,
                    pinned: !submission?.pinned,
                  })
                    .then((resp) => {
                      if (resp.data.success) {
                        toast.success('Post successfully pinned')
                      }
                    })
                    .catch((err) => {
                      toast.error(err?.response?.data?.error)
                      mutateSubmissions()
                    })
                }}
                className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 dark:text-background-accent text-background-accent/80"
                  style={{
                    color: submission.pinned
                      ? chroma(org.color).luminance(0.25).css() || org.color
                      : undefined,
                  }}
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
              </button>
            }
            dropDown={
              submission?.pinned ? (
                <p className="text-xs text-gray-400 dark:text-foreground">Unpin post</p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-foreground">Pin to top of the feed</p>
              )
            }
          />
        )}
        {can(user?.id, 'moderate_posts', org) &&
          (!fullWidth ||
            submission?.postCategory?.defaultAuthorOnly ||
            submission?.postCategory?.defaultCompanyOnly) &&
          !submission?.postCategory?.private && (
            <Tooltip
              dontTruncate={true}
              child={
                <button
                  onClick={() => {
                    if (submission?.postCategory?.defaultCompanyOnly) {
                      if (!isPlan(org.plan, 'premium')) {
                        setUpgradePlan({
                          plan: 'premium',
                          title: 'Company-only posts are',
                        })
                        return
                      }
                    } else {
                      if (
                        !isPlan(org.plan, 'growth') &&
                        org.name !== 'chatling' &&
                        org.name !== 'alphana'
                      ) {
                        setUpgradePlan({
                          plan: 'growth',
                          title: 'Author-only posts are',
                        })
                        return
                      }
                    }
                    const fallbackUser = {
                      _id: '65d394b4affdf5e99fcbfd19',
                      type: 'admin' as 'admin' | 'customer',
                    }
                    const user =
                      submission.user?._id &&
                      (submission.user.type === 'admin' || submission.user.type === 'customer')
                        ? {
                            _id: submission?.user?._id,
                            type: submission?.user?.type,
                          }
                        : fallbackUser
                    if (isPostPrivateWithUsers(submission)) {
                      removePostBetweenAuthor(
                        [submission.id],
                        [user] as any,
                        mutateSubmissions,
                        rawSubmissionData,
                        false
                      )
                    } else {
                      keepPostBetweenAuthor(
                        [submission.id],
                        [user] as any,
                        mutateSubmissions,
                        rawSubmissionData,
                        false,
                        false,
                        submission?.postCategory?.defaultCompanyOnly
                      )
                    }
                  }}
                  className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary"
                >
                  {isPostPrivateWithUsers(submission) ? (
                    <EyeOffIcon className="w-4 h-4 dark:text-background-accent text-background-accent/80" />
                  ) : (
                    <EyeIcon className="w-4 h-4 dark:text-background-accent text-background-accent/80" />
                  )}
                </button>
              }
              dropDown={
                isPostPrivateWithUsers(submission) ? (
                  <p className="text-xs text-center text-gray-400 dark:text-foreground">
                    Make post visible to everyone <br /> (Currently visible to{' '}
                    {isAuthorAdmin
                      ? 'admins only'
                      : submission?.postCategory?.defaultCompanyOnly
                      ? "author's company only"
                      : 'the author only'}
                    )
                  </p>
                ) : (
                  <p className="text-xs text-center text-gray-400 dark:text-foreground">
                    Make post visible to{' '}
                    {isAuthorAdmin
                      ? 'only admins'
                      : submission?.postCategory?.defaultCompanyOnly
                      ? "author's company only"
                      : 'only the author'}{' '}
                    <br /> (Currently visible to everyone
                    {submission?.inReview ? ' after approval' : ''})
                  </p>
                )
              }
            />
          )}
        <Tooltip
          dontTruncate={true}
          child={
            <button
              onClick={() => {
                try {
                  navigator.clipboard.writeText(getBoardUrl(org) + `/p/` + submission.slug)
                  toast.success('Copied to clipboard')
                } catch (err) {
                  toast.error('Failed to copy to clipboard')
                }
              }}
              className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary"
            >
              <LinkIcon className="w-4 h-4 dark:text-background-accent text-background-accent/80" />
            </button>
          }
          dropDown={
            <p className="text-xs text-gray-400 dark:text-foreground">
              {t('copy-link-to-clipboard')}
            </p>
          }
        />
        {can(user?.id, 'post_merge', org) && !submission?.mergedToSubmissionId && !fullWidth && (
          <MergePopup
            submissionKey={getSubmissionSimilarKey(submission)}
            activityMutate={activityMutate}
            isPending={submission?.inReview}
            closeSubmissionModal={() => setOpen && setOpen(false)}
            activeTitle={submission?.title}
            rawSubmissionData={rawSubmissionData}
            mutateSubmissions={mutateSubmissions}
            activeSubId={submission?.id}
            commentsMutate={commentsMutate}
          />
        )}

        {org.settings.linearIntegrationEnabled && can(user?.id, 'use_integrations', org) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  className="w-4 h-4 dark:text-background-accent text-background-accent/80"
                  width="16"
                  height="16"
                  viewBox="0 0 100 100"
                  color="currentColor"
                >
                  <path
                    fill="currentColor"
                    d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end">
              {!submission?.linearIssueUrl ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedLinearPage('New issue')
                      setPushToLinearPopup(true)
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Create new issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedLinearPage('Link existing')
                      setPushToLinearPopup(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Link to existing issue / project
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      const url = sanitizeUrl(submission.linearIssueUrl || '')
                      if (url) window.open(url, '_blank')
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="w-4 h-4 mr-1.5 secondary-svg"
                      width="16"
                      height="16"
                      viewBox="0 0 100 100"
                      color="currentColor"
                    >
                      <path
                        fill="currentColor"
                        d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                      />
                    </svg>
                    View linked issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setUnlinkConfirmation(true)
                    }}
                  >
                    <XIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Unlink issue
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {org.settings.clickupIntegrationEnabled && can(user?.id, 'use_integrations', org) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <svg
                  width={14}
                  height={17}
                  className="dark:text-background-accent text-background-accent/80"
                  viewBox="0 0 14 17"
                  fill="none"
                  color="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 12.3831L2.46097 10.498C3.76783 12.2043 5.15566 12.9905 6.70213 12.9905C8.24008 12.9905 9.58976 12.2132 10.838 10.5206L13.333 12.3605C11.5331 14.801 9.29394 16.0904 6.70213 16.0904C4.11894 16.0904 1.859 14.8101 0 12.3831Z"
                    fill="currentColor"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.69273 4.18985L2.3126 7.96414L0.289062 5.61578L6.70143 0.090332L13.0639 5.6201L11.0305 7.95984L6.69273 4.18985Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {!submission?.clickupIssueUrl ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedClickupPage('New issue')
                      setPushToClickupPopup(true)
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Create new task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedClickupPage('Link existing')
                      setPushToClickupPopup(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Link to existing task
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      const url = sanitizeUrl(submission.clickupIssueUrl || '')
                      if (url) window.open(url, '_blank')
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      className="w-4 h-4 mr-1.5 secondary-svg"
                      width="16"
                      height="16"
                      viewBox="0 0 100 100"
                      color="currentColor"
                    >
                      <path
                        fill="currentColor"
                        d="M1.22541 61.5228c-.2225-.9485.90748-1.5459 1.59638-.857L39.3342 97.1782c.6889.6889.0915 1.8189-.857 1.5964C20.0515 94.4522 5.54779 79.9485 1.22541 61.5228ZM.00189135 46.8891c-.01764375.2833.08887215.5599.28957165.7606L52.3503 99.7085c.2007.2007.4773.3075.7606.2896 2.3692-.1476 4.6938-.46 6.9624-.9259.7645-.157 1.0301-1.0963.4782-1.6481L2.57595 39.4485c-.55186-.5519-1.49117-.2863-1.648174.4782-.465915 2.2686-.77832 4.5932-.92588465 6.9624ZM4.21093 29.7054c-.16649.3738-.08169.8106.20765 1.1l64.77602 64.776c.2894.2894.7262.3742 1.1.2077 1.7861-.7956 3.5171-1.6927 5.1855-2.684.5521-.328.6373-1.0867.1832-1.5407L8.43566 24.3367c-.45409-.4541-1.21271-.3689-1.54074.1832-.99132 1.6684-1.88843 3.3994-2.68399 5.1855ZM12.6587 18.074c-.3701-.3701-.393-.9637-.0443-1.3541C21.7795 6.45931 35.1114 0 49.9519 0 77.5927 0 100 22.4073 100 50.0481c0 14.8405-6.4593 28.1724-16.7199 37.3375-.3903.3487-.984.3258-1.3542-.0443L12.6587 18.074Z"
                      />
                    </svg>
                    View linked task
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setClickupUnlinkConfirmation(true)
                    }}
                  >
                    <XIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Unlink task
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* End Clickup */}

        {/* GitHub */}
        {org.settings.githubIntegrationEnabled && can(user?.id, 'use_integrations', org) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <>
                  {/*?xml version="1.0" encoding="UTF-8"?*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 15"
                    version="1.1"
                    className="w-4 h-4 dark:text-background-accent text-background-accent/80"
                  >
                    <g id="surface1">
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'evenodd',
                          fill: 'currentColor',
                          fillOpacity: 1,
                        }}
                        d="M 7.976562 0 C 3.566406 0 0 3.4375 0 7.691406 C 0 11.089844 2.285156 13.96875 5.453125 14.984375 C 5.851562 15.0625 5.996094 14.820312 5.996094 14.617188 C 5.996094 14.4375 5.980469 13.828125 5.980469 13.191406 C 3.761719 13.648438 3.300781 12.273438 3.300781 12.273438 C 2.945312 11.382812 2.417969 11.152344 2.417969 11.152344 C 1.691406 10.683594 2.46875 10.683594 2.46875 10.683594 C 3.273438 10.734375 3.699219 11.472656 3.699219 11.472656 C 4.410156 12.644531 5.558594 12.3125 6.023438 12.109375 C 6.085938 11.613281 6.300781 11.269531 6.523438 11.078125 C 4.753906 10.898438 2.890625 10.238281 2.890625 7.28125 C 2.890625 6.441406 3.207031 5.753906 3.710938 5.21875 C 3.632812 5.027344 3.355469 4.238281 3.789062 3.183594 C 3.789062 3.183594 4.464844 2.980469 5.980469 3.972656 C 6.632812 3.804688 7.300781 3.71875 7.976562 3.71875 C 8.648438 3.71875 9.335938 3.808594 9.96875 3.972656 C 11.488281 2.980469 12.164062 3.183594 12.164062 3.183594 C 12.597656 4.238281 12.320312 5.027344 12.242188 5.21875 C 12.757812 5.753906 13.058594 6.441406 13.058594 7.28125 C 13.058594 10.238281 11.199219 10.886719 9.414062 11.078125 C 9.707031 11.320312 9.957031 11.777344 9.957031 12.503906 C 9.957031 13.535156 9.945312 14.363281 9.945312 14.617188 C 9.945312 14.820312 10.089844 15.0625 10.484375 14.984375 C 13.65625 13.96875 15.9375 11.089844 15.9375 7.691406 C 15.953125 3.4375 12.375 0 7.976562 0 Z M 7.976562 0 "
                      />
                    </g>
                  </svg>
                </>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {org.settings.githubIntegrationEnabled ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedGithubPage('New issue')
                      setPushToGithubPopup(true)
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Create new issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedGithubPage('Link existing')
                      setPushToGithubPopup(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Link to existing issue
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {/* Azure DevOps */}
        {org.settings.devopsIntegrationEnabled && can(user?.id, 'use_integrations', org) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <>
                  {/*?xml version="1.0" encoding="utf-8"?*/}
                  {/* Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools */}
                  <svg
                    width="16px"
                    height="16px"
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    className="w-4 h-4 dark:text-background-accent text-background-accent/80"
                  >
                    <path
                      fill="currentColor"
                      d="M15 3.622v8.512L11.5 15l-5.425-1.975v1.958L3.004 10.97l8.951.7V4.005L15 3.622zm-2.984.428L6.994 1v2.001L2.382 4.356 1 6.13v4.029l1.978.873V5.869l9.038-1.818z"
                    />
                  </svg>
                </>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {org.settings.devopsIntegrationEnabled ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedDevOpsPage('New work item')
                      setPushToDevOpsPopup(true)
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Create new work item
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedDevOpsPage('Link existing')
                      setPushToDevOpsPopup(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Link to existing work item
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {org.settings.jiraIntegrationEnabled && can(user?.id, 'use_integrations', org) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 mr-2 bg-transparent shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <svg
                  className="w-4 h-4 dark:text-background-accent text-background-accent/80"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 33 28"
                >
                  <path
                    d="M27.006 4H15.45a5.21 5.21 0 0 0 5.212 5.211h2.125v2.058A5.21 5.21 0 0 0 28 16.48V4.994A.995.995 0 0 0 27.006 4Z"
                    fill="currentColor"
                  />
                  <path
                    d="M21.28 9.76H9.726a5.21 5.21 0 0 0 5.211 5.211h2.126v2.058a5.21 5.21 0 0 0 5.211 5.211V10.754a.995.995 0 0 0-.994-.994Z"
                    fill="currentColor"
                  />
                  <path
                    d="M15.554 15.52H4a5.21 5.21 0 0 0 5.211 5.211h2.126v2.057A5.21 5.21 0 0 0 16.55 28V16.514a.995.995 0 0 0-.995-.994Z"
                    fill="currentColor"
                  />
                  <defs>
                    <linearGradient
                      id="a"
                      x1={22.037}
                      y1={9.773}
                      x2={17.12}
                      y2={14.842}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset={0.176} stopColor="#344563" />
                      <stop offset={1} stopColor="#7A869A" />
                    </linearGradient>
                    <linearGradient
                      id="b"
                      x1={16.643}
                      y1={15.564}
                      x2={10.959}
                      y2={21.094}
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset={0.176} stopColor="#344563" />
                      <stop offset={1} stopColor="#7A869A" />
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {!submission?.jiraIssueId ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedJiraPage('New issue')
                      setPushToJiraPopup(true)
                    }}
                  >
                    <PlusCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Create new issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setDisplayedJiraPage('Link existing')
                      setPushToJiraPopup(true)
                    }}
                  >
                    <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Link to existing issue
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      const url = sanitizeUrl(submission.jiraIssueUrl || '')
                      if (url) window.open(url, '_blank')
                    }}
                  >
                    <svg
                      className="w-4 h-4 mr-1.5 secondary-svg"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 33 28"
                    >
                      <path
                        d="M27.006 4H15.45a5.21 5.21 0 0 0 5.212 5.211h2.125v2.058A5.21 5.21 0 0 0 28 16.48V4.994A.995.995 0 0 0 27.006 4Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.28 9.76H9.726a5.21 5.21 0 0 0 5.211 5.211h2.126v2.058a5.21 5.21 0 0 0 5.211 5.211V10.754a.995.995 0 0 0-.994-.994Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.554 15.52H4a5.21 5.21 0 0 0 5.211 5.211h2.126v2.057A5.21 5.21 0 0 0 16.55 28V16.514a.995.995 0 0 0-.995-.994Z"
                        fill="currentColor"
                      />
                      <defs>
                        <linearGradient
                          id="a"
                          x1={22.037}
                          y1={9.773}
                          x2={17.12}
                          y2={14.842}
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset={0.176} stopColor="#344563" />
                          <stop offset={1} stopColor="#7A869A" />
                        </linearGradient>
                        <linearGradient
                          id="b"
                          x1={16.643}
                          y1={15.564}
                          x2={10.959}
                          y2={21.094}
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset={0.176} stopColor="#344563" />
                          <stop offset={1} stopColor="#7A869A" />
                        </linearGradient>
                      </defs>
                    </svg>
                    View linked issue
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setJiraUnlinkConfirmation(true)
                    }}
                  >
                    <XIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Unlink issue
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {(can(user?.id, 'moderate_posts', org) || can(user?.id, 'view_users', org)) && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 shadow-none hover:bg-gray-100 hover:dark:bg-secondary">
                <DotsHorizontalIcon className="w-4 h-4 text-background-accent/80 dark:text-background-accent" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="end">
              {(submission?.user?._id === user?.id || can(user?.id, 'moderate_posts', org)) && (
                <DropdownMenuItem
                  onSelect={() => {
                    setNewPostData({
                      content: submission?.content,
                      title: submission?.title,
                    })
                    setEnableEditing((p) => !p)
                  }}
                  key="edit"
                >
                  <PencilIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                  {t('edit-title-content')}
                </DropdownMenuItem>
              )}

              {can(user?.id, 'moderate_posts', org) && (
                <DropdownMenuItem onSelect={turnOffComments} key="disable-comments">
                  <ChatAlt2Icon className="h-4 w-4 mr-1.5 secondary-svg" />
                  {submission?.commentsAllowed ? t('disable-commenting') : t('enable-commenting')}
                </DropdownMenuItem>
              )}

              {can(user?.id, 'view_users', org) && (
                <DropdownMenuItem
                  onSelect={() => {
                    const emailLink = `mailto:${submission?.user?.email}`
                    window.location.href = emailLink
                  }}
                  key="email-submitter"
                >
                  <MailIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                  {t('email-submitter')}
                </DropdownMenuItem>
              )}
              {can(user?.id, 'manage_users', org) &&
                (submission?.user?.email || submission.user?._id) &&
                !isMember(submission.user?._id, org) && (
                  <DropdownMenuItem
                    onSelect={() => {
                      if (!submission?.user?.email && !submission?.user?._id) {
                        toast.error('User email or ID not found')
                        return
                      }
                      setBanUserModalOpen(true)
                    }}
                    key="ban-user"
                  >
                    <BanIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    {t('ban-user')}
                  </DropdownMenuItem>
                )}
              {!fullWidth && can(user?.id, 'moderate_posts', org) && (
                <DropdownMenuItem onSelect={() => setDeletePost(true)} key="delete-post">
                  <TrashIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                  {t('delete-post')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  const renderMainPostInfo = () => {
    return (
      <>
        {' '}
        <div className={`${'col-span-2'}`}>
          <span className="font-medium">{t('upvoters')}</span>
        </div>
        <div className={`${'col-span-3'}`}>
          <div className="flex items-center ">
            <VotingHandler
              widget={widget}
              submission={submission}
              small={true}
              mutateSubmissions={mutateSubmissions}
              rawSubmissionData={rawSubmissionData}
            />
            {/* {submission && (
          <Transition
            className={'w-full'}
            appear={true}
            show={submission?.recentUpvoters.length !== 0}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100 "
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="flex items-center px-2">
              {submission?.recentUpvoters.slice(0, 3).map((upvoter, index) => (
                <Transition.Child
                  enter="transition-opacity ease-linear duration-1000"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity ease-linear duration-500"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  key={upvoter.id}
                >
                  <div
                    className={`flex-shrink-0  h-5 w-5 lg:h-7 lg:w-7 flex items-center justify-center bg-[#e7eaee] dark:bg-secondary rounded-full ${
                      index !== 0 && '-ml-2'
                    }`}
                  >
                    <Tooltip
                      dropDown={<p className="text-xs font-medium">{upvoter.name}</p>}
                      child={
                        upvoter?.profilePicture && (
                          <div className="z-10 rounded-full bg-gray-50 dark:bg-secondary h-7 w-7">
                            <Image
                              unoptimized
                              className="object-cover rounded-full"
                              src={upvoter?.profilePicture}
                              height={28}
                              width={28}
                            />
                          </div>
                        )
                      }
                    />
                  </div>
                </Transition.Child>
              ))}
              {submission?.upvotes > 3 && (
                <div className="relative z-20 flex items-center justify-center -ml-2 text-xs font-semibold text-gray-700 border rounded-full w-7 h-7 border-gray-100/60 dark:border-border/50 bg-gray-50 dark:text-foreground dark:bg-secondary">
                  +{submission?.upvotes - 3}
                </div>
              )}
            </div>
          </Transition>
        )} */}
            {can(user?.id, 'post_vote_on_behalf', org) && (
              <div className="z-30 pl-2 ml-auto">
                <button
                  onClick={() => setAddUpvoters(true)}
                  className="text-xs font-medium truncate hover:underline main-transition hover:cursor-pointer unstyled-button"
                >
                  <span className="truncate">View upvoters</span>
                </button>
              </div>
            )}
          </div>
          {isMember(user?.id, org) && timeFrame && (
            <p className="text-[10px] absolute  mt-px text-gray-500 dark:text-foreground">
              <span className="font-medium">{submission.upvotesInTimeframe}</span>{' '}
              {timeFrame === 'Weekly'
                ? 'in last 7 days'
                : timeFrame === 'Monthly'
                ? 'this month'
                : timeFrame === 'Current week'
                ? 'current week'
                : 'this year'}
            </p>
          )}
        </div>
        {hideStatus ? null : (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('status')}</span>
            </div>
            <div className="col-span-3 p-1.5 -m-1.5 overflow-hidden">
              <motion.div
                className="flex items-center"
                variants={containerVariants}
                initial="initial"
                animate={
                  can(user?.id, 'set_post_status', org) &&
                  submission?.statusUpdateSentForStatusId === 'not-sent'
                    ? 'expanded'
                    : 'initial'
                }
              >
                <div
                  className={
                    !can(user?.id, 'set_post_status', org) ? '' : 'flex-grow w-full min-w-0'
                  }
                >
                  <Status
                    postView={true}
                    activityMutate={activityMutate}
                    rawSubmissionData={rawSubmissionData}
                    mutateSubmissions={mutateSubmissions}
                    status={submission?.postStatus}
                    small={true}
                    postId={submission?.id}
                    submission={submission}
                    closeCallback={(input) => {
                      if (
                        input === 'statusQuestion' &&
                        submission?.statusUpdateSentForStatusId === undefined
                      ) {
                        mutateSubmissionItems(
                          'statusUpdateSentForStatusId',
                          'not-sent',
                          mutateSubmissions,
                          rawSubmissionData,
                          submission?.id
                        )
                      }
                    }}
                    commentsMutate={commentsMutate}
                  />
                </div>
                <AnimatePresence>
                  {can(user?.id, 'set_post_status', org) &&
                    submission?.statusUpdateSentForStatusId === 'not-sent' &&
                    !(submission.upvoted && submission.upvotes === 1) && (
                      <motion.div
                        variants={popoverVariants}
                        initial="initial"
                        animate="visible"
                        exit="exit"
                      >
                        <Popover>
                          <SimpleTooltip
                            content={`Send ${submission?.postStatus?.name} status update email to upvoters`}
                          >
                            <PopoverTrigger asChild>
                              <button
                                tabIndex={-1}
                                className="flex items-center justify-center dashboard-secondary"
                              >
                                <MailIcon className="w-4 h-4" />
                              </button>
                            </PopoverTrigger>
                          </SimpleTooltip>
                          <PopoverContent className="w-[310px]">
                            <MessageComponent
                              submission={submission}
                              setOpen={() => {}}
                              setCustomModal={setCustomModal}
                              commentsMutate={commentsMutate}
                              submissionMutate={mutateSubmissions}
                              setPages={() => {}}
                              rawSubmissionData={rawSubmissionData}
                            />
                          </PopoverContent>
                        </Popover>
                      </motion.div>
                    )}
                </AnimatePresence>
              </motion.div>
            </div>
          </>
        )}
        <div className="col-span-2">
          <span className="font-medium">{t('category')}</span>
        </div>
        <div className="col-span-3 ">
          <div className={`${!can(user?.id, 'set_post_category', org) && 'inline-flex w-full'} `}>
            <Category
              small={true}
              // dash={true}
              rawSubmissionData={rawSubmissionData}
              mutateSubmissions={mutateSubmissions}
              category={submission?.postCategory}
              postId={submission?.id}
            />
          </div>
        </div>
        {(can(user?.id, 'set_post_tags', org) || submission?.postTags?.length !== 0) && (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('tags')}</span>
            </div>
            <div className="relative w-full col-span-3">
              <div
                className={
                  submission?.postTags?.length > 1 && can(user?.id, 'set_post_tags', org)
                    ? 'pb-4'
                    : ''
                }
              >
                <TagComponent
                  rawSubmissionData={rawSubmissionData}
                  mutateSubmissions={mutateSubmissions}
                  tags={submission?.postTags ? submission?.postTags : []}
                  postId={submission?.id}
                />
              </div>

              {submission?.postTags?.length > 1 && can(user?.id, 'set_post_tags', org) && (
                <div
                  className={`${
                    user && can(user.id, 'set_post_tags', org) ? '-mt-3' : 'mt-[22px]'
                  } absolute z-[5] cursor-default`}
                >
                  <Tooltip
                    dropDown={
                      <div className="space-y-2">
                        {submission?.postTags?.map((tag) => {
                          return (
                            <div
                              key={tag.name}
                              className="flex items-center px-1 text-xs font-medium text-gray-500 w-36 dark:text-foreground"
                            >
                              <TagBullet theme={tag?.color} />
                              {tag.name}{' '}
                              {tag?.private && (
                                <LockClosedIcon className="flex-shrink-0 w-3 h-3 ml-auto secondary-svg" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    }
                    child={
                      <p className="text-xs font-medium text-background-accent dark:text-foreground">
                        +{' '}
                        {submission.postTags.length > 1
                          ? submission.postTags.length - 1
                          : submission.postTags.length}{' '}
                        other {submission?.postTags?.length === 2 ? 'tag' : 'tags'} selected
                      </p>
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}
        {can(user?.id, 'set_post_eta', org) ? (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('eta')}</span>
            </div>
            <div className="relative col-span-3">
              <DatePicker
                unscheduling={submission?.eta ? true : undefined}
                onSelect={(date: Date | null) => {
                  if (mutateSubmissions && rawSubmissionData) {
                    updateSubmissionInfo({
                      eta: date,
                      submissionId: submission?.id,
                    }).catch(() => {
                      toast.error('Failed to update ETA')
                    })
                    mutateSubmissionItems('eta', date, mutateSubmissions, rawSubmissionData, [
                      submission?.id,
                    ])
                  }
                }}
                CustomButton={
                  <MultiselectButton
                    unSelected={!submission?.eta}
                    icon={
                      submission?.eta && (
                        <div className="mr-1.5 rounded dark:bg-border bg-gray-100/80 text-gray-500 dark:text-gray-100 py-0 p-1 text-[11px] font-semibold">
                          Q{getETAQuarter(submission?.eta)}
                        </div>
                      )
                    }
                    className={submission?.eta ? 'pl-1' : ''}
                  >
                    {submission?.eta
                      ? getETADate(
                          retrieveDateWithoutTimezone(submission.eta),
                          i18n.language === 'default' ? 'en' : i18n.language,
                          false
                        )
                      : 'Select a date'}
                  </MultiselectButton>
                }
                showQuarterButtons={true}
                selected={submission?.eta ? retrieveDateWithoutTimezone(submission.eta) : undefined}
              />
            </div>
          </>
        ) : (
          submission?.eta && (
            <>
              <div className="col-span-2">
                <span className="font-medium">ETA</span>
              </div>
              <div className="w-full min-w-0 col-span-3 font-medium dark:font-medium first-letter:uppercase">
                {getETADate(
                  submission?.eta,
                  i18n.language === 'default' ? 'en' : i18n.language,
                  false,
                  timezone
                )}
              </div>
            </>
          )
        )}
        {isMember(user?.id, org) && org?.members?.length > 1 && (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('assignee')}</span>
            </div>
            <div className="relative col-span-3">
              <AssignPicker
                submission={submission}
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
              />
            </div>
          </>
        )}
      </>
    )
  }

  const renderExtraPostInfo = () => {
    return (
      <>
        {' '}
        {submission.metadata && can(user?.id, 'moderate_posts', org) && (
          <>
            <div className="col-span-2">
              <span className="font-medium">Metadata</span>
            </div>
            <div className="col-span-3 space-y-1">
              <button
                className="py-1 dashboard-secondary text-[13px]"
                onClick={() => setMetaDataPopup(true)}
              >
                Open metadata
              </button>
            </div>
          </>
        )}
        {submission?.totalUpvotersMonthlySpend && can(user?.id, 'view_users', org) ? (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('total-mrr')}</span>
            </div>
            <div className="col-span-3 ">
              <MRRBadge mrr={submission?.totalUpvotersMonthlySpend?.toString()} />
            </div>
          </>
        ) : null}
        {!submission?.postCategory?.hideCreationDates || isMember(user?.id, org) ? (
          <>
            <div className="col-span-2">
              <span className="font-medium">{t('date')}</span>
            </div>
            <div className="col-span-3">
              <p className="w-full min-w-0 font-medium dark:font-semibold first-letter:uppercase">
                {dateDifference(
                  submission?.date,
                  i18n.language,
                  isMounted ? new Date() : renderDate
                )}
              </p>
            </div>
          </>
        ) : null}
        {org?.settings?.hideAuthorInfo && !isMember(user?.id, org) ? null : (
          <AuthorDisplayer
            mutateSubmissions={mutateSubmissions}
            submission={submission}
            rawSubmissionData={rawSubmissionData}
          />
        )}
      </>
    )
  }

  const renderPrioritizationRanker = () => {
    if (!org?.settings?.valueEffortScale || !isMember(user?.id, org)) return null

    if (!can(user?.id, 'manage_prioritization', org)) {
      return null
    }

    return (
      <div
        className={`grid items-center grid-cols-5 ${
          !isSmall ? 'p-4' : 'py-3'
        } gap-y-2.5 border-gray-100/60 border-t dashboard-border`}
      >
        <div className="flex items-center justify-between col-span-5">
          <span className="font-medium">Prioritization</span>
          {/* <span className="text-xs font-medium dark:text-foreground/80">Compare</span> */}
        </div>
        <div className="flex items-center col-span-5 gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative w-full text-xs dashboard-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                className="mr-1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M18 4a1 1 0 0 1 .783 .378l.074 .108l3 5a1 1 0 0 1 -.032 1.078l-.08 .103l-8.53 9.533a1.7 1.7 0 0 1 -1.215 .51c-.4 0 -.785 -.14 -1.11 -.417l-.135 -.126l-8.5 -9.5a1 1 0 0 1 -.172 -1.067l.06 -.115l3.013 -5.022l.064 -.09a.982 .982 0 0 1 .155 -.154l.089 -.064l.088 -.05l.05 -.023l.06 -.025l.109 -.032l.112 -.02l.117 -.005h12zm-8.886 3.943a1 1 0 0 0 -1.371 .343l-.6 1l-.06 .116a1 1 0 0 0 .177 1.07l2 2.2l.09 .088a1 1 0 0 0 1.323 -.02l.087 -.09a1 1 0 0 0 -.02 -1.323l-1.501 -1.65l.218 -.363l.055 -.103a1 1 0 0 0 -.398 -1.268z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
              Value
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <span
                  className={cn(
                    'p-1 py-0 font-medium rounded',
                    displayedValueEffortColor('value', org, submission)
                  )}
                >
                  {displayedValueEffortScore('value', org, submission)}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <PrioritizationOptions
                SubMenuWrapper={DropdownMenuSub}
                SubMenuContent={DropdownMenuSubContent}
                SubMenuTrigger={DropdownMenuSubTrigger}
                WrapperItem={({ children, index, subNumber }: any) => {
                  return (
                    <DropdownMenuItem
                      onSelect={(event) => {
                        changeValueEffort(
                          'value',
                          index,
                          subNumber,
                          [submission?.id],
                          event,
                          mutateSubmissions,
                          rawSubmissionData
                        )
                      }}
                    >
                      {children}
                    </DropdownMenuItem>
                  )
                }}
                org={org}
                activeValue={submission.prioritization?.valueEffort?.value || 0}
              />
            </DropdownMenuContent>
          </DropdownMenu>{' '}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="relative w-full text-xs dashboard-secondary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1.5"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M17 2a2 2 0 0 1 1.995 1.85l.005 .15v2a6.996 6.996 0 0 1 -3.393 6a6.994 6.994 0 0 1 3.388 5.728l.005 .272v2a2 2 0 0 1 -1.85 1.995l-.15 .005h-10a2 2 0 0 1 -1.995 -1.85l-.005 -.15v-2a6.996 6.996 0 0 1 3.393 -6a6.994 6.994 0 0 1 -3.388 -5.728l-.005 -.272v-2a2 2 0 0 1 1.85 -1.995l.15 -.005h10z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
              Effort
              <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <span
                  className={cn(
                    'p-1 py-0 font-medium rounded',
                    displayedValueEffortColor('effort', org, submission)
                  )}
                >
                  {displayedValueEffortScore('effort', org, submission)}
                </span>
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <PrioritizationOptions
                SubMenuWrapper={DropdownMenuSub}
                SubMenuContent={DropdownMenuSubContent}
                SubMenuTrigger={DropdownMenuSubTrigger}
                WrapperItem={({ children, index, subNumber }: any) => {
                  return (
                    <DropdownMenuItem
                      onSelect={(event) => {
                        changeValueEffort(
                          'effort',
                          index,
                          subNumber,
                          [submission?.id],
                          event,
                          mutateSubmissions,
                          rawSubmissionData
                        )
                      }}
                    >
                      {children}
                    </DropdownMenuItem>
                  )
                }}
                org={org}
                activeValue={submission.prioritization?.valueEffort?.effort || 0}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`${isSmall ? `md:hidden` : 'hidden md:block'} ${
        fullWidth ? 'max-w-[360px] min-w-[260px] md:mb-0' : ''
      } pb-2 text-sm dashboard-border md:border-l md:w-4/12 w-full text-gray-400 dark:text-foreground relative rounded-tr-lg`}
    >
      <div className={cn('relative rounded-tr-md', !fullWidth && '')}>
        {setActiveSubmissionId !== undefined && (
          <div className="absolute active:scale-[100%] hidden md:flex hover:scale-110 scale-100 transform-gpu -z-10 dark:divide-border/60 top-0 h-[50px] lg:h-[58.84px] divide-gray-100/60 divide-y w-7 lg:w-8  dark:hover:divide-dark-accent/60 dark:hover:border-dark-accent/60 main-transition items-center justify-start flex-col -right-[31.5px] lg:-right-[41px] bg-secondary/50 dark:bg-secondary/40 dark:border-border/60 border shadow-sm dark:shadow border-gray-100/60 hover:border-gray-200/60 hover:divide-gray-200/40 rounded-md">
            <SimpleTooltip contentProps={{ side: 'left' }} delayDuration={1000} content="Next post">
              <button
                tabIndex={-1}
                onClick={() => navigatePosts(true)}
                className="flex items-center justify-center w-full h-full p-1 border-0 rounded-none dark:hover:bg-secondary dark:shadow bg-card rounded-t-md"
              >
                <ChevronUpIcon className="secondary-svg !w-3.5 !h-3.5" />
              </button>
            </SimpleTooltip>
            <SimpleTooltip
              contentProps={{ side: 'left' }}
              delayDuration={1000}
              content="Previous post"
            >
              <button
                tabIndex={-1}
                onClick={() => navigatePosts(false)}
                className="p-1 w-full flex bg-white/40 hover:bg-white/80 dark:bg-transparent rounded-none shadow-gray-200/[6%] shadow-inner rounded-b-md dark:hover:bg-secondary items-center justify-center border-0 dark:shadow-black/10 h-full"
              >
                {paginatingMoreLoader ? (
                  <div className="secondary-svg !w-3.5 !h-3.5">
                    <Loader />
                  </div>
                ) : (
                  <ChevronDownIcon className="secondary-svg !w-3.5 !h-3.5" />
                )}
              </button>
            </SimpleTooltip>
          </div>
        )}
        {user?.id && (submission?.user?._id === user?.id || isMember(user?.id, org)) && (
          <div
            className={`grid  overflow-auto custom-scrollbar items-center grid-cols-5 ${
              !isSmall && 'px-4'
            } ${!isSmall ? 'pt-4 pb-3.5' : 'py-3'} border-b gap-y-4 dashboard-border`}
          >
            <div className="col-span-2">
              <span className="font-medium">{t('manage-post')}</span>
            </div>
            <div className="col-span-3 ml-auto">{renderManagePostMenu()}</div>
          </div>
        )}

        <div
          className={`grid items-center grid-cols-5 ${
            submission?.mergedToSubmissionId && 'hidden'
          } ${!isSmall ? 'p-4' : 'py-3'} border-b gap-y-4 dashboard-border`}
        >
          {renderMainPostInfo()}
        </div>
      </div>

      {isMember(user?.id, org) ||
      !submission?.postCategory?.hideCreationDates ||
      !org?.settings?.hideAuthorInfo ? (
        <div className={`grid items-center grid-cols-5 ${!isSmall ? 'p-4' : 'py-3'} gap-y-4 `}>
          {renderExtraPostInfo()}
        </div>
      ) : null}

      {renderPrioritizationRanker()}
      <div className={'border-t dashboard-border'}>
        <DeeperInsightPopup isOpen={openInsights} setOpen={setOpenInsights} />

        {!isMember(user?.id, org) ? (
          <>
            {!submission?.mergedToSubmissionId && (
              <VotingHandler
                setLocalAuthenitacteModal={setAuthenitacteModal}
                subscribe={true}
                submission={submission}
                small={true}
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
              />
            )}
          </>
        ) : isPlan(org.plan, 'pro') && submission?.user?._id ? (
          <TrackedUserPreview setOpenInsights={setOpenInsights} userId={submission?.user?._id} />
        ) : (
          <>
            <button
              onClick={() => setOpenInsights(true)}
              className="flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 main-transition border-gray-100/60 dark:hover:bg-secondary dark:border-border/50 unstyled-button"
            >
              <div className="pr-3">
                <p className="flex items-center font-semibold">
                  <SparklesIcon className="mr-1.5 text-accent h-4 w-4" />
                  View author data
                </p>
                <p className="mt-1.5 text-xs dark:text-foreground/90 font-medium">
                  Sync your customer data with Featurebase to view and sort posts by customers
                  monthly spend and other parameters.
                </p>
              </div>
              <ChevronRightIcon className="flex-shrink-0 w-4 h-4 text-gray-200 dark:text-background-accent" />
            </button>
          </>
        )}
      </div>
      {customModal}
    </div>
  )
}

export default ManagePost
