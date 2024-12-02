import React from 'react'
import { TranslateIcon, CheckIcon, LightBulbIcon, PlusIcon } from '@heroicons/react/solid'
import { getCountryNameByCode } from '@/lib/localizationUtils'
import { cn } from '@/lib'
import { isMember } from '@/lib/acl'
import { useUser } from '@/data/user'
import router from 'next/router'
import { useCurrentOrganization } from '@/data/organization'
import { useAtom } from 'jotai'
import { upgradePlanAtom } from '@/atoms/orgAtom'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup, CommandItem, CommandSeparator } from './radix/Command'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from './radix/DropdownMenu'

interface ChangelogLocaleDropdownProps {
  activeLocale: string
  availableLocales: string[]
  changeLocale: (locale: string) => void
  customButton?: React.ReactNode
  hideNewLanguageSuggestion?: boolean
  adminCreateNewLanguage?: boolean
  paywalled?: boolean
  completedLocales?: string[]
  publishedLocales?: string[]
  publicView?: boolean
}

const ChangelogLocaleDropdown: React.FC<ChangelogLocaleDropdownProps> = ({
  activeLocale,
  availableLocales,
  changeLocale,
  customButton,
  hideNewLanguageSuggestion,
  adminCreateNewLanguage,
  paywalled,
  completedLocales,
  publishedLocales,
  publicView,
}) => {
  const { user } = useUser()

  const { org } = useCurrentOrganization()

  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)

  if (paywalled) {
    return (
      <div
        onClick={() => {
          setUpgradePlan({
            title: 'Localized articles are',
            plan: 'growth',
          })
        }}
      >
        {customButton ? (
          customButton
        ) : (
          <button className="p-1 -m-1 rounded-md leading-none cursor-pointer hover:bg-gray-100/70 dark:hover:bg-secondary main-transition">
            <TranslateIcon className="secondary-svg mr-1" /> {activeLocale.toUpperCase()}
          </button>
        )}
      </div>
    )
  }

  if (publicView) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          {customButton ? (
            customButton
          ) : (
            <button className="p-1 -m-1 rounded-md leading-none cursor-pointer hover:bg-gray-100/70 dark:hover:bg-secondary main-transition">
              <TranslateIcon className="secondary-svg mr-1" /> {activeLocale.toUpperCase()}
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent collisionPadding={10}>
          {availableLocales.map((locale) => (
            <DropdownMenuItem
              key={locale}
              onSelect={() => changeLocale(locale)}
              className={cn(
                'flex items-center justify-between',
                activeLocale === locale && 'active-dropdown-item'
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    completedLocales && completedLocales.includes(locale)
                      ? '!bg-accent/20 !text-accent-foreground dark:!text-accent-foreground'
                      : 'bg-foreground/10',
                    'truncate -ml-1 rounded-sm dark:text-foreground/80 min-w-[24px] px-0.5 h-4 flex items-center justify-center mr-2 text-[10px] font-semibold'
                  )}
                >
                  {locale.toUpperCase()}
                </span>
                <span>{getCountryNameByCode(locale)}</span>
              </div>
              {activeLocale === locale && <CheckIcon className="w-4 h-4 ml-2" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <ModularComboBox
      TriggerButton={() =>
        (customButton ? (
          customButton
        ) : (
          <button className="p-1 -m-1 rounded-md leading-none cursor-pointer hover:bg-gray-100/70 dark:hover:bg-secondary main-transition">
            <TranslateIcon className="secondary-svg mr-1" /> {activeLocale.toUpperCase()}
          </button>
        )) as any
      }
      CommandItems={({ closeComboBox }) => (
        <CommandGroup>
          {availableLocales.map((locale) => (
            <CommandItem
              key={locale}
              onSelect={() => {
                changeLocale(locale)
                closeComboBox()
              }}
              className={cn(
                'flex items-center justify-between',
                activeLocale === locale && 'active-dropdown-item'
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    'truncate -ml-1 rounded-sm dark:text-foreground/80 min-w-[24px] px-0.5 h-4 flex items-center justify-center mr-2 text-[10px] font-semibold',
                    publishedLocales && publishedLocales.includes(locale)
                      ? 'bg-green-500/20 text-green-700 dark:text-green-300'
                      : completedLocales && completedLocales.includes(locale)
                      ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300'
                      : 'bg-foreground/10'
                  )}
                >
                  {locale.toUpperCase()}
                </span>
                <span>{getCountryNameByCode(locale)}</span>
              </div>
              {activeLocale === locale && <CheckIcon className="w-4 h-4 ml-2" />}
            </CommandItem>
          ))}
          {!hideNewLanguageSuggestion && (
            <>
              <CommandSeparator />
              <CommandItem
                onSelect={() => {
                  window.postMessage({
                    target: 'FeaturebaseWidget',
                    data: {
                      action: 'openFeedbackWidget',
                      setBoard: '💡 Feature Request',
                    },
                  })
                  closeComboBox()
                }}
              >
                <LightBulbIcon className="secondary-svg mr-[12px]" />
                Suggest a new language
              </CommandItem>
            </>
          )}
          {adminCreateNewLanguage && user && isMember(user?.id, org) && (
            <>
              <CommandSeparator />
              <CommandItem
                onSelect={() => {
                  router.push(
                    router.pathname.includes('changelog')
                      ? '/dashboard/settings/changelog'
                      : '/dashboard/settings/help-center'
                  )
                  closeComboBox()
                }}
              >
                <PlusIcon className="secondary-svg mr-[12px]" />
                Add a new language
              </CommandItem>
            </>
          )}
        </CommandGroup>
      )}
      allowNewCreation={false}
      searchableDisplayName="languages"
    />
  )
}

export default ChangelogLocaleDropdown
