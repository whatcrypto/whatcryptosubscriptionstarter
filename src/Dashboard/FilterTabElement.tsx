import { ISubmissionFilters } from '@/interfaces/ISubmission'
import { cn } from '@/lib/utils'
import { PlusCircleIcon, XCircleIcon, XIcon, CubeIcon } from '@heroicons/react/solid'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import ActiveViewItem from './GenerateActiveView'
import { CommandGroup } from './radix/Command'
import ModularComboBox from './radix/ModularComboBox'
import { DatePicker } from './radix/DatePicker'
import { format } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { useTranslation } from 'next-i18next'
import { useCurrentOrganization } from '@/data/organization'
import { getIdentifiedUser } from 'network/lib/user'
import UserPicture from './UserPicture'
import ActiveUserSearchResults from './ActiveUserSearchResults'
import { ICustomer, ICustomerCompany } from '@/interfaces/IUser'
import { TooltipProvider } from './radix/Tooltip'
import { getCompanyById } from 'network/lib/organization'
import ActiveCompanySearchResults from './ActiveCompanySearchResults'
import {
  dateComparator,
  numberComparator,
  stringArrayComparator,
  stringComparator,
} from './SegmentItem'
import debounce from 'lodash/debounce'
import SimpleTooltip from './SimpleTooltip'

export const getOperatorDisplayValue = (
  t: any,
  operator: string,
  valueType: string,
  values?: any,
  initialFilter?: any
) => {
  if (valueType === 'boolean') {
    switch (operator) {
      case 'is':
        if (initialFilter?.key === 'custom-field') {
          return values?.[0] === 'true' ? 'Checked' : 'Not Checked'
        } else {
          return values?.[0] === 'true' ? 'True' : 'False'
        }
      case 'is not':
        if (initialFilter?.key === 'custom-field') {
          return values?.[0] === 'true' ? 'Not Checked' : 'Checked'
        } else {
          return values?.[0] === 'true' ? 'False' : 'True'
        }
      default:
        return operator
    }
  } else if (valueType === 'date') {
    switch (operator) {
      case 'is':
        return 'On'
      case 'ne':
      case 'is not':
        return 'Not on'
      case 'gte':
        return 'On or after'
      case 'lte':
        return 'On or before'
      case 'gt':
        return 'After'
      case 'lt':
        return 'Before'
      case '!exists':
        return 'Not set'
      default:
        return operator
    }
  } else {
    switch (operator) {
      case 'is':
        return t('is')
      case 'ne':
      case 'is not':
        return t('is-not')
      case 'exists':
        return 'Exists'
      case '!exists':
        return 'Not set'
      case 'gte':
        return 'Greater than or equal to'
      case 'lte':
        return 'Less than or equal to'
      case 'gt':
        return 'Greater than'
      case 'lt':
        return 'Less than'
      default:
        return operator
    }
  }
}

const determineAndReturnComparator = (valueType: string, allowNotExists?: boolean) => {
  if (valueType === 'string') {
    return ['is', 'is not', 'exists', '!exists']
  } else if (valueType === 'date') {
    return allowNotExists
      ? ['is', 'ne', 'gt', 'gte', 'lt', 'lte', '!exists']
      : ['is', 'ne', 'gt', 'gte', 'lt', 'lte']
  } else if (valueType === 'number') {
    return ['is', 'ne', 'gt', 'gte', 'lt', 'lte']
  } else if (valueType === 'string[]') {
    return ['in', 'ne', 'exists', '!exists']
  } else if (valueType === 'boolean') {
    return ['is', 'is not']
  } else {
    return ['is', 'is not']
  }
}

const FilterTabElement: React.FC<{
  filter: any
  index: number
  initialFilter: any
  roadmap: boolean
  setActiveFilters: (update: SetStateAction<ISubmissionFilters>) => void
  publicBoard?: boolean
  setCreateNewSegmentOpen?: React.Dispatch<React.SetStateAction<boolean>>
}> = ({
  filter,
  index,
  initialFilter,
  roadmap,
  setActiveFilters,
  publicBoard,
  setCreateNewSegmentOpen,
}) => {
  const { t } = useTranslation()
  const { org } = useCurrentOrganization()

  const [textInputValue, setTextInputValue] = useState(filter.values[0] || '')

  const debouncedUpdateActiveFilters = useMemo(
    () =>
      debounce((value) => {
        setActiveFilters((prev) => ({
          ...prev,
          advancedFilters: prev.advancedFilters.map((item: any) => {
            if (item.id === filter.id) {
              return {
                ...item,
                values: [value],
              }
            } else {
              return item
            }
          }),
        }))
      }, 500), // Adjust the debounce delay as needed
    [setActiveFilters, filter.id]
  )

  useEffect(() => {
    if (initialFilter.type === 'text' || initialFilter.type === 'number') {
      debouncedUpdateActiveFilters(textInputValue)
      // Cancel the debounced function on component unmount
      return () => {
        debouncedUpdateActiveFilters.cancel()
      }
    }
    // Only trigger when textInputValue changes
  }, [textInputValue])

  const firstItemName = useMemo(
    () =>
      filter.values[0] && initialFilter?.getItemFromId
        ? initialFilter?.getItemFromId(filter.values[0])
        : '',
    [filter.values, initialFilter]
  )

  const updateActiveFilters = (currentValue: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      advancedFilters: prev?.advancedFilters?.map((elem) => {
        if (elem.id === filter.id) {
          if (!initialFilter?.multiSelectable) {
            return {
              ...elem,
              values: [currentValue],
            }
          } else {
            return {
              ...elem,
              values: elem.values?.includes(currentValue)
                ? elem.values.filter((item: any) => item !== currentValue)
                : [...elem.values, currentValue],
            }
          }
        } else {
          return elem
        }
      }),
    }))
  }

  const changeOperator = (value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      advancedFilters: prev?.advancedFilters?.map((item: any) => {
        if (item.id === filter.id) {
          if (initialFilter.type === 'boolean') {
            return {
              ...item,
              values: item?.values?.[0] === 'true' ? ['false'] : ['true'],
            }
          }
          return {
            ...item,
            operator: value,
          }
        } else {
          return item
        }
      }),
    }))
  }

  const operators = determineAndReturnComparator(initialFilter.type, initialFilter.key === 'eta')

  return (
    <div
      key={filter.id}
      className={cn(
        'flex items-center text-xs font-medium  border rounded-md shadow-sm dark:shadow dark:bg-secondary'
      )}
    >
      <p className="flex items-center text-gray-400 dark:text-gray-100 gap-2 capitalize  px-2 py-1.5">
        {initialFilter && <initialFilter.icon className="flex-shrink-0 w-4 h-4 secondary-svg" />}
        <SimpleTooltip content={initialFilter.key?.length > 30 ? t(initialFilter.key) : null}>
          <span className={cn(initialFilter.key?.length > 30 && 'cursor-help')}>
            {t(initialFilter.key).slice(0, 30) + (t(initialFilter.key).length > 30 ? '...' : '')}
          </span>
        </SimpleTooltip>
      </p>
      {!initialFilter.hideOperator && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <p className="px-2 border-x text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-accent/40 cursor-pointer main-transition dark:text-foreground dark:border-border py-1.5">
              {getOperatorDisplayValue(
                t,
                filter.operator,
                initialFilter.type,
                filter?.values,
                initialFilter
              )}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className={initialFilter.type === 'date' ? 'w-40' : 'w-32'}
            align="start"
          >
            {operators?.map((operator: string) => (
              <DropdownMenuItem key={operator} onSelect={() => changeOperator(operator)}>
                {getOperatorDisplayValue(t, operator, initialFilter.type)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      {initialFilter.type !== 'boolean' &&
        filter.operator !== '!exists' &&
        filter.operator !== 'is null' &&
        filter.operator !== 'is not null' && (
          <div className="border-r dark:border-border">
            <TooltipProvider>
              {initialFilter.type === 'date' ? (
                <DatePicker
                  // oppositeAlign={roadmap}
                  selected={filter?.values?.[0] ? (new Date(filter?.values[0]) as Date) : undefined}
                  onSelect={(date) =>
                    setActiveFilters((prev) => ({
                      ...prev,
                      advancedFilters: prev?.advancedFilters?.map((item: any) => {
                        if (item.id === filter.id) {
                          return {
                            ...item,
                            values: [date.toISOString()],
                          }
                        } else {
                          return item
                        }
                      }),
                    }))
                  }
                  CustomButton={
                    <p className="py-1.5 px-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-dark-accent/40 cursor-pointer main-transition dark:text-foreground dark:border-border">
                      {filter.values?.[0]
                        ? format(new Date(filter.values[0]), 'MMM dd, yyyy').toString()
                        : 'Not selected'}
                    </p>
                  }
                />
              ) : initialFilter.type === 'number' ? (
                <input
                  type="number"
                  value={textInputValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setTextInputValue(value)
                  }}
                  className="py-1.5 px-2 text-xs text-gray-500 dark:text-foreground rounded-none border-0 dark:bg-transparent bg-transparent focus:outline-none"
                  placeholder={'Enter number'}
                />
              ) : initialFilter.type === 'text' ? (
                <input
                  type="text"
                  value={textInputValue}
                  onChange={(e) => {
                    const value = e.target.value
                    setTextInputValue(value)
                  }}
                  className="py-1.5 px-2 text-xs text-gray-500 dark:text-foreground rounded-none border-0 dark:bg-transparent bg-transparent focus:outline-none"
                  placeholder={'Enter text'}
                />
              ) : (
                <ModularComboBox
                  TriggerButton={() => (
                    <p className="inline-flex items-center px-2 dark:hover:bg-dark-accent/40  hover:bg-gray-50 cursor-pointer main-transition dark:text-foreground dark:border-border py-1.5">
                      {initialFilter.customNameDisplaying
                        ? initialFilter.customNameDisplaying(filter.values[0])
                        : firstItemName && initialFilter?.getItemName
                        ? initialFilter?.getItemName(firstItemName as any)
                        : 'Not selected'}
                      {filter.values.length > 1 ? (
                        <span className="ml-1.5 dark:text-foreground/80 text-foreground/80">
                          {' '}
                          (+{filter.values.length - 1})
                        </span>
                      ) : null}
                    </p>
                  )}
                  allowNewCreation={false}
                  searchableDisplayName={initialFilter.name?.toLowerCase()}
                  popoverContentProps={{
                    align: roadmap ? 'end' : 'start',
                  }}
                  CommandItems={({ closeComboBox, setOnlyDisplayCustomPage }) => {
                    return (
                      <CommandGroup>
                        {initialFilter.customSearchResults
                          ? initialFilter.customSearchResults(closeComboBox, updateActiveFilters)
                          : initialFilter.options?.map((option: any, index: number) => {
                              return (
                                <ActiveViewItem
                                  addFilter={(currentValue: string) =>
                                    updateActiveFilters(currentValue)
                                  }
                                  index={index}
                                  item={initialFilter}
                                  initialChecked={(() => {
                                    return filter.values?.includes(
                                      option[initialFilter.optionIdKey]
                                    ) as boolean
                                  })()}
                                  oneSelectable={!initialFilter?.multiSelectable}
                                  option={option}
                                  setCreateNewSegmentOpen={setCreateNewSegmentOpen}
                                  setOpen={() => closeComboBox()}
                                  key={
                                    initialFilter.optionIdKey
                                      ? option[initialFilter.optionIdKey]
                                      : index
                                  }
                                />
                              )
                            })}
                      </CommandGroup>
                    )
                  }}
                />
              )}
            </TooltipProvider>
          </div>
        )}
      <button
        onClick={() => {
          setActiveFilters((prev) => {
            const newAdvancedFilters = prev.advancedFilters.filter(
              (elem: any) => elem.id !== filter.id
            )
            let foundHiddenOrCompletedFilter = false

            if (!publicBoard)
              newAdvancedFilters.forEach((filter) => {
                if (filter.type === 's') {
                  if (
                    filter.values.some((value: any) => {
                      const foundType = org?.postStatuses?.find((status) => status.id === value)
                        ?.type
                      return foundType === 'completed' || foundType === 'canceled'
                    })
                  ) {
                    foundHiddenOrCompletedFilter = true
                  }
                }
              })

            return {
              ...prev,
              advancedFilters: prev.advancedFilters.filter((elem: any) => elem.id !== filter.id),
            }
          })
        }}
        className="px-2 py-2 cursor-pointer rounded-r-md hover:bg-gray-50 dark:hover:bg-dark-accent/40 main-transition dark:text-foreground unstyled-button"
      >
        <XIcon className="w-3 h-3 secondary-svg" />
      </button>
    </div>
  )
}

export default FilterTabElement

// export const FilterItems = ({ closeComboBox, initialFilter, updateActiveFilters, filter }: any) =>
//   React.useMemo(() => {
//     return (
//       <CommandGroup>
//         {initialFilter.options?.map((option: any, index: number) => {
//           return (
//             <ActiveViewItem
//               addFilter={(currentValue: string) => updateActiveFilters(currentValue)}
//               index={index}
//               item={initialFilter}
//               initialChecked={(() => {
//                 if (filter.type === 'stale' || filter.name === 'Author only') {
//                   return filter.values?.includes(option) as boolean
//                 } else {
//                   return filter.values?.includes(option[initialFilter.optionIdKey]) as boolean
//                 }
//               })()}
//               oneSelectable={!initialFilter?.multiSelectable}
//               option={option}
//               setOpen={() => closeComboBox()}
//               key={initialFilter.optionIdKey ? option[initialFilter.optionIdKey] : index}
//             />
//           )
//         })}
//       </CommandGroup>
//     )
//   }, [])
