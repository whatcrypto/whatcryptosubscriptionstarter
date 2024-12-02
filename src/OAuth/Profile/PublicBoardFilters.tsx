import { cn } from '@/lib/utils'
import { ChevronDownIcon, ClockIcon, FireIcon, TrendingUpIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import PostCTA from './PostCTA'
import { ISubmissionFilters } from '@/interfaces/ISubmission'
import { sortBy } from './PopularitySorter'
import ActiveFilterTab from './ActiveFilterTab'
import { useCurrentOrganization } from '@/data/organization'
import MainFilterDropdown from './MainFilterDropdown'
import { useTranslation } from 'next-i18next'
import AnimatedSearchButton from './AnimatedSearchButton'
import { AnimatePresence, motion } from 'framer-motion'
import { useUser } from '@/data/user'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/radix/Drawer'

const PublicBoardFilters: React.FC<{
  filters: ISubmissionFilters
  setFilters: React.Dispatch<React.SetStateAction<ISubmissionFilters>>
  setActiveSubmissionId: React.Dispatch<React.SetStateAction<string>>
  setMainPostView: React.Dispatch<React.SetStateAction<boolean>>
  mutateAllSubmissions: Function
  disableKeybind?: boolean
  hidePostCreation?: boolean
}> = ({
  filters,
  setFilters,
  setActiveSubmissionId,
  setMainPostView,
  mutateAllSubmissions,
  disableKeybind,
  hidePostCreation,
}) => {
  const { org } = useCurrentOrganization()
  const sortByOptionsOrder = new Set([
    org.settings.defaultSortingOrder,
    ...['top', 'recent', 'trending'],
  ])
  const [open, setOpen] = useState(false)

  const [drawerOpen, setDrawerOpen] = useState(false)

  const { t } = useTranslation()

  const currentSortOption = () => {
    switch (filters.sortBy) {
      case sortBy.trending:
        return { label: t('trending'), icon: <FireIcon className="secondary-svg mr-1.5" /> }
      case sortBy.top:
        return { label: t('top'), icon: <TrendingUpIcon className="secondary-svg mr-1.5" /> }
      case sortBy.recent:
        return { label: t('new'), icon: <ClockIcon className="secondary-svg mr-1.5" /> }
      default:
        return { label: t('Sort'), icon: null }
    }
  }

  const { label: currentSortLabel, icon: currentSortIcon } = currentSortOption()

  return (
    <div className="p-4 -m-4 overflow-x-auto scrollbar-none">
      <AnimatePresence initial={false}>
        <div className="flex justify-between gap-3 mt-4">
          {!open && (
            <motion.div
              initial={{ opacity: 0, display: 'none' }}
              animate={{ opacity: 1, display: 'flex', transition: { delay: 0.25 } }}
              exit={{ opacity: 0, display: 'none', transition: { duration: 0 } }}
              className="flex"
            >
              <div className="gap-3 hidden sm:flex">
                {Array.from(sortByOptionsOrder).map((sortOption) => {
                  switch (sortOption) {
                    case 'trending':
                      return (
                        <button
                          key="trending"
                          onClick={() => {
                            setFilters((prev: any) => ({
                              ...prev,
                              sortBy: sortBy.trending,
                              inReview: false,
                            }))
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                          className={cn(
                            'dashboard-secondary',
                            filters.sortBy !== sortBy.trending &&
                              'bg-transparent dark:bg-transparent'
                          )}
                        >
                          <FireIcon className="secondary-svg mr-1.5" />
                          {t('trending')}
                        </button>
                      )
                    case 'top':
                      return (
                        <button
                          key="top"
                          onClick={() => {
                            if (filters.sortBy === 'trending') {
                              setFilters((prev: any) => {
                                delete prev['startDate']
                                delete prev['endDate']
                                return { ...prev, sortBy: sortBy.top, inReview: false }
                              })
                            } else {
                              setFilters((prev: any) => ({
                                ...prev,
                                sortBy: sortBy.top,
                                inReview: false,
                              }))
                            }
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                          className={cn(
                            'dashboard-secondary',
                            filters.sortBy !== sortBy.top && 'bg-transparent dark:bg-transparent'
                          )}
                        >
                          <TrendingUpIcon className="secondary-svg mr-1.5" />
                          {t('top')}
                        </button>
                      )
                    case 'recent':
                      return (
                        <button
                          key="recent"
                          onClick={() => {
                            if (filters.sortBy === 'trending') {
                              setFilters((prev: any) => {
                                delete prev['startDate']
                                delete prev['endDate']
                                delete prev['inReview']
                                return { ...prev, sortBy: sortBy.recent }
                              })
                            } else {
                              setFilters((prev: any) => {
                                delete prev['inReview']
                                return { ...prev, sortBy: sortBy.recent }
                              })
                            }
                          }}
                          style={{ whiteSpace: 'nowrap' }}
                          className={cn(
                            'dashboard-secondary',
                            filters.sortBy !== sortBy.recent && 'bg-transparent dark:bg-transparent'
                          )}
                        >
                          <ClockIcon className="secondary-svg mr-1.5" />
                          {t('new')}
                        </button>
                      )
                    default:
                      return null
                  }
                })}
              </div>
              <div className="sm:hidden">
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                  <DrawerTrigger asChild>
                    <button
                      onClick={() => setDrawerOpen(true)}
                      style={{ whiteSpace: 'nowrap' }}
                      className="dashboard-secondary flex items-center"
                    >
                      {currentSortIcon}
                      {currentSortLabel}
                      <ChevronDownIcon className="secondary-svg ml-1.5 opacity-80" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader className="text-left">
                      <DrawerTitle>{t('sort-posts')}</DrawerTitle>
                      <DrawerDescription>
                        {t('select-how-the-posts-should-be-sorted')}
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-2 px-4">
                      {Array.from(sortByOptionsOrder).map((sortOption) => {
                        switch (sortOption) {
                          case 'trending':
                            return (
                              <button
                                key="trending"
                                onClick={() => {
                                  setFilters((prev: any) => ({
                                    ...prev,
                                    sortBy: sortBy.trending,
                                    inReview: false,
                                  }))
                                  setDrawerOpen(false)
                                }}
                                className={cn(
                                  'flex items-center py-1.5 text-sm dashboard-secondary justify-center',
                                  filters.sortBy !== sortBy.trending &&
                                    'bg-transparent dark:bg-transparent'
                                )}
                              >
                                <FireIcon className="secondary-svg mr-1.5" />
                                {t('trending')}
                              </button>
                            )
                          case 'top':
                            return (
                              <button
                                key="top"
                                onClick={() => {
                                  if (filters.sortBy === 'trending') {
                                    setFilters((prev: any) => {
                                      delete prev['startDate']
                                      delete prev['endDate']
                                      return { ...prev, sortBy: sortBy.top, inReview: false }
                                    })
                                  } else {
                                    setFilters((prev: any) => ({
                                      ...prev,
                                      sortBy: sortBy.top,
                                      inReview: false,
                                    }))
                                  }
                                  setDrawerOpen(false)
                                }}
                                className={cn(
                                  'flex items-center py-1.5 text-sm dashboard-secondary justify-center',
                                  filters.sortBy !== sortBy.top &&
                                    'bg-transparent dark:bg-transparent'
                                )}
                              >
                                <TrendingUpIcon className="secondary-svg mr-1.5" />
                                {t('top')}
                              </button>
                            )
                          case 'recent':
                            return (
                              <button
                                key="recent"
                                onClick={() => {
                                  if (filters.sortBy === 'trending') {
                                    setFilters((prev: any) => {
                                      delete prev['startDate']
                                      delete prev['endDate']
                                      delete prev['inReview']
                                      return { ...prev, sortBy: sortBy.recent }
                                    })
                                  } else {
                                    setFilters((prev: any) => {
                                      delete prev['inReview']
                                      return { ...prev, sortBy: sortBy.recent }
                                    })
                                  }
                                  setDrawerOpen(false)
                                }}
                                className={cn(
                                  'flex items-center py-1.5 text-sm dashboard-secondary justify-center',
                                  filters.sortBy !== sortBy.recent &&
                                    'bg-transparent dark:bg-transparent'
                                )}
                              >
                                <ClockIcon className="secondary-svg mr-1.5" />
                                {t('new')}
                              </button>
                            )
                          default:
                            return null
                        }
                      })}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <button className="dashboard-secondary text-center dark:border-border/50 bg-transparent dark:bg-transparent items-center justify-center">
                          Close
                        </button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
            </motion.div>
          )}

          <div className="flex items-center justify-end w-full gap-3 ml-auto">
            <AnimatedSearchButton
              publicBoard={true}
              open={open}
              setOpen={setOpen}
              filters={filters}
              setFilters={setFilters}
              disableKeybind={disableKeybind}
            />
            <MainFilterDropdown
              publicBoard={true}
              activeFilters={filters.advancedFilters}
              setActiveFilters={setFilters}
            />

            {hidePostCreation ? null : (
              <div className="hidden lg:block">
                <PostCTA />
              </div>
            )}
          </div>
        </div>
      </AnimatePresence>

      <ActiveFilterTab
        publicBoard={true}
        setActiveFilters={setFilters}
        activeFilters={filters.advancedFilters}
      />
    </div>
  )
}

export default PublicBoardFilters
