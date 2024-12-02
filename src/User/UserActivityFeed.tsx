import { ISingleTrackerUser } from '@/interfaces/IUser'
import React, { useState } from 'react'
import { sanitizeHTML } from '../lib/contentSanitizer'
import StandaloneMainPostViewPopup from './StandaloneMainPostViewPopup'
import { dateDifference } from './MainPostView'
import { useTranslation } from 'next-i18next'
import {
  ArrowUpIcon,
  ChatAlt2Icon,
  CollectionIcon,
  LightningBoltIcon,
} from '@heroicons/react/solid'
import { useSingleTrackedUserActivity } from '@/data/user'
import EmptyActivity from './EmptyActivity'
import Loader from './Loader'
import { ContentModifier } from './ContentReplacer'
import { stripHtml } from 'string-strip-html'

export const getText = (type: string, t: any) => {
  switch (type) {
    case 'reply':
      return t('replied-to-a-comment')
    case 'upvote':
      return t('upvoted-a-post')
    case 'comment':
      return t('posted-a-comment')
    case 'roleChanged':
      return t('users-role-changed')
    case 'createSubmission':
      return t('created-a-post')
    default:
      break
  }
}

const UserActivityFeed: React.FC<{ activeUserId: string }> = ({ activeUserId }) => {
  const [activeActivityFilter, setActiveActivityFilter] = useState('all')
  const [showPostView, setShowPostView] = useState(false)
  const [activeSubmissionId, setActiveSubmissionId] = useState('')
  // const { restoreUrl, setUrl } = useSubmissionUrl()
  const { i18n } = useTranslation()
  const { trackedUserActivity, loadingSingleUserActivity } =
    useSingleTrackedUserActivity(activeUserId)
  const { t } = useTranslation()

  const ActivityLog: React.FC<{ activity: ISingleTrackerUser }> = ({ activity }) => {
    const { createdAt, submissionId, type, comment, submission } = activity

    const getContentPreview = () => {
      switch (type) {
        case 'reply':
          return comment?.content || ''
        case 'roleChanged':
          return ''
        case 'upvote':
          return submission?.title ? submission?.title : 'This post has been deleted.'
        case 'comment':
          return comment?.content || ''
        case 'createSubmission':
          return submission?.title ? submission?.title : 'This post has been deleted.'
        default:
          return ''
      }
    }

    const strippedHTML = stripHtml(getContentPreview()).result

    if (getText(type, t) === undefined || !strippedHTML) return null
    return (
      <button
        onClick={() => {
          if (type !== 'roleChanged' && submission?.title) {
            if (setActiveSubmissionId && setShowPostView) {
              setActiveSubmissionId(submissionId)
              setShowPostView(true)
            }
          }
        }}
        className={`unstyled-button overflow-hidden rounded-none group border-t border-gray-100 hover:dark:bg-secondary py-5 dark:border-border main-transition cursor-pointer hover:bg-gray-50  font-medium w-full text-xs dark:text-foreground text-gray-500`}
      >
        <div className="flex items-center justify-between px-4">
          <span className="text-sm font-semibold">{getText(type, t)}</span>
          <span className="text-xs opacity-75 first-letter:capitalize">
            {dateDifference(createdAt, i18n.language)}
          </span>
        </div>
        {type !== 'upvote' && type !== 'roleChanged' && (
          <div className="px-4 mt-3.5 line-clamp-3 text-sm font-normal text-gray-400 dark:border-border main-transition dark:text-foreground border-gray-100/50">
            <ContentModifier content={strippedHTML} />
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="">
      <StandaloneMainPostViewPopup
        activeSubmissionId={activeSubmissionId}
        setShowPostView={(value) => {
          // if (value === false) {
          //   restoreUrl()
          // }
          setShowPostView(value)
        }}
        showPostView={showPostView}
      />

      <div className="flex items-center gap-1 px-3 pt-3 overflow-auto text-sm font-medium custom-scrollbar">
        <button
          onClick={() => setActiveActivityFilter('all')}
          className={`flex ${
            activeActivityFilter !== 'all' &&
            'dark:shadow-none border-transparent shadow-none dark:border-transparent dark:bg-transparent'
          } dashboard-secondary flex-shrink-0 px-2 py-1 items-center`}
        >
          <LightningBoltIcon className="secondary-svg mr-1.5" />
          {t('all-activity')}
        </button>
        <button
          onClick={() => setActiveActivityFilter('comments')}
          className={`flex ${
            activeActivityFilter !== 'comments' &&
            'dark:shadow-none border-transparent shadow-none dark:border-transparent dark:bg-transparent'
          } dashboard-secondary px-2 py-1 items-center`}
        >
          <ChatAlt2Icon className="secondary-svg mr-1.5 " />
          {t('comments')}
        </button>
        <button
          onClick={() => setActiveActivityFilter('posts')}
          className={`flex ${
            activeActivityFilter !== 'posts' &&
            'dark:shadow-none border-transparent shadow-none dark:border-transparent dark:bg-transparent'
          } dashboard-secondary px-2 py-1 items-center`}
        >
          <CollectionIcon className="secondary-svg mr-1.5 " /> {t('posts')}
        </button>
        <button
          onClick={() => setActiveActivityFilter('upvotes')}
          className={`flex ${
            activeActivityFilter !== 'upvotes' &&
            'dark:shadow-none border-transparent shadow-none dark:border-transparent dark:bg-transparent'
          } dashboard-secondary px-2 py-1 items-center`}
        >
          <ArrowUpIcon className="secondary-svg mr-1.5 " /> {t('upvotes')}
        </button>
      </div>
      <div className="mt-3">
        {trackedUserActivity?.length > 0 ? (
          trackedUserActivity
            ?.filter((activity) => {
              if (!activity?.submission?.title) return false
              if (activeActivityFilter === 'all') return true
              if (activeActivityFilter === 'comments')
                return activity.type === 'comment' || activity.type === 'reply'
              if (activeActivityFilter === 'posts') return activity.type === 'createSubmission'
              if (activeActivityFilter === 'upvotes') return activity.type === 'upvote'
            })
            ?.map((activity, index: number) => <ActivityLog activity={activity} key={index} />)
        ) : loadingSingleUserActivity ? (
          <div className="py-6">
            <div className="w-5 h-5 mx-auto text-background-accent">
              <Loader />
            </div>
          </div>
        ) : (
          <div className="pb-16">
            <EmptyActivity />
          </div>
        )}
      </div>
    </div>
  )
}

export default UserActivityFeed
