import { Command } from 'cmdk'
import React, { Fragment, useCallback, useEffect, useState } from 'react'
import { CommandList } from './radix/Command'
import { SearchIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import debounce from 'lodash/debounce'
import { ISubmission } from '@/interfaces/ISubmission'
import { useSubmissionsWithFiltering } from '@/data/submission'
import { useCurrentOrganization } from '@/data/organization'
import InView from 'react-intersection-observer'
import Loader from './Loader'
import EmptyIllustration from './EmptyIllustration'
import { Transition } from '@headlessui/react'
import { sanitizeHTML } from '@/lib/contentSanitizer'
import Status from './Status'
import Category from './Category'
import CommentCounter from './CommentCounter'
import { cn } from '@/lib/utils'

const PostSearchWithAI: React.FC<{
  callBack: (postId: string, title: string) => void
  isMerge?: boolean
  setUrl?: (id: string) => void
  setSearchingForQuery: React.Dispatch<React.SetStateAction<string>>
  fullSearchQuery: string
  defaultSearchQuery?: string
}> = ({ callBack, isMerge, setUrl, setSearchingForQuery, fullSearchQuery, defaultSearchQuery }) => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const { org } = useCurrentOrganization()

  const {
    submissionResults,
    mutateSubmissions,
    size,
    setSize,
    totalSubmissionResults,
    submissionLoading,
    rawSubmissionData,
  } = useSubmissionsWithFiltering(fullSearchQuery, org, 2)

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchingForQuery(query)
    }, 300), // 300ms debounce time
    []
  )

  useEffect(() => {
    if (defaultSearchQuery) {
      setSearchingForQuery(defaultSearchQuery)
      setSearchQuery(defaultSearchQuery)
    }
  }, [defaultSearchQuery])

  const Hit: React.FC<{ hit: any }> = ({ hit }) => {
    const sanitizedHTML = sanitizeHTML(hit.content?.replace('</p>', '</p> '), false)

    return (
      <a>
        <div
          className={`list-none px-4 py-3.5 cursor-pointer border-gray-100/80 dark:border-border `}
        >
          <div className="flex justify-between">
            <p className="text-sm font-semibold text-gray-600 dark:text-white">{hit.title}</p>
          </div>
          {sanitizedHTML && (
            <p className="max-w-sm mt-2 text-xs text-gray-500 md:max-w-full line-clamp-3 dark:text-foreground">
              {<Fragment>{sanitizedHTML}</Fragment>}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Status xSmall={true} widget={true} status={hit?.postStatus} small={true} />
            <Category noBg={true} xSmall={true} category={hit?.postCategory} small={true} />
            {hit?.commentCount ? <CommentCounter count={hit?.commentCount} /> : null}
          </div>
        </div>
      </a>
    )
  }

  let showLoader = totalSubmissionResults ? size * 10 < totalSubmissionResults : false

  const loading = submissionLoading && searchQuery

  return (
    <div>
      <Command>
        <div className="relative">
          <label htmlFor="small_search" className="absolute  cursor-text left-4 top-[18px]">
            <SearchIcon className="w-4 h-4 secondary-svg" />
          </label>
          <input
            id="small_search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              debouncedSearch(e.target.value)
            }}
            placeholder={t('search-for-posts')}
            autoFocus
            className="p-3.5 pl-11 border-x-0 border-t-0 focus:border-gray-100 dark:focus:border-dark-accent/60 shadow-none dark:shadow-none focus:ring-0 dark:focus:ring-0 focus:outline-none dark:focus:outline-none rounded-none placeholder:text-base text-base"
          />
        </div>
        <div className="bg-gray-50/50 dark:bg-secondary/60">
          <CommandList
            className={cn(
              `list-none h-96 custom-scrollbar-stronger  z-50 overflow-y-auto journal-scroll  inset-x-0`,
              (submissionResults?.length === 0 || !submissionResults) &&
                'flex flex-col items-center justify-center'
            )}
          >
            {submissionResults && (
              <Transition
                appear={true}
                show={submissionResults?.length !== 0}
                as="div"
                className="grid w-full grid-cols-1 divide-y border-gray-100/50 "
              >
                {submissionResults?.map((sub: ISubmission, index) => (
                  <Command.Item
                    onSelect={() => {
                      setUrl && setUrl(sub.slug)

                      if (isMerge && !sub?.mergedToSubmissionId) {
                        callBack(sub.id, sub.title)
                      }
                      if (!isMerge) {
                        callBack(sub.id, sub.title)
                      }
                    }}
                    key={sub.id}
                    className="w-full main-transition hover:bg-gray-100/25 dark:hover:bg-border/40 aria-selected:bg-gray-100/25 dark:aria-selected:bg-dark-accent/30"
                  >
                    <Hit hit={sub} />
                  </Command.Item>
                ))}
              </Transition>
            )}
            {(submissionResults?.length === 0 || !submissionResults) && (
              <div className="flex flex-col items-center justify-center mx-auto my-0 space-y-3">
                <div className="flex items-center justify-center w-16 h-16 secondary-svg">
                  {loading ? <Loader /> : <EmptyIllustration primary={org.color} />}
                </div>
                {!loading && (
                  <p className="text-sm font-medium text-background-accent dark:text-foreground/80">
                    {t('no-results-found')}
                  </p>
                )}
              </div>
            )}
            {showLoader && (
              <Command.Item>
                <InView
                  as="div"
                  onChange={(inView: boolean) => {
                    inView && setSize(size + 1)
                  }}
                >
                  <div className="flex items-center justify-center py-10 mt-4 text-background-accent/80 dark:text-gray-500">
                    <div className="w-6 h-6 ">
                      <Loader />
                    </div>
                  </div>
                </InView>
              </Command.Item>
            )}
          </CommandList>
        </div>
      </Command>
    </div>
  )
}

export default PostSearchWithAI
