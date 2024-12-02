import { useAtom } from 'jotai'
import React, { SVGProps, SetStateAction } from 'react'
import { createPostAtom } from '../atoms/displayAtom'
import { ISubmissionFilters } from '../interfaces/ISubmission'
import { useCurrentOrganization, useUserOrganizations } from '../data/organization'
import { postsFilterAtom } from '../atoms/dashboardAtom'
import {
  LightBulbIcon,
  MoonIcon,
  PlusCircleIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  SpeakerphoneIcon,
  SunIcon,
} from '@heroicons/react/solid'
import MenuEntry from './MenuEntry'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import TagBullet from './TagBullet'
import { v4 as uuid } from 'uuid'
import { cn } from '@/lib/utils'
import { IOrganization } from '@/interfaces/IOrganization'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { Button } from './radix/Button'
import Loader from './Loader'
import ProfileDropdown from './ProfileDropdown'
import { getOrganizationUrl } from '../lib/subdomain'
import Link from '@/components/CustomLink'
import { differenceInDays } from 'date-fns'
import { useTheme } from 'next-themes'
import { articleViewAtom } from '@/atoms/docsAtom'
import { redirectAdminToOrgById } from '@/lib/redirectAdminToOrg'
import {
  activeRoadmapAtom,
  activeSubmissionIdsAtom,
  askAiPopupAtom,
  organizerViewAtom,
} from '@/atoms/submissionAtom'
import FeaturedIcon from './docs/FeaturedIcon'

export const onlyAllowSetTypeFilters = (
  filterTypes: string[],
  setFilters: (update: SetStateAction<ISubmissionFilters>) => void,
  org: IOrganization
) => {
  setFilters((prev: ISubmissionFilters) => {
    return {
      ...prev,
      advancedFilters: prev.advancedFilters
        ?.filter((filter) => filter.type !== 's')
        ?.concat(
          filterTypes.map((type) => ({
            type: 's',
            operator: 'is',
            values:
              org?.postStatuses
                ?.filter((status) => status.type === type)
                ?.map((status) => status.id) || [],
            id: uuid(),
          }))
        ),
    }
  })
}

const MenuContent: React.FC<{
  pageData: {
    link: string
    title: string
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
    category: string
  }[]
}> = ({ pageData }) => {
  const [createPost, setCreatePost] = useAtom(createPostAtom)
  const { org } = useCurrentOrganization()
  const [filters, setFilters] = useAtom(postsFilterAtom)
  const router = useRouter()
  const [articleView, setArticleView] = useAtom(articleViewAtom)

  const { orgResults, isOrganizationsLoading, isOrganizationsError } = useUserOrganizations()
  const { theme, setTheme, systemTheme } = useTheme()
  const activeTheme = theme !== 'dark' && theme !== 'light' ? systemTheme : theme
  const [askAiPopup, setAskAiPopup] = useAtom(askAiPopupAtom)

  const [activeRoadmap, setActiveRoadmap] = useAtom(activeRoadmapAtom)

  const [organizerView, setOrganizerView] = useAtom(organizerViewAtom)
  const [selectedSubmissionIds, setSelectedSubmissionIds] = useAtom(activeSubmissionIdsAtom)

  const isActiveFilter = (filters: ISubmissionFilters, filterTypes: string[]): boolean => {
    const currentFilters = filters?.advancedFilters

    if (currentFilters?.filter((filter) => filter.type === 's')?.length === 0) return false

    let value = true

    currentFilters?.forEach((filter) => {
      if (filter.type === 's') {
        filter.values.forEach((status) => {
          if (
            !filterTypes.includes(org?.postStatuses?.find((stat) => stat.id === status)?.type || '')
          ) {
            value = false
          }
        })
      }
    })

    // If all elements match, the arrays are equal, and the filter is active
    return value
  }

  const filterStyle = (filter: string) => {
    return cn(
      `w-full unstyled-button dash-nav-button text-[13px] py-1 px-3`,
      isActiveFilter(filters, [...filter?.split(',')]) && 'bg-gray-100/50 dark:bg-secondary'
    )
  }

  const themeButton = () => {
    return (
      <button
        onClick={() => {
          if (theme !== 'dark' && theme !== 'light') {
            setTheme(systemTheme === 'dark' ? 'light' : 'dark')
          } else {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }
        }}
        className={`dash-nav-button`}
      >
        {activeTheme === 'dark' ? (
          <SunIcon className="w-5 h-5 mr-2 text-background-accent/70 dark:text-background-accent/90" />
        ) : (
          <MoonIcon className="w-5 h-5 mr-2 text-background-accent/70 dark:text-background-accent/90" />
        )}
        {activeTheme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    )
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex items-center flex-shrink-0 mr-0 pr-1.5 pl-[4px]">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={'outline'}
                className="w-full py-1 px-0.5 -m-0.5 -my-1 pl-1 bg-transparent border-transparent shadow-none dark:shadow-none"
              >
                <div className="flex items-center justify-center flex-shrink-0 bg-white shadow-sm dark:bg-secondary/80 rounded w-[21px] h-[21px] overflow-hidden">
                  {!org?.picture ? (
                    <div className="flex items-center justify-center flex-shrink-0 w-full h-full bg-gray-700 rounded-full text-background-accent/80 dark:text-gray-400">
                      <div className="w-5 h-5">
                        <Loader />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center flex-shrink-0 object-cover w-full h-full overflow-hidden rounded">
                      <img width={21} height={21} src={org?.picture} alt="" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start justify-center w-full ml-[9px] text-left">
                  <p className="relative leading-none text-[15px] font-semibold truncate w-28 first-letter:uppercase">
                    <span>{org.displayName}</span>
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <div className="overflow-auto max-h-64 custom-scrollbar-stronger">
                {orgResults &&
                  orgResults.results.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      onSelect={() => {
                        redirectAdminToOrgById(item.id, '/posts')
                      }}
                    >
                      <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 mr-2 overflow-hidden rounded-full ">
                        {item?.picture ? (
                          <img width={20} height={20} src={item?.picture} alt="" />
                        ) : (
                          <span className="text-xs text-gray-200">A</span>
                        )}
                      </div>
                      <span className="first-letter:uppercase">{item.displayName}</span>
                    </DropdownMenuItem>
                  ))}
                <DropdownMenuItem
                  onSelect={() => {
                    /* Logic if needed for creating new organization */
                    window.location.href = 'https://auth.featurebase.app/register'
                  }}
                >
                  <PlusCircleIcon className="h-4 w-4 ml-0.5 mr-2.5" /> Create new
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-2">
            <ProfileDropdown xSmall={true} small={true} />
          </div>
        </div>
        <div className="flex flex-col h-full">
          <div className="flex flex-col mt-5 lg:mt-4">
            {/* <button
              onClick={() => setCreatePost(true)}
              className="dashboard-secondary dark:shadow-none px-2 py-1.5"
            >
              <PencilIcon className="w-5 ml-0.5 h-5 mr-[9px]" />
              Create new post
            </button> */}
            <div className="space-y-1 lg:space-y-3">
              {pageData.map(
                (page) =>
                  page.category === 'personal' && (
                    <MenuEntry key={page.title} item={page} link={page.link} title={page.title} />
                  )
              )}
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 lg:mt-8">
            <p className="uppercase text-[11px] px-1.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-1.5">
              Modules
            </p>
            <div className="w-full space-y-1 lg:space-y-2">
              {pageData.map((page) => {
                let isActive =
                  page.title === 'Posts'
                    ? router.pathname.includes('/dashboard/posts')
                    : page.title === 'Help center'
                    ? router.pathname.includes('/dashboard/articles')
                    : page.title === 'Roadmap'
                    ? router.pathname.includes('/dashboard/roadmap')
                    : false

                if (page.title === 'Roadmap' && org?.roadmaps?.length === 0) {
                  return null
                }

                if (page.title === 'Posts' && isActive) {
                  return (
                    <div className="relative" key={page?.title}>
                      <button
                        className="relative z-10 w-full unstyled-button"
                        onClick={() => {
                          setSelectedSubmissionIds([])
                          setOrganizerView('')
                          setFilters({
                            sortBy: 'date:desc',
                            advancedFilters: [],
                            searchByComments: true,
                          })
                          setAskAiPopup(false)
                        }}
                      >
                        <MenuEntry
                          disableNavLink={true}
                          key={page.title}
                          item={page}
                          link={page.link}
                          title={page.title}
                        />
                      </button>
                      <motion.div
                        initial={{
                          height: 0,
                          display: 'none',
                          opacity: 0,
                          y: -40,
                        }}
                        animate={{
                          height: isActive ? 'auto' : 0,
                          display: isActive ? 'block' : 'none',
                          opacity: isActive ? (organizerView ? 0.6 : 1) : 0,
                          y: isActive ? 0 : -40,
                        }}
                        transition={{
                          duration: 0.23,
                        }}
                        className={cn(
                          'ml-6 mt-1.5 space-y-1',
                          organizerView && 'pointer-events-none select-none'
                        )}
                      >
                        <button
                          onClick={() => {
                            onlyAllowSetTypeFilters(['reviewing'], setFilters, org)
                            setAskAiPopup(false)
                          }}
                          className={filterStyle('reviewing')}
                        >
                          <TagBullet theme="Orange" />
                          Under Review
                        </button>
                        <button
                          onClick={() => {
                            onlyAllowSetTypeFilters(['unstarted'], setFilters, org)
                            setAskAiPopup(false)
                          }}
                          className={filterStyle('unstarted')}
                        >
                          <TagBullet theme="Purple" />
                          Planned
                        </button>
                        <button
                          onClick={() => {
                            onlyAllowSetTypeFilters(['active'], setFilters, org)
                            setAskAiPopup(false)
                          }}
                          className={filterStyle('active')}
                        >
                          <TagBullet theme="Blue" />
                          Active
                        </button>
                        <button
                          onClick={() => {
                            onlyAllowSetTypeFilters(['completed', 'canceled'], setFilters, org)
                            setAskAiPopup(false)
                          }}
                          className={filterStyle('completed,canceled')}
                        >
                          <TagBullet theme="Green" />
                          Done / Closed
                        </button>
                      </motion.div>
                    </div>
                  )
                } else if (page.link === '/dashboard/articles' && isActive) {
                  return (
                    <div className="relative" key={page?.title}>
                      <button
                        className="relative z-10 w-full unstyled-button"
                        onClick={() => setArticleView(false)}
                      >
                        <MenuEntry
                          key={page.title}
                          item={page}
                          link={page.link}
                          title={page.title}
                        />
                      </button>
                      <motion.div
                        initial={{
                          height: 0,
                          display: 'none',
                          opacity: 0,
                          y: -40,
                        }}
                        animate={{
                          height: isActive ? 'auto' : 0,
                          display: isActive ? 'block' : 'none',
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : -40,
                        }}
                        transition={{
                          duration: 0.23,
                        }}
                        className="ml-6 mt-1.5 space-y-1"
                      >
                        <button
                          onClick={() => {
                            setArticleView(false)

                            // If is not on the articles page, send them there
                            if (router.pathname !== '/dashboard/articles') {
                              router.push('/dashboard/articles')
                            }
                          }}
                          className={cn(
                            `w-full unstyled-button dash-nav-button text-[13px] py-1 px-3`,
                            !articleView && 'bg-gray-100/50 dark:bg-secondary'
                          )}
                        >
                          Collections
                        </button>
                        <button
                          onClick={() => {
                            setArticleView(true)

                            // If is not on the articles page, send them there
                            if (router.pathname !== '/dashboard/articles') {
                              router.push('/dashboard/articles')
                            }
                          }}
                          className={cn(
                            `w-full unstyled-button dash-nav-button text-[13px] py-1 px-3`,
                            articleView && 'bg-gray-100/50 dark:bg-secondary'
                          )}
                        >
                          Articles
                        </button>
                      </motion.div>
                    </div>
                  )
                } else if (page.link === '/dashboard/roadmap' && isActive) {
                  return (
                    <div className="relative" key={page?.title}>
                      <button className="relative z-10 w-full unstyled-button">
                        <MenuEntry
                          key={page.title}
                          item={page}
                          link={page.link}
                          title={page.title}
                        />
                      </button>
                      <motion.div
                        initial={{
                          height: 0,
                          display: 'none',
                          opacity: 0,
                          y: -40,
                        }}
                        animate={{
                          height: isActive ? 'auto' : 0,
                          display: isActive ? 'block' : 'none',
                          opacity: isActive ? 1 : 0,
                          y: isActive ? 0 : -40,
                        }}
                        transition={{
                          duration: 0.23,
                        }}
                        className="ml-6 mt-1.5 space-y-1 max-h-64 overflow-auto custom-scrollbar -mr-3 pr-3"
                      >
                        {org?.roadmaps?.map((roadmap) => (
                          <button
                            key={roadmap._id}
                            onClick={() => {
                              setActiveRoadmap(roadmap)
                              if (router.pathname !== '/dashboard/roadmap') {
                                router.push('/dashboard/roadmap')
                              }
                            }}
                            className={cn(
                              `w-full unstyled-button dash-nav-button text-[13px] py-1 px-3`,
                              activeRoadmap?._id === roadmap._id &&
                                'bg-gray-100/50 dark:bg-secondary'
                            )}
                          >
                            {roadmap.icon && (
                              <span className="mr-1.5 flex-shrink-0  text-background-accent/70 dark:text-background-accent/90">
                                <FeaturedIcon small={true} icon={roadmap.icon} />
                              </span>
                            )}
                            {roadmap.name}
                          </button>
                        ))}
                      </motion.div>
                    </div>
                  )
                } else if (page.category === 'modules') {
                  if (page.title === 'Views' && !org.hasSavedViews) return null

                  return (
                    <MenuEntry key={page.title} item={page} link={page.link} title={page.title} />
                  )
                }
              })}
            </div>
          </div>
          <div className="flex flex-col w-full mt-4 lg:mt-8">
            <p className="uppercase text-[11px] px-1.5 text-background-accent/70 dark:text-background-accent tracking-widest font-semibold mb-1.5">
              Organization
            </p>
            <div className="w-full space-y-1 lg:space-y-3">
              {pageData.map(
                (page) =>
                  page.category === 'organization' && (
                    <MenuEntry key={page.title} item={page} link={page.link} title={page.title} />
                  )
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full mt-4 space-y-3">
        <div>
          <a href="https://help.featurebase.app/" target="_blank" rel="noreferrer">
            <button className={`dash-nav-button`}>
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2 text-background-accent/70 dark:text-background-accent/90" />
              Help
            </button>
          </a>
        </div>
        <button data-featurebase-changelog className={`dash-nav-button`}>
          <SpeakerphoneIcon className="w-5 h-5 mr-2 text-background-accent/60 dark:text-background-accent/90" />
          Latest changes
          <span
            id="fb-update-badge"
            className="block px-2 ml-auto text-xs text-white bg-indigo-500 border-indigo-400 rounded-full"
          ></span>
        </button>
        <div>
          <button
            onClick={() => {
              window.postMessage({
                target: 'FeaturebaseWidget',
                data: { action: 'openFeedbackWidget' },
              })
            }}
            className={`dash-nav-button`}
          >
            <LightBulbIcon className="w-5 h-5 mr-2 text-background-accent/70 dark:text-background-accent/90" />
            Give us feedback
          </button>
        </div>

        {themeButton()}

        {org.subscriptionStatus === 'trial' && org?.trialEndDate && (
          <Link legacyBehavior href="/dashboard/settings/pricing">
            <a>
              <button
                className={
                  'rounded-md -m-px px-2 mt-1 sm:mt-3 font-semibold dark:text-foreground text-gray-400 dark:border-secondary dark:hover:bg-secondary white-btn w-full'
                }
              >
                <SparklesIcon className="w-5 h-5 mr-2 text-background-accent/70 dark:text-foreground" />
                {differenceInDays(new Date(org.trialEndDate), Date.now())}
                <span className="ml-1">Days left</span>
              </button>
            </a>
          </Link>
        )}
        {org.subscriptionStatus === 'trial_ended' && (
          <Link legacyBehavior href="/dashboard/settings/pricing">
            <a>
              <button
                className={
                  'rounded-md -m-px px-2 mt-1 sm:mt-3 font-semibold dark:text-foreground text-gray-400 dark:border-secondary dark:hover:bg-secondary white-btn w-full'
                }
              >
                <SparklesIcon className="w-5 h-5 mr-2 text-background-accent/80 dark:text-foreground" />
                Upgrade now
              </button>
            </a>
          </Link>
        )}
      </div>
    </>
  )
}

export default MenuContent
