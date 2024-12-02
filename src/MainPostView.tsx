import {
  ArrowRightIcon,
  CheckIcon,
  ClipboardCopyIcon,
  ExternalLinkIcon,
  EyeOffIcon,
  InformationCircleIcon,
  ShieldCheckIcon,
  TrashIcon,
} from '@heroicons/react/solid'
import React, { useEffect, useState } from 'react'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import CommentFeed from './CommentFeed'
import TextEditor from './TextEditor'
import { format, formatDistance, formatDistanceToNow, parseISO } from 'date-fns'
import { KeyedMutator } from 'swr'
import {
  getSingleSubmissionWithoutSWR,
  removeSubmission,
  updateSubmission,
  updateSubmissionInfo,
} from '../../network/lib/submission'
import { useComments } from '../data/comment'
import Loader from './Loader'
import { useUser } from '../data/user'
import { useCurrentOrganization } from '../data/organization'
import Router from 'next/router'
import ConfirmationModal from './ConfirmationModal'
import AddUpvoters from './AddUpvoters'
import PublicBoardAuth from './PublicBoardAuth'
import { useTranslation } from 'next-i18next'
import {
  enUS,
  et,
  ptBR,
  de,
  fr,
  es,
  ru,
  nl,
  ko,
  pl,
  sv,
  hu,
  it,
  uk,
  bn,
  bs,
  bg,
  ca,
  hr,
  cs,
  da,
  fi,
  el,
  hi,
  id,
  ja,
  lv,
  lt,
  ms,
  mn,
  nb,
  pt,
  ro,
  sr,
  sl,
  th,
  tr,
  vi,
  zhCN,
  zhTW,
} from 'date-fns/locale'
import Link from '@/components/CustomLink'
import {
  unlinkIssue,
  unlinkJiraIssue,
  unlinkClickup,
  banUser,
} from '../../network/lib/organization'
import PushToLinearPopup from './PushToLinearPopup'
import PopupWrapper from './PopupWrapper'
import { toast } from 'sonner'
import PushToJiraPopup from './PushToJiraPopup'
// import useElementSize from './useElementSize'
import useElementSize from '@/hooks/betterUseElementSize'
import ManagePost from './MainPostViewOptions'
import { isTestingEnv } from '../atoms/authAtom'
import { useAtom } from 'jotai'
import { cn, keepPostBetweenAuthor } from '@/lib/utils'
import PushToClickupPopup from './PushToClickupPopup'
import ClickupLinks from './ClickupLinks'
import { ContentModifier } from './ContentReplacer'
import LargeSurvey from './LargeSurvey'
import { mutateSubmissionItems, performSubmissionMutation } from '@/lib/submissionMutator'
import LinearLinks from './LinearLinks'
import { notificationAtom } from '@/atoms/notificationAtom'
import { clearNotifications } from './NotificationPopupUpperBar'
import SimilarPostResults from './SimilarPostResults'
import MainPostViewCommentEditor from './MainPostViewCommentEditor'
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'
import { lastViewedSubmissionAtom } from '@/atoms/displayAtom'
import CustomPostFields from './CustomPostFields'
import MergedWithPopup from './MergedWithPopup'
import { can } from '@/lib/acl'
import SimpleTooltip from './SimpleTooltip'
import { Button } from './radix/Button'
import PushToGithubPopup from './PushToGithubPopup'
import GithubLinks from './GithubLinks'
import JiraLinks from './JiraLinks'
import { availableLocales } from '@/lib/localizationUtils'
import PushToDevOpsPopup from './PushToDevOpsPopup'
import DevOpsLinks from './DevOpsLinks'

// Make swit
// Define the locales that you support
type SupportedLocales = (typeof availableLocales)[number]

// Define the type for the object containing all your locale objects
type LocaleObjects = {
  [K in SupportedLocales]: Locale
}

// Now use this type for your locales object
const locales: LocaleObjects = {
  bn,
  bs,
  'pt-BR': ptBR,
  bg,
  ca,
  hr,
  cs,
  da,
  nl,
  en: enUS,
  et,
  fi,
  fr,
  de,
  el,
  hi,
  hu,
  id,
  it,
  ja,
  ko,
  lv,
  lt,
  ms,
  mn,
  nb,
  pl,
  pt,
  ro,
  ru,
  sr,
  'zh-CN': zhCN,
  sl,
  es,
  sw: enUS, // Swahili not available, fallback to English
  sv,
  th,
  'zh-TW': zhTW,
  tr,
  uk,
  vi,
}

export const dateDifference = (date: string, locale: string = 'en', renderDate?: Date): string => {
  if (!date || date === 'Invalid date') {
    return ''
  }

  if (locale === 'default') {
    locale = 'en'
  }

  // Runtime check to ensure the locale is supported
  const safeLocale: SupportedLocales = locales.hasOwnProperty(locale)
    ? (locale as SupportedLocales)
    : 'en'

  const dateToCompare = renderDate ? new Date(renderDate) : new Date()
  const localeObject = locales[safeLocale]

  const formattedDistance = renderDate
    ? formatDistance(new Date(date), dateToCompare, {
        includeSeconds: true,
        addSuffix: true,
        locale: localeObject,
      })
    : formatDistanceToNow(new Date(date), {
        includeSeconds: true,
        addSuffix: true,
        locale: localeObject,
      })

  // First letter to uppercase
  return formattedDistance.charAt(0).toUpperCase() + formattedDistance.slice(1)
}

// Helper function to add ordinal suffixes to day numbers
const addOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return `${day}th`
  switch (day % 10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}

// Updated formatLocalizedDate function with ordinal handling for English
export const formatLocalizedDate = (
  date: string,
  locale: string = 'en',
  eta: boolean = false
): string => {
  if (locale === 'default') {
    locale = 'en'
  }

  if (!date || date === 'Invalid date') {
    return ''
  }

  const dateObj = new Date(date)

  // Define formatting options
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  if (eta) {
    // If ETA is true, include time
    options.hour = 'numeric'
    options.minute = 'numeric'
  }

  // Create formatter
  const formatter = new Intl.DateTimeFormat(locale, options)

  // Use formatToParts to manipulate individual date components
  const parts = formatter.formatToParts(dateObj)

  // Check if the locale is English to add ordinal suffix
  const isEnglish = locale.startsWith('en')

  const formattedParts = parts.map((part) => {
    if (isEnglish && part.type === 'day') {
      const dayNumber = parseInt(part.value, 10)
      return addOrdinalSuffix(dayNumber)
    }
    return part.value
  })

  // Join the parts back into a single string
  const formattedDate = formattedParts.join('')

  // Capitalize the first letter (if necessary)
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

export const getETADate = (
  date: string | Date,
  locale: string = 'en',
  shortFormat: boolean = false,
  userTimezone?: string
) => {
  if (!date) {
    return ''
  }

  // Check if the provided locale is supported, otherwise default to 'en'
  const safeLocale = locale in locales ? locale : 'en'

  // Define the format string based on the 'shortFormat' flag
  const formatString = shortFormat ? 'MMM d' : 'MMM dd, yyyy'

  // Format the date using the appropriate locale and format string
  const formattedDate = format(new Date(date), formatString, {
    // @ts-ignore
    locale: locales?.[safeLocale],
  })

  // Capitalize the first letter of the formatted date
  return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)
}

const MainPostView: React.FC<{
  submission: ISubmission
  mutateSubmissions: KeyedMutator<any[]> | any
  rawSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate
  large?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  timeFrame?: any
  widget?: boolean
  openInFeaturebaseUrl?: string
  showPostView?: boolean
  renderDate?: Date
  roadmapView?: boolean
  timezone?: string
  fetchResults?: boolean
  fullwidth?: boolean
  commentThreadId?: string
  setDisablePopupClosing?: (value: boolean) => void
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>>
}> = ({
  submission,
  mutateSubmissions,
  large = false,
  rawSubmissionData,
  setOpen,
  timeFrame,
  widget,
  openInFeaturebaseUrl,
  renderDate,
  roadmapView,
  timezone,
  fetchResults,
  fullwidth,
  commentThreadId,
  setDisablePopupClosing,
  setActiveSubmissionId,
}) => {
  const [pushToLinearPopup, setPushToLinearPopup] = useState(false)
  const [pushToClickupPopup, setPushToClickupPopup] = useState(false)
  const [pushToGithubPopup, setPushToGithubPopup] = useState(false)
  const [pushToJiraPopup, setPushToJiraPopup] = useState(false)
  const [pushToDevOpsPopup, setPushToDevOpsPopup] = useState(false)
  const [deletePost, setDeletePost] = useState(false)

  const [sortByComments, setSortByComments] = useState({
    sortBy: (submission?.commentCount || 0) < 10 ? 'new' : 'best',
    submissionId: submission?.id,
    commentThreadId,
  })
  const [editLoading, setEditLoading] = useState(false)

  const { user } = useUser()
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const [enableEditing, setEnableEditing] = useState(false)
  const [newPostData, setNewPostData] = useState({ content: '', title: '' })
  const [authenitcateModal, setAuthenitacteModal] = useState(false)
  const [addUpvoters, setAddUpvoters] = useState(false)
  const { t } = useTranslation()
  const [metaDataPopup, setMetaDataPopup] = useState(false)
  const [displayedLinearpage, setDisplayedLinearPage] = useState<'New issue' | 'Link existing'>(
    'New issue'
  )
  const [displayedClickupPage, setDisplayedClickupPage] = useState<'New issue' | 'Link existing'>(
    'New issue'
  )

  const [displayedGithubPage, setDisplayedGithubPage] = useState<'New issue' | 'Link existing'>(
    'New issue'
  )

  const [displayedJiraPage, setDisplayedJiraPage] = useState<'New issue' | 'Link existing'>(
    'New issue'
  )
  const [displayedDevOpsPage, setDisplayedDevOpsPage] = useState<'New work item' | 'Link existing'>(
    'New work item'
  )

  const [unlinkConfirmation, setUnlinkConfirmation] = useState(false)
  const [banUserModalOpen, setBanUserModalOpen] = useState(false)
  const [clickupUnlinkConfirmation, setClickupUnlinkConfirmation] = useState(false)
  const [jiraUnlinkConfirmation, setJiraUnlinkConfirmation] = useState(false)
  const [isShowingMore, setIsShowingMore] = useState(false)
  const [editorHeightRef, { width, height: editorHeight }] = useElementSize()

  const [testingEnv, setTestingEnv] = useAtom(isTestingEnv)
  const { commentsMutate, rawComments, comments } = useComments(sortByComments, org)
  const [mergedPostInfo, setMergedPostInfo] = useState<any>(null)
  const [notifications, setNotifications] = useAtom(notificationAtom)
  const [lastViewedSubmission, setLastViewedSubmission] = useAtom(lastViewedSubmissionAtom) // Correctly initializing a ref with an empty string

  const [isWritingComment, setIsWritingComment] = useState(false)
  const [isWritingReply, setIsWritingReply] = useState(false)

  const stringifiedNotificationResults = JSON.stringify(notifications?.notificationResults)

  useEffect(() => {
    if (submission && user && org) {
      clearNotifications(submission.id, notifications)
    }
  }, [submission, user, stringifiedNotificationResults])

  useEffect(() => {
    if (submission?.mergedToSubmissionId && !mergedPostInfo) {
      getSingleSubmissionWithoutSWR(submission?.mergedToSubmissionId)
        .then((resp) => {
          if (resp.data) {
            setMergedPostInfo(resp.data.results[0])
          }
        })
        .catch((err) => {
          toast.error('Error fetching merged post info')
        })
    }
  }, [submission?.mergedToSubmissionId])

  useEffect(() => {
    if (sortByComments?.submissionId !== submission?.id) {
      setSortByComments({
        ...sortByComments,
        submissionId: submission?.id,
      })
    }
  }, [submission?.id])

  useEffect(() => {
    if (setDisablePopupClosing !== undefined) {
      if (submission) {
        if (enableEditing || isWritingComment || isWritingReply) {
          setDisablePopupClosing(true)
        } else {
          if (!isWritingComment && !isWritingReply) {
            setDisablePopupClosing(false)
          }
        }
      }
    }
  }, [submission, enableEditing, setDisablePopupClosing, isWritingComment, isWritingReply])

  const changeSubmission = () => {
    if (!editLoading) {
      setEditLoading(true)
      updateSubmission({
        submissionId: submission?.id,
        content: newPostData.content || '<p></p>',
        title: newPostData.title,
      })
        .then((resp) => {
          if (resp.data.success) {
            setEditLoading(false)
            setEnableEditing(false)
            performSubmissionMutation(
              mutateSubmissions,
              (oldResults) =>
                oldResults.map((sub) =>
                  sub.id === submission?.id
                    ? { ...sub, content: newPostData.content, title: newPostData.title }
                    : sub
                ),
              rawSubmissionData
            )
          }
        })
        .catch((err) => {
          toast.error('Error updating post')
          setEditLoading(false)
        })
    }
  }

  const approvePost = () => {
    mutateSubmissionItems('inReview', false, mutateSubmissions, rawSubmissionData, submission?.id)

    updateSubmissionInfo({
      submissionId: submission?.id,
      inReview: false,
    })
      .then((resp) => {
        if (resp.data.success) {
          toast.success('Post successfully approved')
        }
      })
      .catch((err) => {
        toast.error('Error approving post')
        mutateSubmissions()
      })
  }

  const deleteSubmission = () => {
    mutateSubmissionItems(
      '',
      '',
      mutateSubmissions,
      rawSubmissionData,
      [submission?.id],
      (oldResults: ISubmission[]) => {
        return oldResults.filter((sub) => sub.id !== submission?.id)
      },
      -1
    )

    removeSubmission(submission?.id)
      .then((resp) => {
        if (resp.data.success) {
          toast.success('Post successfully deleted')
          if (roadmapView) {
            mutateSubmissions(['Deleted'])
          }
        }
      })
      .catch((err) => {
        toast.error('Error deleting posts')
        mutateSubmissions()
      })

    if (setOpen === undefined) {
      Router.push('/')
    } else {
      setOpen(false)
    }
  }

  const doUnlinkJiraIssue = () => {
    unlinkJiraIssue({ submissionId: submission?.id })
      .then((resp) => {
        if (resp.data.success) {
          mutateSubmissions()
          toast.success('Issue successfully unlinked')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Something went wrong')
      })
  }

  const unlinkLinearIssue = () => {
    unlinkIssue({ submissionId: submission?.id })
      .then((resp) => {
        if (resp.data.success) {
          mutateSubmissions()
          toast.success('Issue successfully unlinked')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Could not unlink issue')
      })
  }

  const unlinkClickupIssue = () => {
    unlinkClickup({ submissionId: submission?.id })
      .then((resp) => {
        if (resp.data.success) {
          mutateSubmissions()
          toast.success('Task successfully unlinked')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error('Something went wrong')
      })
  }

  const changeSubmissionCommentCount = (increase: boolean) => {
    if (submission?.commentCount !== undefined) {
      mutateSubmissionItems(
        'commentCount',
        increase ? submission?.commentCount + 1 : submission?.commentCount - 1,
        mutateSubmissions,
        rawSubmissionData,
        submission?.id
      )
    }
  }

  const banUserCallback = () => {
    banUser({
      email: submission?.user?.email,
      id: submission?.user?._id,
    })
      .then(() => {
        toast.success('User banned successfully')
        mutateSubmissions && mutateSubmissions()
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || 'Failed to ban user')
      })
  }

  if (submission) {
    return (
      <div className={cn(!fullwidth ? 'max-w-5xl h-full' : 'min-h-full flex flex-col')}>
        <PopupWrapper
          isOpen={metaDataPopup}
          small={true}
          hasPadding={false}
          setIsOpen={setMetaDataPopup}
        >
          <div className="px-4 py-3 ">
            <h3 className="text-sm font-medium text-gray-600 dark:text-white">Metadata</h3>
            <div className="mt-2 border divide-y rounded-md secondary-raised-card">
              {submission.metadata &&
                Object.keys(submission.metadata).map((key) => {
                  const metadata: any = submission?.metadata
                  return (
                    <div
                      key={key}
                      className="flex relative group items-start p-1.5 px-2.5 text-[13px]"
                    >
                      <div className="absolute inset-y-0 right-0 delay-100 opacity-0 group-hover:opacity-100 main-transition">
                        <button
                          onClick={() => {
                            try {
                              navigator.clipboard.writeText(JSON.stringify(metadata?.[key]))
                              toast.success('Copied to clipboard')
                            } catch (err) {
                              console.error('Failed to copy: ', err)
                            }
                          }}
                          className="flex unstyled-button items-center gap-1 h-full pr-3.5 hover:dark:text-foreground dark:text-foreground/60 transform-gpu text-xs"
                        >
                          Copy
                        </button>
                      </div>
                      <SimpleTooltip
                        delayDuration={500}
                        content={key && key?.length > 18 ? <p>{key}</p> : null}
                      >
                        <div className="w-1/4 truncate dark:text-foreground/80 text-background-accent">
                          <span className="truncate cursor-default select-none">{key}</span>
                        </div>
                      </SimpleTooltip>
                      <div className="w-3/4 pl-3">
                        <SimpleTooltip
                          delayDuration={2000}
                          content={
                            metadata?.[key] && metadata?.[key]?.length > 200 ? (
                              <p>{metadata?.[key]}</p>
                            ) : null
                          }
                        >
                          <span
                            className={cn(
                              'line-clamp-4 font-medium',
                              metadata?.[key] === 'undefined' &&
                                'dark:text-foreground/60 text-background-accent'
                            )}
                          >
                            {metadata?.[key]?.toString() || '-'}
                          </span>
                        </SimpleTooltip>
                      </div>
                    </div>
                  )
                })}
            </div>
            <div className="flex items-center justify-end mt-3">
              <Button
                variant={'outline'}
                size={'sm'}
                onClick={() => {
                  try {
                    navigator.clipboard.writeText(JSON.stringify(submission.metadata))
                    toast.success('Copied to clipboard')
                  } catch (err) {
                    console.error('Failed to copy: ', err)
                  }
                }}
              >
                <ClipboardCopyIcon className="mr-1.5 secondary-svg" />
                Copy all data
              </Button>
            </div>
          </div>
        </PopupWrapper>
        <ConfirmationModal
          open={deletePost}
          setOpen={setDeletePost}
          callBack={deleteSubmission}
          buttonTxt="Delete"
          description="Are you sure you want to delete this post? This can not be undone."
          title="Delete Post"
        />
        <ConfirmationModal
          open={jiraUnlinkConfirmation}
          setOpen={setJiraUnlinkConfirmation}
          callBack={doUnlinkJiraIssue}
          buttonTxt="Unlink"
          description="Are you sure you want to unlink this Jira issue?"
          title="Unlink Jira issue"
        />
        <ConfirmationModal
          open={unlinkConfirmation}
          setOpen={setUnlinkConfirmation}
          callBack={unlinkLinearIssue}
          buttonTxt="Unlink"
          description="Are you sure you want to unlink this Linear issue/project?"
          title="Unlink Linear issue/project"
        />
        <ConfirmationModal
          open={clickupUnlinkConfirmation}
          setOpen={setClickupUnlinkConfirmation}
          callBack={unlinkClickupIssue}
          buttonTxt="Unlink"
          description="Are you sure you want to unlink this ClickUp task?"
          title="Unlink ClickUp issue"
        />
        <ConfirmationModal
          open={banUserModalOpen}
          setOpen={setBanUserModalOpen}
          callBack={banUserCallback}
          buttonTxt="Ban"
          description={`Are you sure you want to ban ${
            submission?.user?.email || submission?.user?.name
          } from your organization?`}
          title="Ban User"
        />

        <AddUpvoters
          submission={submission}
          mutateSubmissions={mutateSubmissions}
          submissionId={submission?.id}
          open={addUpvoters}
          setOpen={setAddUpvoters}
        />
        <PublicBoardAuth
          isOpen={authenitcateModal}
          setIsOpen={setAuthenitacteModal}
          callback={() => mutateCurrentOrg()}
        />
        <PushToLinearPopup
          isOpen={pushToLinearPopup}
          setOpen={setPushToLinearPopup}
          submission={submission}
          mutateSubmission={mutateSubmissions}
          displayedPage={displayedLinearpage}
        ></PushToLinearPopup>
        <PushToJiraPopup
          isOpen={pushToJiraPopup}
          setOpen={setPushToJiraPopup}
          submission={submission}
          mutateSubmission={mutateSubmissions}
          displayedPage={displayedJiraPage}
        ></PushToJiraPopup>
        <PushToClickupPopup
          isOpen={pushToClickupPopup}
          setOpen={setPushToClickupPopup}
          submission={submission}
          mutateSubmission={mutateSubmissions}
          displayedPage={displayedClickupPage}
        ></PushToClickupPopup>
        <PushToGithubPopup
          isOpen={pushToGithubPopup}
          setOpen={setPushToGithubPopup}
          submission={submission}
          mutateSubmission={mutateSubmissions}
          displayedPage={displayedGithubPage}
        ></PushToGithubPopup>
        <PushToDevOpsPopup
          isOpen={pushToDevOpsPopup}
          setOpen={setPushToDevOpsPopup}
          submission={submission}
          mutateSubmission={mutateSubmissions}
          displayedPage={displayedDevOpsPage}
        ></PushToDevOpsPopup>

        <div
          className={cn(
            `flex flex-col md:flex-row`,
            fullwidth ? 'mx-0 min-full h-full flex-grow' : ' h-full'
          )}
        >
          <div
            className={`w-full p-[18px] md:py-5 md:w-8/12 relative overflow-hidden   ${
              fullwidth && 'max-w-4xl sm:min-w-[500px] mx-auto'
            }`}
          >
            {large && !openInFeaturebaseUrl && (
              <div className="mb-3 -mt-2">
                <a
                  onClick={() => {
                    // Check if the user was on this page before
                    if (lastViewedSubmission) {
                      Router.back()
                    } else {
                      Router.push('/')
                    }
                  }}
                  className="text-xs font-medium cursor-pointer text-background-accent dark:text-foreground"
                >
                  <span className="opacity-75">←</span> {t('back-to-all-posts')}
                </a>
              </div>
            )}
            {openInFeaturebaseUrl && (
              <div className="flex justify-end w-full mx-auto mb-2">
                <a href={openInFeaturebaseUrl} target="_blank" rel="noreferrer">
                  <button className="text-xs dashboard-secondary">
                    Open in Featurebase
                    <ExternalLinkIcon className="secondary-svg ml-1.5" />
                  </button>
                </a>
              </div>
            )}

            {fullwidth && !submission?.isSpam
              ? null
              : (submission?.inReview ||
                  (!can(user?.id, 'moderate_posts', org) &&
                    ((submission?.accessUsers && submission?.accessUsers?.length > 0) ||
                      (submission?.accessCompanies &&
                        submission?.accessCompanies?.length > 0)))) && (
                  <div className="relative mb-5 rounded-md">
                    <div className="w-full border rounded-md border-accent/20 dark:border-accent/20">
                      <div
                        className={cn(
                          'flex items-center border-accent/20 dark:border-accent/[13%] w-full p-4  rounded-t-md bg-accent/10 dark:bg-accent/[12%]',
                          can(user?.id, 'moderate_posts', org) && !fullwidth
                            ? 'rounded-t-md  border-b'
                            : 'rounded-md p-3'
                        )}
                      >
                        <div className="flex-shrink-0">
                          {!submission?.inReview ? (
                            <EyeOffIcon className="w-4 h-4 text-accent dark:text-accent" />
                          ) : (
                            <ShieldCheckIcon className="w-4 h-4 text-accent dark:text-accent" />
                          )}
                        </div>
                        <div className="items-center flex-1 ml-2">
                          <p className="text-[13px] font-medium leading-5 text-accent-foreground dark:text-white/90">
                            {submission?.inReview
                              ? can(user?.id, 'moderate_posts', org)
                                ? submission?.isSpam
                                  ? 'This post was automatically flagged as spam and is awaiting your approval.'
                                  : t('approve-the-post-to-make-it-visible-to-others')
                                : 'This post is awaiting approval from the admins. It is not visible to others.'
                              : submission?.postCategory?.defaultCompanyOnly
                              ? "This post is private. It's only visible to your company members."
                              : "This post is private. It's only visible to you and the admins."}
                          </p>
                        </div>
                      </div>
                      {can(user?.id, 'moderate_posts', org) && !fullwidth && (
                        <div
                          className={cn(
                            'grid grid-cols-3 divide-x bg-accent/[2%] dark:bg-accent/[3%] divide-accent/20 dark:divide-accent/10 rounded-b-md ',
                            !submission?.user?.email && 'grid-cols-2'
                          )}
                        >
                          <button
                            tabIndex={-1}
                            onClick={() => setDeletePost(true)}
                            className="justify-center p-3 text-xs rounded-none plain-button rounded-bl-md hover:bg-accent/[12%] text-accent-foreground dark:text-white/90"
                          >
                            <TrashIcon className="mr-1.5 h-3.5 w-3.5 text-accent/80" />
                            Delete
                          </button>
                          {submission?.user?._id &&
                            (submission.user.type === 'customer' ||
                              submission.user.type === 'admin') && (
                              <button
                                tabIndex={-1}
                                onClick={() => {
                                  if (
                                    submission.user?._id &&
                                    (submission.user.type === 'admin' ||
                                      submission.user.type === 'customer')
                                  ) {
                                    keepPostBetweenAuthor(
                                      [submission.id],
                                      [
                                        {
                                          _id: submission?.user?._id,
                                          type: submission?.user?.type,
                                        },
                                      ],
                                      mutateSubmissions,
                                      rawSubmissionData,
                                      false,
                                      true
                                    )
                                  }
                                }}
                                className="justify-center p-3 text-xs rounded-none plain-button hover:bg-accent/[12%] text-accent-foreground dark:text-white/90"
                              >
                                <EyeOffIcon className="mr-1.5 h-3.5 w-3.5 text-accent/80" />
                                Discuss with author
                              </button>
                            )}
                          <button
                            tabIndex={-1}
                            onClick={approvePost}
                            className="justify-center p-3 text-xs rounded-none plain-button rounded-br-md hover:bg-accent/[12%] text-accent-foreground dark:text-white/90"
                          >
                            <CheckIcon className="mr-1.5 h-3.5 w-3.5 text-accent/80" />
                            Approve publicly
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

            <div className="flex items-start w-full">
              <div className="w-full ">
                <div
                  tabIndex={1}
                  className="flex items-start justify-between gap-3 pb-3 overflow-hidden outline-none dark:outline-none focus:outline-none dark:focus:outline-none"
                >
                  <div className="w-full">
                    {enableEditing ? (
                      <input
                        onChange={(event) =>
                          setNewPostData((prev) => ({
                            ...prev,
                            [event.target.name]: event.target.value,
                          }))
                        }
                        name="title"
                        value={newPostData.title}
                        className={`${
                          fullwidth ? 'text-lg sm:text-xl font-semibold' : 'text-lg font-semibold'
                        } text-gray-700 dark:text-white content w-full line-clamp-5`}
                      />
                    ) : (
                      <h1
                        className={`${
                          fullwidth ? 'text-lg sm:text-xl font-semibold' : 'text-lg font-semibold'
                        } text-gray-700 dark:text-white content w-full line-clamp-5`}
                      >
                        {submission?.title}
                      </h1>
                    )}
                  </div>
                  {!enableEditing && <MergedWithPopup submission={submission} />}
                </div>

                {enableEditing ? (
                  <div className={`text-gray-400  dark:text-foreground pt-1`}>
                    <TextEditor
                      className="styled-editor"
                      formData={newPostData}
                      height={60}
                      // setFormData={setNewPostData}
                      setFormData={(data) => {
                        setNewPostData((p) => ({ ...p, content: data }))
                      }}
                      author={submission?.user?._id}
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div
                      ref={editorHeightRef}
                      className={`${
                        fullwidth ? 'text-base' : 'text-[15px]'
                      }  content  text-gray-400 dark:text-foreground ${
                        isShowingMore ? 'h-full' : 'max-h-[602px] h-full overflow-clip flow-root'
                      } pt-1`}
                    >
                      <ContentModifier
                        openReadMore={() => {
                          setIsShowingMore(true)
                        }}
                        content={submission.content}
                      />
                    </div>
                    {!isShowingMore && editorHeight === 598 && (
                      <button
                        onClick={() => setIsShowingMore(true)}
                        tabIndex={-1}
                        className={cn(
                          'continue-reading-overlay group dark:from-card',
                          large && 'dark:from-card'
                        )}
                      >
                        <p className="mb-1 text-sm font-medium text-gray-500 border-b border-transparent dark:text-foreground group-hover:border-gray-200 dark:group-hover:border-background-accent main-transition unstyled-button">
                          {t('continue-reading')}
                        </p>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {enableEditing && (
              <button
                onClick={() => changeSubmission()}
                className="ml-auto mt-3 dashboard-primary justify-center text-[13px] py-1.5"
              >
                {editLoading && (
                  <div className="w-4 h-4 mr-1 text-background-accent dark:text-foreground">
                    <Loader />
                  </div>
                )}
                {t('change-content')}
              </button>
            )}
            <CustomPostFields
              rawSubmissionData={rawSubmissionData}
              mutateSubmissions={mutateSubmissions}
              submission={submission}
            />
            <div className="mt-4 sm:mt-8">
              <LargeSurvey
                submission={submission}
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
              />
            </div>
            {can(user?.id, 'use_integrations', org) ? (
              <>
                <ClickupLinks mutateSubmissions={mutateSubmissions} submission={submission} />
                <LinearLinks unlinkLinearIssue={unlinkLinearIssue} submission={submission} />
                <GithubLinks submission={submission} mutateSubmissions={mutateSubmissions} />
                <JiraLinks submission={submission} mutateSubmissions={mutateSubmissions} />
              </>
            ) : null}
            {org.settings.devopsIntegrationEnabled && can(user?.id, 'use_integrations', org) ? (
              <DevOpsLinks submission={submission} mutateSubmissions={mutateSubmissions} />
            ) : null}

            {fetchResults && (
              <SimilarPostResults
                commentsMutate={commentsMutate}
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
                submissionId={submission.id}
                submission={submission}
                handleReverseMerge={(submissionId) => {
                  if (setOpen === undefined) {
                    Router.push('/submissions/' + submissionId)
                  } else {
                    setOpen(false)
                  }
                }}
              />
            )}

            {submission?.mergedToSubmissionId ? (
              <div className="mt-4">
                <div className="p-3 border rounded-md border-accent-200 bg-accent/10 dark:border-accent/10 dark:bg-accent/10">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 text-accent dark:text-accent">
                        <InformationCircleIcon />
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2 ml-3 overflow-hidden md:flex-row md:gap-4 md:justify-between">
                      <p className="overflow-hidden text-sm font-medium leading-5 break-all truncate flex-nowrap text-accent-foreground dark:text-white">
                        <span className="font-normal text-accent-foreground dark:text-white/90">
                          This post was merged into
                        </span>{' '}
                        {mergedPostInfo?.title}
                      </p>
                      <Link
                        legacyBehavior
                        href={'/submissions/' + submission?.mergedToSubmissionId}
                      >
                        <a className="flex items-center flex-shrink-0 text-xs font-medium whitespace-no-wrap cursor-pointer accent-text-hover">
                          Go to new post <ArrowRightIcon className="w-3 h-3 ml-1.5" />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <MainPostViewCommentEditor
                setDisablePopupClosing={setIsWritingComment}
                setAuthenitacteModal={setAuthenitacteModal}
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
                sortByComments={sortByComments}
                submission={submission}
              />
            )}

            {fetchResults && (
              <ManagePost
                roadmapView={roadmapView}
                renderDate={renderDate}
                timezone={timezone}
                large={large}
                mutateSubmissions={mutateSubmissions}
                org={org}
                rawSubmissionData={rawSubmissionData}
                setAddUpvoters={setAddUpvoters}
                setDeletePost={setDeletePost}
                setDisplayedJiraPage={setDisplayedJiraPage}
                setDisplayedLinearPage={setDisplayedLinearPage}
                setDisplayedClickupPage={setDisplayedClickupPage}
                setEnableEditing={setEnableEditing}
                setJiraUnlinkConfirmation={setJiraUnlinkConfirmation}
                setMetaDataPopup={setMetaDataPopup}
                setNewPostData={setNewPostData}
                setOpen={setOpen}
                setPushToJiraPopup={setPushToJiraPopup}
                setPushToLinearPopup={setPushToLinearPopup}
                setPushToClickupPopup={setPushToClickupPopup}
                setPushToGithubPopup={setPushToGithubPopup}
                setPushToDevOpsPopup={setPushToDevOpsPopup}
                setDisplayedDevOpsPage={setDisplayedDevOpsPage}
                setDisplayedGithubPage={setDisplayedGithubPage}
                setUnlinkConfirmation={setUnlinkConfirmation}
                submission={submission}
                setClickupUnlinkConfirmation={setClickupUnlinkConfirmation}
                timeFrame={timeFrame}
                widget={widget}
                isSmall={true}
                setAuthenitacteModal={setAuthenitacteModal}
                commentsMutate={commentsMutate}
                fullWidth={fullwidth}
                setActiveSubmissionId={setActiveSubmissionId}
                setBanUserModalOpen={setBanUserModalOpen}
              />
            )}

            {submission && (
              <CommentFeed
                isRegularPage={large}
                setAuthenitacteModal={setAuthenitacteModal}
                sortBy={sortByComments}
                setSortBy={setSortByComments}
                changeSubmissionCommentCount={changeSubmissionCommentCount}
                submission={submission}
                setIsWritingReply={setIsWritingReply}
              />
            )}
          </div>
          {fetchResults && (
            <ManagePost
              roadmapView={roadmapView}
              renderDate={renderDate}
              timezone={timezone}
              large={large}
              mutateSubmissions={mutateSubmissions}
              org={org}
              rawSubmissionData={rawSubmissionData}
              setAddUpvoters={setAddUpvoters}
              setDeletePost={setDeletePost}
              setDisplayedJiraPage={setDisplayedJiraPage}
              setDisplayedLinearPage={setDisplayedLinearPage}
              setDisplayedClickupPage={setDisplayedClickupPage}
              setEnableEditing={setEnableEditing}
              setJiraUnlinkConfirmation={setJiraUnlinkConfirmation}
              setMetaDataPopup={setMetaDataPopup}
              setNewPostData={setNewPostData}
              setOpen={setOpen}
              setPushToJiraPopup={setPushToJiraPopup}
              setPushToLinearPopup={setPushToLinearPopup}
              setPushToClickupPopup={setPushToClickupPopup}
              setPushToGithubPopup={setPushToGithubPopup}
              setPushToDevOpsPopup={setPushToDevOpsPopup}
              setDisplayedDevOpsPage={setDisplayedDevOpsPage}
              setDisplayedGithubPage={setDisplayedGithubPage}
              setUnlinkConfirmation={setUnlinkConfirmation}
              submission={submission}
              setClickupUnlinkConfirmation={setClickupUnlinkConfirmation}
              timeFrame={timeFrame}
              widget={widget}
              isSmall={false}
              setAuthenitacteModal={setAuthenitacteModal}
              commentsMutate={commentsMutate}
              fullWidth={fullwidth}
              setActiveSubmissionId={setActiveSubmissionId}
              setBanUserModalOpen={setBanUserModalOpen}
            />
          )}
        </div>
        {/* <div className="mt-10"></div> */}
      </div>
    )
  } else {
    return null
  }
}

export default MainPostView
