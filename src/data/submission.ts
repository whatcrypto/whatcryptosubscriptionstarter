import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { defaultFetcher } from '../../network/apiClient'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import { IOrganization } from '../interfaces/IOrganization'
import axios from 'axios'

export function useSubmissions(organization: string) {
  const { data, error } = useSWR([`/v1/submission`, { organization }])
  return {
    submissions: data,
    isSubmissionsLoading: !error && !data,
    submissionError: error,
  }
}

export function useSingleSubmission(id: string, isSlug?: boolean) {
  const {
    data,
    error,
    mutate: mutateSingleSubmission,
  } = useSWR(
    id !== ''
      ? [`/v1/submission`, { ...(isSlug ? { slug: id } : { id }), includeMergedPosts: true }]
      : null,
    {
      revalidateOnFocus: false,
    }
  )
  return {
    submission: data?.results?.[0] as ISubmission,
    isSubmissionsLoading: !error && !data,
    submissionError: error,
    mutateSingleSubmission,
    rawSubmissionData: data && (data as ISubmissionPaginate[]),
  }
}

export function useSimilarSubmissions(id?: string, query?: string) {
  const {
    data,
    mutate: mutateSimilarSubmissions,
    isValidating,
  } = useSWR(
    id || query
      ? ['/v1/submission/getSimilarSubmissions', { submissionId: id, query: query }]
      : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const similarSubmissions: (ISubmission & { confidenceScore: number })[] =
    data && (data?.submissions as (ISubmission & { confidenceScore: number })[])
  return {
    similarSubmissions,
    mutateSimilarSubmissions,
    isValidating,
    rawData: data,
  }
}

export type SearchResult =
  | {
      articles: any[]
      posts: any[]
    }
  | undefined

const fetcher = async (url: string, data: any, searchKey: string) => {
  const response = await axios.post(url, data, {
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${searchKey}`,
    },
  })
  return response.data
}

export function useSimilarPostsAndArticles(content: string, searchKey: string) {
  const { data, error, mutate, isValidating } = useSWR(
    content
      ? [
          `${process.env.NEXT_PUBLIC_MEILISEARCH_HOST}/multi-search`,
          {
            queries: [
              {
                q: content,
                showRankingScoreDetails: true,
                limit: 2,
                filter: 'state=live',
                indexUid: 'helpcenterarticles',
                hybrid: {
                  semanticRatio: 1,
                  embedder: 'default',
                },
              },
              {
                q: content,
                showRankingScoreDetails: true,
                limit: 8,
                indexUid: 'posts',
                hybrid: {
                  semanticRatio: 1,
                  embedder: 'default',
                },
              },
            ],
          },
          searchKey,
        ]
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  )

  const formattedData: SearchResult = data
    ? {
        articles: data?.results?.[0]?.hits || [],
        posts: data?.results?.[1]?.hits || [],
      }
    : undefined

  return {
    rawData: data,
    data: formattedData,
    isLoading: !error && !data,
    isValidating,
    isError: error,
    mutate,
  }
}

export const submissionsGetKey = (pageIndex: number, previousPageData: any, filters: any) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  return [`/v1/submission?` + filters, { page: pageIndex + 1 }]
}
export function useSubmissionsWithFiltering(
  filters: string | null,
  org: IOrganization,
  initialSize = 2
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateSubmissions,
    isValidating,
  } = useSWRInfinite(
    (pageIndex: number, previousPageData: any) =>
      org && filters ? submissionsGetKey(pageIndex, previousPageData, filters) : null,
    defaultFetcher,
    {
      initialSize,
      revalidateIfStale: false,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      revalidateOnFocus: false,
    }
  )

  let resultIds: string[] = []
  let submissionResults: ISubmission[] = []

  if (data && Array.isArray(data)) {
    for (let page of data) {
      if (page && page.results) {
        for (let sub of page.results) {
          if (sub && sub.id && !resultIds.includes(sub.id)) {
            resultIds.push(sub.id)
            submissionResults.push(sub)
          }
        }
      }
    }
  } else if (data) {
    console.error('data is not an array of ISubmissionPaginate objects')
  }

  const isLastPageReached = data && data.length && data[data.length - 1]?.totalPages === data.length
  const submissionLoading = !isLastPageReached && !error && size > (data ? data?.length : 0)

  return {
    submissionResults: data ? submissionResults : undefined,
    size,
    setSize,
    totalSubmissionResults: data?.[0]?.totalResults,
    mutateSubmissions,
    rawSubmissionData: data ? (data as ISubmissionPaginate[]) : undefined,
    submissionLoading: initialSize === 2 ? !data && !error : submissionLoading,
    data,
    isValidating,
  }
}
