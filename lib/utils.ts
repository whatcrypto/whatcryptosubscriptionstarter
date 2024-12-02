import { IOrganization, IRoadmapDocument } from '@/interfaces/IOrganization'
import { IAdmin, ICustomer } from '@/interfaces/IUser'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { sanitizeHTML } from './contentSanitizer'
import { defaultFetcher } from 'network/apiClient'
import { KeyedMutator, SWRConfiguration } from 'swr/dist/types'
import { QueryEntry } from '@/components/MainFilterDropdown'
import { v4 as uuid } from 'uuid'
import { ISubmission, ISubmissionFilters, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { getFilterValue } from '@/pages'
import { GetServerSidePropsContext } from 'next'
import { SetStateAction } from 'react'
import { performSubmissionMutation } from './submissionMutator'
import { updateSubmissionInfo } from 'network/lib/submission'
import { toast } from 'sonner'
import { IntercomProps } from 'react-use-intercom'
import { isMember } from './acl'
import { z } from 'zod'
import { Editor } from '@tiptap/react'
import isURL from 'validator/lib/isURL'
import { Node } from '@tiptap/pm/model'
import { useCallback, useState } from 'react'
import {
  IHelpCenterArticleDocument,
  IHelpCenterCollectionDocument,
  IHelpCenterDocument,
  IHelpCenterIcon,
} from '@/interfaces/IHelpCenter'
import { createHelpdocs, createHelpdocsCollection } from 'network/lib/helpcenter'
import { utcToZonedTime } from 'date-fns-tz'
import { format, parseISO } from 'date-fns'
import { getBoardUrl } from '@/pages/widget/changelogPopup'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { availableLocales } from './localizationUtils'
import { updateFilters } from '@/components/FilterSyncer'
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const monthNames = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
]

export function isPlan(currentPlan: string, mustBePlan: string) {
  const planOrder = ['free', 'trial', 'pro', 'growth', 'premium', 'enterprise']
  // Treat 'pro_lifetime' as 'pro' for comparison purposes.
  if (currentPlan === 'pro_lifetime') {
    currentPlan = 'pro'
  }
  if (mustBePlan === 'pro_lifetime') {
    mustBePlan = 'pro'
  }
  const currentPlanIndex = planOrder.indexOf(currentPlan)
  const mustBePlanIndex = planOrder.indexOf(mustBePlan)
  if (currentPlanIndex === -1 || mustBePlanIndex === -1) {
    return false
  }
  return currentPlanIndex >= mustBePlanIndex
}

function parseInput(input: string): { period: string; year: number } {
  const monthOrQuarterRegex = /([\w']+)(?:\s|)'(\d{2})/
  const match = input.toLowerCase().match(monthOrQuarterRegex)

  if (!match) {
    throw new Error(`Invalid input: ${input}`)
  }

  const [, period, yearStr] = match
  const year = 2000 + parseInt(yearStr, 10)

  return { period, year }
}

function createUTCDate(year: number, month: number, day: number): string {
  return new Date(Date.UTC(year, month, day, 0, 0, 0, 0)).toISOString()
}

export function getEndDate(input: string): string {
  const { period, year } = parseInput(input)

  switch (period) {
    case 'q1':
      return createUTCDate(year, 2, 31) // March 31
    case 'q2':
      return createUTCDate(year, 5, 30) // June 30
    case 'q3':
      return createUTCDate(year, 8, 30) // September 30
    case 'q4':
      return createUTCDate(year, 11, 31) // December 31
    default:
      const monthIndex = monthNames.indexOf(period)
      if (monthIndex >= 0) {
        // Get the last day of the month
        const lastDay = new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate()
        return createUTCDate(year, monthIndex, lastDay)
      }
      throw new Error(`Invalid input: ${input}`)
  }
}

export function getStartDate(input: string): string {
  const { period, year } = parseInput(input)

  switch (period) {
    case 'q1':
      return createUTCDate(year, 0, 1) // January 1
    case 'q2':
      return createUTCDate(year, 3, 1) // April 1
    case 'q3':
      return createUTCDate(year, 6, 1) // July 1
    case 'q4':
      return createUTCDate(year, 9, 1) // October 1
    default:
      const monthIndex = monthNames.indexOf(period)
      if (monthIndex >= 0) {
        return createUTCDate(year, monthIndex, 1)
      }
      throw new Error(`Invalid input: ${input}`)
  }
}

export function getPlanName(plan: string) {
  plan = plan?.toLowerCase()
  if (plan === 'pro') return 'Starter'
  if (plan === 'pro_lifetime') return 'Starter'
  if (plan === 'growth') return 'Growth'
  if (plan === 'premium') return 'Business'
  return plan
}

export const defaultSWRConfig: SWRConfiguration = {
  fetcher: defaultFetcher,
  onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
    // Never retry on 404.
    if (error.status === 404) return

    // Only retry up to 5 times.
    if (retryCount >= 5) return

    // Increase retry delay exponentially.
    setTimeout(
      () => {
        revalidate({ retryCount })
      },
      Math.pow(2, retryCount) * 1000
    )
  },
  errorRetryInterval: 5000,
  shouldRetryOnError: false,
}

export const htmlContentParser = (content: string): string => {
  let modifiedParsedContent = sanitizeHTML(content)
  if (modifiedParsedContent) {
    modifiedParsedContent = modifiedParsedContent
      .replace(/<a.*?href="(.*?)".*?>(.*?)<\/a>/g, (match, src, text) => {
        let sanitizedText = sanitizeHTML(text)
        return `<a href="${src}" class="text-indigo-500 dark:text-indigo-300" target="_blank" rel="noreferrer">${sanitizedText}</a>`
      })
      .replace(/<iframe.*?src="(.*?)".*?<\/iframe>/g, (match, src) => {
        return `<iframe src="${src}" class="w-full h-96 rounded-xl shadow"></iframe>`
      })
  }
  return modifiedParsedContent || ''
}

// Define allowed parameters for the query
export const ALLOWED_PARAMS = [
  'sortBy',
  'inReview',
  'b', // 'board' / 'category'
  's', // 'status'
  'q', // 'query'
  'a', // 'assignee'
  't', // 'tag'
  'segment',
  'e', // 'eta'
  'd', // Date
  'stale',
  'authorOnly',
  'u', // Author id
  'c', // company id
  'view',
]

// Regular expression to match custom field keys (cf-<ObjectId>)
export const CUSTOM_FIELD_REGEX = /^cf-[0-9a-fA-F]{24}/

// Function to convert a Mongoose query string to an array of QueryEntry objects for frontend use
export function mongooseQueryStringToObject(queryString: string): QueryEntry[] {
  // Return an empty array if the queryString is 'undefined'
  if (queryString === 'undefined') {
    return []
  }

  const SKIP_PARAMS = ['mode']

  // Mapping string representations of operators to their logical equivalents
  const OPERATOR_MAP: Record<string, string> = {
    '!=': 'is not',
    '>=': 'gte',
    '<=': 'lte',
    '=': 'is',
    '>': 'gt',
    '<': 'lt',
  }

  // Sort the operators by length in descending order for correct identification in the string
  const sortedOperators = Object.keys(OPERATOR_MAP).sort((a, b) => b.length - a.length)

  // Initialize an array to store the converted query entries
  const entries: QueryEntry[] = []

  // Replace '+' with '%20' to handle spaces properly
  // This is because in URL encoding, spaces may be represented as '+'
  queryString = queryString.replace(/\+/g, '%20')

  // Split the queryString into individual conditions
  const conditions = queryString?.split('&') || []

  for (const condition of conditions) {
    let operator: string = ''
    let type: string = ''
    let values: string[] = []

    // Skip the condition if it's in SKIP_PARAMS
    if (SKIP_PARAMS.some((param) => condition.startsWith(`${param}=`))) {
      continue
    }

    // Handling the special '!exists' operator
    if (condition.startsWith('!')) {
      // Remove the '!' and any trailing '=' from the condition to get the type
      type = decodeURIComponent(condition.slice(1).replace(/=$/, ''))
      operator = '!exists'
      entries.push({ type, operator, values, id: uuid() })
      continue
    }

    // Searching for operators in the condition
    let foundOperator = false
    for (const op of sortedOperators) {
      const opIndex = condition.indexOf(op)
      if (opIndex > 0) {
        operator = OPERATOR_MAP[op] // Map the string operator to its logical equivalent

        // Extract the type and values from the condition
        type = decodeURIComponent(condition.substring(0, opIndex))

        // Continue if the type is not allowed and not a custom field
        if (!ALLOWED_PARAMS.includes(type) && !CUSTOM_FIELD_REGEX.test(type)) {
          continue
        }

        // Extract and decode values after the operator
        const valuesString = condition.substring(opIndex + op.length)

        // **Updated handling of empty valuesString**
        if (valuesString === '') {
          // If valuesString is an empty string, set values to an empty array
          values = []
        } else {
          values = valuesString
            .split(',')
            .filter((v) => v !== '')
            .map(decodeURIComponent)
        }

        entries.push({ type, operator, values, id: uuid() }) // Push the entry with a unique id
        foundOperator = true
        break
      }
    }

    // If no operator was found, handle the 'exists' operator
    if (!foundOperator) {
      operator = 'exists'
      type = decodeURIComponent(condition)

      // Continue if the type is not allowed and not a custom field
      if (!ALLOWED_PARAMS.includes(type) && !CUSTOM_FIELD_REGEX.test(type)) {
        continue
      }

      entries.push({ type, operator, values, id: uuid() })
    }
  }

  // Return the array of QueryEntry objects
  return entries
}

// Function to convert query objects to Mongoose query strings for backend and frontend
// Frontend query is usually trimmed down to not show default filters
export function objectToMongooseQueryString(
  queryObj: QueryEntry[],
  filters: any,
  defaultFilters?: ISubmissionFilters,
  org?: IOrganization,
  hideCompletedAndCanceled?: boolean,
  roadmap?: boolean
): { backendQuery: string; frontendQuery: string } {
  // Mapping supported logical operators to their string equivalents in query
  const OPERATOR_MAP: Record<string, string> = {
    is: '=',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    ne: '!=',
    in: '=',
    'is not': '!=',
    exists: '',
    '!exists': '!',
  }

  // Grouping query entries by type and operator
  const grouped: Record<string, { type: string; operator: string; values: string[] }> = {}

  // Adjusted grouping logic
  queryObj.forEach((entry) => {
    const key = `${entry.type}${OPERATOR_MAP[entry.operator]}`

    // Only include types that are in ALLOWED_PARAMS or custom fields
    if (!ALLOWED_PARAMS.includes(entry.type) && !CUSTOM_FIELD_REGEX.test(entry.type)) {
      return
    }

    if (!grouped[key]) {
      grouped[key] = { ...entry, values: [...entry.values] }
    } else {
      grouped[key].values.push(...entry.values)
    }
  })

  // Initialize array to hold parts of the query string
  const queryStringParts: string[] = []

  // Building query string parts from the grouped entries
  Object.values(grouped).forEach((entry) => {
    // Only proceed if the entry has values and the type is in ALLOWED_PARAMS or is a custom field
    if (
      entry.operator in OPERATOR_MAP &&
      (ALLOWED_PARAMS.includes(entry.type) || CUSTOM_FIELD_REGEX.test(entry.type))
    ) {
      // Constructing query string part based on the operator type
      let currentPart = ''
      const encodedType = encodeURIComponent(entry.type)
      const encodedValues = entry.values.map(encodeURIComponent).join(',')

      if (entry.operator === 'is' || entry.operator === 'is not' || entry.operator === 'in') {
        if (entry.values.length > 0) {
          currentPart = `${encodedType}${OPERATOR_MAP[entry.operator]}${encodedValues}`
        } else {
          if (entry.operator === 'is not') {
            currentPart = `!${encodedType}`
          } else {
            currentPart = `${encodedType}`
          }
        }
      } else if (entry.operator === 'exists') {
        currentPart = `${encodedType}`
      } else if (entry.operator === '!exists') {
        currentPart = `!${encodedType}`
      } else {
        currentPart = `${encodedType}${OPERATOR_MAP[entry.operator]}${encodeURIComponent(
          entry.values[0]
        )}`
      }

      // Check for duplicates before pushing
      if (!queryStringParts.includes(currentPart)) {
        queryStringParts.push(currentPart)
      }
    }
  })

  // Find index of existing 'sortBy' in queryStringParts
  const sortByIndex = queryStringParts.findIndex((part) => part.startsWith('sortBy='))

  // If 'sortBy' exists and is different, replace it
  if (
    sortByIndex !== -1 &&
    filters.sortBy &&
    queryStringParts[sortByIndex] !== 'sortBy=' + encodeURIComponent(filters.sortBy)
  ) {
    queryStringParts[sortByIndex] = 'sortBy=' + encodeURIComponent(filters.sortBy)
  }
  // If 'sortBy' doesn't exist, add it
  else if (sortByIndex === -1 && filters.sortBy) {
    queryStringParts.push('sortBy=' + encodeURIComponent(filters.sortBy))
  }

  // Handling 'inReview' and 'includePinned' filters
  if (!filters?.id) {
    if (filters.inReview && !queryStringParts.includes('inReview=true')) {
      queryStringParts.push('inReview=true')
    } else if (!filters.inReview && queryStringParts.includes('inReview=true')) {
      queryStringParts.splice(queryStringParts.indexOf('inReview=true'), 1)
    } else if (!filters.inReview && !filters.q) {
      queryStringParts.push('inReview=false')
    }
  } else {
    queryStringParts.splice(queryStringParts.indexOf('inReview=true'), 1)
    queryStringParts.splice(queryStringParts.indexOf('inReview=false'), 1)
  }

  if (filters.id && !queryStringParts.some((part) => part.startsWith('id='))) {
    queryStringParts.push('id=' + encodeURIComponent(filters.id))
  } else if (!filters.id && queryStringParts.some((part) => /^id=/.test(part))) {
    const indexToRemove = queryStringParts.findIndex((part) => /^id=/.test(part))
    if (indexToRemove !== -1) {
      queryStringParts.splice(indexToRemove, 1)
    }
  }

  if (filters.includePinned && !queryStringParts.includes('includePinned=true') && !filters.q) {
    queryStringParts.push('includePinned=true')
  } else if (!filters.includePinned && queryStringParts.includes('includePinned=true')) {
    queryStringParts.splice(queryStringParts.indexOf('includePinned=true'), 1)
  }

  if (filters.searchByComments && !queryStringParts.includes('searchByComments=true')) {
    queryStringParts.push('searchByComments=true')
  } else if (!filters.searchByComments && queryStringParts.includes('searchByComments=true')) {
    queryStringParts.splice(queryStringParts.indexOf('searchByComments=true'), 1)
  }

  // Handling search query filter 'q'
  if (filters.q && !queryStringParts.some((part) => part.startsWith('q='))) {
    queryStringParts.push('q=' + encodeURIComponent(filters.q))
  } else if (!filters.q && queryStringParts.some((part) => /^q=/.test(part))) {
    const indexToRemove = queryStringParts.findIndex((part) => /^q=/.test(part))
    if (indexToRemove !== -1) {
      queryStringParts.splice(indexToRemove, 1)
    }
  }

  // Handling hiding of completed and canceled statuses
  const defaultlyHiddenStatuses = hideCompletedAndCanceled
    ? org?.postStatuses
        ?.filter((status) => status.type === 'canceled' || status.type === 'completed')
        .map((status) => {
          return status.id
        })
    : []

  // Check if there are any 's=' or 's!=' parts in the query string
  const queryStringPartsHasUserSetStatuses = queryStringParts.some(
    (part) => /^s=/.test(part) || /^s!=/.test(part)
  )

  const includesIdFilter = queryStringParts.some((part) => part.startsWith('id='))

  const backendModifiedQuery =
    hideCompletedAndCanceled && !queryStringPartsHasUserSetStatuses && !includesIdFilter
      ? [...queryStringParts, `s!=${defaultlyHiddenStatuses?.map(encodeURIComponent).join(',')}`]
      : queryStringParts

  if (defaultFilters) {
    const frontEndModifiedQuery = queryStringParts.filter((filter) => {
      if (filter.includes('sortBy=')) {
        if (defaultFilters.sortBy === decodeURIComponent(filter.split('=')[1])) {
          return false
        } else {
          return true
        }
      } else if (filter.includes('includePinned=')) {
        return false
      } else if (filter.includes('searchByComments=')) {
        return false
      } else if (filter.includes('id=')) {
        return false
      } else if (filter.includes('inReview=false')) {
        return false
      } else if (filter.includes('inReview=true') && defaultFilters.inReview) {
        return false
      } else {
        return true
      }
    })
    return {
      backendQuery: backendModifiedQuery.join('&'),
      frontendQuery: frontEndModifiedQuery.join('&'),
    }
  }

  return {
    backendQuery: queryStringParts.join('&'),
    frontendQuery: queryStringParts.join('&'),
  }
}

export const generateDefaultFilterForRoadmapColumn = (
  defaultFiltersForColumn: ISubmissionFilters,
  activeExtraBaseFilters: ISubmissionFilters
) => {
  return {
    ...defaultFiltersForColumn,
    sortBy: activeExtraBaseFilters.sortBy,
    inReview: false,
    includePinned: true,
    advancedFilters: [
      ...defaultFiltersForColumn.advancedFilters.filter((item) => {
        if (activeExtraBaseFilters?.advancedFilters?.find((i) => i.type === item.type)) {
          return false
        }
        return true
      }),
      ...activeExtraBaseFilters.advancedFilters,
    ],
  }
}

export const generateDefaultBaseFilterForRoadmap = (baseFilter: string) => {
  const mainFilters = mongooseQueryStringToObject(baseFilter)

  const defaultFilter = {
    sortBy: 'upvotes:desc',
    advancedFilters: [],
    inReview: undefined,
    includePinned: true,
    q: undefined,
    limit: 10,
  }

  return updateFilters(defaultFilter, mainFilters, defaultFilter)
}

export const getDefaultFilters = (org: IOrganization, includePinned = true): ISubmissionFilters => {
  return {
    sortBy: getFilterValue(org?.settings?.defaultSortingOrder || ''),
    advancedFilters: [],
    includePinned: includePinned,
    inReview: undefined,
    q: undefined,
  } as ISubmissionFilters
}

export const getRoadmapDefaultFilters = (
  org: IOrganization,
  customStatus?: string,
  otherFilters?: QueryEntry[]
): ISubmissionFilters => {
  // Filter and map boards (categories)
  const boards = org?.structure?.roadmap?.hiddenCategories?.map(
    (cat) => org?.postCategories?.find((c) => c.category === cat)?.id || ''
  )

  // Create default advancedFilters array
  const advancedFilters = []

  // Add boards filter if boards exist
  if (boards && boards.length > 0) {
    advancedFilters.push({
      type: 'b',
      operator: 'is not',
      id: uuid(),
      values: boards ? [...boards] : [],
    })
  }

  if (otherFilters) {
    advancedFilters.push(...otherFilters)
  }

  // Add postStatus filter only if customStatus is defined
  if (customStatus) {
    const postStatus = org?.postStatuses.find((status) => status.name === customStatus)?.id
    if (postStatus) {
      advancedFilters.push({
        type: 's',
        operator: 'is',
        id: uuid(),
        values: [postStatus],
      })
    }
  }

  return {
    sortBy: 'upvotes:desc',
    advancedFilters,
    inReview: undefined,
    includePinned: true,
    q: undefined,
    limit: 10,
  } as ISubmissionFilters
}

export const convertUuid = (initialUuid: string | number) => {
  if (typeof initialUuid === 'string') {
    const buffer = Buffer.from(initialUuid.replace(/-/g, ''), 'hex')
    const number = buffer.readUIntBE(0, buffer.length)
    return number
  } else {
    const buffer = Buffer.alloc(16)
    buffer.writeUIntBE(initialUuid, 0, 16)
    const uuid = [
      buffer.toString('hex', 0, 4),
      buffer.toString('hex', 4, 6),
      buffer.toString('hex', 6, 8),
      buffer.toString('hex', 8, 10),
      buffer.toString('hex', 10, 16),
    ].join('-')
    return uuid
  }
}

export const handleCheckboxClick = (
  id: string,
  event: React.MouseEvent<HTMLInputElement>,
  lastChecked: string | null,
  submissionResults: ISubmission[] | undefined,
  checkboxes: {
    [key: string]: boolean
  },
  setCheckboxes: (
    value: React.SetStateAction<{
      [key: string]: boolean
    }>
  ) => void,
  setLastChecked: React.Dispatch<React.SetStateAction<string | null>>
) => {
  if (!submissionResults) return
  if (event.shiftKey && lastChecked != null) {
    const start = submissionResults.findIndex((option) => option.id === (lastChecked || id))
    const end = submissionResults.findIndex((option) => option.id === id)
    const newCheckboxes = { ...checkboxes }
    for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
      const optionId = submissionResults[i].id
      if (lastChecked === submissionResults[i].id && !checkboxes[optionId]) continue
      if (lastChecked === submissionResults[i].id && checkboxes[optionId]) continue
      if (checkboxes[optionId]) {
        newCheckboxes[optionId] = false
      } else {
        newCheckboxes[optionId] = true
      }
    }
    setCheckboxes(newCheckboxes)
  } else {
    setCheckboxes({ ...checkboxes, [id]: !checkboxes[id] })
  }
  setLastChecked(id)
}

export function isValidObjectId(str: string): boolean {
  // Check if the string is exactly 24 characters long
  if (!str || (str && str?.length !== 24)) {
    return false
  }

  // Check if all characters are hexadecimal
  const hexRegex = /^[0-9a-fA-F]{24}$/
  return hexRegex.test(str)
}

export const isLocalStorageAvailable = () => {
  const test = 'test'
  try {
    localStorage?.setItem(test, test)
    localStorage?.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

export const determineSSRTheme = (org: IOrganization, context: GetServerSidePropsContext) => {
  let defaultTheme = org?.settings?.defaultTheme || 'client'

  if (context.query?.theme === 'light' || context.query?.theme === 'dark') {
    defaultTheme = context.query?.theme
  }

  return defaultTheme
}

export const metadataSchema = z.record(z.string()).nullable()

export const parseMetadataJson = (metadata: string) => {
  try {
    // Validate the metadata schema before parsing
    const parsedMetadata = JSON.parse(metadata)
    metadataSchema.parse(parsedMetadata)

    return parsedMetadata
  } catch (e) {
    console.log('Error parsing metadata JSON:', e)
    return {}
  }
}

// Example usage:
// Assuming you have an array 'changelogCategories' with a property 'name' you want to sort by:
// const sortedCategories = sortArrayByProperty(changelog?.changelogCategories, 'name');
export function sortChangelogCategories(array: { id: string; name: string; roles?: string[] }[]) {
  // Make a copy of the array to avoid mutating the original array
  const items = [...array]

  // Separate sorting logic
  const sortByName = (a: { name: string }, b: { name: string }) => {
    return a.name.localeCompare(b.name)
  }

  // Sort the array
  return items.sort(sortByName)
}

export const handleMentionKeyDown = (
  event: KeyboardEvent,
  totalCount: number,
  setHoverIndex: (value: SetStateAction<number>) => void,
  handleCommand: (index: number) => void,
  hoverIndex: number
) => {
  const { key } = event

  if (key === 'ArrowUp') {
    setHoverIndex((prev) => {
      const beforeIndex = prev - 1
      return beforeIndex >= 0 ? beforeIndex : 0
    })
    return true
  }

  if (key === 'ArrowDown') {
    setHoverIndex((prev) => {
      const afterIndex = prev + 1
      return afterIndex < totalCount ? afterIndex : totalCount - 1
    })
    return true
  }

  if (key === 'Enter') {
    handleCommand(hoverIndex)
    return true
  }

  return false
}

export const keepPostBetweenAuthor = (
  submissionIds: string[],
  authors: { _id: string; type: 'admin' | 'customer' }[],
  mutateSubmissions: KeyedMutator<any>,
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[] | undefined,
  mutateBoth?: boolean,
  changeInReview?: boolean,
  isCompanyOnly?: boolean
) => {
  updateSubmissionInfo({
    submissionIds,
    access: {
      add: authors,
    },
    ...(changeInReview && { inReview: false }),
  })
    .then(() => {
      toast.success(
        `The post is now only visible to the ${
          isCompanyOnly ? `author's company members` : 'author'
        }`
      )
    })
    .catch(() => {
      toast.error('Could not change post privacy')
    })

  const dummyDataForMutation = {
    _id: '65d394b4affdf5e99fcbfd19',
    type: 'admin' as 'admin' | 'customer' | 'company',
  }

  // IS array
  if (mutateBoth && Array.isArray(rawSubmissionData)) {
    mutateSubmissions(
      rawSubmissionData?.map((entry: any) => ({
        ...entry,
        results: entry.results.map((submission: ISubmission) =>
          !submissionIds.includes(submission.id)
            ? submission
            : {
                ...submission,
                // Check if author already is in the submission and dont add it again
                accessUsers: [dummyDataForMutation],
                inReview:
                  submissionIds.includes(submission.id) && changeInReview
                    ? false
                    : submission?.inReview,
                accessCompanies: ['active'],
              }
        ),
      })),
      false
    )
  } else {
    performSubmissionMutation(
      mutateSubmissions,
      (oldResults) =>
        oldResults.map((submission) =>
          !submissionIds.includes(submission.id)
            ? submission
            : {
                ...submission,
                // Check if author already is in the submission and dont add it again
                accessUsers: [dummyDataForMutation],
                accessCompanies: ['active'],
                inReview:
                  submissionIds.includes(submission.id) && changeInReview
                    ? false
                    : submission?.inReview,
              }
        ),
      rawSubmissionData
    )
  }
}

export const removePostBetweenAuthor = (
  submissionIds: string[],
  authors: { _id: string; type: 'admin' | 'customer' }[],
  mutateSubmissions: KeyedMutator<any>,
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[] | undefined,
  changeInReview?: boolean
) => {
  updateSubmissionInfo({
    submissionIds,
    access: {
      remove: authors,
    },
    ...(changeInReview && { inReview: false }),
  })
    .then(() => {
      toast.success('The post is now visible to everyone')
    })
    .catch(() => {
      toast.error('Could not change post privacy')
    })
  performSubmissionMutation(
    mutateSubmissions,
    (oldResults) =>
      oldResults.map((submission) =>
        !submissionIds.includes(submission.id)
          ? submission
          : {
              ...submission,
              // Remove the specified authors from accessUsers
              accessUsers: [],
              accessCompanies: [],
            }
      ),
    rawSubmissionData
  )
}

export const isPostPrivateWithUsers = (submission: ISubmission) => {
  return (
    (submission?.accessUsers && submission?.accessUsers?.length > 0) ||
    (submission?.accessCompanies && submission?.accessCompanies?.length > 0)
  )
}

function objectIdToTimestamp(objectId: string) {
  if (objectId) {
    objectId = objectId.toString()
    return (
      parseInt(objectId.slice(0, 8), 16) * 1000 +
      Math.floor(parseInt(objectId.slice(-6), 16) / 16777.217)
    ) // convert 0x000000 ~ 0xffffff to 0 ~ 999
  } else {
    return 10000
  }
}

export const generateRoadmapFilter = (filters: ISubmissionFilters) => {
  const filtersHasBoardFilter = filters?.advancedFilters?.some(
    (filter) => filter?.type === 'b' && filter?.userGenerated
  )

  return objectToMongooseQueryString(
    filters.advancedFilters.filter((filter) =>
      filtersHasBoardFilter
        ? filter.type === 'b' && filter.operator === 'is not' && !filter.userGenerated
          ? false
          : true
        : true
    ),
    {
      sortBy: filters.sortBy,
      inReview: filters.inReview,
      includePinned: filters.includePinned,
    }
  ).backendQuery
}

export function getETAQuarter(date: Date | string): number {
  const normalizedDate = retrieveDateWithoutTimezone(date)

  // Use the normalized date to get the month
  const month = normalizedDate.getMonth()
  return Math.floor(month / 3) + 1
}

export function retrieveDateWithoutTimezone(storedDateString: string | Date) {
  // Parse the stored ISO string
  const date = new Date(storedDateString)

  // Reconstruct the date in the user's local timezone
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()

  // Create a new Date object in the local timezone
  return new Date(year, month, day)
}

export function getDateInUtc(date: Date | string): string {
  let normalizedDate: Date

  if (typeof date === 'string') {
    normalizedDate = new Date(parseISO(date).toDateString())
  } else {
    normalizedDate = new Date(date.toDateString())
  }

  return normalizedDate.toISOString()
}

export const initIntercom = (
  user: IAdmin | ICustomer,
  org: IOrganization,
  boot: (props?: IntercomProps) => void,
  setShowChat: any
) => {
  if (isMember(user?.id, org)) {
    setShowChat(true)
    boot({
      name: user?.name,
      email: user?.email,
      userId: user?.id,
      createdAt: user?.id ? (objectIdToTimestamp(user?.id) / 1000).toString() : '',
      company: {
        plan: org?.plan,
        name: org?.displayName,
        companyId: org?.id,
        createdAt: (objectIdToTimestamp(org?.id) / 1000).toString(),
        customAttributes: {
          subscription_status: org?.subscriptionStatus,
          subscription_period: org?.subscriptionPeriod,

          board_url: 'https://' + org?.name + '.featurebase.app/',
          subdomain: org?.name,
        },
      },
      hideDefaultLauncher: true,
      verticalPadding: 70,
      userHash: user?.intercomHash,
    })
  }
}

export const addYoutubeVideo = (editor: any, range?: any) => {
  if (!editor) return null

  const url = prompt('Enter Youtube/Loom/Descript Video URL')

  // Validate if is a valid URL
  if (!isURL(url || '', { require_protocol: true })) {
    alert('Please enter a full and valid URL for the video')
    return
  }

  if (url) {
    // Check if is youtube url
    let inputUrl = url
    // Add as embed
    const isLoom = inputUrl.includes('loom.com')
    const youtubeRegex = /^(https?\:\/\/)?(www\.youtube\.com\/watch\?v=|youtu\.be\/)([^&?\/\s]+).*/

    const isYoutube = youtubeRegex.test(url)

    if (isYoutube) {
      const match = url.match(youtubeRegex)
      const videoId = match?.[3] // Extract the video ID from the capturing group

      if (!videoId) return
      // Use the extracted video ID to form the embed URL
      inputUrl = `https://www.youtube.com/embed/${videoId}`
    } else if (isLoom) {
      inputUrl = inputUrl.replace('/share/', '/embed/')
    } else {
      // Assuming it's a Descript URL or another type with similar URL structure
      inputUrl = inputUrl.replace('/view/', '/embed/')
    }

    editor
      .chain()
      .focus()
      .setIframe({
        src: inputUrl,
        dataAttribute: {
          key: `data-${isLoom ? 'loom' : isYoutube ? 'youtube' : 'descript'}-video`,
          value: '',
        },
      })
      .run()

    if (range) {
      editor.chain().focus().deleteRange(range).run()
    }
    // Add new line after video
  }
}

export const addIframeEmbed = (editor: any, range?: any) => {
  if (!editor) return null

  const url = prompt('Enter URL for iframe embed')

  // Validate if it's a valid URL
  if (!isURL(url || '', { require_protocol: true })) {
    alert('Please enter a full and valid URL for the iframe')
    return
  }

  if (url) {
    let inputUrl = url

    // You might want to add specific transformations for different types of embeds here
    // For now, we'll just use the URL as is

    editor
      .chain()
      .focus()
      .setIframe({
        src: inputUrl,
        dataAttribute: {
          key: 'data-iframe-embed',
          value: '',
        },
      })
      .run()

    if (range) {
      editor.chain().focus().deleteRange(range).run()
    }
    // Add new line after iframe
  }
}

export const useData = () => {
  const [currentNode, setCurrentNode] = useState<Node | null>(null)
  const [currentNodePos, setCurrentNodePos] = useState<number>(-1)

  const handleNodeChange = useCallback(
    (data: { node: Node | null; editor: Editor; pos: number }) => {
      if (data.node) {
        setCurrentNode(data.node)
      }

      setCurrentNodePos(data.pos)
    },
    [setCurrentNodePos, setCurrentNode]
  )

  return {
    currentNode,
    currentNodePos,
    setCurrentNode,
    setCurrentNodePos,
    handleNodeChange,
  }
}

export const updateStructure = (
  structure: IHelpCenterCollectionDocument['structure'] | undefined,
  newData: IHelpCenterArticleDocument | IHelpCenterCollectionDocument,
  deleteItem = false
): IHelpCenterCollectionDocument['structure'] | [] => {
  return structure
    ? structure
        ?.filter((item) => {
          if (deleteItem) {
            if (
              newData.type === 'article' &&
              item.type === 'article' &&
              item.articleId === newData.articleId
            ) {
              return false
            }
            if (
              newData.type === 'collection' &&
              item.type === 'collection' &&
              item.collectionId === newData.collectionId
            ) {
              return false
            }
          }
          return true
        })
        ?.map((item: any) => {
          if (
            newData.type === 'article' &&
            item.type === 'article' &&
            item.articleId === newData.articleId
          ) {
            return { ...item, ...newData }
          } else if (item.type === 'collection' && item?.structure) {
            if (newData.type === 'collection' && item.collectionId === newData.collectionId) {
              return { ...item, ...newData }
            }

            // Recurse into nested structures
            return {
              ...item,
              structure: updateStructure(item?.structure, newData, deleteItem),
            }
          }
          return item
        })
    : []
}

// export const iOS = /iPad|iPhone|iPod/.test(navigator?.platform)

export const createCollection = async (
  mutate: any,
  name: string,
  description: string,
  icon?: IHelpCenterIcon,
  parent?: string
) => {
  toast.promise(
    createHelpdocsCollection({
      name,
      description,
      icon,
      parentId: parent,
    }).then(() => {
      mutate()
    }),
    {
      loading: 'Creating collection...',
      success: 'Collection created successfully.',
      error: (e) => e.response?.data.error,
    }
  )
}

export const createArticle = (
  mutate: any,
  parentId?: string,
  changeRoute?: (id: string) => Promise<boolean>
) => {
  toast.promise(
    createHelpdocs({
      title: 'Untitled document',
      body: '',
      description: '',
      parentId,
    }).then((res) => {
      if (changeRoute && res.data.articleId) {
        changeRoute(res.data.articleId)
      }
      mutate()
    }),
    {
      loading: 'Creating article...',
      success: 'Article created successfully.',
      error: (e) => e.response?.data.error,
    }
  )
}

export const getSubmissionSimilarKey = (submission: ISubmission) => {
  return submission?.title?.slice(0, 60) + '-' + submission?.content?.slice(0, 60)
}

export const getHelpCenterPrefix = (org: IOrganization) => {
  return org.activeHelpCenter.externalDomain
    ? `${org.activeHelpCenter.externalDomain}`
    : `${getBoardUrl(org)}/help`
}

export const getLocaleFromSSR = async (context: GetServerSidePropsContext) => {
  if (context.locale && availableLocales.includes(context.locale)) {
    return context.locale
  }

  return 'en'
}

export const handleHelpCenterRedirect = (
  helpCenterdata: any,
  context: GetServerSidePropsContext,
  locale: string,
  collectionData?: IHelpCenterCollectionDocument,
  articleData?: IHelpCenterArticleDocument
) => {
  const isVisitingDefaultDirectly = context?.locale === 'default'

  const helpCenter: IHelpCenterDocument = helpCenterdata?.value?.data

  if (!collectionData && !articleData) {
    if (helpCenter?.defaultLocale !== 'en' && isVisitingDefaultDirectly) {
      return {
        redirect: {
          destination: `/${helpCenter.defaultLocale}/help`,
          permanent: false,
        },
      }
    }

    // Check that the locale is available in the help center
    if (!helpCenter?.availableLocales.includes(locale)) {
      console.log('redirecting to default locale', locale, helpCenter?.availableLocales)
      return {
        redirect: {
          destination: `/${helpCenter.defaultLocale}/help`,
          permanent: false,
        },
      }
    }
  }

  // Check for collection redirect
  if (collectionData && collectionData.locale !== locale) {
    const collectionSlug = collectionData.slug || collectionData.collectionId
    if (collectionSlug) {
      return {
        redirect: {
          destination: `/${collectionData.locale}/help/collections/${collectionSlug}`,
          permanent: false,
        },
      }
    }
  }

  // Check for article redirect
  if (articleData && articleData.locale !== locale) {
    const articleSlug = articleData.slug || articleData.articleId
    if (articleSlug) {
      return {
        redirect: {
          destination: `/${articleData.locale}/help/articles/${articleSlug}`,
          permanent: false,
        },
      }
    }
  }

  // Optimized code for checking if the router path matches the slug of collection or article
  try {
    // Extract the URL path and query parameters
    const [urlPath, queryParams] = context.resolvedUrl.split('?')
    // Split the path into segments, filtering out any empty strings to handle extra slashes
    const pathSegments = urlPath.split('/').filter((segment) => segment)
    // Get the last segment of the path
    const lastSegment = decodeURIComponent(
      pathSegments[pathSegments.length - 1] || ''
    ).toLowerCase()

    if (collectionData) {
      const collectionSlug = (collectionData.slug || collectionData.collectionId || '')
        .toString()
        .toLowerCase()

      if (collectionSlug && lastSegment !== collectionSlug) {
        return {
          redirect: {
            destination: `/${locale}/help/collections/${encodeURIComponent(collectionSlug)}${
              queryParams ? `?${queryParams}` : ''
            }`,
            permanent: false,
          },
        }
      }
    } else if (articleData) {
      const articleSlug = (articleData.slug || articleData.articleId || '').toString().toLowerCase()

      if (articleSlug && lastSegment !== articleSlug) {
        return {
          redirect: {
            destination: `/${locale}/help/articles/${encodeURIComponent(articleSlug)}${
              queryParams ? `?${queryParams}` : ''
            }`,
            permanent: false,
          },
        }
      }
    }
  } catch (error) {
    // Log the error and proceed without redirecting
    console.error('Error in handleHelpCenterRedirect:', error)
  }

  // If no redirect is needed, return null or undefined
  return null
}

function getUTCStartOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
}

function getUTCEndOfMonth(year: number, month: number): Date {
  // Month is zero-based, so we move to the next month and subtract 1 millisecond
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))
}

function getUTCStartOfQuarter(year: number, quarter: number): Date {
  const month = (quarter - 1) * 3
  return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
}

function getUTCEndOfQuarter(year: number, quarter: number): Date {
  const month = quarter * 3
  return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
}

function getUTCStartOfHalfYear(year: number, half: number): Date {
  const month = (half - 1) * 6
  return new Date(Date.UTC(year, month, 1, 0, 0, 0, 0))
}

function getUTCEndOfHalfYear(year: number, half: number): Date {
  const month = half * 6
  return new Date(Date.UTC(year, month, 0, 23, 59, 59, 999))
}

export const monthColors = {
  jan: 'Pink',
  feb: 'Purple',
  mar: 'Indigo',
  apr: 'Blue',
  may: 'Pink',
  jun: 'Green',
  jul: 'Green',
  aug: 'Yellow',
  sep: 'Yellow',
  oct: 'Orange',
  nov: 'Orange',
  dec: 'Red',
}

export const quarterColors = {
  Q1: 'Purple',
  Q2: 'Blue',
  Q3: 'Green',
  Q4: 'Orange',
}

export const halfYearColors = {
  H1: 'Purple',
  H2: 'Orange',
}

export function generateRoadmapTemplateItems(
  activeRoadmap: IRoadmapDocument | undefined,
  timeframeOffset: number
) {
  if (activeRoadmap?.template?.type !== 'date') return []

  const timeframe = activeRoadmap.template.options?.timeframe
  const numberOfPeriods = 4
  const items = []
  const currentDate = new Date()

  for (let i = 0; i < numberOfPeriods; i++) {
    const offset = i + timeframeOffset
    let startDate: Date
    let endDate: Date
    let title: string
    let color: string

    const currentYear = currentDate.getUTCFullYear()
    const currentMonth = currentDate.getUTCMonth() // 0-11

    if (timeframe === 'month') {
      const adjustedDate = new Date(Date.UTC(currentYear, currentMonth + offset, 1))
      const year = adjustedDate.getUTCFullYear()
      const month = adjustedDate.getUTCMonth() // 0-11

      startDate = getUTCStartOfMonth(year, month)
      endDate = getUTCEndOfMonth(year, month)
      title = format(startDate, 'MMMM yyyy')
      const monthName = monthNames[month]
      color = monthColors[monthName as keyof typeof monthColors] || 'Sky'
    } else if (timeframe === 'quarter') {
      const totalQuarters = Math.floor(currentMonth / 3) + offset
      const year = currentYear + Math.floor(totalQuarters / 4)
      const quarter = (((totalQuarters % 4) + 4) % 4) + 1 // Quarters are 1-based

      startDate = getUTCStartOfQuarter(year, quarter)
      endDate = getUTCEndOfQuarter(year, quarter)
      title = `Q${quarter} ${year}`
      color = quarterColors[`Q${quarter}` as keyof typeof quarterColors] || 'Sky'
    } else if (timeframe === 'half-year') {
      const totalHalves = Math.floor(currentMonth / 6) + offset
      const year = currentYear + Math.floor(totalHalves / 2)
      const half = (((totalHalves % 2) + 2) % 2) + 1 // Halves are 1-based

      startDate = getUTCStartOfHalfYear(year, half)
      endDate = getUTCEndOfHalfYear(year, half)
      title = `H${half} ${year}`
      color = halfYearColors[`H${half}` as keyof typeof halfYearColors] || 'Sky'
    } else {
      continue
    }

    const dateFilter = `e>=${encodeURIComponent(startDate.toISOString())}&e<=${encodeURIComponent(
      endDate.toISOString()
    )}`

    // Keep id as end date timestamp
    items.push({
      _id: endDate.getTime().toString(),
      title,
      filter: dateFilter,
      color: color,
      icon: null,
    })
  }

  return items
}

export const getPathFromAsPath = (asPath: string) => {
  try {
    // Create a URL with a dummy base since asPath is path-only
    const url = new URL(asPath, 'http://dummy.com')
    return url.pathname
  } catch {
    // Fallback to simple split if URL parsing fails
    // This handles cases where asPath might be malformed
    return asPath.split('?')[0].split('#')[0]
  }
}

export {
  getUTCStartOfMonth,
  getUTCEndOfMonth,
  getUTCStartOfQuarter,
  getUTCEndOfQuarter,
  getUTCStartOfHalfYear,
  getUTCEndOfHalfYear,
}
