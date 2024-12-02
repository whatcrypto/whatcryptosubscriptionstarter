import React, { useEffect } from 'react'
import {
  BriefcaseIcon,
  CheckIcon,
  CubeIcon,
  UserGroupIcon,
  UserIcon,
  XIcon,
} from '@heroicons/react/solid'
import ObjectID from 'bson-objectid'
import ModularComboBox from './radix/ModularComboBox'
import {
  CommandEmpty,
  CommandGroup,
  CommandHeading,
  CommandItem,
  CommandSeparator,
} from './radix/Command'
import { DatePicker } from './radix/DatePicker'
import { useCurrentOrganization, useUsedCustomFields } from '@/data/organization'
import MultiselectButton from './MultiselectButton'
import { cn } from '@/lib/utils'
import { SingleUserSegmentRule } from '@/interfaces/IOrganization'

const initialPropertyValues = [
  'Company Created',
  'Company ID',
  'Monthly Recurring Revenue',
  'Company Name',
  'User Created',
  'User ID',
  'User Email',
  'User Name',
  'User Role',
]

export const stringComparator = [
  'is',
  'is not',
  'is not null',
  'is null',
  'contains',
  'does not contain',
]
export const dateComparator = ['after date', 'before date', 'is not null', 'is null', 'on date']

export const numberComparator = [
  'greater than',
  'is',
  'is not',
  'is not null',
  'is null',
  'less than',
]
export const stringArrayComparator = ['is one of', 'is not in']

interface SegmentItemProps {
  rule: SingleUserSegmentRule
  index: number
  onChange: (index: number, newRule: SingleUserSegmentRule) => void
  onRemove: (index: string) => void
}
interface PropertyTypes {
  [key: string]: string
}

export const propertyTypes: PropertyTypes = {
  'companies.createdAt': 'date',
  'companies.id': 'string',
  'companies.monthlySpend': 'number',
  'companies.name': 'string',
  createdAt: 'date',
  userId: 'string',
  email: 'string',
  name: 'string',
  roles: 'string[]',
}

const fieldDisplayValues: { [key: string]: string } = {
  'companies.createdAt': 'Company Created',
  'companies.id': 'Company ID',
  'companies.monthlySpend': 'Monthly Recurring Revenue',
  'companies.name': 'Company Name',
  createdAt: 'User Created',
  userId: 'User ID',
  email: 'User Email',
  name: 'User Name',
  roles: 'User Role',
}

const fieldValues = {
  'Company Created': 'companies.createdAt',
  'Company ID': 'companies.id',
  'Monthly Recurring Revenue': 'companies.monthlySpend',
  'Company Name': 'companies.name',
  'User Created': 'createdAt',
  'User ID': 'userId',
  'User Email': 'email',
  'User Name': 'name',
  'User Role': 'roles',
}

const determineAndReturnComparator = (valueType: string) => {
  if (valueType === 'string') {
    return stringComparator
  } else if (valueType === 'date') {
    return dateComparator
  } else if (valueType === 'number') {
    return numberComparator
  } else if (valueType === 'string[]') {
    return stringArrayComparator
  }
}

const SegmentItem: React.FC<SegmentItemProps> = ({ rule, index, onChange, onRemove }) => {
  const [propertyValue, setPropertyValue] = React.useState<string>(rule.field || 'Select property')
  const [valueType, setValueType] = React.useState(rule.fieldType || 'string')

  const [comparatorValue, setComparatorValue] = React.useState<any>(rule.rule || 'Select filter')
  const [value, setValue] = React.useState<any>(rule.value || '')

  const id = rule['_id'] || new ObjectID().toString()

  const { org } = useCurrentOrganization()

  const { usedCustomFields } = useUsedCustomFields()

  const handleTextValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  useEffect(() => {
    if (propertyValue !== 'Select property') {
      onChange(index, {
        _id: id,
        field: propertyValue,
        fieldType: valueType,
        value: value,
        rule: comparatorValue,
      } as any)
    }
  }, [propertyValue, valueType, comparatorValue, value])

  // Define a mapping from property values to their types.
  useEffect(() => {
    const type = propertyTypes[propertyValue] || 'string'
    setValueType(type as 'string' | 'number' | 'date')
  }, [propertyValue])

  return (
    <div className="relative grid w-full grid-cols-12 gap-2 mt-2">
      <div className="col-span-4 ">
        <ModularComboBox
          TriggerButton={() => (
            <button className={cn('combobox-button bg-gray-50/50')}>
              <span
                className={`w-[150px]  font-medium ${
                  propertyValue === 'Select property'
                    ? 'text-background-accent/60 dark:text-foreground/60'
                    : 'text-gray-500 dark:text-foreground'
                }  flex items-center`}
              >
                <p className="truncate">
                  {(fieldDisplayValues?.[propertyValue] || propertyValue)
                    ?.replace('companies.customFields.', '')
                    ?.replace('customFields.', '')}
                </p>
              </span>
            </button>
          )}
          CommandItems={({ closeComboBox }) => {
            return (
              <>
                <CommandGroup
                  heading={<CommandHeading icon={<UserGroupIcon />} text="Main Properties" />}
                >
                  {initialPropertyValues
                    ?.filter((item) => item !== propertyValue)
                    ?.map((value) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          setPropertyValue(fieldValues[value as keyof typeof fieldValues] || value)
                          if (
                            propertyTypes[
                              fieldValues[value as keyof typeof fieldValues] || value
                            ] !== valueType
                          ) {
                            setComparatorValue('Select filter')
                            setValue('')
                          }
                          closeComboBox()
                        }}
                      >
                        {value}
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup
                  className=""
                  heading={<CommandHeading icon={<UserIcon />} text="User custom fields" />}
                >
                  {usedCustomFields?.userCustomFields
                    ?.filter((item) => item !== propertyValue)
                    ?.map((value) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          setPropertyValue('customFields.' + value)
                          setValueType('string')
                          if (propertyTypes[value] !== valueType) {
                            setComparatorValue('Select filter')
                            setValue('')
                          }
                          closeComboBox()
                        }}
                      >
                        {value}
                      </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup
                  className="-mt-1 border-t"
                  heading={<CommandHeading icon={<BriefcaseIcon />} text="Company custom fields" />}
                >
                  {usedCustomFields?.companyCustomFields
                    ?.filter((item) => item !== propertyValue)
                    ?.map((value) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          setPropertyValue('companies.customFields.' + value)
                          setValueType('string')
                          if (propertyTypes[value] !== valueType) {
                            setComparatorValue('Select filter')
                            setValue('')
                          }
                          closeComboBox()
                        }}
                      >
                        {value}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </>
            )
          }}
          popoverContentProps={{
            align: 'start',
          }}
          allowNewCreation={false}
          searchableDisplayName="property"
        />
      </div>
      {propertyValue !== 'Select property' ? (
        <div className="col-span-3">
          <ModularComboBox
            TriggerButton={() => (
              <button className="mr-2 combobox-button bg-gray-50/50">
                <span
                  className={` ${
                    comparatorValue === 'Select filter'
                      ? 'text-background-accent/60 dark:text-foreground/60'
                      : 'text-gray-500 dark:text-foreground'
                  } w-[115px] font-medium text-gray-500 dark:text-foreground flex items-center`}
                >
                  <p className="truncate">{comparatorValue}</p>
                </span>
              </button>
            )}
            CommandItems={({ closeComboBox }) => {
              return (
                <CommandGroup>
                  {determineAndReturnComparator(valueType)
                    ?.filter((item) => item !== comparatorValue)
                    ?.map((value) => (
                      <CommandItem
                        value={value}
                        key={value}
                        onSelect={() => {
                          setComparatorValue(value)
                          closeComboBox()
                        }}
                      >
                        {value}
                      </CommandItem>
                    ))}
                </CommandGroup>
              )
            }}
            popoverContentProps={{
              align: 'start',
            }}
            allowNewCreation={false}
            searchableDisplayName="filter"
          />
        </div>
      ) : null}
      {comparatorValue !== 'Select filter' &&
        comparatorValue !== 'is not null' &&
        comparatorValue !== 'is null' && (
          <div className="w-full col-span-4">
            {!Array.isArray(value) ? (
              <>
                {valueType === 'string' && comparatorValue !== 'Select filter' ? (
                  <input value={value} onChange={handleTextValueChange} placeholder="Value" />
                ) : null}
                {valueType === 'number' && comparatorValue !== 'Select filter' ? (
                  <input value={value} onChange={handleTextValueChange} placeholder="Value" />
                ) : null}
                {valueType === 'date' && comparatorValue !== 'Select filter' ? (
                  <DatePicker
                    selected={value ? new Date(value) : undefined}
                    onSelect={(date) => {
                      setValue(date.toString())
                    }}
                    buttonClasses="w-full combobox-button !text-foreground bg-gray-50/50 shadow-none text-left justify-start"
                  />
                ) : null}
              </>
            ) : null}

            {/* @ts-ignore */}
            {valueType === 'string[]' && propertyValue === 'roles' ? (
              <ModularComboBox
                TriggerButton={() => (
                  <MultiselectButton
                    customBadge={
                      value &&
                      value?.length > 1 && (
                        <span className="ml-auto text-xs bg-dark-accent px-1.5 py-0.5 rounded-md inline-block">
                          +{value?.length - 1}
                        </span>
                      )
                    }
                    className={cn(
                      'combobox-button bg-gray-50/50 py-1.5 dark:shadow-none w-full font-medium text-gray-500 dark:text-foreground flex items-center text-sm'
                    )}
                    // icon={<UserGroupIcon className="secondary-svg mr-1.5" />}
                  >
                    {value?.length === 0 || !value
                      ? undefined
                      : `${org.roles?.find((role) => role.id === value?.[0])?.role}`}
                    {/* {data?.allowedSegmentIds && data?.allowedSegmentIds?.length > 1 && (
                <span className="ml-auto bg-dark-accent px-1.5 py-0 rounded-md inline-block">
                  +{data?.allowedSegmentIds?.length - 1}
                </span>
              )} */}
                  </MultiselectButton>
                  // <button className="mr-2 combobox-button">
                  //   <span
                  //     className={` ${
                  //       comparatorValue === 'Select filter'
                  //         ? 'text-background-accent/60 dark:text-foreground/60'
                  //         : 'text-gray-500 dark:text-foreground'
                  //     } w-[115px] font-medium text-gray-500 dark:text-foreground flex items-center`}
                  //   >
                  //     <p className="truncate">{value}</p>
                  //   </span>
                  // </button>
                )}
                CommandItems={({ closeComboBox }) => {
                  return (
                    <CommandGroup>
                      {org.roles.map((role) => (
                        <CommandItem
                          key={role.id}
                          onSelect={() => {
                            let newRoleIds = value || []

                            if (!Array.isArray(newRoleIds)) {
                              newRoleIds = []
                            }

                            if (newRoleIds.includes(role.id)) {
                              newRoleIds = newRoleIds?.filter((id: string) => id !== role.id)
                            } else {
                              newRoleIds = [...newRoleIds, role.id]
                            }

                            setValue(newRoleIds)

                            // closeComboBox()
                          }}
                        >
                          {value?.includes(role.id) && (
                            <CheckIcon className="mr-1.5 secondary-svg" />
                          )}
                          {role.role}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )
                }}
                popoverContentProps={{
                  align: 'start',
                }}
                allowNewCreation={false}
                searchableDisplayName="filter"
              />
            ) : null}
          </div>
        )}
      {propertyValue !== 'Select property' && comparatorValue !== 'Select filter' && (
        <button
          className="col-span-1 dashboard-secondary dashboard-border dark:bg-transparent dark:shadow-none"
          onClick={() => id && onRemove(id)}
        >
          <XIcon className="w-5 h-5 mx-auto secondary-svg" />
        </button>
      )}
    </div>
  )
}

export default SegmentItem
