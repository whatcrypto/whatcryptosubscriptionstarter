import React, { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { INotificationAtom, notificationAtom, notificationTypeAtom } from '@/atoms/notificationAtom'
import { removeNotification } from 'network/lib/organization'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { CheckIcon, EyeIcon, EyeOffIcon } from '@heroicons/react/solid'


import { useCurrentOrganization } from '@/data/organization'
import SimpleTooltip from './SimpleTooltip'
import { useUser } from '@/data/user'
import { isMember } from '@/lib/acl'
import { useTranslation } from 'next-i18next'

export const clearNotifications = (id: string, notifications: INotificationAtom) => {
  if (id === 'all' && notifications?.rawNotificationResults) {
    notifications.mutateNotifications(
      [
        {
          ...notifications.rawNotificationResults[0],
          // @ts-ignore
          results: [],
          totalUnviewedResults: 0,
          totalResults: 0,
        },
      ],
      false
    )

    removeNotification(id).catch((err) => {
      toast.error('Error clearing inbox, please try again')
      console.error(err)
    })

    toast.success('Inbox cleared')
  } else if (
    notifications?.notificationResults?.find(
      (item) => item?.submission?.id === id && !item?.viewed
    ) &&
    notifications.rawNotificationResults
  ) {
    notifications.mutateNotifications(
      [
        {
          ...notifications.rawNotificationResults[0],
          // @ts-ignore
          results: notifications?.notificationResults?.map((item) =>
            item?.submission?.id === id ? { ...item, viewed: true } : item
          ),
          totalUnviewedResults:
            notifications?.totalUnviewedResults -
            notifications?.notificationResults?.filter(
              (item) => item?.submission?.id === id && !item?.viewed
            )?.length,
        },
      ],
      false
    )

    removeNotification(id).catch((err) => {
      toast.error('Error clearing inbox, please try again')
      console.error(err)
    })
  }
}

const NotificationPopupUpperBar = () => {
  const [notifications, setNotifications] = useAtom(notificationAtom)
  const [notificationType, setNotificationType] = useAtom(notificationTypeAtom)
  const [count, setCount] = useState(0)

  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const { t } = useTranslation()
  useEffect(() => {
    if (!notifications?.notificationLoading) {
      setCount(notifications?.totalNotificationResults)
    }
  }, [notifications?.totalNotificationResults, notifications?.notificationLoading])

  // type is what we use in the code, name is what we show to the user
  const ActiveItem = ({ type, name }: { type: string; name: string }) => {
    return (
      <button
        onClick={() => setNotificationType((p) => ({ ...p, type: type }))}
        className={cn(
          'unstyled-button text-sm rounded-none dark:text-foreground/70 px-2 border-b-2 pb-2 main-transition text-background-accent border-transparent dark:hover:border-background-accent/60 hover:border-gray-200/60 cursor-pointer',
          type === notificationType.type &&
            'border-accent/60 hover:border-accent dark:hover:border-accent dark:text-foreground text-gray-500'
        )}
      >
        {name}
      </button>
    )
  }

  return (
    <div className="px-4 pt-3 text-sm text-gray-400 border-b shadow-sm bg-white/80 dark:text-foreground dark:bg-secondary/40 border-gray-100/60 dark:border-border dark:shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-foreground">{t('inbox')}</p>
        {count > 0 && !notificationType.viewed && (
          <button
            onClick={() => clearNotifications('all', notifications)}
            className="flex items-center text-sm font-medium cursor-pointer unstyled-button dark:text-foreground/70 dark:hover:text-gray-100 hover:text-gray-600 main-transition"
          >
            <div className="mr-1 secondary-svg">
              <CheckIcon />
            </div>
            {t('Mark all as read')}
          </button>
        )}
      </div>
      <div className=" -ml-1.5 gap-2 flex items-center pt-4 text-sm -mb-px font-medium">
        <div className="flex items-start">
          <ActiveItem type="All" name={t('all')} />
          <ActiveItem type="Comments" name={t('comments')} />
          {!org.settings.postModerationEnabled && <ActiveItem type="Posts" name={t('posts')} />}
          {isMember(user?.id, org) && <ActiveItem type="Assignments" name={t('assignments')} />}
          <ActiveItem type="Mentions" name={t('mentions')} />
        </div>
        <div className="hidden ml-auto -mt-2 sm:block">
          <SimpleTooltip
            content={
              notificationType.viewed !== false
                ? t('view-unread-notifications')
                : t('view-all-notifications')
            }
          >
            <button
              tabIndex={-1}
              onClick={() =>
                setNotificationType((p) => ({
                  ...p,
                  viewed: p.viewed === undefined ? false : undefined,
                }))
              }
              className={cn(
                notificationType.viewed === false
                  ? 'dashboard-primary'
                  : 'dashboard-secondary bg-transparent dark:bg-transparent',
                '  border-transparent shadow-none p-1 dark:border-transparent dark:shadow-none'
              )}
            >
              {notificationType.viewed === false ? (
                <EyeOffIcon className="text-white !h-3.5 !w-3.5" />
              ) : (
                <EyeIcon className="secondary-svg !h-3.5 !w-3.5" />
              )}
            </button>
          </SimpleTooltip>
          {/* <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <button
                  tabIndex={-1}
                  className="p-1 bg-transparent border-transparent shadow-none dashboard-secondary dark:bg-transparent dark:border-transparent dark:shadow-none"
                >
                  <CogIcon className="w-4 h-4 secondary-svg" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onSelect={() =>
                    setNotificationType((p) => ({
                      ...p,
                      viewed: p.viewed === undefined ? false : undefined,
                    }))
                  }
                  className={'dropdown-item'}
                >
                  {notificationType.viewed === false ? (
                    <>
                      <EyeIcon className="w-4  h-4 mr-1.5 text-background-accent/80 dark:text-background-accent" />
                      Show all
                    </>
                  ) : (
                    <>
                      <BellIcon className="w-4  h-4 mr-1.5 text-background-accent/80 dark:text-background-accent" />
                      Only unread
                    </>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
        </div>
      </div>
    </div>
  )
}

export default NotificationPopupUpperBar
