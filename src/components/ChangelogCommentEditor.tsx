import { useCurrentOrganization } from '@/data/organization'
import { useUser } from '@/data/user'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import TextEditor from './TextEditor'
import { postComment } from 'network/lib/submission'
import { useComments } from '@/data/comment'
import { KeyedMutator } from 'swr'
import { toast } from 'sonner'
import { useTranslation } from 'next-i18next'
import CommentSwitchButton from './CommentSwitchButton'
import { ArrowRightIcon, ChartBarIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { AnimatePresence, motion } from 'framer-motion'
import useStickyObserver from '@/hooks/hooks'
import { cn } from '@/lib/utils'
import { authenitcateModalAtom } from '@/atoms/authAtom'
import { IChangelog } from '@/interfaces/IChangelog'
import { reactToChangelog } from 'network/lib/changelog'
import { v4 as uuid } from 'uuid'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './radix/HoverCard'
import Loader from './Loader'
import SimpleTooltip from './SimpleTooltip'
import ReactionPopup from './ReactionPopup'
import { isMember } from '@/lib/acl'
import Link from './CustomLink'

const ChangelogCommentEditor: React.FC<{
  changelogId: string
  sortByComments: {
    sortBy: string
    changelogId: string
  }
  muatateCommentCount: (increase: boolean) => void
  mutateChangelogs: KeyedMutator<any>
  unOpenedChangelog?: boolean
  changelog: IChangelog
  isInView?: boolean
  widget?: boolean
  isCommentsLoading: boolean
}> = ({
  changelogId,
  sortByComments,
  muatateCommentCount,
  unOpenedChangelog,
  mutateChangelogs,
  changelog,
  isInView,
  widget,
  isCommentsLoading,
}) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const [toggleEditor, setToggleEditor] = useState(false)

  const { commentsMutate, rawComments, comments } = useComments(
    isInView || toggleEditor ? sortByComments : null,
    org
  )

  const [formData, setFormData] = useState({ content: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [isPrivateComment, setIsPrivateComment] = useState(false)
  const [openHoverCard, setOpenHoverCard] = useState(false)

  const editorRef = useRef(null)

  const { t } = useTranslation()

  const [hasBeenSticky, setHasBeenSticky] = useState(unOpenedChangelog ? true : false)
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [reactionPopup, setReactionPopup] = useState(false)

  const topCelebrationReactions = ['🔥', '💯', '🎉', '🥳', '❤️', '🎊', '🍾', '🤯', '👀', '🍻']
  const [localReactionData, setLocalReactionData] = useState(changelog?.reactions)

  const stickyRef = useRef(null)
  const sentinelRef = useRef(null)
  const isSticky = useStickyObserver(stickyRef, sentinelRef)

  useEffect(() => {
    if (!isSticky) {
      setHasBeenSticky(true)
    }
  }, [isSticky])

  useEffect(() => {
    if (changelog?.reactions) {
      setLocalReactionData(changelog?.reactions)
    }
  }, [changelog?.reactions])

  const postNewComment = async (changelogId: string, notify: boolean) => {
    if (!loading) {
      if (formData.content.length > 8) {
        setErrors('')
        setLoading(true)
        postComment({
          content: formData.content,
          isPrivate: isPrivateComment,
          changelogId,
          sendNotification: notify,
        })
          .then((resp) => {
            if (resp.data.success) {
              if (rawComments && comments && resp.data.comment.isSpam === false) {
                commentsMutate(
                  rawComments.map((entry: any) => ({
                    ...entry,
                    results: [resp.data.comment, ...comments],
                  })),
                  false
                )
              }
              setFormData({ content: '' })
              setLoading(false)
              // Mutate changelog comment count
              muatateCommentCount(true)
              toast.success('Comment successfully posted!')
              setToggleEditor(false)
              // Reset the editor
              if (editorRef.current) {
                // @ts-ignore
                editorRef.current?.commands?.clearContent(true)
              }
            }
          })
          .catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.error)
          })
      } else {
        setErrors(t('comment-is-empty'))
      }
    }
  }

  const isIframeContext = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.parent !== window
  }, [])

  const reactToLocalChangelog = (emoji: string) => {
    if (user) {
      reactToChangelog({
        changelogId,
        reaction: emoji,
      }).catch((err) => {
        toast.error(err?.response?.data?.error)
      })

      // @ts-ignore
      setLocalReactionData((p) => ({
        ...p,
        [emoji]: {
          count: (p?.[emoji]?.count || 0) + (p?.[emoji]?.interacted ? -1 : 1),
          interacted: p?.[emoji]?.interacted ? false : true,
          // @ts-ignore
          id: p?.[emoji]?.id ? p?.[emoji]?.id : uuid(),
        },
      }))
      // mutateChangelogs()
    } else {
      setAuthenitacteModal(true)
    }
  }
  const getTopReactions = useMemo(() => {
    let reactionsArray = Object.entries(localReactionData || {}).map(([emojiKey, reaction]) => ({
      emojiKey,
      ...reaction,
    }))

    // Add default reactions with zero count if not present
    topCelebrationReactions.forEach((emoji) => {
      if (!reactionsArray.some((reaction) => reaction.emojiKey === emoji)) {
        reactionsArray.push({
          emojiKey: emoji,
          count: 0,
          interacted: false,
          // @ts-ignore
          id: uuid(), // assuming generateUniqueId() function exists to generate a unique ID
        })
      }
    })

    // Sort by count descending, then by the order in topCelebrationReactions
    reactionsArray.sort((a, b) => {
      if (b.count === a.count) {
        return (
          topCelebrationReactions.indexOf(a.emojiKey) - topCelebrationReactions.indexOf(b.emojiKey)
        )
      }
      return b.count - a.count
    })

    // Take the top 3 reactions
    return reactionsArray.slice(0, 3)
  }, [user])

  return (
    <>
      <AnimatePresence initial={false}>
        <div key="sentinel-element" ref={sentinelRef} className="pt-10 sentinel"></div>{' '}
        {/* Sentinel Element */}
        <style>{`
      .ProseMirror p.is-editor-empty:first-child::after {
        margin-top: -20px !important;
      }
      @media (max-width: 640px) {
        .ProseMirror p.is-editor-empty:first-child::after {
          margin-top: -24px !important;
        }
      }
      `}</style>
        <motion.div
          key="main-wrapper"
          animate={{
            paddingBottom:
              isSticky && !hasBeenSticky ? (toggleEditor ? 0 : 36) : !toggleEditor ? 52 : 0,
            width: isSticky && !hasBeenSticky && !toggleEditor ? '480px' : '100%',
            transition: {
              duration: 0.3,
              ease: 'easeInOut',
            },
          }}
          ref={stickyRef}
          className={cn(
            'flex sticky dark:shadow-2xl rounded-lg mx-auto shadow-xl bottom-8 top-6 flex-col-reverse mobile-full-width',
            hasBeenSticky && 'static',
            (!isSticky || hasBeenSticky) && 'dark:shadow-md shadow-sm',
            widget && 'force-full-width'
          )}
        >
          <motion.div
            key="comment-editor"
            animate={{
              height: toggleEditor ? 'auto' : 0,
              transition: {
                duration: 0.3,
                ease: 'easeInOut',
              },
            }}
            className="w-full overflow-hidden rounded-lg -mt-[54px]"
          >
            <div className="!block pt-[58px] styled-editor bg-[#FCFDFE] dark:bg-secondary p-0">
              <TextEditor
                className={cn(
                  'styled-editor relative z-[100] border-0  shadow-none focus:border-0 focus-within:ring-0 focus:ring-0 ring-0 bg-transparent dark:bg-transparent dark:border-0 dark:shadow-none'
                )}
                formData={formData}
                setFormData={(data) => setFormData({ content: data })}
                placeholder={
                  (isPrivateComment ? t('write-a-private-comment') : t('write-a-comment')) + '...'
                }
                editorRef={editorRef}
                height={60}
                insideContent={
                  <CommentSwitchButton
                    buttonText={t('post-comment')}
                    isPrivateComment={isPrivateComment}
                    loading={loading}
                    org={org}
                    isNotEmpty={formData.content === '<p></p>' ? false : true}
                    setIsPrivateComment={setIsPrivateComment}
                    elementId={changelogId}
                    user={user}
                    callback={(subId, notify) => postNewComment(subId, notify)}
                    isReply={true}
                  />
                }
              />
            </div>
          </motion.div>

          <div className="relative z-[40]">
            <motion.div
              key="main-cta"
              className={cn(
                'sticky w-full z-[40] main-transition overflow-hidden flex items-center shadow-none dark:shadow-none rounded-lg',
                widget
                  ? 'dark:bg-secondary bg-white border'
                  : 'dropdown-background dark:bg-secondary/[95%] dark:!backdrop-brightness-[20%] bg-white'
              )}
            >
              <div className=" pr-0 flex gap-3 items-center  p-2.5">
                {getTopReactions?.map((reaction, index) => {
                  const referencedReaction = localReactionData?.[reaction?.emojiKey]

                  return (
                    <button
                      key={reaction?.emojiKey + '_' + index}
                      onClick={() => {
                        reactToLocalChangelog(reaction?.emojiKey)
                      }}
                      className={cn(
                        'p-1 z-10 w-8 text-center items-center justify-center text-base rounded-lg border border-transparent relative',
                        referencedReaction?.interacted
                          ? 'text-primary-foreground bg-accent/10 border-accent/[15%] hover:bg-accent/20'
                          : 'hover:bg-white hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent'
                      )}
                    >
                      <span
                        className={`absolute py-0.5 leading-none -right-1  border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 ${
                          referencedReaction?.interacted
                            ? 'text-primary-foreground bg-accent border-accent'
                            : 'text-background-accent dark:text-foreground/60 dark:border-gray-500/60 bg-white dark:bg-dark-accent'
                        }`}
                      >
                        {referencedReaction?.count || 0}
                      </span>
                      {reaction?.emojiKey}
                    </button>
                  )
                })}
                <div className="hidden sm:block">
                  <HoverCard open={openHoverCard} onOpenChange={setOpenHoverCard} openDelay={200}>
                    <HoverCardTrigger onClick={() => setOpenHoverCard(true)} asChild>
                      <button className="relative z-10 items-center justify-center w-8 h-8 p-1 text-base text-center border border-transparent rounded-lg cursor-default focus:ring-0 hover:bg-transparent hover:border-transparent">
                        <svg
                          viewBox="0 0 44 44"
                          strokeWidth="2.8"
                          className="h-5.5 w-5.5 text-background-accent dark:text-foreground/60"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          stroke="currentColor"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_5429_7066)">
                            <path d="M16.5 18.3333H16.5183" />
                            <path d="M27.5 18.3333H27.5183" />
                            <path d="M17 27C17.6518 27.6332 18.4297 28.1363 19.2883 28.4797C20.1468 28.8231 21.0687 29 22 29C22.9313 29 23.8532 28.8231 24.7117 28.4797C25.5703 28.1363 26.3482 27.6332 27 27" />
                            <path d="M38.2525 24.7812C38.414 23.8628 38.4968 22.9324 38.5 22C38.5 18.7366 37.5323 15.5465 35.7193 12.8331C33.9062 10.1197 31.3293 8.00484 28.3143 6.756C25.2993 5.50715 21.9817 5.18039 18.781 5.81705C15.5803 6.45371 12.6403 8.02518 10.3327 10.3327C8.02518 12.6403 6.45371 15.5803 5.81705 18.781C5.18039 21.9817 5.50715 25.2993 6.756 28.3143C8.00484 31.3293 10.1197 33.9062 12.8331 35.7193C15.5465 37.5323 18.7366 38.5 22 38.5C23.265 38.5 24.4933 38.3607 25.6667 38.093" />
                            <path d="M35 29.9167V38.0834" />
                            <path d="M30.917 34H39.0837" />
                          </g>
                          <defs>
                            <clipPath id="clip0_5429_7066">
                              <rect width={44} height={44} fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="flex rounded-lg dark:bg-secondary/[95%] dark:!backdrop-brightness-[20%] bg-white items-center gap-4 p-2.5 w-full max-w-full">
                      {topCelebrationReactions?.map((reaction, index) => {
                        const referencedReaction = localReactionData?.[reaction]

                        if (getTopReactions?.some((item) => item.emojiKey === reaction)) {
                          return null
                        }

                        return (
                          <button
                            key={reaction + '_' + index}
                            onClick={() => {
                              reactToLocalChangelog(reaction)
                            }}
                            className={cn(
                              'p-1 z-10 w-8 text-center items-center justify-center text-base rounded-lg border border-transparent relative',
                              referencedReaction?.interacted
                                ? 'text-primary-foreground bg-accent/10 border-primary/[15%] hover:bg-accent/20'
                                : 'hover:bg-white hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent'
                            )}
                          >
                            <span
                              className={`absolute py-0.5 leading-none -right-1  border rounded shadow -top-1 text-[9px] font-bold tracking-wide  px-0.5 ${
                                referencedReaction?.interacted
                                  ? 'text-primary-foreground bg-accent border-transparent'
                                  : 'text-background-accent dark:text-foreground/60 dark:border-gray-500/60 bg-white dark:bg-dark-accent'
                              }`}
                            >
                              {referencedReaction?.count || 0}
                            </span>
                            {reaction}
                          </button>
                        )
                      })}
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
              {user && isMember(user?.id, org) && (
                <SimpleTooltip content="View analytics">
                  <Link legacyBehavior href={`/dashboard/changelog/${changelog?.id}/analytics`}>
                    <a target="_blank" rel="noreferrer">
                      <button className="relative z-10 ml-2 -mr-2 sm:mr-0 sm:ml-1.5 items-center hover:bg-white hover:border-gray-100 dark:hover:bg-dark-accent dark:hover:border-dark-accent justify-center w-8 h-8 p-1 text-base text-center border border-transparent rounded-lg focus:ring-0 hover:bg-transparent hover:border-transparent">
                        <ChartBarIcon className="w-5 h-5 secondary-svg" />
                      </button>
                    </a>
                  </Link>
                </SimpleTooltip>
              )}
              <div className="h-8 w-px ml-5 flex-shrink-0 sm:ml-[18px] bg-gray-100 dark:bg-dark-accent/80"></div>
              <div
                onClick={() => {
                  if (user || (org?.settings?.anyoneCanComment && !isIframeContext)) {
                    setToggleEditor((p) => !p)
                  } else {
                    setAuthenitacteModal(true)
                  }
                }}
                className="flex min-w-0 pr-4 cursor-pointer relative group w-full pl-[18px] group items-center py-3 text-gray-400 dark:text-foreground/80 text-sm"
              >
                <div className="z-10 flex items-center w-full pr-5 truncate pointer-events-none">
                  <div className="flex-shrink-0 hidden sm:block mr-2.5">
                    {user ? (
                      <img className="w-6 h-6 rounded-full" src={user?.profilePicture} />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        className="w-5 h-5 secondary-svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="w-full min-w-0 truncate">{t('write-a-comment')}...</span>
                </div>
                <div className="absolute z-10 min-w-0 opacity-70 right-4 sm:right-5 group-hover:opacity-100 main-transition">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: toggleEditor ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    {isCommentsLoading && isInView ? (
                      <div className="secondary-svg">
                        <Loader />
                      </div>
                    ) : (
                      <ArrowRightIcon className="secondary-svg" />
                    )}
                  </motion.div>
                </div>
                <div className="absolute left-0 opacity-0 group-hover:opacity-75 main-transition -inset-y-2 -right-2 bg-gradient-to-r from-transparent to-gray-200/20 dark:to-border"></div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>
      {user && isMember(user?.id, org) && (
        <ReactionPopup
          reactions={changelog?.reactions}
          isOpen={reactionPopup}
          setIsOpen={setReactionPopup}
        />
      )}
    </>
  )
}

export default ChangelogCommentEditor
