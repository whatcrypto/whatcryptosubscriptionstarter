import { BellIcon } from '@heroicons/react/solid'
import Link from '@/components/CustomLink'
import React, { useState } from 'react'
import PopupWrapper from './PopupWrapper'
import { useCurrentOrganization } from '../data/organization'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import { useIntercom } from 'react-use-intercom'
import { chatWithAIAtom, chatWithAIInputAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'

const DashboardUpperBar: React.FC<{
  children: React.ReactNode
  title: string
  ChangelogUpperBar?: React.ReactNode
  customTitle?: React.ReactNode
}> = ({ children, title, ChangelogUpperBar, customTitle }) => {
  if (localStorage?.getItem('showUpdate') === null) {
    localStorage?.setItem('showUpdate', 'show')
  }
  const { org } = useCurrentOrganization()
  let showBanner = org.subscriptionStatus === 'trial_ended'
  const router = useRouter()

  const isSettingView = router.pathname.includes('/settings')

  const [gettingStartedItems, setGettingStartedItems] = useState<null | string[]>(null)

  if (localStorage?.getItem('gettingStarted') === null) {
    localStorage?.setItem('gettingStarted', JSON.stringify(['customizeCategories', 'getFeedback']))
  } else {
    if (gettingStartedItems === null)
      setGettingStartedItems(JSON.parse(localStorage?.getItem('gettingStarted') || '{}'))
  }

  const tutorialContent: any = {
    'Customize boards ✏️': {
      path: '/dashboard/settings/boards',
      content: (
        <>
          <b className="font-semibold">
            Are you looking to collect feature requests, bug reports or just general feedback?
          </b>{' '}
          <br />
          Easily edit the boards that people can post under.
        </>
      ),
      cta: 'Edit boards',
    },
    // 'Customize roadmap 🗺️': {
    //   path: '/dashboard/settings/roadmap',
    //   content: (
    //     <>
    //       <b className="font-semibold">
    //         {' '}
    //         Change what statuses and categories are displayed on your product roadmap.{' '}
    //       </b>
    //       You can also disable roadmap from the public view.
    //     </>
    //   ),
    //   cta: 'Customize roadmap',
    // },
    'Get feedback 🔗': {
      path: 'copylink',
      content: (
        <>
          <b className="font-semibold"> It's time to share your board with others! </b>
          <br />
          Copy your feedback board url, add it to your app, and share it with your community.
        </>
      ),
      cta: 'Copy link',
    },
  }

  const removeItem = (name: string) => {
    if (gettingStartedItems) {
      setGettingStartedItems(gettingStartedItems?.filter((entry) => entry !== name))
      localStorage?.setItem(
        'gettingStarted',
        JSON.stringify(gettingStartedItems?.filter((entry) => entry !== name))
      )
    }
  }
  const [chatWithAI, setChatWithAI] = useAtom(chatWithAIAtom)
  const [textInput, setTextInput] = useAtom(chatWithAIInputAtom)

  const [tutorialOpen, setTutorialOpen] = useState(false)
  const [activeTutorial, setActiveTutorial] = useState('')

  const { show } = useIntercom()

  return (
    <div className="w-full">
      {!ChangelogUpperBar ? org.subscriptionStatus === 'trial' && null : ChangelogUpperBar}
      {showBanner && (
        <div>
          <div className="w-full px-4 mt-4 sm:px-6 border-b pb-4 dashboard-border">
            <div className="p-2 relative z-[200] rounded-lg shadow-xl bg-gradient-to-r from-rose-700 to-red-500 sm:p-2">
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center flex-1 w-0">
                  <span className="flex p-2 rounded-lg bg-rose-900">
                    <BellIcon className="w-5 h-5 text-rose-100" aria-hidden="true" />
                  </span>
                  <p className="ml-3 text-base font-medium text-white truncate">
                    <span className="md:hidden">Your trial has come to an end </span>
                    <span className="hidden md:inline">
                      <b className="font-semibold">Your trial has come to an end. </b>Please update
                      your billing information to continue using Featurebase.
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 dark:text-gray-100 text-gray-500">
              <b className="font-semibold">Need more time to test everything?</b> No worries! We can
              extend your trial -{' '}
              <button
                className="text-indigo-400 ml-1 dark:text-indigo-300 cursor-pointer unstyled-button inline-block"
                onClick={() => {
                  setTextInput('Could you please extend my trial?')
                  setChatWithAI(true)
                }}
              >
                Ask for more time.
              </button>
            </div>
          </div>
        </div>
      )}

      <PopupWrapper small={true} isOpen={tutorialOpen} setIsOpen={setTutorialOpen}>
        <div>
          <h2 className="text-lg font-semibold text-gray-600 dark:text-white">{activeTutorial}</h2>
          <p className="mt-1 mb-2 text-base text-gray-400 dark:text-foreground">
            {activeTutorial && tutorialContent[activeTutorial].content}
          </p>
          {activeTutorial &&
          tutorialContent[activeTutorial].path &&
          tutorialContent[activeTutorial].path !== 'copylink' ? (
            <Link legacyBehavior href={activeTutorial && tutorialContent[activeTutorial].path}>
              <button
                onClick={() => setTutorialOpen(false)}
                className="justify-center w-full mt-4 dashboard-primary"
              >
                {activeTutorial && tutorialContent[activeTutorial].cta}
              </button>
            </Link>
          ) : (
            <button
              onClick={() => {
                navigator.clipboard.writeText('https://' + org.name + '.featurebase.app')

                toast.success('Successfully copied feedback board URL')
              }}
              className="justify-center w-full mt-4 dashboard-primary"
            >
              {activeTutorial && tutorialContent[activeTutorial].cta}
            </button>
          )}
        </div>
      </PopupWrapper>
      <div>
        {/* <div className="mx-auto mb-4 max-w-7xl">
          {totalSubmissionResults < 4 && gettingStartedItems && gettingStartedItems?.length > 0 && (
            <div className="relative inline-block">

              <div className="relative z-40 inline-flex flex-wrap items-center px-2 py-2 text-sm font-semibold text-gray-600 border rounded-md dark:bg-secondary dark:text-indigo-50 up-element ">
                <p className="w-full mr-4 sm:w-auto">Getting started</p>
                {gettingStartedItems && gettingStartedItems.includes('customizeCategories') && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setActiveTutorial('Customize boards ✏️')
                        setTutorialOpen(true)
                      }}
                      className="bg-indigo-600 pr-[27px] mt-2 sm:mt-0 shadow-none rounded-full hover:bg-indigo-500 text-xs px-2 py-1 mr-2 dark:shadow-none"
                    >
                      Customize boards ✏️
                    </button>
                    <button
                      onClick={() => removeItem('customizeCategories')}
                      className="p-0.5 absolute right-0 mt-3 sm:mt-1 mr-3.5 top-0 text-indigo-100  bg-indigo-800 hover:bg-gray-900 rounded-full "
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                )}
           
                {gettingStartedItems.includes('getFeedback') && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setActiveTutorial('Get feedback 🔗')
                        setTutorialOpen(true)
                      }}
                      className="bg-indigo-600 pr-[27px] mt-2 sm:mt-0 shadow-none rounded-full hover:bg-indigo-500 text-xs px-2 py-1 mr-2 dark:shadow-none"
                    >
                      Get feedback 🔗
                    </button>
                    <button
                      onClick={() => removeItem('getFeedback')}
                      className="p-0.5 absolute right-0 mt-3 sm:mt-1 mr-3.5 top-0 text-indigo-100  bg-indigo-800 hover:bg-gray-900 rounded-full "
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div> */}
        {!isSettingView && (
          <div
            className={`flex px-5 py-4 border-b gap-6 dark:border-border/60 border-gray-100/60 items-center flex-wrap justify-between mx-auto`}
          >
            <h1 className="text-[17px] dashboard-upperbar-padding font-semibold text-gray-600 dark:text-gray-100">
              {customTitle ? customTitle : title}
            </h1>
            <div className="flex items-center justify-between">{children}</div>
          </div>
        )}
      </div>
      {/* <div className="w-full px-8 py-3 text-gray-600 border-t border-b border-background-accent ">
        <div className="mx-auto space-x-8 max-w-7xl">
          <a>Link 1</a>
          <a>Link 1</a>
          <a>Link 1</a>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardUpperBar
