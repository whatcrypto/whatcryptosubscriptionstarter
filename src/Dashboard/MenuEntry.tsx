import { useRouter } from 'next/router'
import React from 'react'
import { useCurrentOrganization, usePendingModerationCount } from '../data/organization'
import Link from '@/components/CustomLink'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { notificationAtom } from '@/atoms/notificationAtom'
import Notifications from './Notifications'
import { can } from '@/lib/acl'
import { useUser } from '@/data/user'
import { activeSubmissionIdsAtom, organizerViewAtom } from '@/atoms/submissionAtom'

type MenuEntryProps = {
  title: string
  item?: any
  link: string
  mobile?: boolean
  disableNavLink?: boolean
}

const MenuEntry: React.FC<MenuEntryProps> = ({
  title,
  item,
  link,
  mobile = false,
  disableNavLink = false,
}) => {
  const router = useRouter()
  const { org } = useCurrentOrganization()
  const { user } = useUser()

  let isActive =
    (link !== '/' && router.pathname === link) ||
    (title === 'Settings' &&
      router.pathname.includes('/settings') &&
      !router.pathname.includes('team')) ||
    (title === 'Surveys' && router.pathname.includes('/surveys'))

  const [notifications, setNotifications] = useAtom(notificationAtom)
  const { pendingCount, mutate: mutatePending } = usePendingModerationCount()

  // Check how many total steps are left in the boarding process
  const checkTotalProgress = () => {
    const boardingSteps: any = org?.newSetupSteps
    if (boardingSteps) {
      let total = 0
      let done = 0
      Object.values(boardingSteps).forEach((value: any) => {
        Object.values(value).forEach((value: any) => {
          total++
          if (value) {
            done++
          }
        })
      })

      if (org?.onboardingData?.access !== 'employees') {
        --total
      }

      return { total, done }
    }
    return { total: 0, done: 0 }
  }

  const { total, done } = checkTotalProgress()
  if (title === 'Getting Started' && (total === done || Math.floor((done / total) * 100) > 100)) {
    return <></>
  }

  if (title === 'Moderate') {
    if (!org.settings.postModerationEnabled && (pendingCount?.total || 0) === 0) {
      return <></>
    }

    if (!can(user?.id, 'moderate_posts', org) && !can(user?.id, 'moderate_comments', org)) {
      return <></>
    }
  }

  const LinkElement = React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement>
  >(({ className, ...props }, ref) => {
    return (
      <a
        ref={ref}
        className={cn(`dash-nav-button`, isActive && 'dark:bg-secondary bg-gray-100/50', className)}
        {...props}
      >
        <item.icon
          className={`h-5 w-5 mr-2 text-background-accent/70 dark:text-background-accent/90`}
        />
        {title}

        {title === 'Statistics' && (
          <div
            className={`px-2 flex items-center py-0.5 ml-auto font-bold shadow-none text-xs ${
              isActive
                ? 'bg-indigo-500 text-white border-indigo-400'
                : 'text-background-accent dark:text-foreground'
            } rounded-full bg-gray-50 border dark:border-secondary border-gray-100/50  dark:bg-secondary `}
          >
            <span className="flex h-2 w-2 relative mr-1.5">
              <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-2 h-2 bg-green-500 rounded-full"></span>
            </span>
          </div>
        )}

        {title === 'Moderate' && (pendingCount?.total || 0) > 0 && (
          <div
            className={cn(pendingCount?.total > 0 ? 'menu-entry-badge-active' : 'menu-entry-badge')}
          >
            {pendingCount?.total}
          </div>
        )}
        {title === 'Getting Started' && (
          <div className={cn(isActive ? 'menu-entry-badge-active' : 'menu-entry-badge')}>
            {Math.floor((done / total) * 100)}%
          </div>
        )}
      </a>
    )
  })
  LinkElement.displayName = 'LinkElement'

  return (
    <>
      {title === 'Inbox' ? (
        <Notifications
          customButton={
            <a
              className={cn(
                `dash-nav-button`,
                'data-[state=open]:dark:bg-border/80 data-[state=open]:bg-gray-100/50'
              )}
            >
              <item.icon
                className={`h-5 w-5 mr-2 text-background-accent/70 dark:text-background-accent/90`}
              />
              {title}
              {title === 'Inbox' && notifications?.totalUnviewedResults ? (
                <div
                  className={
                    notifications?.totalUnviewedResults
                      ? `menu-entry-badge-active`
                      : `menu-entry-badge`
                  }
                >
                  {notifications?.totalUnviewedResults}
                </div>
              ) : null}
            </a>
          }
        />
      ) : disableNavLink ? (
        <LinkElement />
      ) : (
        <Link legacyBehavior href={link} passHref>
          <LinkElement />
        </Link>
      )}
    </>
  )
}

export default MenuEntry
