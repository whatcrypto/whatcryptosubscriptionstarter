import useSWR from 'swr'
import { IHelpCenterArticleDocument } from '@/interfaces/IHelpCenter'
import { IOrganization } from '@/interfaces/IOrganization'
import { defaultFetcher } from 'network/apiClient'
import useSWRInfinite from 'swr/infinite'
import i18n from 'i18next'
import { useTranslation } from 'next-i18next'

export const articleGetKey = (pageIndex: number, previousPageData: any, filters: any = {}) => {
  if (previousPageData && pageIndex === previousPageData.totalPages) return null
  return [`/v1/helpcenter/articles`, { ...filters, page: pageIndex + 1 }]
}

export function useArticlesWithFiltering(
  filters: object | null,
  org: IOrganization,
  fetchOnce?: boolean
) {
  const {
    data,
    error,
    size,
    setSize,
    mutate: mutateArticles,
    isValidating,
  } = useSWRInfinite(
    (pageIndex, previousPageData) =>
      org ? articleGetKey(pageIndex, previousPageData, filters) : null,
    defaultFetcher, // Ensure you have a 'defaultFetcher' defined that handles the fetching logic
    {
      ...(fetchOnce
        ? {
            revalidateOnFocus: false,
            revalidateOnMount: false,
            revalidateOnReconnect: false,
            refreshWhenOffline: false,
            refreshWhenHidden: false,
            refreshInterval: 0,
          }
        : {}),
      initialSize: 1,
    }
  )

  let articleResults: IHelpCenterArticleDocument[] = []

  if (data && !error) {
    data.forEach((page) => {
      articleResults = articleResults.concat(page.results || [])
    })
  }

  return {
    articleResults,
    rawArticleResults: data,
    size,
    setSize,
    totalArticleResults: data?.[0]?.totalResults,
    mutateArticles,
    articlesLoading: !error && !data,
    isValidatingArticles: isValidating,
  }
}

export const useKnowledgebaseStructure = (
  withoutStructure = false,
  locale?: string,
  dontFetch?: boolean
) => {
  const { i18n } = useTranslation()

  if (!locale && i18n.language) {
    locale = i18n.language

    if (locale === 'default') {
      locale = 'en'
    }
  }

  const {
    data,
    error,
    mutate: mutate,
    isValidating,
  } = useSWR(
    dontFetch
      ? null
      : `/v1/helpcenter?withStructure=${!withoutStructure}${locale ? `&locale=${locale}` : ''}`,
    withoutStructure
      ? {
          revalidateOnFocus: false,
          // revalidateOnMount: false,
          revalidateOnReconnect: false,
          refreshWhenOffline: false,
          refreshWhenHidden: false,
          refreshInterval: 0,
        }
      : {}
  )
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isValidating,
  }
}
export const useFullKnowledgebaseStructure = (articleView: boolean, locale?: string) => {
  const {
    data,
    error,
    mutate: mutate,
  } = useSWR(
    articleView
      ? `/v1/helpcenter/articles/structure${locale ? `?locale=${locale}` : ''}`
      : `/v1/helpcenter/structure${locale ? `?locale=${locale}` : ''}`
  )
  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export const useKnowledgeBaseCollections = (singleCollectionMode?: boolean, id?: string) => {
  const {
    data,
    error,
    mutate: mutate,
    isValidating,
  } = useSWR(
    singleCollectionMode && !id
      ? null
      : `/v1/helpcenter/collections${id ? `?collectionId=${id}` : ''}`
  )

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isValidating,
  }
}

export const useKnowledgeBaseCollectionList = () => {
  const {
    data: collectionList,
    error,
    mutate: mutate,
  } = useSWR(`/v1/helpcenter/collections/dropdownList`)

  return {
    collectionList,
    isLoading: !error && !collectionList,
    isError: error,
    mutate,
  }
}

export const useKnowledgeBaseArticle = (articleId: string) => {
  const {
    data,
    error,
    mutate: mutate,
    isValidating,
  } = useSWR(!articleId ? null : `/v1/helpcenter/articles?articleId=${articleId}`)

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isValidating,
  }
}
export const useKnowledgeBaseCollectionsForWidget = () => {
  const {
    data,
    error,
    mutate: mutate,
    isValidating,
  } = useSWR(`/v1/helpcenter/collections/small_dropdown`, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  })

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isValidating,
  }
}
