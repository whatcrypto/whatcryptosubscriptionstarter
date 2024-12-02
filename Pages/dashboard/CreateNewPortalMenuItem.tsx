import React from 'react'
import PopupWrapper from '@/components/PopupWrapper'
import IconPickerPopover from '@/components/IconPickerPopover'
import FeaturedIcon from '@/components/docs/FeaturedIcon'
import { CollectionIcon, TranslateIcon } from '@heroicons/react/solid'
import { IHelpCenterIcon } from '@/interfaces/IHelpCenter'
import { Button } from '@/components/radix/Button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/radix/Card'
import { Label } from '@/components/radix/Label'
import { Input } from '@/components/radix/Input'
import { cn } from '@/lib'
import { orgSettingsChanger } from '@/lib/organizatioMutator'
import { useCurrentOrganization } from '@/data/organization'
import ObjectID from 'bson-objectid'
import { IOrganization, IPortalMenuItem } from '@/interfaces/IOrganization'
import DashboardLocaleDropdown from '@/components/DashboardLocaleDropdown'
import { availableLocales, getCountryNameByCode } from '@/lib/localizationUtils'
import { ITranslationText } from '@/interfaces/IOrganization'
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/radix/DropdownMenu'
import { LinkIcon, BookOpenIcon, RefreshIcon, MapIcon } from '@heroicons/react/solid'
import isURL from 'validator/lib/isURL'
import { toast } from 'sonner'

export const moduleLinks = {
  feedback: '/',
  roadmap: '/roadmap',
  changelog: '/changelog',
  help: '/help',
}

export const moduleLinkValues = Object.values(moduleLinks)

export const isLinkModule = (url: string) => Object.values(moduleLinks).includes(url)

export const isModuleDisabled = (moduleName: keyof typeof moduleLinks, org: IOrganization) => {
  if (!org || !org?.widget) return false
  // Check if org.publicPortalMenu already has a module with the same name

  const expectedUrl = moduleLinks[moduleName as keyof typeof moduleLinks]

  const existingModule = org.publicPortalMenu?.find((item) => item.link === expectedUrl)

  return !existingModule
}

const CreateMenuItemModal: React.FC<{
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  onCreate: (newItem: IPortalMenuItem) => void
}> = ({ setIsOpen, isOpen, onCreate }) => {
  const [loading, setLoading] = React.useState(false)

  const { org, mutateCurrentOrg } = useCurrentOrganization()

  const [activeLocale, setActiveLocale] = React.useState('en')

  const [data, setData] = React.useState<{
    name: ITranslationText
    url: string
    icon?: IHelpCenterIcon | null
  }>({
    name: {},
    url: '',
    icon: undefined,
  })

  const [errors, setErrors] = React.useState<{
    name: boolean
    url: boolean
  }>({
    name: false,
    url: false,
  })

  const handleModuleSelection = (inputModule: string) => {
    setData({
      ...data,
      url: moduleLinks[inputModule as keyof typeof moduleLinks],
    })
    if (errors.url) {
      setErrors((prev) => ({ ...prev, url: false }))
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    const isValid = isURL(value)
    setData({ ...data, url: value })
    setErrors((prev) => ({ ...prev, url: !isValid && value !== '' }))
  }

  React.useEffect(() => {
    if (isOpen) {
      setData({
        name: {},
        url: '',
        icon: undefined,
      })
      setErrors({
        name: false,
        url: false,
      })
      setActiveLocale('en')
    }
  }, [isOpen])

  const handleSubmit = async () => {
    let hasError = false
    const newErrors = { name: false, url: false }

    if (!data.name[activeLocale] || !data.name[activeLocale].trim()) {
      newErrors.name = true
      hasError = true
    }
    if (!data.url || (!Object.values(moduleLinks).includes(data.url) && !isURL(data.url))) {
      newErrors.url = true
      hasError = true
    }

    // Check if URL already exists in menu items
    const linkExists = org?.publicPortalMenu?.some((item) => item.link === data.url)
    if (linkExists) {
      toast.error('A menu item with this URL already exists.')
      return
    }

    setErrors(newErrors)

    if (hasError) {
      toast.error('Please fill in all required fields.')
      return
    }

    setLoading(true)

    const newMenuItem = {
      _id: new ObjectID().toString(),
      name: data.name,
      link: data.url,
      icon: data.icon || null,
    }

    const updatedMenuItems = [...(org?.publicPortalMenu || []), newMenuItem]

    orgSettingsChanger(
      { publicPortalMenu: updatedMenuItems },
      {
        ...org,
        publicPortalMenu: updatedMenuItems,
      },
      mutateCurrentOrg,
      true,
      undefined,
      handleRes
    )
  }

  const handleRes = (success: boolean) => {
    if (success) {
      setIsOpen(false)
    }
    setLoading(false)
  }

  const changeLocale = (locale: string) => {
    setActiveLocale(locale)
  }

  return (
    <PopupWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
      <CardHeader>
        <CardTitle>Create Menu Item</CardTitle>
        <CardDescription>Enter the details for the new menu item.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="gap-3 flex flex-col">
          <div>
            <Label className={cn('flex items-center pb-1.5')} htmlFor="name">
              Icon & Name
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <IconPickerPopover
                onSelect={(icon, type) => {
                  setData({
                    ...data,
                    icon: !icon
                      ? null
                      : {
                          type,
                          value: icon,
                        },
                  })
                }}
                trigger={
                  <button className="h-[34px] flex-shrink-0 w-[38px] flex items-center justify-center p-0 shadow-none dark:shadow-none dashboard-secondary">
                    {data.icon ? (
                      <span className="">
                        <FeaturedIcon inButton={true} icon={data.icon as any} />
                      </span>
                    ) : (
                      <LinkIcon className="!w-4 !h-4 !m-0 flex-shrink-0 secondary-svg opacity-60 dark:opacity-60" />
                    )}
                  </button>
                }
              />
              <Input
                value={data.name[activeLocale] || ''}
                onChange={(event) => {
                  const newName = event.target.value
                  setData((prevData) => ({
                    ...prevData,
                    name: {
                      ...prevData.name,
                      [activeLocale]: newName,
                    },
                  }))
                  if (errors.name && newName.trim()) {
                    setErrors((prev) => ({ ...prev, name: false }))
                  }
                }}
                id="name"
                type="text"
                placeholder={`Enter menu item name (${activeLocale})`}
                error={errors.name}
              />
              <DashboardLocaleDropdown
                customButton={
                  <Button variant={'outline'}>
                    <TranslateIcon className="secondary-svg mr-1" />{' '}
                    {getCountryNameByCode(activeLocale)}
                  </Button>
                }
                completedLocales={Object.keys(data.name)}
                activeLocale={activeLocale}
                changeLocale={changeLocale}
                availableLocales={availableLocales}
                hideNewLanguageSuggestion={true}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="url">Link</Label>
            <div className="mt-1 flex items-center gap-2">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant={'outline'} icon={LinkIcon}>
                    {Object.values(moduleLinks).includes(data.url)
                      ? {
                          '/': 'Feedback module',
                          '/roadmap': 'Roadmap module',
                          '/changelog': 'Changelog module',
                          '/help': 'Help center module',
                        }[data.url]
                      : 'Custom link'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    icon={CollectionIcon}
                    onClick={() => handleModuleSelection('feedback')}
                  >
                    Feedback module
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={MapIcon} onClick={() => handleModuleSelection('roadmap')}>
                    Roadmap module
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={RefreshIcon}
                    onClick={() => handleModuleSelection('changelog')}
                  >
                    Changelog module
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    icon={BookOpenIcon}
                    onClick={() => handleModuleSelection('help')}
                  >
                    Help center module
                  </DropdownMenuItem>
                  <DropdownMenuItem icon={LinkIcon} onClick={() => setData({ ...data, url: '' })}>
                    Custom link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {!Object.values(moduleLinks).includes(data.url) && (
                <Input
                  value={data.url}
                  onChange={handleUrlChange}
                  id="url"
                  type="text"
                  placeholder="https://..."
                  error={errors.url}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs mr-auto dark:text-foreground/80">
          Will default to English if not translated for visited language.
        </p>
        <Button onClick={handleSubmit} loading={loading}>
          Create Menu Item
        </Button>
      </CardFooter>
    </PopupWrapper>
  )
}

export default CreateMenuItemModal
