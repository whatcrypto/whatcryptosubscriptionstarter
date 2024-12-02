import { useCurrentOrganization } from '@/data/organization'
import { ISubmissionSavedFilter } from '@/interfaces/IOrganization'
import { mongooseQueryStringToObject, objectToMongooseQueryString } from '@/lib/utils'
import {
  DotsHorizontalIcon,
  LockClosedIcon,
  PencilIcon,
  ShareIcon,
  TrashIcon,
} from '@heroicons/react/solid'
import { XIcon } from 'lucide-react'
import { createFilter, deleteFilter, updateFilter } from 'network/lib/organization'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'
import ConfirmationModal from './ConfirmationModal'
import CreateFilterModal from './CreateFilterModal'
import { updateFilters } from './FilterSyncer'
import Tooltip from './Tooltip'
import { CommandGroup, CommandItem } from './radix/Command'
import ModularComboBox from './radix/ModularComboBox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'

interface IFilterCreationAndUpdate {
  title: string
  description: string
  isPrivate: boolean
  filter: string
}

const FilterTabView: React.FC<{
  createFilterModalOpen: boolean
  activeView: string
  setCreateFilterModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  activeFilters: any[]
  setActiveViewId: React.Dispatch<React.SetStateAction<string>>
  filters: ISubmissionSavedFilter[]
  loading: boolean
  mutate: KeyedMutator<any>
  filtersExist: boolean
  mainFilters: any
  rawData: any
  setMainFilters: React.Dispatch<React.SetStateAction<any>>
}> = ({
  createFilterModalOpen,
  setCreateFilterModalOpen,
  activeFilters,
  activeView,
  setActiveViewId,
  filters,
  loading,
  mutate,
  filtersExist,
  mainFilters,
  rawData,
  setMainFilters,
}) => {
  const activeViewData = filters?.find((filter) => filter.id === activeView)

  const [confirmationModal, setConfirmationModal] = useState(false)

  const { org, mutateCurrentOrg } = useCurrentOrganization()

  const handleCreationAndUpdate = (data: IFilterCreationAndUpdate): Promise<void> => {
    return new Promise((resolve, reject) => {
      const commonSuccessActions = (res: any) => {
        if (res?.data?.filter) {
          toast.success('Filter created successfully')
          mutate(
            {
              ...rawData,
              filters: activeView
                ? filters.map((item) => (item.id === activeView ? res.data.filter : item))
                : [...filters, res.data.filter],
            },
            false
          )
          setActiveViewId(res.data.filter.id)
          mutateCurrentOrg()
          setCreateFilterModalOpen(false)
        }
        resolve()
      }

      if (activeView) {
        // Update
        updateFilter({
          description: data.description,
          filter: objectToMongooseQueryString(activeFilters, {
            sortBy: mainFilters.sortBy,
            inReview: mainFilters.inReview,
            q: mainFilters.q,
          }).backendQuery,
          isPrivate: data.isPrivate,
          title: data.title,
          id: activeView,
        })
          .then(commonSuccessActions)
          .catch((err) => {
            toast.error(err?.response?.data?.message)
            reject(err)
          })
      } else {
        // Create
        createFilter({
          description: data.description,
          filter: objectToMongooseQueryString(activeFilters, {
            sortBy: mainFilters.sortBy,
            inReview: mainFilters.inReview,
            q: mainFilters.q,
          }).backendQuery,
          isPrivate: data.isPrivate,
          title: data.title,
        })
          .then(commonSuccessActions)
          .catch((err) => {
            toast.error(err?.response?.data?.message)
            reject(err)
          })
      }
    })
  }

  const deleteCurrentFilter = () => {
    deleteFilter(activeView)
      .then((res) => {
        if (res?.data?.success) {
          toast.success('View deleted successfully')
          mutate(
            {
              ...rawData,
              filters: filters.filter((item) => item.id !== activeView),
            },
            false
          )
          setActiveViewId('')
          setCreateFilterModalOpen(false)
          mutateCurrentOrg()
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message)
      })
  }

  return (
    <div>
      {activeViewData && filtersExist && (
        <div className="flex items-center p-2 px-2 rounded-lg dark:border-border mb-3 bg-gray-50 dark:bg-secondary">
          <p className="flex flex-wrap items-center gap-3 text-sm dark:text-gray-100 text-gray-500 font-medium">
            <ModularComboBox
              allowNewCreation={false}
              searchableDisplayName="filter"
              CommandItems={({ closeComboBox }) => {
                return (
                  <CommandGroup>
                    {filters
                      ?.filter((view) => view.id !== activeView)
                      ?.map((view) => (
                        <CommandItem
                          value={view.title}
                          key={view.title}
                          onSelect={() => {
                            const newFilters = mongooseQueryStringToObject(view.filter)
                            const brandNewFilters = updateFilters(mainFilters, newFilters)

                            setMainFilters(brandNewFilters)

                            setActiveViewId(view.id)
                            closeComboBox()
                          }}
                        >
                          {view.isPrivate && (
                            <LockClosedIcon className="secondary-svg h-4 w-4 mr-1.5" />
                          )}
                          {view.title}
                        </CommandItem>
                      ))}
                  </CommandGroup>
                )
              }}
              TriggerButton={() => (
                <button className="dashboard-secondary text-[13px] dark:bg-secondary-foreground/5 dark:hover:bg-secondary-foreground/10 dark:border-secondary-foreground/5  dark:shadow-none flex items-center py-1 px-2 cursor-pointer main-transition rounded-md">
                  <svg
                    className="h-4 w-4 mr-2 secondary-svg"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                    <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                    <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
                  </svg>
                  {activeViewData?.title}
                </button>
              )}
              popoverContentProps={{
                align: 'start',
              }}
            />

            <span className="font-medium  text-sm dark:text-foreground">
              {activeViewData?.description}
            </span>
          </p>
          <div className="flex items-center gap-2 ml-auto">
            {activeViewData.isPrivate && (
              <Tooltip
                child={
                  <span className=" font-medium border-gray-100 text-sm dark:text-foreground text-gray-500 dark:border-border pl-3 ml-3 flex items-center">
                    <LockClosedIcon className="secondary-svg mr-1" />
                  </span>
                }
                dropDown={
                  <p className="text-xs text-gray-500 dark:text-foreground font-medium">
                    Private view - only shown to you
                  </p>
                }
              />
            )}
            <button
              onClick={() => {
                setActiveViewId('')
                setMainFilters({
                  sortBy: 'date:desc',
                  advancedFilters: [],
                })
              }}
              className="p-1 dashboard-secondary dark:bg-transparent bg-transparent dark:border-transparent dark:shadow-none border-transparent shadow-none"
            >
              <XIcon className="h-5 w-5 secondary-svg" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1 dashboard-secondary dark:bg-transparent bg-transparent dark:border-transparent dark:shadow-none border-transparent shadow-none">
                  <DotsHorizontalIcon className="h-5 w-5 secondary-svg" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onSelect={() => setCreateFilterModalOpen(true)}>
                  <PencilIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                  Edit view
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    // Copy it in the clipboard as
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(
                        'https://' +
                          org.name +
                          '.featurebase.app/dashboard/posts' +
                          '?view=' +
                          activeViewData.id
                      )

                      toast.success('Copied to clipboard')
                    }
                  }}
                >
                  <ShareIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                  Share view
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setConfirmationModal(true)}>
                  <TrashIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                  Delete view
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      <ConfirmationModal
        open={confirmationModal}
        setOpen={setConfirmationModal}
        buttonTxt="Delete view"
        title={`Are you sure you want to delete ${activeViewData?.title} view?`}
        description="This action can not be undone and these posts will be permanently deleted from our servers!"
        callBack={() => deleteCurrentFilter()}
      />
      <CreateFilterModal
        open={createFilterModalOpen}
        activeViewData={activeViewData}
        setOpen={setCreateFilterModalOpen}
        handleCreationAndUpdate={handleCreationAndUpdate}
      />
    </div>
  )
}

export default FilterTabView
