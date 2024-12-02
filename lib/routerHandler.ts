import { trimmedValue } from '@/components/PublicBoardMenu'
import { getAccessToken } from 'network/apiClient'
import { NextRouter } from 'next/router'

export const addFilterToBoard = (router: NextRouter, value: string, key: string, path?: string) => {
  const trimmed = trimmedValue(value)

  // Create a copy of the current query params
  let newQuery = !path ? { ...router.query } : {}

  if (trimmed) {
    // Add or update the key if value exists
    newQuery[key] = trimmed
  } else {
    // Remove the key if the value is empty
    delete newQuery[key]
  }

  if (getAccessToken()) {
    newQuery.jwt = getAccessToken()
  }

  const isAlreadyOnPath = path ? router.pathname === path : true

  router.push(
    {
      pathname: path || router.pathname,
      query: newQuery,
    },
    undefined,
    { shallow: isAlreadyOnPath }
  )
}
