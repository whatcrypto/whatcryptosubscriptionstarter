import React, { SetStateAction, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  CUSTOM_FIELD_REGEX,
  getPathFromAsPath,
  mongooseQueryStringToObject,
  objectToMongooseQueryString,
} from '@/lib/utils'
import { ISubmissionFilters } from '@/interfaces/ISubmission'
import { QueryEntry } from './MainFilterDropdown'
import { useCurrentOrganization } from '@/data/organization'
import { getFilters } from 'network/lib/organization'
import { ISubmissionSavedFilter } from '@/interfaces/IOrganization'
import { toast } from 'sonner'
import { useAtom } from 'jotai'
import { createPostAtom } from '@/atoms/displayAtom'
import { ALLOWED_PARAMS } from '@/lib/utils'

const combineSimilarStatuses = (advancedFilters: any) => {
  return advancedFilters.reduce((acc: any, curr: any) => {
    // Check if a filter with the same type and operator already exists in acc
    const existingFilter = acc.find(
      (item: any) => item.type === curr.type && item.operator === curr.operator
    )

    if (existingFilter) {
      // Merge values if filter already exists
      existingFilter.values = Array.from(new Set([...existingFilter.values, ...curr.values]))
    } else {
      // Add the new filter if it doesn't already exist
      acc.push(curr)
    }

    return acc
  }, [])
}

export const updateFilters = (
  prevFilters: ISubmissionFilters,
  newAdvancedFilters: QueryEntry[],
  defaultFilters?: ISubmissionFilters | null
): ISubmissionFilters => {
  const sortByEntry = newAdvancedFilters.find((item) => item.type === 'sortBy')
  const inReviewEntry = newAdvancedFilters.find((item) => item.type === 'inReview')
  const query = newAdvancedFilters.find((item) => item.type === 'q')?.values[0] || ''

  if (defaultFilters) {
    // Remove existing filters with the same type and operator as any in newAdvancedFilters
    const filteredPrevAdvancedFilters = prevFilters.advancedFilters.filter(
      (prevFilter) =>
        !newAdvancedFilters.some(
          (newFilter) =>
            newFilter.type === prevFilter.type && newFilter.operator === prevFilter.operator
        )
    )

    return {
      ...prevFilters,
      advancedFilters: [
        ...filteredPrevAdvancedFilters,
        ...newAdvancedFilters.filter(
          (item) => !['sortBy', 'inReview', 'q', 'includePinned'].includes(item.type)
        ),
      ],
      sortBy: sortByEntry ? sortByEntry.values[0] : defaultFilters.sortBy,
      inReview: inReviewEntry ? inReviewEntry.values[0] === 'true' : undefined,
      includePinned: defaultFilters?.includePinned ? true : false,
      q: query || undefined,
    }
  } else {
    return {
      ...prevFilters,
      advancedFilters: newAdvancedFilters,
    }
  }
}

const FilterSyncer: React.FC<{
  setFilters: (update: SetStateAction<ISubmissionFilters>) => void
  filters: ISubmissionFilters
  setActiveFilterURI: React.Dispatch<React.SetStateAction<string>>
  defaultFilters?: ISubmissionFilters
  setSearchQuery?: React.Dispatch<React.SetStateAction<string | undefined>>
  noCache?: boolean
  hideCompletedAndCancelled: boolean
  roadmap?: boolean
}> = ({
  setFilters,
  filters,
  setActiveFilterURI,
  defaultFilters,
  setSearchQuery,
  noCache,
  hideCompletedAndCancelled,
  roadmap,
}) => {
  const router = useRouter()
  const [initialRender, setInitialRender] = useState(true)
  const lastUrlFiltersRef = useRef<QueryEntry[] | undefined>(undefined)
  const { org } = useCurrentOrganization()
  const stringifiedActiveFilters = JSON.stringify(filters.advancedFilters)
  const [createPost, setCreatePost] = useAtom(createPostAtom)

  // useEffect for initializing filters on the initial render
  useEffect(() => {
    // Initialize filters from URL parameters or saved views
    if (router && router.query && initialRender) {
      // Check fi query parm includes createPost
      if (router?.query?.createPost) {
        setCreatePost(true)
      }
      if (router.query.view) {
        // Handling saved view filters
        getFilters()
          .then((res) => {
            // Find and apply the saved filter corresponding to the 'view' query parameter
            const savedFilters = res.data.filters || []
            const filter = savedFilters.find(
              (item: ISubmissionSavedFilter) => item.id === router.query.view
            )
            if (filter) {
              // Update the filters based on the saved filter and set them in the state
              const newFilters = mongooseQueryStringToObject(filter.filter)
              setInitialRender(false)
              if (JSON.stringify(newFilters) !== JSON.stringify(lastUrlFiltersRef.current)) {
                const brandNewFilters = updateFilters({ advancedFilters: [] }, newFilters, {
                  advancedFilters: [],
                })

                setFilters(brandNewFilters)
                lastUrlFiltersRef.current = newFilters
              }
            }
          })
          .catch((err) => {
            // Error handling for failed filter retrieval
            console.log(err)
            toast.error("Couldn't load view filters")
          })
      } else {
        // Handling URL query parameters
        const newFilters = mongooseQueryStringToObject(
          decodeURIComponent(router.asPath.split('?')[1])
        )

        setInitialRender(false)
        if (JSON.stringify(newFilters) !== JSON.stringify(lastUrlFiltersRef.current)) {
          // Update search query if it exists
          const query = newFilters.find((item) => item.type === 'q')?.values[0] || ''
          if (query && setSearchQuery) {
            setSearchQuery && setSearchQuery(query)
          }

          // Update the filters based on the URL query parameters
          const brandNewFilters = updateFilters(filters, newFilters, defaultFilters)
          setFilters(brandNewFilters)
          lastUrlFiltersRef.current = newFilters
        }
      }
    }
  }, [router, defaultFilters])

  // useEffect for updating the URL and application state based on filter changes
  useEffect(() => {
    if (stringifiedActiveFilters && !initialRender && filters.advancedFilters) {
      const queryString = objectToMongooseQueryString(
        filters.advancedFilters,
        {
          sortBy: filters.sortBy,
          inReview: filters.inReview,
          includePinned: filters.includePinned,
          searchByComments: filters.searchByComments,
          q: filters.q,
          id: filters.id,
        },
        defaultFilters,
        org,
        hideCompletedAndCancelled,
        roadmap
      )

      setActiveFilterURI(queryString.backendQuery + (noCache ? '&_=' + new Date().getTime() : ''))

      // Parse current and new query parameters
      const currentQuery = new URLSearchParams(router.asPath.split('?')[1] || '')
      const newQuery = new URLSearchParams(queryString.frontendQuery)

      // Create a new URLSearchParams object for the final query
      const finalQuery = new URLSearchParams()

      // Add all allowed non-filter params from the current query
      for (const [key, value] of currentQuery.entries()) {
        // Remove non-alphabetic characters from the beginning of the key
        const cleanKey = key.replace(/^[^a-zA-Z]+/, '')

        const baseKey = ALLOWED_PARAMS.find((param) => cleanKey.startsWith(param))

        if (!baseKey && key !== 'jwt' && !CUSTOM_FIELD_REGEX.test(key)) {
          finalQuery.append(key, value)
        }
      }

      // Add all new filter params
      for (const [key, value] of newQuery.entries()) {
        finalQuery.set(key, value)
      }

      const mergedQueryString = finalQuery.toString()

      if (router.asPath.split('?')[1] !== mergedQueryString) {
        router.push(
          getPathFromAsPath(router.asPath) + (mergedQueryString ? '?' + mergedQueryString : ''),
          undefined,
          {
            shallow: true,
          }
        )
      }
    }
  }, [
    stringifiedActiveFilters,
    initialRender,
    filters.sortBy,
    filters.q,
    filters.inReview,
    filters.id,
    hideCompletedAndCancelled,
    roadmap,
  ])

  return <div></div>
}

export default FilterSyncer
