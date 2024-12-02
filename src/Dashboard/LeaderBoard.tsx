import { ILeaderboardEntry, useLeaderBoard } from '@/data/organization'
import { CheckCircleIcon } from '@heroicons/react/solid'
import React from 'react'
import Loader from './Loader'
import Image from 'next/legacy/image'
import Tooltip from './Tooltip'
import { cn } from '@/lib/utils'
import { useTranslation } from 'next-i18next'
import Link from './CustomLink'

const Leaderboard = () => {
  const { leaderboard, isLoading } = useLeaderBoard()
  const { t } = useTranslation()

  return (
    <div>
      <p className="flex items-center justify-between text-sm font-medium text-gray-500 dark:text-gray-100">
        {t('most-helpful')}
      </p>
      {!isLoading ? (
        <div className="mt-3 border-gray-100 divide-y border-y dark:border-border">
          {leaderboard?.length === 0 && (
            <div className={cn('py-3 text-gray-500 border-gray-100 dark:border-border')}>
              <p className="max-w-[230px] text-sm text-gray-400 dark:text-foreground">
                {t('be-the-first-one-to-help-the-team')}
              </p>
            </div>
          )}
          {leaderboard?.map((author: ILeaderboardEntry, index: number) => (
            <div
              key={author.user._id}
              className={cn(
                'py-3 text-gray-500 border-gray-100 dark:border-border',
                index > 2 && 'hidden md:block'
              )}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <div className="pr-1 w-4 flex items-center justify-center font-medium mr-1.5 dark:text-foreground/80 text-xs">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </div>
                  <div className=" mr-1.5 w-4 h-4 ">
                    {author?.user?.picture ? (
                      <div className="relative flex items-center justify-center flex-shrink-0 w-4 h-4 rounded-full bg-gray-100/60 dark:bg-secondary/50 ">
                        <Image
                          unoptimized
                          className="object-cover rounded-full"
                          src={author?.user?.picture}
                          height={16}
                          width={16}
                        />
                      </div>
                    ) : (
                      <div className="bg-gray-100 rounded-full dark:bg-gray-500">
                        <svg
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          className="w-4 h-4 font-semibold text-gray-400 rounded-full dark:text-foreground "
                        >
                          <path
                            d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                            className="jsx-1981044996"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  {author?.user?._id ? (
                    <Link legacyBehavior href={`/u/${author?.user?._id}`}>
                      <button className="font-medium unstyled-button rounded-md px-0.5 -mx-0.5 hover:bg-gray-100/40 dark:hover:bg-secondary dark:text-foreground max-w-[190px] truncate">
                        {author.user.name}
                      </button>
                    </Link>
                  ) : (
                    <button className="font-medium unstyled-button rounded-md px-0.5 -mx-0.5 pointer-events-none dark:text-foreground max-w-[190px] truncate">
                      {author.user.name}
                    </button>
                  )}
                </div>{' '}
                <div className="font-semibold dark:text-foreground px-1 py-0.5 rounded-lg text-xs">
                  <Tooltip
                    child={
                      <div className="flex items-center ">
                        <CheckCircleIcon className="w-3.5 h-3.5 mr-1.5 secondary-svg" />
                        <code className="transparent-code">{author.score}</code>
                      </div>
                    }
                    dropDown={
                      <div className="flex flex-col items-start space-y-2 text-xs text-gray-400 dark:text-foreground">
                        <p>
                          <code className="font-semibold">{author.upvotesReceived}</code> Upvote
                          {author.upvotesReceived !== 1 && 's'} received
                        </p>
                        <p>
                          <code className="font-semibold">{author.commentsLeft}</code> Comment
                          {author.commentsLeft !== 1 && 's'} created
                        </p>
                        <p>
                          <code className="font-semibold">{author.ideasSubmitted}</code> Idea
                          {author.ideasSubmitted !== 1 && 's'} submitted
                        </p>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-8">
          <div className="w-5 h-5 secondary-svg">
            <Loader />
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
