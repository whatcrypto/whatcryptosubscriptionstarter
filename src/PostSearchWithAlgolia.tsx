import { Fragment, useState } from 'react'
// import { useSubmissionsWithFiltering } from '../data/submission'
// import { ISubmissionFilters } from '../interfaces/ISubmission'
// import { useCurrentOrganization } from '../data/organization'
import { sanitizeHTML } from '../lib/contentSanitizer'
import OutsideClickHandler from 'react-outside-click-handler'
import {
  InstantSearch,
  Highlight,
  Configure,
  connectHits,
} from 'react-instantsearch-dom'
import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { useCurrentOrganization } from '../data/organization'
import Status from './Status'
import Category from './Category'
import EmptyIllustration from './EmptyIllustration'
import CustomSearchBox from './CustomSearchBox'
import { cn } from '@/lib/utils'
import CommentCounter from './CommentCounter'
import { Command, CommandList } from 'cmdk'
import { useRouter } from 'next/router'
import { meilisearchClientAtom } from '@/atoms/orgAtom'

export const MergeIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="7" cy="6" r="2" />
      <circle cx="17" cy="12" r="2" />
      <line x1="7" y1="8" x2="7" y2="16" />
      <path d="M7 8a4 4 0 0 0 4 4h4" />
    </svg>
  )
}

const PostSearchWithAlgolia: React.FC<{
  value: string
  callBack: (postId: string, title: string) => void
  isMerge?: boolean
  setUrl?: (id: string) => void
  postCreation?: boolean
  removeSubmissionWithIDs?: string[]
}> = ({ value, callBack, isMerge, setUrl, postCreation, removeSubmissionWithIDs }) => {
  const { t } = useTranslation()
  const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)

  const { org } = useCurrentOrganization()
  const [state, setState] = useState({ query: value })

  const router = useRouter()

  useEffect(() => {
    setState((prev) => ({ ...prev, query: value }))
  }, [value])

  useEffect(() => {
    if (meilisearchClient) {
      meilisearchClient.clearCache()
    }
  }, [meilisearchClient])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const Hit: React.FC<{ hit: any }> = ({ hit }) => {
    const sanitizedHTML = sanitizeHTML(hit.content?.replace('</p>', '</p> '), false)

    return (
      <a>
        <div
          className={`list-none px-4 py-3.5 cursor-pointer border-gray-100/80 dark:border-border `}
        >
          <div className="flex justify-between">
            <p className="text-sm font-semibold text-gray-600 dark:text-white">
              <Highlight tagName={'mark'} attribute="title" hit={hit} />
            </p>
            {!isMerge &&
              (hit?.mergedToSubmissionId ? (
                <span className="dark:bg-green-500/10 bg-green-50 text-green-800 border-green-200 text-xs flex items-center font-medium py-1 h-6 px-1.5 rounded-md dark:text-green-200">
                  Merged{' '}
                  <div className="h-4 w-4 text-green-500 dark:text-green-300 flex-shrink-0 ml-1.5">
                    <MergeIcon />
                  </div>
                </span>
              ) : null)}
          </div>
          {sanitizedHTML && (
            <p className="max-w-sm mt-2 text-xs text-gray-500 md:max-w-full line-clamp-3 dark:text-foreground">
              {<Fragment>{sanitizedHTML}</Fragment>}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <Status xSmall={true} widget={true} status={hit?.postStatus} small={true} />
            <Category
              xSmall={true}
              widget={true}
              category={hit?.postCategory}
              small={true}
              dash={true}
            />
            {hit?.commentCount ? <CommentCounter count={hit?.commentCount} /> : null}
          </div>
        </div>
      </a>
    )
  }

  const Hits = ({ hits }: any) => {
    // return the DOM output

    hits = hits.filter(
      (hit: any) => hit?.mergeCommentId === null || hit?.mergeCommentId === undefined
    )

    return (
      <CommandList
        className={`list-none h-96 custom-scrollbar-stronger  z-50 overflow-y-auto journal-scroll  inset-x-0`}
      >
        <div className="divide-y dark:divide-border divide-gray-100/60">
          {hits &&
            hits?.length > 0 &&
            hits.map((hit: any) => {
              if (isMerge && hit?.mergedToSubmissionId) return null
              if (isMerge && removeSubmissionWithIDs?.includes(hit?.id)) return null

              return (
                <Command.Item
                  onSelect={() => {
                    setUrl && setUrl(hit.id)

                    if (isMerge && !hit?.mergedToSubmissionId) {
                      callBack(hit.id, hit.title)
                    }
                    if (!isMerge) {
                      callBack(hit.id, hit.title)
                    }
                  }}
                  key={hit.id}
                  className="w-full main-transition hover:bg-gray-100/25 dark:hover:bg-dark-accent/30 aria-selected:bg-gray-100/25 dark:aria-selected:bg-gray-600/30 data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  <Hit hit={hit} />
                </Command.Item>
              )
            })}
        </div>
        {!hits?.length && (
          <div className="flex flex-col items-center justify-center mx-auto space-y-3 mt-36">
            <div className="w-16 h-16">
              <EmptyIllustration primary={org.color} />
            </div>
            <p className="text-sm font-medium text-background-accent dark:text-foreground/80">
              {t('no-results-found')}
            </p>
          </div>
        )}
      </CommandList>
    )
  }

  const CustomHits = connectHits(Hits)

  if (meilisearchClient) {
    return (
      <div className="">
        <OutsideClickHandler
          onOutsideClick={() => {
            setIsModalOpen(false)
          }}
        >
          <InstantSearch
            onSearchStateChange={(searchState) => {
              setState(searchState)
            }}
            searchState={state}
            searchClient={meilisearchClient}
            indexName="posts"
          >
            <Command>
              <Configure query={value} hitsPerPage={postCreation ? 10 : 40} />
              <div
                className={cn(
                  ' border-gray-100/80 relative dark:border-border border-b ',
                  isMerge && 'border-t'
                )}
              >
                <CustomSearchBox />
              </div>
              <div className="bg-gray-50/50 dark:bg-secondary/60">
                <CustomHits />
              </div>
            </Command>
          </InstantSearch>
        </OutsideClickHandler>
      </div>
    )
  } else {
    return (
      <>
        <input
          value={value}
          onChange={(event) => setState((prev) => ({ ...prev, query: event.target.value }))}
          placeholder={t('title-of-your-post')}
        />
      </>
    )
  }
}

export default PostSearchWithAlgolia
