import { INotification, IOrganization } from '@/interfaces/IOrganization'
import React, { useEffect } from 'react'
import UserPicture from './UserPicture'
import { dateDifference } from './MainPostView'
import Loader from './Loader'
import InView from 'react-intersection-observer'
import { useTranslation } from 'next-i18next'
import { useAtom } from 'jotai'
import { notificationAtom } from '@/atoms/notificationAtom'
import { cn } from '@/lib/utils'
import { useUser } from '@/data/user'
import { removeNotificationById } from 'network/lib/organization'
import { toast } from 'sonner'

export const getActualType = (type: string, org: IOrganization) => {
  switch (type) {
    case 'Assignments':
      return ['assign']
    case 'Comments':
      return ['comment']
    case 'Posts':
      return ['submission']
    case 'Mentions':
      return ['mention']
    default:
      return org.settings.postModerationEnabled
        ? ['assign', 'comment', 'mention']
        : ['assign', 'comment', 'submission', 'mention']
  }
}

export const getNotificationTextForType = (t: any, type: string, mentionType?: string) => {
  switch (type) {
    case 'reply':
      return `💭 ${t('replied-to-a-comment')}`
    // return '💭 Replied to a comment'
    case 'assign':
      return `⭐ ${t('assigned-a-post-to-you')}`
    // return '⭐ Assigned a post to you'
    case 'comment':
      return `💬 ${t('posted-a-comment')}`
    // return '💬 Posted a comment'
    case 'submission':
      return `✨ ${t('created-a-post')}`
    // return '✨ Created a post'
    case 'mention':
      if (mentionType === 'comment') {
        return `🏷️ ${t('mentioned-you-in-a-comment')}`
        // return '🏷️ Mentioned you in a comment'
      } else if (mentionType === 'submission') {
        return `🏷️ ${t('mentioned-you-in-a-post')}`
        // return '🏷️ Mentioned you in a post'
      } else if (mentionType === 'reply') {
        return `🏷️ ${t('mentioned-you-in-a-reply')}`
        // return '🏷️ Mentioned you in a reply'
      }

      return `🏷️ ${t('mentioned-you')}`
    // return '🏷️ Mentioned you'
    default:
      break
  }
}

const NotificationResults: React.FC<{
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>> | undefined
  isPopup?: boolean
  setActiveId?: React.Dispatch<React.SetStateAction<string>> | undefined
  setShowPostView?: React.Dispatch<React.SetStateAction<boolean>> | undefined
  setUrl?: (notification: any) => void
}> = ({ setActiveSubmissionId, isPopup, setActiveId, setShowPostView, setUrl }) => {
  const [notifications, setNotifications] = useAtom(notificationAtom)

  const {
    notificationResults,
    size,
    setSize,
    rawNotificationResults,
    mutateNotifications,
    totalNotificationResults,
    notificationLoading,
  } = notifications || {}

  const { t, i18n } = useTranslation()

  let showLoader = totalNotificationResults && size ? size * 10 < totalNotificationResults : false

  const { user } = useUser()

  useEffect(() => {
    if (user) {
      mutateNotifications && mutateNotifications()
    }
  }, [user])

  return (
    <>
      <div
        className={
          isPopup
            ? ' flex flex-col  min-h-[80px] max-h-[60vh] overscroll-contain overflow-auto custom-scrollbar-stronger'
            : ''
        }
      >
        {notificationResults?.length === 0 && !notificationLoading && (
          <div className="flex flex-col items-center justify-center h-full py-16 text-sm font-medium text-background-accent dark:text-foreground">
            <div className="pb-10">
              <div className="flex items-center px-3 py-2 mb-3 transform -translate-x-6 bg-white border rounded-md shadow-lg dark:bg-background-accent/[15%] dark:border-gray-500/50">
                <div className="rounded-full flex-shrink-0 dark:bg-gray-200/[15%] bg-gray-100/40 h-7 w-7 ring-2 ring-blue-500/30 dark:ring-blue-400/50 ring-offset-[3px] ring-offset-white dark:ring-offset-gray-600"></div>
                <div className="w-full ml-3 space-y-2">
                  <div className="w-32 h-3 rounded-md bg-gray-100/40 dark:bg-background-accent/[15%]"></div>
                  <div className="w-20 h-3 rounded-md bg-gray-100/40 dark:bg-background-accent/[15%]"></div>
                </div>
              </div>
              <div className="absolute flex items-center px-3 py-2 mb-3  translate-x-6 bg-white border rounded-md shadow-lg -translate-y-9 dark:bg-background-accent/[22%] backdrop-blur-lg transform-gpu dark:border-gray-500/50">
                <div className="rounded-full flex-shrink-0 dark:bg-background-accent/[15%] bg-gray-100/40 h-7 w-7 ring-2 ring-rose-500/30 dark:ring-rose-400/50 ring-offset-[3px] ring-offset-white dark:ring-offset-gray-600"></div>
                <div className="w-full ml-3 space-y-2">
                  <div className="w-32 h-3 rounded-md bg-gray-100/40 dark:bg-background-accent/[15%]"></div>
                  <div className="w-20 h-3 rounded-md bg-gray-100/40 dark:bg-background-accent/[15%]"></div>
                </div>
              </div>
            </div>
            You're all caught up!
          </div>
        )}

        <div className="w-full divide-y">
          {notificationResults &&
            notificationResults?.length !== 0 &&
            notificationResults?.map((notification: INotification, index: number) => (
              <button
                onClick={() => {
                  if (notification?.submission) {
                    setUrl &&
                      setUrl(
                        notification?.submission?.slug
                          ? notification?.submission?.slug
                          : notification?.submission.id
                      )
                    if (setActiveSubmissionId) {
                      setActiveSubmissionId(notification?.submission?.id)
                    } else {
                      setActiveId && setActiveId(notification?.submission.id)
                      setShowPostView && setShowPostView(true)
                    }
                  } else if (notification?.changelog) {
                    // Open changelog link in new tab
                    window.open('/changelog/' + notification?.changelog?.id, '_blank')
                    removeNotificationById(notification?.id).catch((err) => {
                      toast.error('Error clearing inbox, please try again')
                      console.error(err)
                    })
                    if (notifications && notifications?.rawNotificationResults) {
                      notifications.mutateNotifications(
                        [
                          {
                            ...notifications?.rawNotificationResults[0],
                            // @ts-ignore
                            results: notifications?.notificationResults?.map((item) =>
                              item?.changelog?.id === notification?.changelog?.id
                                ? { ...item, viewed: true }
                                : item
                            ),
                            totalUnviewedResults:
                              notifications?.totalUnviewedResults -
                              notifications?.notificationResults?.filter(
                                (item) =>
                                  item?.changelog?.id === notification?.changelog?.id &&
                                  !item?.viewed
                              )?.length,
                          },
                        ],
                        false
                      )
                    }
                  }
                }}
                key={notification.id}
                className={cn(
                  `flex w-full unstyled-button items-center px-3 py-3 text-sm rounded-none ${
                    notification?.viewed && 'opacity-40 hover:opacity-100'
                  } shadow-none w-full focus:outline-none focus:ring-0 border-gray-100/80 dark:border-border text-gray-500 dark:text-foreground hover:bg-white/80 dark:hover:bg-border/30 dark:hover:border-border cursor-pointer main-transition`,
                  !isPopup && 'px-6 py-4'
                )}
              >
                <div className="w-full">
                  <div className={'flex items-center text-xs gap-2'}>
                    <UserPicture
                      small={isPopup ? true : false}
                      authorId={notification.causedByUser?._id}
                      img={notification.causedByUser?.picture}
                    />
                    <p className="font-medium truncate dark:text-gray-100">
                      {notification.causedByUser?.name}
                    </p>
                    <p className="flex-shrink-0 truncate dark:text-foreground">
                      {getNotificationTextForType(t, notification.type, notification.mentionType)}
                    </p>
                  </div>
                  <div className="flex mt-1.5 flex-wrap items-center justify-between font-medium dark:text-gray-100 ">
                    <span className="truncate">
                      {notification?.submission?.title || notification.content}
                    </span>
                  </div>

                  <div className="text-xs flex justify-between items-center font-medium mt-1.5 dark:text-foreground text-background-accent">
                    <div className="flex items-center justify-end text-xs font-medium truncate text-background-accent dark:text-foreground ">
                      <span className="mr-1 first-letter:uppercase">
                        {dateDifference(notification?.createdAt, i18n.language)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
        </div>
        {(notificationLoading || showLoader) && (
          <div className="py-[38px]">
            {notificationLoading && (
              <div className="">
                <div className="mx-auto secondary-svg ">
                  <Loader />
                </div>
              </div>
            )}

            {!notificationLoading && showLoader && (
              <InView
                as="div"
                onChange={(inView: boolean) => {
                  inView && setSize && size && setSize(size + 1)
                }}
              >
                <div className="flex items-center justify-center mt-4">
                  <div className="secondary-svg">
                    <Loader />
                  </div>
                </div>
              </InView>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default NotificationResults
