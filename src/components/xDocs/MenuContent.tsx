// MenuContent.tsx
import React, { memo } from 'react'
import Link from '@/components/CustomLink'
import { useAtom } from 'jotai'
import {
  helpcenterActivePageAtom,
  helpcenterShowBackButtonAtom,
  helpCenterUrlPartsAtom,
} from '@/atoms/orgAtom'
import { useCurrentOrganization } from '@/data/organization'
import { useTheme } from 'next-themes'
import Image from 'next/legacy/image'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  LightningBoltIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  TranslateIcon,
  XIcon,
} from '@heroicons/react/solid'
import { cn } from '@/lib/utils'
import FeaturedIcon from './FeaturedIcon'
import CMDIcon from '../CMDIcon'
import Loader from '../Loader'
import { Disclosure } from '@headlessui/react'
import { showArticleSearchAtom } from '@/atoms/docsAtom'
import { processNavData } from '../DevDocsNavigation'
import router from 'next/router'
import ChangelogLocaleDropdown from '../DashboardLocaleDropdown'
import { i18n, useTranslation } from 'next-i18next'

type MenuContentProps = {
  memoizedNavItems: React.ReactNode
  data: any
  close?: () => void
}

const MenuContent: React.FC<MenuContentProps> = memo(({ memoizedNavItems, data, close }) => {
  const [helpCenterUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const [showBackButton, setShowBackButton] = useAtom(helpcenterShowBackButtonAtom)
  const { org } = useCurrentOrganization()
  const { theme, setTheme, systemTheme } = useTheme()
  const activeTheme = theme !== 'dark' && theme !== 'light' ? systemTheme : theme
  const [searchOpen, setSearchOpen] = useAtom(showArticleSearchAtom)

  const { i18n, t } = useTranslation()

  const handleChangeLocale = (locale: string) => {
    // i18n.changeLanguage(locale)
    router.push(router.asPath, undefined, { locale })
    if (close) close()
  }

  return (
    <>
      <div className="relative w-full p-4 xl:p-3">
        <div className="flex flex-col items-start">
          <div className="flex items-center justify-between w-full">
            <Link
              legacyBehavior
              className="w-full min-w-0 truncate"
              href={`${helpCenterUrlParts.subpath}`}
            >
              <button
                onClick={close}
                className="inline-flex items-center min-w-0 max-w-full truncate unstyled-button"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex items-center flex-shrink-0 justify-center mr-0 overflow-hidden rounded-full w-7 h-7 sm:h-7 sm:w-7 dark:bg-secondary dark:border-secondary">
                    {org?.picture ? (
                      <Image
                        className="object-cover rounded-full"
                        src={org?.picture}
                        height={28}
                        width={28}
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
                  <h2 className="w-full min-w-0 text-sm font-semibold leading-none text-gray-600 truncate transform-gpu sm:text-base dark:text-gray-50">
                    <span className="truncate w-full">{org?.displayName}</span>
                  </h2>
                </div>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              {data?.availableLocales?.length > 1 && (
                <div className="hidden xl:block">
                  <ChangelogLocaleDropdown
                    publicView={true}
                    hideNewLanguageSuggestion={true}
                    activeLocale={i18n.language === 'default' ? 'en' : i18n.language}
                    availableLocales={data?.availableLocales}
                    changeLocale={(locale) => {
                      handleChangeLocale(locale)
                    }}
                    customButton={
                      <button className="h-7 py-0 px-1.5 w-full flex items-center rounded-md cursor-pointer !leading-none uppercase dark:text-foreground/80 text-[13px] font-semibold hover:bg-gray-100/70 dark:hover:bg-secondary main-transition">
                        <TranslateIcon className="secondary-svg flex-shrink-0 mr-1" />
                        <span className="leading-none">
                          {i18n.language === 'default' ? 'en' : i18n.language}
                        </span>
                      </button>
                    }
                  />
                </div>
              )}
              <button
                onClick={() => {
                  if (theme !== 'dark' && theme !== 'light') {
                    setTheme(systemTheme === 'dark' ? 'light' : 'dark')
                  } else {
                    setTheme(theme === 'dark' ? 'light' : 'dark')
                  }
                }}
                // Start of Selection
                className="hidden h-7 w-7 p-0 items-center justify-center rounded-md xl:flex hover:bg-gray-100/70 dark:hover:bg-secondary main-transition"
              >
                {activeTheme === 'dark' ? (
                  <SunIcon className="w-5 h-5 secondary-svg" />
                ) : (
                  <MoonIcon className="w-5 h-5 secondary-svg" />
                )}
              </button>
              <Disclosure.Button className="h-8 px-2 dashboard-secondary xl:hidden">
                <span className="sr-only">Open main menu</span>
                <XIcon className="block w-6 h-6" aria-hidden="true" />
              </Disclosure.Button>
            </div>
          </div>
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center w-full px-3 mt-4 dashboard-secondary dark:bg-secondary/50 dark:border-border/60"
          >
            <SearchIcon className="mr-[9px]" />
            {data?.searchPlaceholder === 'Search for articles'
              ? t('search-for-articles')
              : data?.searchPlaceholder || t('search-for-articles')}{' '}
            <div className="flex items-center ml-auto">
              <div className="-mr-0.5 -mt-px">
                <CMDIcon cmdKey="⌘" />
              </div>
              <CMDIcon cmdKey="K" />
            </div>
          </button>
        </div>
      </div>
      <div className="relative flex-grow min-h-0 xl:mt-1">
        {!org?.whitelabel && (
          <a
            href={`https://featurebase.app?utm_source=${
              org?.name ? org.name : 'feedback'
            }&utm_medium=helpcenter&utm_campaign=powered-by&utm_id=${org?.id}`}
            target="_blank"
            rel="noreferrer"
          >
            <button className="absolute  z-20 text-xs p-1.5 font-semibold bottom-3 left-3 dark:text-foreground/50 dark:border-border/30 dark:hover:text-foreground group dark:bg-secondary/10 backdrop-blur dashboard-secondary">
              <LightningBoltIcon className="!w-3 group-hover:!text-accent main-transition !text-accent/40 !h-3 mr-1.5" />
              Featurebase
            </button>
          </a>
        )}
        <div className="absolute bottom-0 hidden h-32 pointer-events-none xl:block -inset-x-4 bg-gradient-to-b from-transparent to-background dark:to-background"></div>
        <div className="w-full h-full pb-20 pl-3 pr-2 overflow-x-hidden overflow-y-auto scrollbar-track-transparent custom-scrollbar-stronger">
          {showBackButton?.show && (
            <div className="flex my-2 px-1 truncate">
              <a
                onClick={() => {
                  setShowBackButton({ show: false, collection: undefined })
                }}
                className="flex items-center cursor-pointer flex-shrink-0 truncate text-[11px] font-semibold line-clamp-2 tracking-[0.05em] text-gray-400 uppercase dark:text-foreground/70"
              >
                Collections
              </a>
              <ChevronRightIcon className="secondary-svg flex-shrink-0 mx-1.5" />
              <Link
                legacyBehavior
                href={`${helpCenterUrlParts.subpath}/collections/${showBackButton?.collection?.collectionId}`}
              >
                <p className="flex cursor-pointer items-center truncate text-[11px] font-semibold line-clamp-2 tracking-[0.05em] text-gray-500 uppercase dark:text-foreground">
                  <span className="truncate">{showBackButton.collection?.name}</span>
                </p>
              </Link>
            </div>
          )}
          {memoizedNavItems}
        </div>
      </div>
      {data?.navItems?.length > 0 ? (
        <div className="relative flex flex-col gap-1 p-2 pl-3 mt-auto border-t xl:bg-background/60 xl:backdrop-blur dashboard-border">
          {data.navItems.map((page: any, index: number) => (
            <Link legacyBehavior key={index} href={page.url}>
              <a
                className={cn(
                  'flex items-center select-none h-8 main-transition px-3 hover:bg-accent/[7%] hover:dark:bg-secondary py-1.5  rounded-md cursor-pointer mx-0'
                )}
              >
                <span
                  className={cn(
                    'text-[13px] truncate font-medium flex items-center',
                    'text-gray-400 dark:text-foreground/80'
                  )}
                >
                  {page.icon && (
                    <div className="opacity-60 mr-1.5">
                      <FeaturedIcon small={true} icon={page?.icon} />
                    </div>
                  )}
                  <span className="truncate">{page?.title}</span>
                </span>
              </a>
            </Link>
          ))}
        </div>
      ) : null}
    </>
  )
})

MenuContent.displayName = 'MenuContent'

export default MenuContent
