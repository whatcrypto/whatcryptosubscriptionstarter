import { AxiosError } from 'axios'
import useSWR, { KeyedMutator } from 'swr'
import { ISingleTrackerUser, ICustomer, ICustomerFilters, IAdmin } from '../interfaces/IUser'
import useSWRInfinite from 'swr/infinite'
import { defaultFetcher } from '../../network/apiClient'
import { IOrganization, ICustomerResults } from '../interfaces/IOrganization'
import { ISubmission } from '@/interfaces/ISubmission'

export function useUser(noSSR: boolean = false) {
  const {
    data: user,
    error,
    mutate: userMutate,
    isValidating: isValidatingUser,
  }: {
    data?: IAdmin | ICustomer
    error?: AxiosError
    mutate: KeyedMutator<IAdmin | ICustomer>
    isValidating: boolean
  } = useSWR(
    `/v1/user`,
    !noSSR
      ? {
          revalidateOnFocus: false,
          revalidateOnMount: false,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: false,
          refreshInterval: 0,
          errorRetryCount: 3,
          errorRetryInterval: 5000,
        }
      : {
          errorRetryCount: 3,
          errorRetryInterval: 5000,
          revalidateIfStale: false,
          revalidateOnFocus: false,
          revalidateOnReconnect: false,
        }
  )
  const loggedOut = error && error.response?.status === 401
  return {
    user,
    loggedOut,
    isUserLoading: !error && !user,
    userError: error,
    userMutate,
    isValidatingUser,
  }
}
export function useUserProfile(id: string) {
  const {
    data: user,
    error,
    mutate: userMutate,
    isValidating: isValidatingUser,
  }: {
    data?: ICustomer
    error?: AxiosError
    mutate: KeyedMutator<ICustomer>
    isValidating: boolean
  } = useSWR(`/v1/user/publicProfile?id=${id}`)

  return {
    user,
    isUserLoading: !error && !user,
    userError: error,
    userMutate,
    isValidatingUser,
  }
}

type userPreview = {
  postsCreated: number
  recentPosts: ISubmission[]
}

export function useUserProfilePreview(shouldFetch?: boolean) {
  const {
    data,
    error,
    mutate: userMutate,
    isValidating: isValidatingUser,
  }: {
    data?: userPreview
    error?: AxiosError
    mutate: KeyedMutator<userPreview>
    isValidating: boolean
  } = useSWR(shouldFetch ? `/v1/user/publicProfilePreview` : null, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  })

  return {
    data,
    isUserLoading: !error && !data,
    userError: error,
    userMutate,
    isValidatingUser,
  }
}

export const trackerUsersGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: ICustomerFilters
) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // const queryParams = encodeURI(queryString.stringify())
  return [`/v1/organization/trackedUsers`, { ...filters, page: pageIndex + 1 }]
}

export function useSingleTrackedUserActivity(id: string) {
  const {
    data,
    error,
    mutate: mutateTrackedUserActivity,
  } = useSWR(id ? ['/v1/organization/trackedUsers/user', { id }] : null)
  const trackedUserActivity: ISingleTrackerUser[] = data && (data as ISingleTrackerUser[])
  return {
    trackedUserActivity,
    mutateTrackedUserActivity,
    loadingSingleUserActivity: !error && !data,
  }
}

export function useTrackedUser(id: string, canFetchUserInformation: boolean = false) {
  const {
    data,
    mutate: mutateTrackedUser,
    isValidating,
  } = useSWR(
    id && canFetchUserInformation ? ['/v1/user/getIdentifiedUser', { id }] : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const trackedUser: ICustomer = data && (data?.user as ICustomer)
  return {
    trackedUser,
    mutateTrackedUser,
    isValidating,
  }
}

export function useTrackedUsers(filters: ICustomerFilters, org: IOrganization) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateTrackedUsers,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      org && trackerUsersGetKey(pageIndex, previousPageData, filters),
    defaultFetcher,
    {
      initialSize: 1,
    }
  )

  let changelogResults: ICustomer[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as ICustomerResults[]) {
      for (let cl of (page as ICustomerResults).results) {
        changelogResults.push(cl)
      }
    }
  }

  return {
    trackedUsers: data && changelogResults,
    totalTrackedUsers: data && data[0]?.totalResults,
    size,
    setSize,
    mutateTrackedUsers,
    loading: !error && !data,
  }
}
