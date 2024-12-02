// .components/Search/CustomSearchBox.js

import { connectSearchBox } from 'react-instantsearch-dom'
import ShineBorder from '../ShinyBorder'
import TextareaAutosize from 'react-textarea-autosize'
import { cn } from '@/lib'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useKnowledgebaseStructure } from '@/data/knowledgebase'
import { useTranslation } from 'next-i18next'

export const searchBoxClasses = (popupVersion: boolean, widget: boolean) => {
  return {
    wrapper: cn(
      widget
        ? 'dark:bg-foreground/[6.5%] bg-white/90 border-gray-100/60 dark:border-foreground/[10%]'
        : true
        ? 'dark:bg-foreground/[4.5%] border-gray-100/60 dark:border-foreground/[10%]' // Style for Safari
        : 'dark:bg-foreground/[2%] border-gray-100/60 dark:border-foreground/[10%]', // Style for other browsers
      '!rounded-lg border relative',
      // true && 'backdrop-blur dark:backdrop-blur',
      popupVersion && !widget && 'bg-white dark:bg-card/[80%]',
      popupVersion && widget && 'dropdown-background'
    ),
    input: cn(
      'bg-transparent relative dark:border-none !pr-16 p-4 shadow-gray-200/20 backdrop-blur-sm shadow-xl dark:shadow-lg rounded-lg border-none resize-none placeholder:text-gray-300/60 dark:bg-transparent ring-0 whitespace-pre-wrap break-words custom-scrollbar-stronger max-h-[200px] focus:ring-0 text-lg font-normal text-gray-600 dark:text-white',
      widget &&
        'p-3 text-base dark:shadow-none placeholder:text-gray-300/80 dark:placeholder:text-white/70',
      widget && !popupVersion && 'placeholder:text-gray-300/80 dark:placeholder:text-white/70'
    ),
  }
}

function CustomSearchBox({
  refine,
  toggleMenu,
  popupVersion,
  widget,
  currentRefinement,
  handleKeyDown,
}: any) {
  // Cache the searchbox classes
  const classes = useMemo(() => searchBoxClasses(popupVersion, widget), [popupVersion, widget])

  const { data } = useKnowledgebaseStructure()
  const { t } = useTranslation()

  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      try {
        // @ts-ignore
        inputRef.current.focus()
      } catch (e) {
        console.log(e)
      }
    }
  }, [inputRef])

  return (
    <form action="" className="relative" role="search">
      <ShineBorder borderWidth={1}>
        <div
          onClick={() => {
            toggleMenu()
          }}
          className={classes.wrapper}
        >
          <TextareaAutosize
            id="algolia_search"
            data-gramm="false"
            onChange={(e) => {
              refine(e.currentTarget.value)
              toggleMenu()
            }}
            autoFocus={true}
            rows={1}
            maxRows={2}
            value={currentRefinement} // Use the currentRefinement here
            ref={inputRef}
            onKeyDown={handleKeyDown}
            placeholder={
              data?.searchPlaceholder === 'Search for articles'
                ? t('search-for-articles')
                : data?.searchPlaceholder || t('search-for-articles')
            }
            className={classes.input}
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
    </form>
  )
}

export default connectSearchBox(CustomSearchBox)
