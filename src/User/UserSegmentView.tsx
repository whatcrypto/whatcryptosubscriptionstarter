import React, { useEffect } from 'react'
import { Label } from './radix/Label'
import SegmentItem from './SegmentItem'
import { ArrowLeftIcon, PlusCircleIcon, TrashIcon, XIcon } from '@heroicons/react/solid'
import { deleteSegment, updateSegment, updateUserSegment } from '../../network/lib/organization'
import { KeyedMutator } from 'swr'
import ObjectID from 'bson-objectid'
import ConfirmationModal from './ConfirmationModal'
import {
  UserSegment,
  SingleUserSegmentRule,
  SegmentOperator,
  SegmentGroupMatchType,
} from '@/interfaces/IOrganization'
import { cn } from '@/lib'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { Button } from './radix/Button'
import Loader from './Loader'
import { toast } from 'sonner'

interface UserSegmentViewProps {
  selectedSegment: UserSegment
  setSelectedSegment: React.Dispatch<React.SetStateAction<UserSegment>>
  allData: UserSegment[]
  setPage: React.Dispatch<React.SetStateAction<string>>
  mutateCurrentOrg: KeyedMutator<any>
}

const UserSegmentView: React.FC<UserSegmentViewProps> = ({
  selectedSegment,
  setSelectedSegment,
  allData,
  setPage,
  mutateCurrentOrg,
}) => {
  const [openDeleteSegment, setOpenDeleteSegment] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  const handleRuleChange = (groupIndex: number, ruleIndex: number, rule: SingleUserSegmentRule) => {
    setSelectedSegment((prevState) => {
      let newSegmentGroups = [...prevState.segmentGroups]
      newSegmentGroups[groupIndex].rules[ruleIndex] = rule
      return {
        ...prevState,
        segmentGroups: newSegmentGroups,
      }
    })
  }

  const handleGroupMatchTypeChange = (groupIndex: number, matchType: SegmentGroupMatchType) => {
    setSelectedSegment((prevState) => {
      let newSegmentGroups = [...prevState.segmentGroups]
      newSegmentGroups[groupIndex].matchType = matchType
      return {
        ...prevState,
        segmentGroups: newSegmentGroups,
      }
    })
  }

  const handleOperatorChange = (operator: SegmentOperator) => {
    setSelectedSegment((prevState) => ({
      ...prevState,
      operator,
    }))
  }

  useEffect(() => {
    const needsUpdate = selectedSegment.segmentGroups.some((group) =>
      group.rules.every(
        (rule) =>
          rule.field &&
          rule.rule &&
          ((rule.rule !== 'is not null' && rule.rule !== 'is null' && rule.value) ||
            rule.rule === 'is not null' ||
            rule.rule === 'is null')
      )
    )

    if (needsUpdate) {
      setSelectedSegment((prevState: any) => {
        let newSegmentGroups = prevState.segmentGroups.map((group: any) => {
          const allRulesFilled = group.rules.every(
            (rule: any) =>
              rule.field &&
              rule.rule &&
              ((rule.rule !== 'is not null' && rule.rule !== 'is null' && rule.value) ||
                rule.rule === 'is not null' ||
                rule.rule === 'is null')
          )

          if (allRulesFilled) {
            return {
              ...group,
              rules: [
                ...group.rules,
                {
                  _id: new ObjectID().toString(),
                  field: '',
                  fieldType: 'string',
                  rule: '',
                  value: '',
                },
              ],
            }
          }
          return group
        })

        return {
          ...prevState,
          segmentGroups: newSegmentGroups,
        }
      })
    }
  }, [selectedSegment])

  const checkStringType = (value: string | string[] | number | Date) => {
    if (Array.isArray(value)) {
      return 'array'
    }

    // Check if the value is a valid number
    if (!isNaN(Number(value))) {
      return 'number'
    }
    // Check if the value is a valid date string
    if (typeof value === 'string' && !isNaN(Date.parse(value))) {
      return 'date'
    }

    // Default to 'string' if no other type matches
    return 'string'
  }

  const areSegmentsValid = () => {
    for (let group of selectedSegment.segmentGroups) {
      // Filter out empty rules
      const rulesToCheck = group.rules.filter((rule) => rule.field)

      for (let rule of rulesToCheck) {
        if (!rule.field || !rule.rule) {
          toast.error('Please complete all fields for every rule before saving.')
          return false
        }
        if (rule.rule !== 'is not null' && rule.rule !== 'is null' && !rule.value) {
          toast.error(
            'Please provide a value for every rule where rule is not "is not null" or "is null".'
          )
          return false
        }

        // Use zod to validate the value is the correct type.
        if (rule.rule !== 'is not null' && rule.rule !== 'is null') {
          const type = checkStringType(rule?.value || '')
          if (rule.fieldType === 'number' && type !== 'number') {
            toast.error('Please provide a number for the value.')
            return false
          }

          // @ts-ignore
          if (type === 'array' && rule?.value?.length === 0) {
            toast.error('Please provide a value for the rule.')
            return false
          }
        }
      }
    }
    return true
  }

  const handleSave = () => {
    if (!areSegmentsValid()) {
      return
    }

    setLoading(true)
    // Remove empty rules from each segment group
    const cleanedSegment = {
      ...selectedSegment,
      segmentGroups: selectedSegment.segmentGroups
        .map((group) => ({
          ...group,
          rules: group.rules.filter((rule) => rule.field && rule.rule),
        }))
        .filter((group) => group.rules.length > 0),
    }

    updateSegment(cleanedSegment)
      .then((res) => {
        toast.success('Segment saved successfully.')
        mutateCurrentOrg()
      })
      .catch((err) => {
        console.error('Error saving segment:', err)
        toast.error('Error saving segment: ' + err?.response?.data?.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleRemoveRule = (groupIndex: number, ruleId: string) => {
    setSelectedSegment((prevState) => {
      let newSegmentGroups = [...prevState.segmentGroups]
      newSegmentGroups[groupIndex].rules = newSegmentGroups[groupIndex].rules.filter(
        (rule) => rule['_id'] !== ruleId
      )
      return {
        ...prevState,
        segmentGroups: newSegmentGroups,
      }
    })
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSegment({
      ...selectedSegment,
      name: e.target.value,
    })
  }

  const handleRemoveSegment = () => {
    deleteSegment(selectedSegment['_id'])
      .then((res) => {
        toast.success('Segment removed successfully.')
        // @ts-ignore
        setSelectedSegment(undefined)
        setPage('main')
        mutateCurrentOrg()
      })
      .catch((err) => {
        console.error('Error removing segment:', err)
        toast.error('Error removing segment.')
      })
  }

  const addNewSegmentGroup = () => {
    setSelectedSegment(
      (prevState) =>
        (({
          ...prevState,

          segmentGroups: [
            ...prevState.segmentGroups,
            {
              _id: new ObjectID().toString(), // Add this line
              matchType: 'all' as SegmentGroupMatchType,
              rules: [
                {
                  _id: new ObjectID().toString(),
                  field: '',
                  fieldType: 'string',
                  rule: '',
                  value: '',
                },
              ],
            },
          ]
        }) as any)
    )
  }

  const handleDeleteGroup = (groupIndex: number) => {
    setSelectedSegment((prevState) => {
      let newSegmentGroups = [...prevState.segmentGroups]
      newSegmentGroups.splice(groupIndex, 1)
      return {
        ...prevState,
        segmentGroups: newSegmentGroups,
      }
    })
  }

  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-medium text-gray-600 dark:text-white">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6 mb-1 text-gray-200 dark:text-foreground/80"
        >
          <path
            fillRule="evenodd"
            d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
            clipRule="evenodd"
          />
          <path
            fillRule="evenodd"
            className="text-accent"
            d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
            clipRule="evenodd"
            fill="currentColor"
          />
        </svg>
        Create segment
      </h2>
      <div className="mt-1.5">
        <Label htmlFor="segment-name">Segment name</Label>
        <input
          id="segment-name"
          className="w-1/2 mt-1"
          type="text"
          onChange={onChange}
          value={selectedSegment.name}
        />
      </div>
      <div className="mt-3">
        <div className="mb-1.5">
          <Label htmlFor="segment-name">Rules</Label>
        </div>
        <div>
          {selectedSegment.segmentGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="relative">
              <div className="border-l pl-3 py-1.5">
                <div className="flex justify-between items-center pb-1">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'ghost'} className="z-10 text-[13px] py-0.5 px-1.5 -mx-1.5">
                        {group.matchType === 'all' ? (
                          <>
                            <span className="dark:text-gray-100 mr-1 font-semibold">ALL</span> of
                            the following rules
                          </>
                        ) : (
                          <>
                            <span className="dark:text-gray-100 mr-1 font-semibold">ANY</span> of
                            the following rules
                          </>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {group.matchType === 'any' && (
                        <DropdownMenuItem
                          onClick={() => handleGroupMatchTypeChange(groupIndex, 'all')}
                        >
                          ALL of the following rules
                        </DropdownMenuItem>
                      )}
                      {group.matchType === 'all' && (
                        <DropdownMenuItem
                          onClick={() => handleGroupMatchTypeChange(groupIndex, 'any')}
                        >
                          ANY of the following rules
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {selectedSegment.segmentGroups.length > 1 && (
                    <button
                      className="p-1 hover:bg-secondary"
                      onClick={() => handleDeleteGroup(groupIndex)}
                    >
                      <XIcon className="secondary-svg " />
                    </button>
                  )}
                </div>
                <div className="mt-1.5">
                  {group.rules.map((rule, ruleIndex) => (
                    <div key={rule['_id']} className={ruleIndex === 0 ? '-mt-1' : ''}>
                      <SegmentItem
                        onRemove={() => handleRemoveRule(groupIndex, rule['_id'])}
                        rule={rule}
                        index={ruleIndex}
                        onChange={(_, updatedRule) =>
                          handleRuleChange(groupIndex, ruleIndex, updatedRule)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
              {selectedSegment.segmentGroups.length > 1 && (
                <div className="py-3 w-full relative flex items-center justify-center">
                  <div className="w-full h-px bg-border absolute"></div>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <button className="bg-border/40 hover:bg-border/80 backdrop-blur-sm border z-10 text-xs p-1.5 px-2">
                        {selectedSegment.operator}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {selectedSegment.operator === 'OR' ? (
                        <DropdownMenuItem onClick={() => handleOperatorChange('AND')}>
                          AND
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleOperatorChange('OR')}>
                          OR
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          ))}
          <div
            className={cn(
              'flex items-center justify-center',
              selectedSegment.segmentGroups.length == 1 && 'mt-4'
            )}
          >
            <Button onClick={addNewSegmentGroup} variant={'ghost'} className="mx-auto">
              <PlusCircleIcon className="mr-1.5 secondary-svg" /> Add new segment group
            </Button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        callBack={handleRemoveSegment}
        title="Delete segment"
        description="Are you sure you want to delete this segment?"
        open={openDeleteSegment}
        setOpen={setOpenDeleteSegment}
        buttonTxt="Delete segment"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 mt-6">
        <div className="flex gap-2">
          <button onClick={() => setPage('main')} className="dashboard-secondary">
            <ArrowLeftIcon className="secondary-svg" />
          </button>
          <button onClick={() => setOpenDeleteSegment(true)} className="dashboard-secondary">
            <TrashIcon className="secondary-svg mr-1.5" /> Delete
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSave} className="dashboard-primary " disabled={loading}>
            {loading ? (
              <div className="h-4 w-4 mr-1.5">
                <Loader />
              </div>
            ) : null}
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserSegmentView
