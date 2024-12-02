import { SuggestionKeyDownProps, SuggestionProps } from '@tiptap/suggestion'
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { usePopper } from 'react-popper'
import { MentionItem } from './MentionItem'
import { useAtom } from 'jotai'
import TagBullet from './TagBullet'
import Tooltip from './Tooltip'
import { ClockIcon, StarIcon } from '@heroicons/react/solid'
import UserPicture from './UserPicture'
import { useIsMounted } from '@/lib/hooks'
import { handleMentionKeyDown } from '@/lib/utils'
import { activeAuthorAtom } from '@/atoms/editorAtom'
import { meilisearchClientAtom } from '@/atoms/orgAtom'
import { Base64 } from 'js-base64'
import { useRouter } from 'next/router'

interface MentionListProps extends SuggestionProps {
  author?: string
  instanceId: string
}

interface MentionListActions {
  onKeyDown: (props: SuggestionKeyDownProps) => void
}

const RenderAfter = ({ children, update }: any) => {
  const [nextTick, setNextTick] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setNextTick(true)
    }, 0)
  }, [])

  useLayoutEffect(() => {
    if (nextTick) {
      update()
    }
  }, [nextTick, update])

  return nextTick ? children : null
}

export const MentionList = forwardRef<MentionListActions, MentionListProps>(
  ({ clientRect, command, query, instanceId }, ref) => {
    const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)

    const [acitveAuthors, setActiveAuthor] = useAtom(activeAuthorAtom)

    const activeAuthor = instanceId ? acitveAuthors?.[instanceId] : undefined

    const router = useRouter()
    const isArticlesPage = router.pathname.includes('/dashboard/articles/')

    useEffect(() => {
      if (meilisearchClient) {
        meilisearchClient.clearCache()
      }
    }, [meilisearchClient])

    const referenceEl: any = useMemo(
      () => (clientRect ? { getBoundingClientRect: clientRect } : null),
      [clientRect]
    )

    const isMounted = useIsMounted()
    const [results, setResults] = useState<any>({
      users: [],
      posts: [],
      changelogs: [],
      articles: [],
    })

    useEffect(() => {
      if (meilisearchClient && query) {
        searchAlgolia()
      }
    }, [query, isMounted, meilisearchClient])

    const searchAlgolia = async () => {
      if (!(meilisearchClient && query)) return

      await meilisearchClient
        .search([
          {
            indexName: 'adminsandcustomers',
            params: {
              filters: activeAuthor ? `id = "${activeAuthor}"` : '',
              hitsPerPage: 1,
            },
          },
          // General search
          {
            indexName: 'adminsandcustomers',
            params: {
              query,
              hitsPerPage: 4,
            },
          },
          {
            indexName: 'posts',
            params: {
              query,
              hitsPerPage: 4,
            },
          },
          {
            indexName: 'localizedchangelogs',
            params: {
              query,
              hitsPerPage: 4,
              filters: 'state = live',
            },
          },
          {
            indexName: 'helpcenterarticles',
            params: {
              query,
              hitsPerPage: 4,
              filters: 'state = live',
            },
          },
        ])
        .then(({ results }: any) => {
          if (!isMounted) return

          const combinedUsersResults = [
            ...results[0].hits,
            ...results[1].hits.filter((hit: any) => hit?.id !== activeAuthor),
          ].slice(0, 4)

          setResults({
            users: combinedUsersResults,
            posts: results[2].hits || [],
            changelogs: results[3].hits || [],
            articles: results[4].hits || [],
          })
        })
        .catch((err: any) => {
          console.error(err)
        })
    }

    const categoryOrder = isArticlesPage
      ? ['articles', 'posts', 'changelogs', 'users']
      : ['users', 'posts', 'changelogs', 'articles']

    const getOrderedResults = () => {
      return categoryOrder.flatMap((key) =>
        results[key].map((item: any) => ({ ...item, type: key.slice(0, -1) }))
      )
    }

    const handleCommand = (index: number) => {
      const orderedItems = getOrderedResults()
      const selectedItem = orderedItems[index]

      if (selectedItem) {
        const type = selectedItem.type
        try {
          command({
            id:
              type === 'article'
                ? `${Base64.encode(
                    JSON.stringify({
                      articleId: selectedItem.articleId,
                      helpCenterId: selectedItem.helpCenterId,
                      organizationId: selectedItem.organizationId,
                      locale: selectedItem.locale,
                      state: selectedItem.state,
                    })
                  )}-${type}`
                : `${selectedItem.id}-${type}`,
            label: selectedItem.name || selectedItem.title,
            ...(type === 'article' && { helpCenterId: selectedItem.helpCenterId }),
          })
        } catch (e) {
          console.error(e)
        }
      }
    }

    const [hoverIndex, setHoverIndex] = useState(0)

    useImperativeHandle(ref, () => {
      const orderedItems = getOrderedResults()
      const totalCount = orderedItems.length

      return {
        onKeyDown: ({ event }) => {
          return handleMentionKeyDown(event, totalCount, setHoverIndex, handleCommand, hoverIndex)
        },
      }
    })

    const [el, setEl] = useState<HTMLDivElement | null>(null)
    const { styles, attributes, update } = usePopper(referenceEl, el, {
      placement: 'bottom-start',
      modifiers: [
        {
          name: 'flip',
          options: {
            fallbackPlacements: ['top-start', 'bottom-end', 'top-end'],
          },
        },
        {
          name: 'preventOverflow',
          options: {
            altAxis: true,
            padding: 8,
          },
        },
        {
          name: 'maxSize',
          options: {
            max: {
              height: 'viewport',
            },
          },
        },
      ],
    })

    const allEmpty = Object.values(results).every((array: any) => array?.length === 0)

    const ChangelogCategoryResult: React.FC<{ result: any }> = ({ result }) => {
      return (
        <div className="flex-shrink-0">
          {result?.displayed ? (
            <div className="flex-shrink-0 ml-1 mr-1">
              <TagBullet theme={'Green'} />
            </div>
          ) : !result?.displayed ? (
            result?.scheduledDate ? (
              <Tooltip
                child={
                  <div>
                    <ClockIcon className="w-4 h-4 secondary-svg mr-1.5" />
                  </div>
                }
                dropDown={
                  <p className="text-xs text-gray-400 dark:text-foreground">
                    Scheduled for release
                  </p>
                }
              />
            ) : (
              <Tooltip
                child={
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 secondary-svg mr-1.5"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </>
                }
                dropDown={
                  <p className="text-xs text-gray-400 dark:text-foreground">Draft, not published</p>
                }
              />
            )
          ) : (
            <Tooltip
              child={
                <>
                  {' '}
                  <div className="relative flex items-center justify-center">
                    <div className="absolute inset-0 w-2 h-2 mx-auto my-auto bg-green-300 rounded-full animate-ping dark:bg-green-400"></div>
                    <div className="relative w-2 h-2 bg-green-400 rounded-full dark:bg-green-400"></div>
                  </div>
                </>
              }
              dropDown={<p className="text-xs">Changelog published</p>}
            />
          )}
        </div>
      )
    }

    if (allEmpty) return null

    const getAdjustedIndex = (categoryIndex: number, itemIndex: number) => {
      return (
        categoryOrder.slice(0, categoryIndex).reduce((acc, key) => acc + results[key].length, 0) +
        itemIndex
      )
    }

    return createPortal(
      <div
        ref={setEl}
        className="lighter-dropdown-background z-[250] divide-y space-y-1.5 dashboard-divide overflow-auto overscroll-contain custom-scrollbar py-1 w-64 rounded-md"
        style={{
          ...styles.popper,
          maxHeight: styles.maxSize ? styles.maxSize.height : 'calc(100dvh - 20px)',
          height: styles.maxSize ? styles.maxSize.height : 'auto',
        }}
        {...attributes.popper}
        tabIndex={-1}
      >
        <RenderAfter update={update}>
          {categoryOrder.map((key, categoryIndex) => {
            const value = results[key]

            if (value?.length > 0) {
              return (
                <div key={key}>
                  <p className="px-3 pt-2 pb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase dark:text-foreground">
                    {key}
                  </p>
                  {value?.map((result: any, index: number) => {
                    const adjustedIndex = getAdjustedIndex(categoryIndex, index)

                    const displayedValue = result?.name || result?.title

                    return (
                      <Tooltip
                        onlyChild={true}
                        customDelay={500}
                        noAlignment={true}
                        key={result.id}
                        child={
                          <MentionItem
                            isActive={hoverIndex === adjustedIndex}
                            onMouseEnter={() => setHoverIndex(adjustedIndex)}
                            onClick={() => handleCommand(adjustedIndex)}
                          >
                            {result?.postStatus?.color && (
                              <div className="flex-shrink-0 ml-1 mr-1">
                                <TagBullet theme={result.postStatus?.color} />
                              </div>
                            )}
                            {result?.changelogCategories ? (
                              <ChangelogCategoryResult result={result} />
                            ) : result?.profilePicture ? (
                              <div className="mr-1.5 -ml-1">
                                <UserPicture
                                  small={true}
                                  authorId={result?.id}
                                  img={result?.profilePicture}
                                />
                              </div>
                            ) : null}
                            <span className="truncate">{displayedValue}</span>
                            {activeAuthor && result.id === activeAuthor && (
                              <StarIcon className="flex-shrink-0 w-4 h-4 ml-auto secondary-svg" />
                            )}
                          </MentionItem>
                        }
                        dropDown={
                          displayedValue?.length > 30 ? (
                            <div className="text-sm p-1.5 text-left flex-wrap overflow-hidden text-gray-400 dark:text-foreground font-medium">
                              {displayedValue}
                            </div>
                          ) : null
                        }
                      />
                    )
                  })}
                </div>
              )
            }
            return null
          })}
        </RenderAfter>
      </div>,
      document.body
    )
  }
)
MentionList.displayName = 'MentionList'
