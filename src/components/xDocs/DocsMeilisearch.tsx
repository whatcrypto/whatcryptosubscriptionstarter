import React, { useMemo, useState } from 'react'
import { helpCenterUrlPartsAtom, meilisearchClientAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'
import { InstantSearch, Configure, connectHits } from 'react-instantsearch-dom'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Command } from 'cmdk'
import ShineBorder from '../ShinyBorder'
import TextareaAutosize from 'react-textarea-autosize'
import { useRouter } from 'next/router'
import SearchBox, { searchBoxClasses } from './SearchBox'
import OutsideClickHandler from 'react-outside-click-handler'
import { Transition } from '@headlessui/react'
import { useKnowledgebaseStructure } from '@/data/knowledgebase'
import { useTranslation } from 'next-i18next'
import Hits from '../DocsMeilisearchHits'
import HelpDocsAISearch from '../HelpDocsAISearch'

const DocsMeilisearch: React.FC<{
  popupVersion?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  dashboardView?: boolean
  widget?: boolean
  setActiveView?: React.Dispatch<React.SetStateAction<{ type: string; id: string }>>
}> = ({ popupVersion, setOpen, dashboardView, widget, setActiveView }) => {
  const [state, setState] = useState({ query: '' })

  const router = useRouter()

  const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)
  const [helpCenterUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showAIView, setShowAIView] = useState(false)

  const [aiSearchForQuery, setAiSearchForQuery] = useState('')

  const { data } = useKnowledgebaseStructure()
  
  const { t, i18n } = useTranslation()
  const searchClasses = useMemo(
    () => searchBoxClasses(popupVersion ? true : false, widget ? true : false),
    [popupVersion, widget]
  )

  useEffect(() => {
    if (meilisearchClient) {
      meilisearchClient.clearCache()
    }
  }, [meilisearchClient])

  // When escape is pressed, close the search
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const CustomHits = connectHits(Hits)

  if (meilisearchClient) {
    return (
      <div>
        <div className="relative w-full">
          <InstantSearch
            onSearchStateChange={(searchState) => {
              setState(searchState)
              if (!searchState.query) {
                setShowAIView(false)
                setAiSearchForQuery('')
              }
            }}
            searchState={state}
            searchClient={meilisearchClient}
            indexName="helpcenterarticles"
          >
            <OutsideClickHandler
              onOutsideClick={() => {
                setIsSearchOpen(false)
              }}
            >
              <Command>
                <Configure
                  query={''}
                  hitsPerPage={widget ? (popupVersion ? 5 : 3) : 10}
                  filters={`state="live" AND locale="${
                    i18n.language === 'default' ? 'en' : i18n.language
                  }"`}
                  attributesToHighlight={['title', 'strippedBody', 'description']}
                  attributesToSnippet={['strippedBody:70', 'description:70']}
                />
                <div>
                  {/* @ts-ignore */}
                  <SearchBox
                    // @ts-ignore
                    handleKeyDown={(e: any) => {
                      if (e.key === 'Enter' && !e.shiftKey && showAIView) {
                        e.preventDefault()
                        setAiSearchForQuery(state.query)
                      }
                    }}
                    // @ts-ignore
                    widget={widget ? true : false}
                    popupVersion={popupVersion ? true : false}
                    toggleMenu={() => setIsSearchOpen(true)}
                    defaultRefinement={state.query}
                    setAiSearchForQuery={setAiSearchForQuery}
                  />
                </div>
                {popupVersion ? (
                  <div
                    className={cn(
                      'shadow-gray-200/30 z-50 rounded-lg mt-5 bg-white/90 -inset-x-2 sm:-inset-x-[15px] dropdown-background '
                    )}
                  >
                    {showAIView ? (
                      <HelpDocsAISearch
                        query={aiSearchForQuery}
                        onBack={() => setShowAIView(false)}
                      />
                    ) : (
                      <CustomHits
                        state={state}
                        setShowAIView={setShowAIView}
                        showAIView={showAIView}
                        dashboardView={dashboardView}
                        aiSearchForQuery={aiSearchForQuery}
                        setAiSearchForQuery={setAiSearchForQuery}
                      />
                    )}
                  </div>
                ) : (
                  <Transition
                    show={isSearchOpen && state?.query !== ''}
                    enter="transition ease-out duration-150"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave={cn('transition ease-in', state.query ? ' duration-150' : 'hidden')}
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                    className={cn(
                      'absolute overflow-hidden rounded-[11px] shadow-gray-200/30 z-[300] top-20 bg-white/90 -inset-x-2 sm:-inset-x-[15px] dropdown-background dark:bg-card/90',
                      widget && 'top-16 dark:bg-background/50'
                    )}
                  >
                    <ShineBorder borderRadius={11} opacity={5} borderWidth={1}>
                      <div className="w-full backdrop-blur-sm">
                        {showAIView ? (
                          <HelpDocsAISearch
                            query={aiSearchForQuery}
                            onBack={() => setShowAIView(false)}
                          />
                        ) : (
                          <CustomHits
                            state={state}
                            setShowAIView={setShowAIView}
                            showAIView={showAIView}
                            dashboardView={dashboardView}
                            aiSearchForQuery={aiSearchForQuery}
                            setAiSearchForQuery={setAiSearchForQuery}
                          />
                        )}
                      </div>
                    </ShineBorder>
                  </Transition>
                )}
              </Command>
            </OutsideClickHandler>
          </InstantSearch>
        </div>
      </div>
    )
  } else {
    return (
      <ShineBorder borderWidth={1}>
        <div className={searchClasses.wrapper}>
          <TextareaAutosize
            data-gramm="false"
            onChange={(e) => setState({ query: e.target.value })}
            autoFocus
            rows={1}
            value={state.query}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
              }
            }}
            placeholder={
              data?.searchPlaceholder === 'Search for articles'
                ? t('search-for-articles')
                : data?.searchPlaceholder || t('search-for-articles')
            }
            className={searchClasses.input}
            // className="bg-transparent relative  pr-16 p-4 shadow-gray-200/20 backdrop-blur-sm shadow-xl dark:shadow-lg rounded-lg border-none resize-none placeholder:text-gray-300/60 dark:bg-transparent ring-0 whitespace-pre-wrap break-words custom-scrollbar-stronger max-h-[200px] focus:ring-0 text-lg font-normal text-gray-600 dark:text-white"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute inset-y-0 w-5 h-6 my-auto text-foreground/40 sm:w-7 sm:h-7 right-4 dark:text-foreground/30"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </ShineBorder>
    )
  }
}

export default DocsMeilisearch
