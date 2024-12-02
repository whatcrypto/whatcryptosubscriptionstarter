import { RefreshIcon } from '@heroicons/react/outline'
import {
  ChevronDownIcon,
  CogIcon,
  CollectionIcon,
  LockClosedIcon,
  MapIcon,
} from '@heroicons/react/solid'
import Link from '@/components/CustomLink'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import ProfileDropdown from './ProfileDropdown'
import PublicBoardAuth from './PublicBoardAuth'
import Image from 'next/legacy/image'
import Loader from './Loader'
import { useAtom } from 'jotai'
import { authenitcateModalAtom } from '../atoms/authAtom'
import { ISubmissionFilters } from '../interfaces/ISubmission'
import { useTranslation } from 'next-i18next'
import { addFilterToBoard } from '@/lib/routerHandler'
import { cn, getDefaultFilters, getPathFromAsPath } from '@/lib/utils'
import Notifications from './Notifications'
import { hideLogoAtom, hidePublicMenuAtom } from '@/atoms/orgAtom'
import { v4 as uuid } from 'uuid'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/radix/DropdownMenu'
import ModerationNotification from './ModerationNotification'
import { can, isMember } from '@/lib/acl'
import { useMediaQuery } from '@/lib/hooks'
import { activeRoadmapAtom } from '@/atoms/submissionAtom'
import FeaturedIcon from './docs/FeaturedIcon'
import { ITranslationText } from '@/interfaces/IOrganization'
import { moduleLinkValues } from '@/pages/dashboard/settings/CreateNewPortalMenuItem'

export const trimmedValue = (item: string) =>
  item
    ?.replace(/[^A-Za-z0-9\s!?]/g, '')
    .toLowerCase()
    .trim()
    .replace(' ', '-')

const PublicBoardMenu: React.FC<{
  filters?: ISubmissionFilters
  setFilters?: React.Dispatch<React.SetStateAction<ISubmissionFilters>>
  mutateChangelogs?: () => void
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>> | undefined
}> = ({ setFilters, filters, mutateChangelogs, setActiveSubmissionId }) => {
  const router = useRouter()
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [hideLogo, setHideLogo] = useAtom(hideLogoAtom)
  const [hidePublicMenu, setHidePublicMenuAtom] = useAtom(hidePublicMenuAtom)
  const { user } = useUser()
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const { t, i18n } = useTranslation()

  const [activeRoadmap, setActiveRoadmap] = useAtom(activeRoadmapAtom)
  // const currentPath = getPathFromAsPath(router.asPath)
  const currentPath = router.pathname

  const pages = org?.publicPortalMenu

  const getAllEnabledBoards = useMemo(() => {
    const enabledStatuses: any = []

    filters?.advancedFilters?.forEach((filter) => {
      if (filter.type === 'b') {
        filter.values.forEach((value) => {
          enabledStatuses.push(value)
        })
      }
    })

    return enabledStatuses
  }, [filters?.advancedFilters])

  const isCurrentUrl = (pageUrl: string) => {
    return (
      pageUrl === currentPath ||
      (currentPath.includes('/c/') && pageUrl === '/') ||
      (currentPath.includes('/roadmap') && pageUrl === '/roadmap') ||
      (currentPath.includes('/p/') && pageUrl === '/') ||
      (currentPath.includes('/changelog/') && pageUrl === '/changelog')
    )
  }

  const invertMenuColors = currentPath.includes('/changelog') || currentPath.includes('/roadmap')

  const linkStyle = (pageUrl: string) =>
    cn(
      `flex items-center rounded-t-lg rounded-b-none main-transition outline-none border border-b-0 dark:hover:bg-background hover:bg-background focus:ring-0 font-medium text-sm sm:text-[15px] py-2.5 px-1.5 sm:px-2`,
      'text-gray-500 dark:text-foreground border-transparent dark:bg-transparent dark:bg-transparent hover:border-gray-100/30 hover:dark:border-border/40',
      isCurrentUrl(pageUrl) &&
        !invertMenuColors &&
        'text-gray-600 dark:text-gray-50 bg-background dark:bg-background dark:border-border/40 border-gray-100/40',
      isCurrentUrl(pageUrl) &&
        invertMenuColors &&
        'text-gray-600 dark:text-gray-50 bg-white dark:bg-background dark:border-border/40 border-gray-100/60 hover:bg-white hover:border-gray-100',
      !isCurrentUrl(pageUrl) && invertMenuColors && 'hover:border-gray-100/60 hover:bg-white'
    )

  if (hidePublicMenu) {
    return (
      <PublicBoardAuth
        isOpen={authenitcateModal}
        setIsOpen={setAuthenitacteModal}
        callback={() => {
          if (mutateChangelogs) {
            mutateChangelogs()
          }
          mutateCurrentOrg()
        }}
      />
    )
  }

  const getMainButtonLink = () => {
    const moduleLinks = org?.publicPortalMenu?.filter((item) =>
      moduleLinkValues.includes(item.link)
    )

    // Return first link that is enabled
    return moduleLinks[0]?.link || '/'
  }

  const getActiveLocalePageName = (name: ITranslationText, moduleName?: string) => {
    const locale = i18n.language === 'default' ? 'en' : i18n.language

    const activeName = name?.[locale] || name?.[Object.keys(name || {})[0]]

    const showDefaultTranslation =
      moduleName && !name?.[locale]
        ? ['changelog', 'feedback', 'roadmap', 'help-center'].includes(
            activeName?.toLowerCase().replace(' ', '-')
          )
        : false

    if (moduleName === 'Changelog') {
      return showDefaultTranslation ? t('changelog') : activeName
    }

    if (moduleName === 'Feedback') {
      if (getAllEnabledBoards.length === 1) {
        return org?.postCategories?.find((cat) => cat.id === getAllEnabledBoards[0])?.category
      }

      return showDefaultTranslation ? t('feedback') : activeName
    }

    if (moduleName === 'Roadmap') {
      if (org?.roadmaps?.length > 1) {
        if (activeRoadmap && currentPath.includes('/roadmap')) {
          return activeRoadmap?.name
            ? activeRoadmap?.name
            : showDefaultTranslation
            ? t('roadmap')
            : activeName
        }
      }

      return showDefaultTranslation ? t('roadmap') : activeName
    }

    if (moduleName === 'Help Center') {
      return showDefaultTranslation ? t('help-center') : activeName
    }

    return activeName
  }

  return (
    <div
      className={cn(
        'px-4 public-nav bg-white border-b border-gray-100/40 dark:border-border/40 dark:bg-secondary/40 md:px-6 xl:px-0',
        invertMenuColors && 'bg-[#F9FAFC]/60'
      )}
    >
      <PublicBoardAuth
        isOpen={authenitcateModal}
        setIsOpen={setAuthenitacteModal}
        callback={() => {
          if (mutateChangelogs) {
            mutateChangelogs()
          }
          mutateCurrentOrg()
        }}
      />
      <div className="max-w-5xl py-4 pb-0 mx-auto">
        <div className="flex items-center justify-between">
          {!hideLogo ? (
            <div className="inline-flex items-center flex-1 w-full mr-3 truncate">
              <Link legacyBehavior className="w-full truncate" href={getMainButtonLink()}>
                <button
                  onClick={() => {
                    setFilters &&
                      setFilters((prev) => ({
                        ...prev,
                        ...getDefaultFilters(org),
                      }))
                  }}
                  className="inline-flex items-center max-w-full truncate unstyled-button"
                >
                  <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mr-2 overflow-hidden rounded-full border- sm:h-9 sm:w-9 dark:bg-gray-800 dark:border-secondary">
                    {org?.picture ? (
                      <Image
                        className="object-cover rounded-full"
                        src={org?.picture}
                        height={36}
                        width={36}
                        alt="profile_pic"
                      />
                    ) : (
                      <div className="flex items-center justify-center text-gray-400 dark:text-background-accent">
                        <div className="w-5 h-5 ">
                          <Loader />
                        </div>
                      </div>
                    )}
                  </div>
                  <h2 className="w-full text-sm font-bold text-gray-600 truncate transform-gpu sm:text-xl dark:text-gray-50">
                    {org?.displayName}
                  </h2>
                </button>
              </Link>
            </div>
          ) : null}

          <div className="flex items-center flex-shrink-0 space-x-3 sm:space-x-4">
            {can(user?.id, 'moderate_comments', org) || can(user?.id, 'moderate_posts', org) ? (
              <ModerationNotification />
            ) : null}

            {user ? <Notifications setActiveSubmissionId={setActiveSubmissionId} /> : null}

            {user && isMember(user.id, org) ? (
              <Link legacyBehavior href="/dashboard/posts">
                <a>
                  <button className="h-9 text-xs sm:text-[13px] px-2 sm:px-3 dashboard-secondary">
                    <CogIcon className="hidden w-4 h-4 mr-1 text-background-accent sm:block dark:text-foreground" />
                    {t('dashboard')}
                  </button>
                </a>
              </Link>
            ) : (
              !user && (
                <button
                  onClick={() => setAuthenitacteModal(true)}
                  className="h-9 text-xs sm:text-[13px] px-2 sm:px-3 dashboard-secondary"
                >
                  {org?.ssoUrl
                    ? t('log-in-with-organization-account', {
                        organization: org.displayName,
                      })
                    : `${t('sign-in')} / ${t('sign-up')}`}
                </button>
              )
            )}

            {user && <ProfileDropdown />}
          </div>
        </div>
        <div className="flex items-center mt-4 -mb-px space-x-1 overflow-x-auto scrollbar-none sm:space-x-5 ">
          {pages.map((page) => (
            <div
              key={page._id}
              className={cn(
                `relative flex-shrink-0`,
                pages?.length === 1
                  ? page.link === '/feedback' && org?.postCategories?.length !== 1
                    ? 'sm:hidden block'
                    : 'hidden'
                  : ``
              )}
            >
              {page.link === '/' ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className={`${linkStyle(page.link)} shadow-none`}>
                    {getAllEnabledBoards.length === 0 && page?.icon && (
                      <span
                        className={`w-4 h-4 mr-1 sm:w-5 sm:h-5 ${
                          isCurrentUrl('/')
                            ? 'text-background-accent dark:text-foreground'
                            : 'text-background-accent/70 dark:text-background-accent'
                        } ${
                          page?.icon?.type !== 'predefined' && 'flex items-center justify-center'
                        }`}
                      >
                        <FeaturedIcon icon={page.icon} inButton={true} />
                      </span>
                    )}
                    {getAllEnabledBoards.length === 1 &&
                      org?.postCategories?.find((cat) => cat.id === getAllEnabledBoards[0])
                        ?.private && (
                        <LockClosedIcon className={`w-4 h-4 mr-1.5 sm:w-5 sm:h-5 secondary-svg`} />
                      )}
                    {getActiveLocalePageName(page.name, 'Feedback')}{' '}
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-1 sm:w-5 sm:h-5 ${
                        isCurrentUrl('/')
                          ? 'text-background-accent dark:text-foreground/80'
                          : 'text-background-accent/60 dark:text-background-accent'
                      }`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="min-w-[192px] w-auto max-w-[320px] relative"
                    align="start"
                  >
                    <DropdownMenuItem
                      onClick={() => {
                        if (router.pathname === '/') {
                          router.push({ pathname: '/' }, undefined, {
                            shallow: true,
                          })
                        } else {
                          router.push({ pathname: '/' }, undefined)
                        }
                        setFilters &&
                          setFilters((prev) => ({
                            ...prev,
                            advancedFilters: [
                              ...prev.advancedFilters.filter((filter) => filter.type !== 'b'),
                            ],
                          }))
                      }}
                    >
                      <CollectionIcon className="w-5 h-5 mr-2 " />
                      {t('all-posts')}
                    </DropdownMenuItem>
                    {org?.postCategories?.map((category) => {
                      return (
                        <DropdownMenuItem
                          onSelect={() => {
                            addFilterToBoard(router, category.id, 'b', '/')
                            setFilters &&
                              setFilters((prev) => ({
                                ...prev,
                                advancedFilters: [
                                  ...prev.advancedFilters.filter((filter) => filter.type !== 'b'),
                                  {
                                    type: 'b',
                                    operator: 'is',
                                    id: uuid(),
                                    values: [category.id],
                                  },
                                ],
                              }))
                          }}
                          key={category.category}
                          className=""
                        >
                          {category.private && (
                            <LockClosedIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                          )}
                          <span className="break-all line-clamp-1">{category.category}</span>
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : page.link === '/roadmap' && org?.roadmaps?.length > 1 ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger className={`${linkStyle(page.link)} shadow-none`}>
                    {isCurrentUrl(page.link) && activeRoadmap?.icon ? (
                      <span className="mr-1 w-4 h-4 sm:w-5 sm:h-5 text-background-accent dark:text-foreground">
                        <FeaturedIcon inButton={true} icon={activeRoadmap?.icon} />
                      </span>
                    ) : (
                      page?.icon && (
                        <span
                          className={`w-4 h-4 mr-1 sm:w-5 sm:h-5 ${
                            isCurrentUrl(page.link)
                              ? 'text-background-accent dark:text-foreground'
                              : 'text-background-accent/70 dark:text-background-accent'
                          } ${
                            page?.icon?.type !== 'predefined' && 'flex items-center justify-center'
                          }`}
                        >
                          <FeaturedIcon inButton={true} icon={page?.icon} />
                        </span>
                      )
                    )}
                    <span className="truncate max-w-[220px]">
                      {getActiveLocalePageName(page.name, 'Roadmap')}
                    </span>
                    <ChevronDownIcon
                      className={`w-4 h-4 ml-1 sm:w-5 sm:h-5 ${
                        isCurrentUrl(page.link)
                          ? 'text-background-accent dark:text-foreground/80'
                          : 'text-background-accent/60 dark:text-background-accent'
                      }`}
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="min-w-[192px] w-auto max-w-[320px] relative"
                    align="start"
                  >
                    {org.roadmaps
                      .filter(
                        (roadmap) => !isCurrentUrl(page.link) || roadmap._id !== activeRoadmap?._id
                      )
                      .map((roadmap) => {
                        return (
                          <DropdownMenuItem
                            onSelect={() => {
                              router.push({ pathname: `/roadmap/${roadmap.slug}` }, undefined)
                              setActiveRoadmap(roadmap)
                            }}
                            className=""
                            key={roadmap._id}
                          >
                            {roadmap.icon && (
                              <span className="mr-1.5 secondary-svg">
                                <FeaturedIcon small={true} icon={roadmap.icon} />
                              </span>
                            )}
                            <span className="break-all line-clamp-1">{roadmap.name}</span>
                          </DropdownMenuItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link legacyBehavior href={page.link}>
                    <a
                      target={
                        !(page.link === '/changelog' || page.link === '/roadmap')
                          ? '_blank'
                          : undefined
                      }
                      rel={
                        !(page.link === '/changelog' || page.link === '/roadmap')
                          ? 'noreferrer'
                          : undefined
                      }
                      className={`${linkStyle(page.link)}`}
                    >
                      {page.icon && (
                        <span
                          className={`w-4 h-4 mr-1 sm:w-5 sm:h-5 ${
                            isCurrentUrl(page.link)
                              ? 'text-background-accent dark:text-foreground'
                              : 'text-background-accent/70 dark:text-background-accent'
                          } ${
                            page?.icon?.type !== 'predefined' && 'flex items-center justify-center'
                          }`}
                        >
                          <FeaturedIcon inButton={true} icon={page?.icon} />
                        </span>
                      )}
                      {getActiveLocalePageName(
                        page.name,
                        page.link === '/changelog'
                          ? 'Changelog'
                          : page.link === '/roadmap'
                          ? 'Roadmap'
                          : page.link === '/help'
                          ? 'Help Center'
                          : undefined
                      )}
                    </a>
                  </Link>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PublicBoardMenu
