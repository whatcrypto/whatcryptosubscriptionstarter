import { Fragment, SVGProps } from 'react'
import { Disclosure } from '@headlessui/react'
import {
  // ChartBarIcon,
  CogIcon,
  CollectionIcon,
  MapIcon,
  StatusOnlineIcon,
  UserGroupIcon,
  XIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ChatAlt2Icon,
} from '@heroicons/react/solid'
import { useRouter } from 'next/router'
import { useCurrentOrganization } from '../data/organization'
import { RefreshIcon } from '@heroicons/react/outline'
import { SettingsView } from './SettingsWrapper'
import MenuContent from './MenuContent'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const DashboardVerticalMenu: React.FC<{ wrapAt2xl: boolean }> = ({ wrapAt2xl }) => {
  const { org } = useCurrentOrganization()
  const router = useRouter()
  if (localStorage?.getItem('showUpdate') === null) {
    localStorage?.setItem('showUpdate', 'show')
  }

  const isSettingView = router.pathname.includes('/settings')

  const pageData = [
    {
      link: '/dashboard/onboarding',
      title: 'Getting Started',
      icon: CheckCircleIcon,
      category: 'personal',
    },
    {
      link: '/dashboard',
      title: 'Inbox',
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
            clipRule="evenodd"
          />
        </svg>
      ),
      category: 'personal',
    },
    {
      link: '/dashboard/moderate',
      title: 'Moderate',
      icon: ShieldCheckIcon,
      category: 'personal',
    },
    {
      link: '/',
      title: 'Live portal',
      icon: StatusOnlineIcon,
      category: 'personal',
    },
    {
      link: '/dashboard/posts',
      title: 'Posts',
      icon: CollectionIcon,
      category: 'modules',
    },
    {
      link: '/dashboard/views',
      title: 'Views',
      icon: (props: SVGProps<SVGSVGElement>) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
          <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
          <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
        </svg>
      ),
      category: 'modules',
    },
    {
      link: '/dashboard/roadmap',
      title: 'Roadmap',
      icon: MapIcon,
      category: 'modules',
    },
    {
      link: '/dashboard/changelog',
      title: 'Changelogs',
      icon: RefreshIcon,
      category: 'modules',
    },
    {
      link: '/dashboard/users',
      title: 'Users',
      icon: UserGroupIcon,
      category: 'modules',
    },
    {
      link: '/dashboard/surveys',
      title: 'Surveys',
      icon: ChatAlt2Icon,
      category: 'modules',
    },
    {
      link: '/dashboard/articles',
      title: 'Help center',
      icon: (props: any) => (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
        </svg>
      ),
      category: 'modules',
    },
    {
      link: '/dashboard/analytics',
      title: 'Analytics',
      icon: (props: any) => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
          <path
            fillRule="evenodd"
            d="M3 6a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6Zm4.5 7.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 1.5 0V12Zm2.25-3a.75.75 0 0 1 .75.75v6.75a.75.75 0 0 1-1.5 0V9.75A.75.75 0 0 1 13.5 9Zm3.75-1.5a.75.75 0 0 0-1.5 0v9a.75.75 0 0 0 1.5 0v-9Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      category: 'modules',
    },
    {
      link: '/dashboard/settings',
      title: 'Settings',
      icon: CogIcon,
      category: 'organization',
    },
    {
      link: '/dashboard/settings',
      title: 'Help',
      icon: CogIcon,
      category: 'help',
    },
  ]

  return (
    <Disclosure as="nav">
      {({ open, close }) => (
        <>
          <div
            className={cn(
              wrapAt2xl
                ? '2xl:w-[302px] 2xl:px-2 2xl:py-3 2xl:pr-3 '
                : 'lg:w-[302px] lg:px-2 lg:py-3 lg:pr-3',
              ' fixed z-50 w-0 custom-scrollbar  main-transition flex-col justify-between  h-full overflow-x-hidden border-0 rounded-none flex dark:border-border ',
              isSettingView
                ? ' dark:border-border/60 bg-white/80 dark:bg-card/50 border-r dark:shadow-md dashboard-border'
                : ''
            )}
          >
            {isSettingView ? (
              <div className="w-full h-full ">
                <div className="w-full h-full">
                  <SettingsView />
                </div>
              </div>
            ) : (
              <>
                <MenuContent pageData={pageData} />
              </>
            )}
          </div>
          <motion.div
            animate={{
              top: open ? 0 : 15,
              left: open ? -4 : 10,
              width: open ? 311 : 64,
            }}
            transition={{ type: 'tween', duration: open ? 0.3 : 0 }}
            className={cn(
              wrapAt2xl ? '2xl:hidden' : 'lg:hidden',
              'flex items-center absolute justify-between px-4 py-3 '
            )}
          >
            <Disclosure.Button
              className={cn(
                'dashboard-secondary flex-nowrap overflow-hidden z-[40] relative flex w-full p-2',
                wrapAt2xl ? '2xl:hidden' : 'lg:hidden'
              )}
            >
              <span className="sr-only">Open main menu</span>
              {open ? (
                <>
                  <XIcon className="mr-1.5 flex-shrink-0 secondary-svg" aria-hidden="true" />
                  <span className="flex-shrink-0">Close popup menu</span>
                </>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="dark:!text-gray-200 !text-background-accent !w-4 !h-4 !dark:text-foreground"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              )}
            </Disclosure.Button>
          </motion.div>
          <div className="relative z-[30]">
            <motion.div
              className="absolute"
              animate={{
                left: open ? 0 : -400,
              }}
            >
              <Disclosure.Panel
                className={cn(
                  'min-w-[304px] h-[100dvh] overflow-auto custom-scrollbar-stronger flex flex-col justify-between absolute pl-2 pr-3 pt-[70px] pb-3  dropdown-background dark:bg-card/90',
                  wrapAt2xl ? ' 2xl:hidden' : ' lg:hidden'
                )}
              >
                {isSettingView ? (
                  <>
                    <SettingsView />
                  </>
                ) : (
                  <MenuContent pageData={pageData} />
                )}
              </Disclosure.Panel>
            </motion.div>
          </div>
        </>
      )}
    </Disclosure>
  )
}

export default DashboardVerticalMenu
