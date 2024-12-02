import { useMembers, useCurrentOrganization, useFilters } from '@/data/organization'
import { ISubmissionFilters } from '@/interfaces/ISubmission'
import { XIcon, PuzzleIcon } from '@heroicons/react/solid'
import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { getAvailableFilterData } from './MainFilterDropdown'

import { defaultFilters, postsFilterAtom } from '@/atoms/dashboardAtom'
import { cn, objectToMongooseQueryString } from '@/lib/utils'
import { useAtom } from 'jotai'
import { updateFilter } from 'network/lib/organization'
import { useRouter } from 'next/router'
import { toast } from 'sonner'
import FilterTabElement from './FilterTabElement'
import FilterTabView from './FilterTabView'
import { useUser } from '@/data/user'
import CreateSegments from './CreateSegments'
import { isMember } from '@/lib/acl'
import { activeFilterExistsAtom } from '@/atoms/submissionAtom'

// ActiveFilterTab component for managing and displaying active filters
const ActiveFilterTab: React.FC<{
  activeFilters: any[]
  setActiveFilters: (update: SetStateAction<ISubmissionFilters>) => void
  publicBoard?: boolean
  roadmap?: boolean
  categoryIds?: string[]
  customActiveStyle?: string
  useLocalMainFilters?: boolean
}> = ({
  activeFilters,
  setActiveFilters,
  publicBoard,
  roadmap,
  categoryIds,
  customActiveStyle,
  useLocalMainFilters = false,
}) => {
  // Hooks for fetching organization data, members, and filters
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const { members } = useMembers(isMember(user?.id, org))
  const {
    filterData: filters,
    isDataLoading: loading,
    mutate,
    rawData,
  } = useFilters(isMember(user?.id, org))
  const [mainFiltersAtomValue, setMainFiltersAtomValue] = useAtom(postsFilterAtom)
  const [mainFiltersLocal, setMainFiltersLocal] = useState(defaultFilters)

  const mainFilters = useMemo(() => {
    return useLocalMainFilters ? mainFiltersLocal : mainFiltersAtomValue
  }, [mainFiltersLocal, mainFiltersAtomValue, useLocalMainFilters])

  const setMainFilters = (value: any) => {
    setMainFiltersLocal(value)
    setMainFiltersAtomValue(value)
  }

  // const [localMainFilters, setLocalMainFilters] = useState(mainFilters)
  // State for managing filter creation and active view ID
  const [createFilter, setCreateFilter] = useState(false)
  const [activeViewId, setActiveViewId] = useState<string>('')
  const [queryViewId, setQueryViewId] = useState<string>('')
  const [createNewSegmentOpen, setCreateNewSegmentOpen] = useState(false)
  const [activeFilterExistsAtomValue, setActiveFilterExistsAtom] = useAtom(activeFilterExistsAtom)
  const [activeFilterExists, setActiveFilterExists] = useState(false)

  useEffect(() => {
    if (activeFilterExistsAtomValue !== activeFilterExists) {
      setActiveFilterExistsAtom(activeFilterExists)
    }
  }, [activeFilterExists, activeFilterExistsAtomValue])

  // Router for managing URL query parameters
  const router = useRouter()
  useEffect(() => {
    // Set queryViewId from the URL query parameter 'view'
    if (router.query?.view) {
      const view = router.query.view
      setQueryViewId(view?.toString())
    }
  }, [router.query])

  // Set activeViewId from queryViewId and reset queryViewId
  useEffect(() => {
    if (queryViewId && activeFilters) {
      setActiveViewId(queryViewId)
      setQueryViewId('')
    }
  }, [activeFilters, queryViewId])

  // Reset activeViewId if there are no active filters
  useEffect(() => {
    if (!activeFilters && activeViewId && !publicBoard) {
      setActiveViewId('')
    }
  }, [activeViewId, activeFilters, publicBoard])

  const getCustomFieldType = (type: string) => {
    switch (type) {
      case 'checkbox':
        return 'boolean'
      case 'select':
        return 'selectable'
      case 'multi-select':
        return 'selectable'
      default:
        return type
    }
  }

  // Memoized filter elements to optimize rendering
  const filterElements = useMemo(() => {
    return activeFilters?.map((filter, index) => {
      const availableFilters = getAvailableFilterData(org, members)

      let initialFilter = null

      if (filter.type.startsWith('cf-')) {
        // Custom field filter
        const fieldId = filter.type.slice(3) // Extract the ObjectId
        const customField = org.customInputFields?.find((field) => field._id === fieldId)

        if (customField) {
          initialFilter = {
            name: customField.label,
            key: customField.label,
            backendValue: filter.type,
            type: getCustomFieldType(customField.type),
            multiSelectable: customField.type === 'multi-select' || customField.type === 'select',
            options:
              // @ts-ignore
              customField.options?.map((option) => ({
                label: option.label,
              })) || [],
            optionIdKey: 'label',
            getItemName: (value: any) => value.label,
            icon: PuzzleIcon,
            getItemFromId: (id: string) =>
              // @ts-ignore
              customField.options?.find((option) => option.label === id),
            paywall: false,
          }
        }
      } else {
        // Standard filter
        initialFilter = availableFilters.find((avfilter) => avfilter.backendValue === filter.type)
      }

      if (!initialFilter) return null

      // Omit filters based on certain conditions (e.g., publicBoard, roadmap, etc.)
      if (
        publicBoard &&
        filter.type === 'b' &&
        !filter.userGenerated &&
        activeFilters.filter((filter) => filter.type === 'b').length === 1 &&
        activeFilters
          .filter((filter) => filter.type === 'b')
          .every((filter) => filter.values?.length === 1) &&
        initialFilter.backendValue === 'b'
      )
        return null

      if (
        roadmap &&
        filter.type === 'b' &&
        filter.operator === 'is not' &&
        !filter.userGenerated &&
        filter.values?.every((item: any) => categoryIds?.includes(item))
      )
        return null

      // Hide default tag for specific organizations (e.g., 'rolla' board)
      if (
        org.name === 'rolla' &&
        !filter.userGenerated &&
        filter.type === 't' &&
        filter?.values?.length === 1 &&
        publicBoard
      )
        return null

      return (
        <FilterTabElement
          initialFilter={initialFilter}
          roadmap={roadmap ?? false}
          setActiveFilters={setActiveFilters}
          key={filter.id}
          filter={filter}
          index={index}
          publicBoard={publicBoard}
          setCreateNewSegmentOpen={setCreateNewSegmentOpen}
        />
      )
    })
  }, [activeFilters, members, org])

  useEffect(() => {
    setActiveFilterExists(filterElements?.some((item) => item !== null))
  }, [filterElements])

  const updateCurrentSavedFilter = () => {
    if (activeViewId) {
      const view = filters?.find((filter) => filter.id === activeViewId)
      if (view) {
        updateFilter({
          description: view.description ?? '',
          filter: objectToMongooseQueryString(activeFilters, {
            sortBy: mainFilters.sortBy,
            inReview: mainFilters.inReview,
            q: mainFilters.q,
          }).backendQuery,
          isPrivate: view.isPrivate,
          title: view.title,
          id: view.id,
        })
          .then((res) => {
            if (res?.data?.filter) {
              toast.success('View successfully saved')
              mutate(
                {
                  ...rawData,
                  filters: filters.map((item) => {
                    if (item.id === activeViewId) {
                      return res.data.filter
                    } else {
                      return item
                    }
                  }),
                },
                false
              )
            }
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message)
          })
      }
    }
  }

  return (
    <div
      className={cn(
        // Conditional styling based on whether active filters exist and the type of board
        activeFilterExists
          ? ` ${
              customActiveStyle
                ? customActiveStyle
                : publicBoard || roadmap
                ? 'pb-0 pt-2.5'
                : 'p-4 bg-gray-50/30 dark:bg-secondary/30 border-b dark:border-border/60 border-gray-100/60 dashboard-padding '
            }`
          : 'hidden'
      )}
    >
      {!publicBoard && !roadmap && (
        <FilterTabView
          filters={filters}
          loading={loading}
          mutate={mutate}
          activeView={activeViewId}
          activeFilters={activeFilters}
          createFilterModalOpen={createFilter}
          setCreateFilterModalOpen={setCreateFilter}
          filtersExist={activeFilterExists}
          setActiveViewId={setActiveViewId}
          mainFilters={mainFilters}
          rawData={rawData}
          setMainFilters={setMainFilters}
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        {filterElements}
        {activeFilterExists && !publicBoard && !roadmap && (
          <div className="flex items-center gap-2 ml-auto">
            {!activeViewId && (
              <button
                onClick={() => {
                  setMainFilters({
                    sortBy: 'date:desc',
                    advancedFilters: [],
                  })
                  setActiveFilters({
                    sortBy: 'date:desc',
                    advancedFilters: [],
                  })
                }}
                className="dashboard-secondary shadow-none bg-transparent ml-auto border-transparent dark:bg-transparent dark:border-transparent py-[6px] text-gray-400 text-xs dark:shadow-none"
              >
                <XIcon className="w-5 h-5 secondary-svg" />
              </button>
            )}
            <button
              onClick={() => {
                activeViewId ? updateCurrentSavedFilter() : setCreateFilter(true)
              }}
              className="dashboard-secondary py-[6px] text-gray-400 text-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="mr-1.5 seconday-svg"
              >
                <path d="M11.644 1.59a.75.75 0 01.712 0l9.75 5.25a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.712 0l-9.75-5.25a.75.75 0 010-1.32l9.75-5.25z" />
                <path d="M3.265 10.602l7.668 4.129a2.25 2.25 0 002.134 0l7.668-4.13 1.37.739a.75.75 0 010 1.32l-9.75 5.25a.75.75 0 01-.71 0l-9.75-5.25a.75.75 0 010-1.32l1.37-.738z" />
                <path d="M10.933 19.231l-7.668-4.13-1.37.739a.75.75 0 000 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 000-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 01-2.134-.001z" />
              </svg>
              {activeViewId ? 'Save changes' : 'Save filters'}
            </button>
          </div>
        )}
      </div>
      <CreateSegments open={createNewSegmentOpen} setOpen={setCreateNewSegmentOpen} />
    </div>
  )
}

export default ActiveFilterTab
