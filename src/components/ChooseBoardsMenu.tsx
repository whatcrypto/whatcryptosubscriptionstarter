import { useCurrentOrganization } from '@/data/organization'
import { ISubmission, ISubmissionFilters } from '@/interfaces/ISubmission'
import { cn } from '@/lib/utils'
import { getFirstEmoji, removeEmojis } from '@/pages/widget/feedback-widget'
import { ArrowRightIcon, LockClosedIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import Leaderboard from './LeaderBoard'
import { useUser, useUserProfilePreview } from '@/data/user'
import TagBullet from './TagBullet'
import { isMember } from '@/lib/acl'
import Link from './CustomLink'

const ChooseBoardsMenu: React.FC<{
  setFilters: Dispatch<SetStateAction<ISubmissionFilters>>
  filters: ISubmissionFilters
  setActiveSubmissionId: Dispatch<SetStateAction<string>>
  setMainPostView: Dispatch<SetStateAction<boolean>>
  setUrl: (id: any) => void
}> = ({ setFilters, filters, setActiveSubmissionId, setMainPostView, setUrl }) => {
  const { t } = useTranslation()

  const { org } = useCurrentOrganization()

  const { user } = useUser()

  const { data, userMutate } = useUserProfilePreview(
    user && !isMember(user?.id, org) ? true : false
  )

  useEffect(() => {
    if (user) {
      userMutate()
    }
  }, [user])

  return (
    <div>
      {data?.recentPosts && data?.recentPosts.length > 0 && user && !isMember(user?.id, org) && (
        <div className="hidden md:block">
          <div className="mb-5 up-element dark:bg-secondary/15 dark:shadow-none relative overflow-hidden">
            <div className="relative p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="!h-5 absolute top-3 -rotate-45 right-2.5 !w-5 secondary-svg opacity-40"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>

              <p className="mb-1.5 text-sm font-medium text-gray-500 dark:text-gray-100">
                {t('your-posts')}{' '}
                <span className="dark:text-foreground/80 text-[13px]">({data?.postsCreated})</span>
              </p>
              <div className=" border-gray-100 dark:border-border max-h-[348px] overflow-auto custom-scrollbar-stronger space-y-1">
                {data?.recentPosts &&
                  data?.recentPosts?.map((item: ISubmission) => (
                    <div
                      onClick={() => {
                        setActiveSubmissionId(item.id)
                        setMainPostView(true)
                        setUrl(`/p/${item.slug}`)
                      }}
                      key={item.id}
                      className="text-[13px] hover:cursor-pointer pl-[5px] group flex items-center py-1 font-medium"
                    >
                      <TagBullet theme={item?.postStatus?.color} />
                      <p className="p-1 -my-1 truncate rounded-md main-transition group-hover:bg-gray-100/30 dark:group-hover:bg-secondary">
                        {item?.title}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
            <Link legacyBehavior href={'/u/' + user?.id}>
              <div className="flex items-center py-2.5 cursor-pointer dark:hover:bg-secondary/60 hover:bg-white main-transition border-t dashboard-border dark:shadow-inner bg-background justify-center">
                <p className="text-xs truncate px-3 font-medium flex items-center text-foreground/90 dark:text-foreground/80">
                  <span className="truncate">{t('view-all-your-activity')}</span>
                  <ArrowRightIcon className="!h-3 !w-3 inline-block ml-1.5 opacity-70" />
                </p>
              </div>
            </Link>
          </div>
        </div>
      )}
      <div className="flex-col hidden md:flex">
        <div className="mb-4">
          <p className="mb-2 text-sm font-medium text-gray-500 dark:text-gray-100">{t('boards')}</p>
          <div className="p-2 -m-2 max-h-[448px] overflow-auto custom-scrollbar-stronger space-y-0.5">
            <div className="flex items-center">
              <button
                onClick={() => {
                  setFilters((prev: ISubmissionFilters) => ({
                    ...prev,
                    advancedFilters: prev.advancedFilters.filter((filter) => filter.type !== 'b'),
                  }))
                }}
                className={cn(
                  !filters?.advancedFilters?.find((filter) => filter.type === 'b')
                    ? ''
                    : 'bg-transparent shadow-none border-transparent dark:shadow-none dark:bg-transparent dark:border-transparent',
                  `flex items-center dashboard-secondary w-full px-2 py-1.5 dark:text-foreground space-x-2 text-sm font-medium text-gray-500 `
                )}
              >
                <div className="pr-1 mr-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 secondary-svg"
                  >
                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
                  </svg>
                </div>
                {t('view-all-posts')}
              </button>
            </div>
            {org?.postCategories?.map((cat) => {
              return (
                <div className="flex items-center" key={cat.category}>
                  <button
                    onClick={() => {
                      setFilters((prev: ISubmissionFilters) => ({
                        ...prev,
                        advancedFilters: [
                          ...prev.advancedFilters.filter((filter) => filter.type !== 'b'),
                          {
                            type: 'b',
                            operator: 'is',
                            id: uuid(),
                            values: [cat.id],
                          },
                        ],
                      }))
                    }}
                    className={cn(
                      filters?.advancedFilters?.find(
                        (filter) => filter.type === 'b' && filter.values[0] === cat.id
                      ) &&
                        filters?.advancedFilters?.filter((filter) => filter.type === 'b')
                          ?.length === 1
                        ? ''
                        : 'bg-transparent shadow-none border-transparent dark:shadow-none dark:bg-transparent dark:border-transparent',
                      `flex items-center dashboard-secondary text-left w-full px-2 py-1.5 dark:text-foreground space-x-2 text-sm font-medium text-gray-500 `
                    )}
                  >
                    {cat.private && (
                      <span className="pr-1">
                        <LockClosedIcon
                          className={cn(
                            'w-4 h-4 text-background-accent/50 dark:text-background-accent',
                            getFirstEmoji(cat.category) ? '-mr-1.5' : 'mr-1.5'
                          )}
                        />
                      </span>
                    )}
                    {getFirstEmoji(cat.category) && (
                      <div className={cn('pr-1 mr-[3px]', cat.private && 'pr-0.5 mr-px')}>
                        <span className="w-4">{getFirstEmoji(cat.category)}</span>
                      </div>
                    )}
                    {removeEmojis(cat.category)}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
        {org.name === 'rolla' && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-100">Products</p>
            <div className="mt-2  space-y-0.5">
              {org?.postTags?.map((tag) => {
                return (
                  <div className="flex items-center" key={tag.id}>
                    <button
                      onClick={() => {
                        setFilters((prev: ISubmissionFilters) => {
                          const advancedWithoutTags = prev.advancedFilters.filter(
                            (filter) => filter.type !== 't'
                          )
                          return {
                            ...prev,
                            advancedFilters: prev.advancedFilters.find(
                              (filter) =>
                                filter.type === 't' &&
                                filter.values?.length === 1 &&
                                filter.values[0] === tag.id
                            )
                              ? advancedWithoutTags
                              : [
                                  ...advancedWithoutTags,
                                  {
                                    type: 't',
                                    operator: 'is',
                                    id: uuid(),
                                    values: [tag.id],
                                  },
                                ],
                          }
                        })
                      }}
                      className={cn(
                        filters?.advancedFilters?.find(
                          (filter) => filter.type === 't' && filter.values[0] === tag.id
                        ) &&
                          filters?.advancedFilters?.filter((filter) => filter.type === 't')
                            ?.length === 1
                          ? ''
                          : 'bg-transparent shadow-none border-transparent dark:shadow-none dark:bg-transparent dark:border-transparent',
                        `flex items-center dashboard-secondary text-left w-full px-2 py-1.5 dark:text-foreground space-x-2 text-sm font-medium text-gray-500 `
                      )}
                    >
                      <TagBullet theme={tag.color} />
                      {getFirstEmoji(tag.name) && (
                        <div className={cn('pr-1 mr-[3px]', tag.private && 'pl-2 pr-0.5 mr-px')}>
                          <span className="w-4">{getFirstEmoji(tag.name)}</span>
                        </div>
                      )}
                      {removeEmojis(tag.name)}
                      {tag.private && (
                        <span className="ml-auto">
                          <LockClosedIcon
                            className={cn(
                              'w-4 h-4 text-background-accent/50 dark:text-background-accent',
                              getFirstEmoji(tag.name) ? '-mr-1.5' : 'mr-1.5'
                            )}
                          />
                        </span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {org?.settings?.hideAuthorInfo ? null : <Leaderboard />}

        {!org?.whitelabel && (
          <div className="items-center justify-center hidden mt-3 md:flex">
            <a
              href={`https://featurebase.app?utm_source=${org.name}&utm_medium=feedback-board&utm_campaign=powered-by&utm_id=${org?.id}`}
              target="_blank"
              rel="noreferrer"
            >
              <button className="px-2 py-1 text-xs font-medium shadow-none text-background-accent white-btn dark:bg-secondary dark:border-secondary/30 hover:dark:bg-secondary/50 rounded-mdinline-flex border-gray-100/50 hover:border-gray-100 ">
                ⚡ {t('powered-by-featurebase')}
              </button>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChooseBoardsMenu
