import { IActivity, IActivityPaginate, IComment, ICommentPaginate } from '../interfaces/IComment'
import { IOrganization } from '@/interfaces/IOrganization'
import { defaultFetcher } from 'network/apiClient'
import useSWRInfinite from 'swr/infinite'

export const commentGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: any = { sortBy: 'best' },
  moderateView = false
) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // const queryParams = encodeURI(queryString.stringify())
  return [
    moderateView ? `/v1/comment/moderate` : `/v1/comment`,
    { ...filters, page: pageIndex + 1 },
  ]
}

export function useComments(
  sortBy: {
    sortBy: string
    submissionId?: string
    changelogId?: string
    commentThreadId?: string
    inReview?: true
  } | null,
  org: IOrganization,
  moderateView = false
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: commentsMutate,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      sortBy ? org && commentGetKey(pageIndex, previousPageData, sortBy, moderateView) : null,
    defaultFetcher,
    {
      initialSize: 1,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      refreshInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  )

  let resultIds: string[] = []

  let commentResults: IComment[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as ICommentPaginate[]) {
      for (let cl of (page as ICommentPaginate).results) {
        if (resultIds.includes(cl.id)) continue
        commentResults.push(cl)
        resultIds.push(cl.id)
      }
    }
  }

  return {
    comments: data && commentResults,
    isCommentsLoading: !error && size > (data ? data?.length : 0),
    commentError: error,
    commentsMutate,
    totalCommentResults: data && data[0]?.totalResults,
    rawComments: data && (data as ICommentPaginate[]),
    size,
    setSize,
  }
}

export const activityGetKey = (
  pageIndex: number,
  previousPageData: any,
  filters: any = { submissionId: '' }
) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  // const queryParams = encodeURI(queryString.stringify())
  return [`/v1/submission/activity`, { ...filters, page: pageIndex + 1 }]
}

export function useActivityFeed(
  sortBy: {
    submissionId: string | undefined
    type?: string
  },
  org: IOrganization
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: activityMutate,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      !sortBy?.submissionId ? null : org && activityGetKey(pageIndex, previousPageData, sortBy),
    defaultFetcher,
    {
      initialSize: 1,
    }
  )

  let resultIds: string[] = []

  let activityResults: IActivity[] = []

  if (data && data[0]?.success !== false) {
    for (let page of data as IActivityPaginate[]) {
      for (let cl of (page as IActivityPaginate).results) {
        if (resultIds.includes(cl.id)) continue
        activityResults.push(cl)
        resultIds.push(cl.id)
      }
    }
  }

  return {
    activities: data && activityResults,
    isActivitiesLoading: !error && size > (data ? data?.length : 0),
    activityError: error,
    activityMutate,
    totalActivityResults: data && data[0]?.totalResults,
    rawActivities: data && (data as IActivityPaginate[]),
    size,
    setSize,
  }
}
