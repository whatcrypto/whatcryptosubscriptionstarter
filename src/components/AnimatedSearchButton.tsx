import { cn } from '@/lib/utils'
import { SearchIcon, XIcon } from '@heroicons/react/solid'
import { AnimatePresence, motion } from 'framer-motion'
import React, { SetStateAction, useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import { ISubmissionFilters } from '@/interfaces/ISubmission'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './radix/Tooltip'
import { useAtom } from 'jotai'
import { useTranslation } from 'next-i18next'
import { authenitcateModalAtom } from '@/atoms/authAtom'
import { createPostAtom } from '@/atoms/displayAtom'
import OutsideClickHandler from 'react-outside-click-handler'

const AnimatedSearchButton: React.FC<{
  open: boolean
  setOpen: React.Dispatch<SetStateAction<boolean>>
  disableKeybind?: boolean
  filters: ISubmissionFilters
  setFilters?: React.Dispatch<React.SetStateAction<ISubmissionFilters>>
  publicBoard?: boolean
  small?: boolean
  changelog?: boolean
  setValue?: (value: string) => void
  dontOpenWhenSet?: boolean
}> = ({
  disableKeybind,
  filters,
  setFilters,
  publicBoard,
  open,
  setOpen,
  small,
  changelog,
  setValue,
  dontOpenWhenSet,
}) => {
  const [searchQuery, setSearchQuery] = useState<undefined | string>('')
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [createPost, setCreatePost] = useAtom(createPostAtom)

  const inputRef = useRef(null) // Step 2: Creating a ref
  const { t } = useTranslation()

  const [initialRender, setInitialRender] = useState(true)

  const toggleOpen = () => {
    setOpen((prevOpen) => {
      setInitialRender(false)
      const newState = !prevOpen
      if (newState && inputRef.current) {
        // Step 4: Focus the input when opening
        // @ts-ignore
        inputRef?.current?.focus()
      }

      if (!newState) {
        setSearchQuery('')
        changelog && setValue
          ? setValue('')
          : setFilters && setFilters((prev: ISubmissionFilters) => ({ ...prev, q: '' }))
      }

      return newState
    })
  }

  useEffect(() => {
    if (filters.q && initialRender && !dontOpenWhenSet) {
      setSearchQuery(filters.q)
      setOpen(true)
      setInitialRender(false)
    }
  }, [filters.q, initialRender, dontOpenWhenSet])

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      changelog && setValue
        ? setValue(query)
        : setFilters && setFilters((prev: ISubmissionFilters) => ({ ...prev, q: query }))
    }, 550), // 300ms debounce time
    []
  )

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      // Check if Ctrl + F is pressed
      if (
        event.ctrlKey &&
        event.key === 'f' &&
        !disableKeybind &&
        !authenitcateModal &&
        !createPost
      ) {
        event.preventDefault() // Prevent the default browser search
        setOpen(true) // Open the search input
        if (inputRef.current) {
          // @ts-ignore
          inputRef.current.focus() // Focus the input when opened with Ctrl + F
        }
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [disableKeybind, authenitcateModal, createPost]) // Empty dependency array to ensure this runs only once on mount

  return (
    <OutsideClickHandler
      display="contents"
      onOutsideClick={() => {
        if (open && searchQuery === '') setOpen(false)
      }}
    >
      <AnimatePresence initial={false}>
        <div
          className={cn(
            'flex items-start justify-end relative rounded-md',
            !publicBoard && ' bg-white dark:bg-[#232735]',
            publicBoard && 'flex-1'
          )}
        >
          <motion.div
            animate={{ width: open ? (publicBoard ? '100%' : 270) : 0 }}
            className={cn(
              ' group flex relative items-center h-[33.58px] overflow-hidden',
              small && 'h-8'
              // open && '-mr-4'
            )}
          >
            <motion.div
              className="z-10 cursor-text"
              onClick={() => {
                // @ts-ignore
                if (inputRef?.current) inputRef?.current?.focus()
              }}
            >
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipTrigger asChild>
                    <SearchIcon className="w-3.5 h-3.5 secondary-svg ml-3" />
                  </TooltipTrigger>
                  <TooltipContent>Powered by AI</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
            <motion.input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                debouncedSearch(e.target.value)
              }}
              ref={inputRef} // Step 3: Attaching the ref to the input
              placeholder={changelog ? 'Search for changelogs' : 'Search for posts'}
              autoFocus={!initialRender}
              className="pl-9 pr-2 mr-4 rounded-r-none dark:bg-transparent absolute border-r-0 bg-transparent inset-0 shadow-none dark:shadow-none focus:ring-0 dark:focus:ring-0 focus:outline-none dark:focus:outline-none w-full"
            />
          </motion.div>
          <motion.button
            animate={{
              borderRadius: open ? '0 0.375rem 0.375rem 0' : '0.375rem 0.375rem 0.375rem 0.375rem',
              transition: open ? { duration: 0, delay: 0 } : { delay: 0.2 },
            }}
            onClick={toggleOpen} // Updated click handler
            className={cn(
              'hidden sm:flex dashboard-secondary flex-shrink-0 overflow-hidden h-[33.58px] z-10 py-2 ring-0 focus:ring-0',
              open && 'dark:shadow-none shadow-none dark:border-dark-accent/80',
              publicBoard && 'bg-transparent dark:bg-transparent',
              small && 'h-8'
            )}
          >
            {open ? (
              <XIcon className="w-3.5 h-3.5 secondary-svg" />
            ) : (
              <SearchIcon className="w-3.5 h-3.5 secondary-svg" />
            )}
            {publicBoard && (
              <motion.span
                animate={{
                  width: open ? 0 : 'auto',
                  opacity: open ? 0 : 1,
                  marginLeft: open ? 0 : '0.375rem',
                }}
              >
                {t('search')}
              </motion.span>
            )}
          </motion.button>
          <motion.button
            animate={{
              borderRadius: open ? '0 0.375rem 0.375rem 0' : '0.375rem 0.375rem 0.375rem 0.375rem',
              transition: open ? { duration: 0, delay: 0 } : { delay: 0.2 },
            }}
            onClick={toggleOpen} // Updated click handler
            className={cn(
              'sm:hidden dashboard-secondary flex-shrink-0 overflow-hidden h-[33.58px] z-10 py-2 ring-0 focus:ring-0',
              open && 'dark:shadow-none shadow-none dark:border-dark-accent/80',
              publicBoard && 'bg-transparent dark:bg-transparent',
              small && 'h-8'
            )}
          >
            {open ? (
              <XIcon className="w-3.5 h-3.5 secondary-svg" />
            ) : (
              <SearchIcon className="w-3.5 h-3.5 secondary-svg" />
            )}
          </motion.button>
        </div>
      </AnimatePresence>
    </OutsideClickHandler>
  )
}

export default AnimatedSearchButton
