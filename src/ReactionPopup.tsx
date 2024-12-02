'use client'

import React, { useEffect, useState, useRef } from 'react'
import PopupWrapper from './PopupWrapper'
import { IChangelog } from '@/interfaces/IChangelog'
import { CardContent, CardDescription, CardHeader, CardTitle } from './radix/Card'
import { cn } from '@/lib'
import UserPicture from './UserPicture'
import TrackedUserPreview from './TrackedUserPreview'
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from './radix/Tooltip'
import { meilisearchClientAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'
import { InView } from 'react-intersection-observer'
import Loader from './Loader'

const ReactionPopup: React.FC<{
  setIsOpen: (isOpen: boolean) => void
  isOpen: boolean
  reactions: IChangelog['reactions']
}> = ({ setIsOpen, isOpen, reactions }) => {
  const [meilisearchClient] = useAtom(meilisearchClientAtom)
  const [userDetails, setUserDetails] = useState<Record<string, any>>({})
  const [visibleUserCount, setVisibleUserCount] = useState(10)
  const [loading, setLoading] = useState(false)

  // Ref for the scrollable container
  const containerRef = useRef<HTMLDivElement>(null)

  // Create a map of users to their reactions
  const userReactions = React.useMemo(() => {
    if (!reactions) return {}

    return Object.entries(reactions).reduce(
      (acc, [emoji, data]) => {
        if (!data || !Array.isArray(data.users)) return acc

        data.users.forEach((user) => {
          if (user) {
            if (!acc[user]) acc[user] = []
            acc[user].push(emoji)
          }
        })
        return acc
      },
      {} as Record<string, string[]>
    )
  }, [reactions])

  const totalUsers = Object.keys(userReactions).length
  const allUserEntries = React.useMemo(() => Object.entries(userReactions), [userReactions])

  useEffect(() => {
    if (!isOpen) return // Fetch data only when the popup is open

    const fetchUserDetails = async () => {
      if (!meilisearchClient) return

      // Get user IDs for currently visible users
      const visibleUserEntries = allUserEntries.slice(0, visibleUserCount)
      const userIds = visibleUserEntries.map(([userId]) => userId)

      // Filter out userIds for which we already have details
      const userIdsToFetch = userIds.filter((userId) => !userDetails.hasOwnProperty(userId))

      if (userIdsToFetch.length === 0) {
        // All user details are already fetched
        return
      }

      setLoading(true)

      try {
        const { results } = await meilisearchClient.search([
          {
            indexName: 'adminsandcustomers',
            params: {
              filters: userIdsToFetch.map((id) => `id = "${id}"`).join(' OR '),
              hitsPerPage: userIdsToFetch.length,
            },
          },
        ])

        const newUserDetails = results[0].hits.reduce((acc: Record<string, any>, user: any) => {
          acc[user.id] = user
          return acc
        }, {})

        // For userIds that were not found in the results, set userDetails[userId] = null
        const userIdsNotFound = userIdsToFetch.filter((userId) => !newUserDetails[userId])
        userIdsNotFound.forEach((userId) => {
          newUserDetails[userId] = null
        })

        setUserDetails((prevDetails) => ({ ...prevDetails, ...newUserDetails }))
      } catch (error) {
        console.error('Error fetching user details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserDetails()
  }, [isOpen, meilisearchClient, visibleUserCount, allUserEntries, userDetails])

  const loadMoreUsers = () => {
    if (visibleUserCount < totalUsers) {
      setVisibleUserCount((prevCount) => prevCount + 10)
    }
  }

  const visibleUserEntries = allUserEntries.slice(0, visibleUserCount)

  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
      <CardHeader className="pb-4">
        <CardTitle>User Reactions</CardTitle>
        <CardDescription>
          <span className="font-medium">{totalUsers}</span>{' '}
          {totalUsers === 1 ? 'user has' : 'users have'} reacted
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Assign the ref to the scrollable container */}
        <div
          ref={containerRef}
          className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar-stronger"
        >
          {totalUsers === 0 && (
            <div className="text-sm dark:text-foreground/80 text-gray-400/80">
              No reactions yet, check back later!
            </div>
          )}
          {Object.keys(userDetails)?.length > 0 &&
            visibleUserEntries
              .filter(([userId]) => userDetails[userId] !== null)
              .map(([userId, emojis], index) => {
                const user = userDetails[userId]

                return (
                  <div
                    key={userId}
                    className={cn(
                      'flex items-center rounded-md p-2 px-3 text-sm',
                      index % 2 === 0 && 'bg-gray-50 dark:bg-dark-accent/40'
                    )}
                  >
                    {user === undefined ? (
                      // Show loading placeholder
                      <div className="flex items-center">
                        <div className="w-48 h-5 rounded-full bg-gray-100/60 dark:bg-dark-accent/60 animate-pulse"></div>
                      </div>
                    ) : user === null ? (
                      // User not found
                      <div className="flex items-center">
                        <UserPicture xSmall={true} authorId={userId} img={''} />
                        <span className="ml-2">User not found</span>
                      </div>
                    ) : (
                      // User data available
                      <>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <p className="font-medium truncate max-w-[250px] flex items-center gap-1.5 dark:text-white/[95%] px-1 py-0.5 cursor-default rounded-md -m-1 hover:bg-gray-50 dark:hover:bg-dark-accent/80 main-transition">
                                <UserPicture
                                  xSmall={true}
                                  authorId={userId}
                                  img={user?.profilePicture}
                                />
                                <span className="truncate">{user.name}</span>
                              </p>
                            </TooltipTrigger>
                            <TooltipContent
                              className="pt-0 text-sm px-3 sm:px-0 pb-3 min-w-[320px] max-w-[320px]"
                              side="left"
                            >
                              <TrackedUserPreview userId={userId} />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="mx-1.5">reacted with</span>
                        <span className="flex items-center gap-1">
                          {emojis.map((emoji) => (
                            <span key={emoji}>{emoji}</span>
                          ))}
                        </span>
                      </>
                    )}
                  </div>
                )
              })}

          {/* Infinite Scroll Trigger */}
          {visibleUserCount < totalUsers && (
            <InView
              as="div"
              root={containerRef.current} // Set the root to the scrollable container
              onChange={(inView) => {
                if (inView && !loading) {
                  loadMoreUsers()
                }
              }}
              threshold={0.1} // Adjusted threshold for better trigger
            >
              <div className="flex items-center justify-center mt-4 pb-7">
                <div className="w-6 h-6 secondary-svg">
                  <Loader />
                </div>
              </div>
            </InView>
          )}
        </div>
      </CardContent>
    </PopupWrapper>
  )
}

export default ReactionPopup
