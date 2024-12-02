import {
  ClockIcon,
  CurrencyDollarIcon,
  FireIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
} from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import React, { useState } from 'react'
import { useCurrentOrganization } from '../data/organization'
import { ISubmissionFilters } from '../interfaces/ISubmission'
import { useUser } from '../data/user'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import MultiselectButton from './MultiselectButton'
import { cn } from '@/lib/utils'
import { can } from '@/lib/acl'

export const sortBy = {
  top: 'upvotes:desc',
  recent: 'date:desc',
  trending: 'trending',
  inReview: 'inReview:true',
  mrr: 'totalUpvotersMonthlySpend:desc',
}

const PopularitySorter: React.FC<{
  filters: ISubmissionFilters
  setFilters: React.Dispatch<React.SetStateAction<ISubmissionFilters>>
  widget?: boolean
  alignRight?: boolean
  CustomButton?: React.FC<{ children: React.ReactNode }>
}> = ({ filters, setFilters, widget, alignRight, CustomButton }) => {
  const [value, setValue] = useState('Recent posts')

  const { org } = useCurrentOrganization()
  const { t } = useTranslation()

  const sortByNames = {
    [sortBy.top]: t('top-upvoted'),
    [sortBy.recent]: t('recent-posts'),
    [sortBy.trending]: t('trending-posts'),
    [sortBy.inReview]: t('pending-posts'),
    [sortBy.mrr]: t('upvoter-mrr'),
  }
  const { user } = useUser()

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {CustomButton ? (
          <div onClick={(e) => e.stopPropagation()}>
            <CustomButton>
              {!filters.inReview && (
                <>
                  {filters.sortBy === sortBy.top && (
                    <TrendingUpIcon className="flex-shrink-0 w-4 h-4 secondary-svg" />
                  )}
                  {filters.sortBy === sortBy.recent && (
                    <ClockIcon className="flex-shrink-0 w-4 h-4 secondary-svg" />
                  )}
                  {filters.sortBy === sortBy.trending && (
                    <FireIcon className="flex-shrink-0 w-4 h-4 secondary-svg" />
                  )}
                  {filters.sortBy === sortBy.mrr && (
                    <CurrencyDollarIcon className="flex-shrink-0 w-4 h-4 secondary-svg" />
                  )}
                </>
              )}
              {filters?.inReview && (
                <ShieldCheckIcon className="flex-shrink-0 w-4 h-4  secondary-svg" />
              )}
            </CustomButton>
          </div>
        ) : (
          <MultiselectButton
            className={cn(
              'w-[190px] pl-3 py-1.5 pr-10 dark:text-foreground text-gray-500',
              widget && 'py-1'
            )}
            icon={
              <>
                {!filters.inReview && (
                  <>
                    {filters.sortBy === sortBy.top && (
                      <TrendingUpIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                    )}
                    {filters.sortBy === sortBy.recent && (
                      <ClockIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                    )}
                    {filters.sortBy === sortBy.trending && (
                      <FireIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                    )}
                    {filters.sortBy === sortBy.mrr && (
                      <CurrencyDollarIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                    )}
                  </>
                )}
                {filters?.inReview && (
                  <ShieldCheckIcon className="flex-shrink-0 w-4 h-4 mr-1 secondary-svg" />
                )}
              </>
            }
          >
            {filters.sortBy &&
              !filters.inReview &&
              sortByNames[filters.sortBy ? filters.sortBy : '']}
            {filters?.inReview && t('pending-posts')}
            {!filters.sortBy && !filters?.inReview && 'Sorting options'}
          </MultiselectButton>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" align={alignRight ? 'start' : 'end'}>
        <DropdownMenuItem
          onSelect={() => {
            if (filters.sortBy === 'trending') {
              setFilters((prev) => {
                delete prev['startDate']
                delete prev['endDate']
                return { ...prev, sortBy: sortBy.top, inReview: false }
              })
            } else {
              setFilters((prev) => ({ ...prev, sortBy: sortBy.top, inReview: false }))
            }
          }}
          className={`${filters.sortBy === sortBy.top ? 'dropdown-active-item' : ''} dropdown-item`}
        >
          <TrendingUpIcon className="w-4 h-4 mr-1.5 secondary-svg" />
          {t('top-upvoted-posts')}
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => {
            setFilters((prev) => ({
              ...prev,
              sortBy: sortBy.recent,
              inReview: false,
            }))
          }}
          className={`${
            filters.sortBy === sortBy.recent && !filters.inReview ? 'dropdown-active-item' : ''
          } dropdown-item`}
        >
          <ClockIcon className="w-4 h-4 mr-1.5 secondary-svg" />
          {t('recent-posts')}
        </DropdownMenuItem>

        {filters?.segment === undefined && (
          <DropdownMenuItem
            onSelect={() => {
              setFilters((prev) => ({
                ...prev,
                sortBy: sortBy.trending,
                inReview: false,
              }))
            }}
            className={`${
              filters.sortBy === sortBy.trending ? 'dropdown-active-item' : ''
            } dropdown-item`}
          >
            <FireIcon className="w-4 h-4 mr-1.5 secondary-svg" />
            {t('trending-posts')}
          </DropdownMenuItem>
        )}

        {org && user && (
          <>
            {can(user?.id, 'view_users', org) ? (
              <DropdownMenuItem
                onSelect={() => {
                  setFilters((prev) => ({
                    ...prev,
                    sortBy: 'totalUpvotersMonthlySpend:desc',
                    inReview: false,
                  }))
                }}
                className={`${
                  filters.sortBy === sortBy.mrr ? 'dropdown-active-item' : ''
                } dropdown-item`}
              >
                <CurrencyDollarIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                {t('upvoter-mrr')}
              </DropdownMenuItem>
            ) : null}

            {can(user?.id, 'moderate_posts', org) ? (
              <DropdownMenuItem
                onSelect={() => {
                  setFilters((prev) => ({
                    ...prev,
                    inReview: true,
                    sortBy: '',
                  }))
                }}
                className={`${filters.inReview ? 'dropdown-active-item' : ''} dropdown-item`}
              >
                <ShieldCheckIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                {t('pending-posts')}
              </DropdownMenuItem>
            ) : null}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default PopularitySorter
