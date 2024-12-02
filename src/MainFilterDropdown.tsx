import { useMembers, useCurrentOrganization } from '@/data/organization'
import { ISubmissionFilters } from '@/interfaces/ISubmission'
import {
  BriefcaseIcon,
  CalendarIcon,
  CollectionIcon,
  ExclamationCircleIcon,
  EyeOffIcon,
  FilterIcon,
  LockClosedIcon,
  PuzzleIcon,
  StatusOnlineIcon,
  TagIcon,
  UserGroupIcon,
  UserIcon,
} from '@heroicons/react/solid'
import React, { SetStateAction, useState } from 'react'
import { CommandItem, CommandGroup } from './radix/Command'
import { CustomInputField, IMember, IOrganization } from '@/interfaces/IOrganization'
import TagBullet from './TagBullet'
import { v4 as uuid } from 'uuid'
import { cn, isPlan } from '@/lib/utils'
import { useUser } from '@/data/user'
import ActiveViewItem from './GenerateActiveView'
import ModularComboBox from './radix/ModularComboBox'
import MainFilterDropdownDateOperator from './MainFilterDropdownDateOperator'
import { useTranslation } from 'next-i18next'
import CreateSegments from './CreateSegments'
import { isMember } from '@/lib/acl'
import ActiveUserSearchResults from './ActiveUserSearchResults'
import { ICustomer, ICustomerCompany } from '@/interfaces/IUser'
import { TooltipProvider } from './radix/Tooltip'
import ActiveCompanySearchResults from './ActiveCompanySearchResults'
import { upgradePlanAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'
import { getCompanyById } from 'network/lib/organization'
import UserProfileFilterDisplayer from './UserProfileFilterDisplayer'
import CompanyFilterDisplayer from './CompanyFilterDisplayer'

export const getAvailableFilterData = (org: IOrganization, members: IMember[]) => [
  {
    name: 'Status',
    key: 'status',
    backendValue: 's',
    type: 'selectable',
    multiSelectable: true,
    icon: StatusOnlineIcon,
    options: org.postStatuses,
    decorator: (value: any) => <TagBullet theme={value.color} />,
    getItemName: (value: any) => value?.name,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, org?.postStatuses, 'name'),
    optionIdKey: 'id',
    getItemFromId: (id: string) => org.postStatuses?.find((item) => item.id === id),
  },
  {
    name: 'Board',
    key: 'category',
    backendValue: 'b',
    type: 'selectable',
    multiSelectable: true,
    icon: CollectionIcon,
    options: org.postCategories,
    getItemName: (value: any) => value.category,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, org?.postCategories, 'category'),
    optionIdKey: 'id',
    decorator: (value: any) =>
      value.private && (
        <LockClosedIcon
          className={`h-4 w-4 mr-1 text-background-accent/60 dark:text-background-accent`}
        />
      ),
    getItemFromId: (id: string) => org.postCategories?.find((item) => item.id === id),
  },
  {
    name: 'Assignee',
    key: 'assignee',
    backendValue: 'a',
    type: 'selectable',
    multiSelectable: true,
    icon: UserIcon,
    options: members
      ? [{ name: 'No assignee', email: '', id: 'unassigned', profilePicture: '' }, ...members]
      : [],
    decorator: (value: IMember) =>
      value.profilePicture ? (
        <img src={value.profilePicture} className="w-5 h-5 mr-2 rounded-full" />
      ) : (
        <div className="w-5 h-5 mr-2 bg-gray-100 rounded-full dark:bg-gray-500">
          <svg
            fill="currentColor"
            viewBox="0 0 24 24"
            className="w-5 font-semibold text-gray-400 rounded-full dark:text-foreground "
          >
            <path
              d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
              className="jsx-1981044996"
            />
          </svg>
        </div>
      ),
    customNameDisplaying: (id: string) => {
      return <UserProfileFilterDisplayer id={id} />
    },
    getItemName: (value: IMember) => value.name,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, members, 'name'),
    optionIdKey: 'id',
    getItemFromId: (id: string) =>
      id === 'unassigned' ? { name: 'No assignee' } : members?.find((item) => item.id === id),
  },
  {
    name: 'Tag',
    key: 'tag',
    backendValue: 't',
    type: 'selectable',
    multiSelectable: true,
    icon: TagIcon,
    options: [
      { name: 'No Tag', translateKey: 'no-tag', color: 'gray', id: 'none', private: false },
      ...org.postTags,
    ],
    decorator: (value: any) => <TagBullet theme={value.color} />,
    getItemName: (value: any, t: any) => {
      if (t && value.translateKey) {
        return t(value.translateKey)
      }
      return value.name
    },
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, org?.postTags, 'name'),
    optionIdKey: 'id',
    allowNotSet: true,
    getItemFromId: (id: string) => org.postTags?.find((item) => item.id === id),
  },
  {
    name: 'Segment',
    key: 'user-segment',
    backendValue: 'segment',
    type: 'selectable',
    icon: (props: React.ComponentProps<'svg'>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        // className="w-4 h-4 mr-2 secondary-svg"
        {...props}
      >
        <path
          fillRule="evenodd"
          d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    options: [...(org?.segments || []), { name: 'Create new segment', _id: 'createNewSegment' }],
    getItemName: (value: any) => value.name,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, org?.segments || [], 'name'),
    optionIdKey: '_id',
    getItemFromId: (id: string) => org.segments?.find((item) => item._id === id),
    paywall: !isPlan(org?.plan, 'premium'),
  },
  {
    name: 'ETA',
    key: 'eta',
    type: 'date',
    backendValue: 'e',
    icon: CalendarIcon,
    options: [],
  },
  {
    name: 'Created date',
    key: 'created-date',
    type: 'date',
    backendValue: 'd',
    icon: CalendarIcon,
    options: [],
  },
  {
    name: 'Custom field',
    key: 'custom-field',
    backendValue: 'cf-',
    type: 'selectable',
    multiSelectable: true,
    icon: PuzzleIcon,
    options: [
      ...(org.customInputFields
        ?.filter((field) => field.type !== 'text')
        ?.map((field) => ({
          name: field.label,
          _id: field._id,
          type: field.type,
        })) || []),
    ],
    paywall: !isPlan(org?.plan, 'premium'),
    getItemName: (value: any, t: any) => {
      if (t && value.translateKey) {
        return t(value.translateKey)
      }
      return value.name
    },
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, org?.customInputFields || [], 'name'),
    optionIdKey: '_id',
    getItemFromId: (id: string) => org.customInputFields?.find((item) => item._id === id),
  },
  {
    name: 'Author',
    key: 'author',
    type: 'selectable',
    backendValue: 'u',
    paywall: !isPlan(org?.plan, 'premium'),
    icon: UserGroupIcon,
    options: [],
    getItemName: (value: any) => value.name,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, [], 'name'),
    optionIdKey: 'id',
    getItemFromId: (id: string) => ({ id, name: id }),
    customSearchResults: (
      closeComboBox: () => void,
      updateActiveFilters: (value: string) => void
    ) => (
      <ActiveUserSearchResults
        setNewAuthor={(user?: ICustomer) => {
          closeComboBox()
          if (user) {
            updateActiveFilters(user.id)
          }
        }}
      />
    ),
    customNameDisplaying: (id: string) => {
      return <UserProfileFilterDisplayer id={id} />
    },
  },
  {
    name: 'Company',
    key: 'company',
    type: 'selectable',
    backendValue: 'c',
    icon: BriefcaseIcon,
    paywall: !isPlan(org?.plan, 'premium'),
    options: [],
    getItemName: (value: any) => value.name,
    filterFunction: (value: string, search: string) =>
      defaultFilterGetter(value, search, [], 'name'),
    optionIdKey: 'id',
    getItemFromId: (id: string) => ({ id, name: id }),
    customNameFetching: async (id: string) => {
      const res = await getCompanyById(id)
      return res.data.company.name
    },
    customNameDisplaying: (id: string) => {
      return <CompanyFilterDisplayer id={id} />
    },
    customSearchResults: (
      closeComboBox: () => void,
      updateActiveFilters: (value: string) => void
    ) => (
      <ActiveCompanySearchResults
        onSelectCompany={(company?: ICustomerCompany) => {
          closeComboBox()
          if (company) {
            updateActiveFilters(company.id)
          }
        }}
      />
    ),
  },
  {
    name: 'Stale',
    key: 'stale-post',
    type: 'boolean',
    backendValue: 'stale',
    icon: ExclamationCircleIcon,
    getItemName: (value: string) => {
      return value === 'true' ? 'true' : 'false'
    },
    getItemFromId: (id: string) => {
      return id === 'true' ? 'true' : 'false'
    },
    hideOperator: true,
    options: ['true', 'false'],
  },
  {
    name: 'Author only',
    key: 'author-only',
    type: 'boolean',
    backendValue: 'authorOnly',
    icon: EyeOffIcon,
    getItemName: (value: string) => {
      return value === 'true' ? 'true' : 'false'
    },
    getItemFromId: (id: string) => {
      return id === 'true' ? 'true' : 'false'
    },
    options: ['true', 'false'],
  },
]

export const defaultFilterGetter = (
  value: string,
  search: string,
  array: Array<any>,
  keyName: string
) => {
  if (
    array
      ?.find((elem) => {
        if (elem?._id) {
          return elem._id === value
        } else {
          return elem.id === value
        }
      })
      ?.[keyName]?.toLocaleLowerCase()
      ?.includes(search?.toLocaleLowerCase())
  ) {
    return 1
  } else {
    return 0
  }
}

export const MEMBER_FILTERS = [
  'Assignee',
  'Segment',
  'Stale',
  'Author only',
  'Author',
  'Company',
  'Custom field',
]

export type QueryEntry = {
  type: string
  operator: string
  values: string[]
  id: string
  userGenerated?: boolean
}

const MainFilterDropdown: React.FC<{
  activeFilters: any[]
  setActiveFilters: (update: SetStateAction<ISubmissionFilters>) => void
  big?: boolean
  small?: boolean
  hideStatusOption?: boolean
  publicBoard?: boolean
  hideText?: boolean
  reverseDropdownDirection?: boolean
  widget?: boolean
  CustomButton?: React.FC<{ children: React.ReactNode }>
}> = ({
  activeFilters,
  setActiveFilters,
  big,
  small,
  hideStatusOption,
  publicBoard,
  hideText,
  reverseDropdownDirection,
  widget,
  CustomButton,
}) => {
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const [activeViewUuid, setActiveViewUuid] = useState('')
  const { members } = useMembers(isMember(user?.id, org))
  const { t } = useTranslation()
  const [createNewSegmentOpen, setCreateNewSegmentOpen] = useState(false)

  const availableFilterData = getAvailableFilterData(org, members)
  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)

  const addFilter = (
    key: string,
    multiSelectable: boolean | undefined,
    value: string,
    operator: string = 'is',
    uuid: string
  ) => {
    const oneSelectable = !multiSelectable

    setActiveFilters((prev) => {
      const existingFilterIndex = prev.advancedFilters.findIndex((filter) => filter.id === uuid)

      if (existingFilterIndex !== -1) {
        // Clone the existing advanced filters array to avoid modifying state directly
        const newAdvancedFilters = [...prev.advancedFilters]

        // Create a new Set from existing values for uniqueness
        const valuesSet = new Set(newAdvancedFilters[existingFilterIndex].values)

        if (oneSelectable) {
          // If oneSelectable is true, toggle the value on and off
          if (valuesSet.has(value)) {
            valuesSet.delete(value)
          } else {
            valuesSet.clear()
            valuesSet.add(value)
          }
        } else {
          // Otherwise, add or remove the value as per the original logic
          if (valuesSet.has(value)) {
            valuesSet.delete(value)
          } else {
            valuesSet.add(value)
          }
        }

        // Convert it back to an array
        const updatedValues = Array.from(valuesSet)

        // If updatedValues is empty, remove the entire filter entry
        if (updatedValues.length === 0) {
          newAdvancedFilters.splice(existingFilterIndex, 1)
        } else {
          newAdvancedFilters[existingFilterIndex].values = updatedValues
        }

        return {
          ...prev,
          advancedFilters: newAdvancedFilters,
        }
      } else {
        // If there is no existing filter with the same id, create a new one
        return {
          ...prev,
          advancedFilters: [
            ...prev.advancedFilters,
            {
              type: key,
              operator,
              values: value ? [value] : [],
              id: uuid,
              userGenerated: true,
            },
          ],
        }
      }
    })
  }

  const checkIfFilterShouldBeShown = (filter: any) => {
    if (hideStatusOption && filter.name === 'Status') return false
    if (publicBoard && filter.name === 'Boards') return false

    if (activeFilters?.find((filter) => filter.type === 'stale') && filter.name === 'Stale')
      return false
    if (
      activeFilters?.find((filter) => filter.type === 'authorOnly') &&
      filter.name === 'Author only'
    )
      return false

    if (!isMember(user?.id, org) && MEMBER_FILTERS.find((f) => f === filter.name)) return false

    return true
  }

  // We don't want to rerender the entire dropdown every time activeFilters changes
  return React.useMemo(
    () => (
      <div>
        <CreateSegments open={createNewSegmentOpen} setOpen={setCreateNewSegmentOpen} />

        <ModularComboBox
          TriggerButton={() =>
            CustomButton ? (
              <div onClick={(e) => e.stopPropagation()}>
                <CustomButton>
                  <FilterIcon className="secondary-svg" />
                </CustomButton>
              </div>
            ) : publicBoard ? (
              <button
                className={cn(
                  'p-0 bg-transparent dark:bg-transparent dashboard-secondary',
                  widget && 'py-1'
                )}
              >
                <span className="inline-flex items-center px-2.5 py-2">
                  <FilterIcon className="secondary-svg" />
                </span>
              </button>
            ) : (
              <button
                className={cn(
                  `dashboard-secondary px-3`,
                  big ? 'py-1.5' : 'py-1',
                  hideText ? (big ? 'py-2 px-2.5' : 'py-1.5 px-2') : '',
                  small ? 'h-8' : ''
                )}
              >
                <FilterIcon className={cn('w-4 h-4 mr-1 secondary-svg', hideText && 'mr-0')} />
                {hideText ? null : t('filters')}
              </button>
            )
          }
          CommandItems={({
            closeComboBox,
            setPages,
            setExtendWidthOnCustomPage,
            setOnlyDisplayCustomPage,
          }) => {
            return (
              <CommandGroup>
                {availableFilterData.map((filter) => {
                  if (!checkIfFilterShouldBeShown(filter)) {
                    return null
                  }

                  return (
                    <CommandItem
                      onSelect={() => {
                        if (filter.paywall) {
                          setUpgradePlan({
                            plan: 'premium',
                            title: 'This feature is',
                          })
                          return
                        }
                        if (filter.type === 'boolean') {
                          addFilter(
                            filter.backendValue,
                            filter?.multiSelectable,
                            'true',
                            'is',
                            uuid()
                          )
                          closeComboBox()
                        } else if (
                          filter.type === 'selectable' ||
                          filter.type === 'oneSelectable'
                        ) {
                          setActiveViewUuid(uuid())
                          setPages((prev) => [...prev, filter.name])
                        } else if (filter.type === 'date') {
                          setPages((prev) => [...prev, filter.name])
                          setOnlyDisplayCustomPage(true)
                          setExtendWidthOnCustomPage('w-[278px]')
                        } else if (filter.type === 'boolean') {
                          closeComboBox()
                        }
                      }}
                      key={filter.name}
                    >
                      <filter.icon className="w-4 h-4 mr-2 secondary-svg" />
                      {t(filter.key)}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          }}
          CustomPage={({ closeComboBox, setPages, activePage, setOnlyDisplayCustomPage }) => {
            const filter = availableFilterData.find((filter) => filter.name === activePage)

            if (!filter) return null

            if (filter.type === 'date') {
              return (
                <div className="pt-2.5">
                  <MainFilterDropdownDateOperator
                    filterText={filter.backendValue === 'e' ? 'ETA' : 'Created date'}
                    addFilter={addFilter}
                    closeComboBox={closeComboBox}
                    filter={filter}
                  />
                </div>
              )
            } else if (filter.key === 'author') {
              return (
                <TooltipProvider>
                  <CommandGroup>
                    <ActiveUserSearchResults
                      filterView={true}
                      setNewAuthor={(user?: ICustomer) => {
                        closeComboBox()
                        if (user) {
                          addFilter(
                            filter.backendValue,
                            filter?.multiSelectable,
                            user.id,
                            'is',
                            activeViewUuid
                          )
                        } else {
                          setOnlyDisplayCustomPage(false)
                        }
                      }}
                    ></ActiveUserSearchResults>
                  </CommandGroup>
                </TooltipProvider>
              )
            } else if (filter.key === 'company') {
              return (
                <TooltipProvider>
                  <CommandGroup>
                    <ActiveCompanySearchResults
                      onSelectCompany={(company) => {
                        closeComboBox()
                        if (company) {
                          addFilter(
                            filter.backendValue,
                            filter?.multiSelectable,
                            company.id,
                            'is',
                            activeViewUuid
                          )
                        }
                      }}
                    ></ActiveCompanySearchResults>
                  </CommandGroup>
                </TooltipProvider>
              )
            } else {
              if (filter.optionIdKey)
                return (
                  <CommandGroup>
                    {filter.options.map((option: any, index) => {
                      return (
                        <ActiveViewItem
                          key={option.id ? option.id : index}
                          setCreateNewSegmentOpen={setCreateNewSegmentOpen}
                          addFilter={(currentValue: string) => {
                            addFilter(
                              filter?.key === 'custom-field'
                                ? `${filter?.backendValue}${option?._id}`
                                : filter?.backendValue || filter.name,
                              filter?.multiSelectable,
                              filter?.key === 'custom-field'
                                ? option?.type === 'checkbox'
                                  ? 'true'
                                  : ''
                                : currentValue,
                              option.id === 'none' ? '!exists' : 'is',
                              activeViewUuid
                            )
                          }}
                          oneSelectable={filter.type === 'oneSelectable'}
                          index={index}
                          item={filter}
                          option={option}
                          setOpen={() => closeComboBox()}
                        />
                      )
                    })}
                  </CommandGroup>
                )
              else return null
            }
          }}
          popoverContentProps={{
            align: reverseDropdownDirection ? 'start' : 'end',
          }}
          allowNewCreation={false}
          searchableDisplayName={'filter'}
        />
      </div>
    ),
    [activeViewUuid, createNewSegmentOpen]
  )
}

export default MainFilterDropdown
