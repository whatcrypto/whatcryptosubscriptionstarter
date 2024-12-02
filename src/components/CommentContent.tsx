import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
  ArrowRightIcon,
  CheckIcon,
  DotsHorizontalIcon,
  EyeIcon,
  LinkIcon,
  LockClosedIcon,
  PencilIcon,
  ReplyIcon,
  ShieldCheckIcon,
  ThumbDownIcon,
  ThumbUpIcon,
  TrashIcon,
  XIcon,
} from '@heroicons/react/solid'
import { IComment } from '../interfaces/IComment'
import { IOrganization } from '@/interfaces/IOrganization'
import { IAdmin, ICustomer } from '@/interfaces/IUser'

import Loader from './Loader'
import { dateDifference } from './MainPostView'
import TextEditor from './TextEditor'
import CommentSwitchButton from './CommentSwitchButton'
import { cn } from '@/lib/utils'
import ButtonLoader from './ButtonLoader'
import { ContentModifier } from './ContentReplacer'
import { AnimatePresence, motion } from 'framer-motion'
import { MergeIcon } from './PostSearchWithAlgolia'
import useElementSize from './useElementSize'
import { getColor } from './TagBullet'
import CommentVoterList from './CommentVoterList'
import chroma from 'chroma-js'
import { Trans, useTranslation } from 'next-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import UserPicture from './UserPicture'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './radix/Tooltip'
import TrackedUserPreview from './TrackedUserPreview'
import { getBoardUrl } from '@/pages/widget/changelogPopup'
import { toast } from 'sonner'
import { can, isMember } from '@/lib/acl'

interface CommentProps {
  isFirst: boolean
  comment: IComment
  org: IOrganization
  user: IAdmin | ICustomer | undefined
  changeComment: Function
  removeComment: Function
  switchCommentPrivacy: Function
  createReply: Function
  isLast: boolean
  hideBottomReplies?: boolean
  addVoteToComment: Function
  setActiveComment: Dispatch<SetStateAction<IComment | null>>
  activeComment: IComment | null
  setAuthenitacteModal: Dispatch<SetStateAction<boolean>>
  isRoot?: boolean
  // wasLastMerged?: boolean
  // isFirstMerged?: boolean
  pinComment: (id: string, content: string, comment: IComment) => void
  isChangelog?: boolean
  differentBackground?: boolean
  setIsWritingReply?: Dispatch<SetStateAction<boolean>>
  highlightRoot?: boolean
  disableDeletion?: boolean
  approveComment: (activeComment: IComment) => void
  moderateView?: boolean
  hideCreationDates?: boolean
  slug?: string
}

const CommentContent: React.FC<CommentProps> = ({
  isFirst,
  comment,
  org,
  user,
  changeComment,
  removeComment,
  switchCommentPrivacy,
  createReply,
  isLast,
  hideBottomReplies,
  addVoteToComment,
  setActiveComment,
  activeComment,
  setAuthenitacteModal,
  isRoot,
  pinComment,
  isChangelog,
  differentBackground,
  setIsWritingReply,
  highlightRoot,
  disableDeletion,
  approveComment,
  moderateView,
  hideCreationDates,
  slug,
}) => {
  const [formData, setFormData] = useState({ content: '' })
  const [showReply, setShowReply] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingPrivate, setLoadingPrivate] = useState(false)
  const [isPrivateComment, setIsPrivateComment] = useState(false)
  const [errors, setErrors] = useState('')
  const [editContent, setEditContent] = useState(false)
  const [newContent, setNewContent] = useState({ content: '' })
  const [hasInteracted, setHasInteracted] = useState(false)
  const [hideReplies, setHideReplies] = useState(false)
  const [isShowingMore, setIsShowingMore] = useState(highlightRoot ? true : false)
  const [editorHeightRef, { width, height: editorHeight }] = useElementSize()
  const { t, i18n } = useTranslation()
  const highlightedStatusColor = comment.postStatus
    ? getColor(org?.postStatuses?.find((s) => s.name === comment.postStatus)?.color || 'Gray')
    : ''

  useEffect(() => {
    if (setIsWritingReply !== undefined) {
      if (formData.content.length > 8 || newContent.content.length > 8) {
        setIsWritingReply(true)
        setHasInteracted(true)
      } else {
        if (hasInteracted) setIsWritingReply(false)
      }
    }
  }, [setIsWritingReply, formData, newContent, hasInteracted])

  const reducedOpacity = chroma(org.color).luminance(0.25).css()

  const isIframeContext = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.parent !== window
  }, [])

  const renderCommentActions = () => {
    return (
      <TooltipProvider>
        <div className="flex items-center gap-2 -ml-0.5">
          <div className="flex items-center rounded-md ">
            <button
              onClick={() => {
                if (user) {
                  addVoteToComment(comment.id, 'upvote')
                } else {
                  setAuthenitacteModal(true)
                }
              }}
              className={cn(
                `dark:shadow-none border-none shadow-none px-1 py-1 bg-transparent dark:bg-transparent border border-transparent dark:border-transparent hover:border-gray-100 hover:bg-gray-100/60 dark:hover:bg-border dark:hover:border-dark-accent`,
                comment.upvoted &&
                  'dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:border-blue-500/20 dark:hover:border-blue-500/30 border-blue-100 bg-blue-50 hover:bg-blue-100 hover:border-blue-200/40'
              )}
            >
              <ThumbUpIcon
                className={cn(
                  'secondary-svg h-4 w-4',
                  comment.upvoted && 'dark:text-blue-400 text-blue-400'
                )}
              />
            </button>
            <Tooltip>
              <TooltipTrigger asChild>
                <p
                  className={cn(
                    'font-bold cursor-default min-w-[20px] text-center dark:group-hover:bg-secondary main-transition text-gray-500 dark:border-border/80 text-[13px] py-1 px-2 dark:text-foreground',
                    comment.score === 1 && 'pointer-events-none'
                  )}
                >
                  {comment.score}
                </p>
              </TooltipTrigger>
              <TooltipContent className="p-0">
                {comment.score === 1 ? null : (
                  <CommentVoterList org={org} user={user} comment={comment} />
                )}
              </TooltipContent>
            </Tooltip>

            <button
              onClick={() => {
                if (user) {
                  addVoteToComment(comment.id, 'downvote')
                } else {
                  setAuthenitacteModal(true)
                }
              }}
              className={cn(
                `dark:shadow-none shadow-none border-none px-1 py-1 bg-transparent dark:bg-transparent border border-transparent dark:border-transparent hover:border-gray-100 hover:bg-gray-100/60 dark:hover:bg-border dark:hover:border-dark-accent`,
                comment.downvoted &&
                  'dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:border-rose-500/20 dark:hover:border-rose-500/30 border-rose-100 bg-rose-50 hover:bg-rose-100 hover:border-rose-200/40'
              )}
            >
              <ThumbDownIcon
                className={cn(
                  'secondary-svg h-4 w-4',
                  comment.downvoted && 'dark:text-rose-400 text-rose-400'
                )}
              />
            </button>
          </div>
          <>
            <button
              onClick={() => {
                if (org?.settings?.anyoneCanComment) {
                  setActiveComment(comment)
                } else if (user) {
                  setActiveComment(comment)
                } else {
                  setAuthenitacteModal(true)
                }
              }}
              className={`p-1 py-1 dark:shadow-none sm:hidden bg-transparent text-xs dark:text-foreground dark:hover:bg-secondary hover:bg-gray-50 border border-transparent shadow-none text-gray-500`}
            >
              <ReplyIcon className="mr-1 secondary-svg" />
              {t('reply')}
            </button>
            <button
              onClick={() => {
                if (org?.settings?.anyoneCanComment && !isIframeContext) {
                  setShowReply((p) => !p)
                } else if (user) {
                  setShowReply((p) => !p)
                } else {
                  setAuthenitacteModal(true)
                }
              }}
              className={`p-1 hidden sm:inline-flex py-1 dark:shadow-none bg-transparent text-xs dark:text-foreground dark:hover:bg-secondary hover:bg-gray-50 dark:hover:border-border dark:border-transparent border-transparent shadow-none text-gray-500`}
            >
              <ReplyIcon className="mr-1 secondary-svg" />
              {t('reply')}
            </button>
          </>
        </div>
      </TooltipProvider>
    )
  }

  const renderEditingButtons = () => {
    if (!user) {
      return null
    }
    if (comment?.user?.name === '[deleted]') {
      return null
    }
    if (!(isMember(user?.id, org) || comment.user?._id === user.id)) {
      return null
    }

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger
          className={`p-1 py-1 dark:shadow-none bg-transparent text-xs dark:text-foreground dark:hover:bg-secondary hover:bg-gray-50 dark:border-transparent border border-transparent shadow-none text-gray-500`}
        >
          <DotsHorizontalIcon className="w-4 h-4 secondary-svg" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="start">
          {can(user?.id, 'set_comment_pinned', org) ? (
            <DropdownMenuItem onSelect={() => pinComment(comment.id, comment.content, comment)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 secondary-svg mr-1.5"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z"
                  strokeWidth="0"
                  fill="currentColor"
                />
              </svg>
              {comment.pinned ? 'Unpin Comment' : 'Pin Comment'}
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onSelect={() => {
              try {
                const baseUrl =
                  getBoardUrl(org) +
                  `${isChangelog ? '/changelog' : '/p'}/` +
                  slug +
                  '/comment/' +
                  comment.id
                navigator.clipboard.writeText(baseUrl)
                toast.success('Link to the comment copied to clipboard')
              } catch (error) {
                toast.error('Failed to copy link')
              }
            }}
          >
            <LinkIcon className="h-4 w-4 mr-1.5 secondary-svg" />
            {t('copy-link')}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              setNewContent({ content: comment.content })
              setEditContent((p) => !p)
            }}
          >
            <PencilIcon className="h-4 w-4 mr-1.5 secondary-svg" />
            {t('edit-comment')}
          </DropdownMenuItem>

          {!disableDeletion && !moderateView && (
            <DropdownMenuItem onSelect={() => removeComment(comment.id)}>
              <TrashIcon className="h-4 w-4 mr-1.5 secondary-svg" />
              {t('delete-comment')}
            </DropdownMenuItem>
          )}

          {can(user?.id, 'manage_comments_private', org) ? (
            <DropdownMenuItem
              onSelect={() =>
                switchCommentPrivacy(
                  comment.id,
                  comment.content,
                  loadingPrivate,
                  setLoadingPrivate,
                  comment
                )
              }
            >
              {loadingPrivate ? (
                <ButtonLoader loading={true} />
              ) : comment?.isPrivate ? (
                <EyeIcon className="h-4 w-4 mr-1.5 secondary-svg" />
              ) : (
                <LockClosedIcon className="h-4 w-4 mr-1.5 secondary-svg" />
              )}
              {comment?.isPrivate ? 'Make Public' : 'Make Private'}
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const renderReplies = () => {
    if (!comment?.replies || hideReplies) {
      return null
    }

    return (
      <div className="relative min-w-[240px] sm:min-w-[420px] ml-6 sm:ml-7">
        <AnimatePresence initial={false}>
          {comment?.replies.map((reply, replyId) => {
            if (comment.isPrivate) {
              reply.isPrivate = true
            }

            return (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  delay: 0.1,
                  duration: 0.3,
                }}
                key={reply.id || replyId}
                className="flex items-start py-2.5 mt-4 space-x-3"
              >
                <CommentContent
                  slug={slug}
                  hideCreationDates={hideCreationDates}
                  isFirst={replyId === 0}
                  comment={reply}
                  org={org}
                  setActiveComment={setActiveComment}
                  user={user}
                  addVoteToComment={addVoteToComment}
                  changeComment={changeComment}
                  setAuthenitacteModal={setAuthenitacteModal}
                  removeComment={removeComment}
                  hideBottomReplies={hideReplies}
                  switchCommentPrivacy={switchCommentPrivacy}
                  createReply={createReply}
                  isLast={comment?.replies?.length - 1 === replyId}
                  activeComment={activeComment}
                  pinComment={pinComment}
                  isRoot={false}
                  differentBackground={differentBackground}
                  setIsWritingReply={setIsWritingReply}
                  approveComment={approveComment}
                  moderateView={moderateView}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    )
  }

  const renderCommentTitle = () => {
    return (
      <TooltipProvider>
        <div className="flex flex-wrap items-center text-sm">
          <div className="pb-px font-medium text-gray-600 dark:text-foreground">
            {comment.postStatus ? (
              <Trans
                i18nKey="user-changed-status-to"
                components={[
                  <span key="author" className="font-semibold dark:text-gray-100" />,
                  <span
                    key="postStatus"
                    className="font-medium"
                    style={{ color: highlightedStatusColor }}
                  />, // For status
                ]}
                values={{
                  author: comment.user?.name,
                  status: comment.postStatus,
                }}
              />
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <p
                    className={cn(
                      'font-semibold dark:text-gray-100 px-1 py-0.5 cursor-default rounded-md -m-1',
                      can(user?.id, 'view_users', org)
                        ? 'hover:bg-gray-50 dark:hover:bg-secondary main-transition'
                        : 'pointer-events-none'
                    )}
                  >
                    {comment.user?.name}
                  </p>
                </TooltipTrigger>
                {can(user?.id, 'view_users', org) &&
                  comment?.user?._id &&
                  comment.user.type === 'customer' && (
                    <TooltipContent
                      className="pt-0 text-sm px-3 sm:px-0 pb-3 min-w-[320px] max-w-[320px]"
                      side="left"
                    >
                      <TrackedUserPreview userId={comment?.user?._id} />
                    </TooltipContent>
                  )}
              </Tooltip>
            )}
          </div>
          {!hideCreationDates || isMember(user?.id, org) ? (
            <>
              <span className="text-gray-200 pointer-events-none dark:text-foreground/60 mx-1.5">
                •
              </span>
              <p className="text-background-accent mt-[0.5px] cursor-default text-[11px] font-medium dark:text-foreground/80 first-letter:uppercase">
                {dateDifference(comment?.createdAt, i18n.language)}
              </p>
            </>
          ) : null}

          {comment.originalSubmission && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex-shrink-0 w-3.5 h-3.5 mx-2 text-accent dark:text-accent">
                  <MergeIcon />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center text-xs font-medium text-gray-400 dark:text-foreground">
                  Merged from <ArrowRightIcon className="w-2 h-2 mx-1 dark:text-foreground" />
                  <a
                    href={'/submissions/' + comment.originalSubmission}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent hover:underline main-transition"
                  >
                    original post
                  </a>
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {comment.isPrivate ? (
            <>
              <span className="text-gray-200 pointer-events-none dark:text-foreground/60 mx-1.5">
                •
              </span>
              <p className="text-background-accent mt-[0.5px] cursor-default text-[11px] font-medium dark:text-foreground/80 first-letter:uppercase">
                Private
              </p>
            </>
          ) : null}
          {comment?.pinned && (
            <Tooltip>
              <TooltipTrigger asChild>
                <svg
                  style={{ color: reducedOpacity }}
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 mx-2"
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#2c3e50"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z"
                    strokeWidth="0"
                    fill="currentColor"
                  />
                </svg>
              </TooltipTrigger>
              <TooltipContent>
                <p className="flex items-center mt-[0.5px] text-xs font-medium text-gray-400 dark:text-foreground">
                  Pinned Comment
                </p>
              </TooltipContent>
            </Tooltip>
          )}
          {comment?.inReview && !can(user?.id, 'moderate_comments', org) && (
            <>
              <span className="text-gray-200 pointer-events-none dark:text-foreground/60 mx-1.5">
                •
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className="text-background-accent cursor-default mt-[0.5px] text-[11px] font-medium dark:text-foreground/80 first-letter:uppercase">
                    {t('pending')}
                  </p>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="flex items-center text-xs font-medium text-gray-400 dark:text-foreground">
                    {t('this-comment-is-being-reviewed-by-the-moderators')}
                  </p>
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </TooltipProvider>
    )
  }

  return (
    <div className="w-full">
      {/* {isFirstMerged && comment.originalSubmission && (
        <div className="mb-3">
          <div className="w-full h-px dark:bg-border" />
        </div>
      )} */}
      <div
        className={cn(
          'w-full relative',
          hideReplies && isRoot && 'flex items-center',
          isRoot && !isFirst && 'mt-6'
        )}
      >
        {hideReplies ? (
          <div
            onClick={() => setHideReplies((p) => !p)}
            className={cn(
              'absolute left-0 h-full bg-background/40 backdrop-blur transform-gpu z-10 hover:bg-gray-50/60 dark:hover:bg-secondary group p-1 py-2 rounded-full group cursor-pointer flex items-center justify-center'
            )}
            aria-hidden="true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 rotate-45 secondary-svg main-transition dark:group-hover:text-gray-100 group-hover:text-gray-500 "
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M18 9l3 3l-3 3" />
              <path d="M15 12h6" />
              <path d="M6 9l-3 3l3 3" />
              <path d="M3 12h6" />
            </svg>
          </div>
        ) : null}
        <div
          onClick={() => {
            setHideReplies((p) => !p)
          }}
          className={cn(
            'absolute inset-y-0 left-1 h-full w-6 group cursor-pointer',
            isLast && 'overflow-hidden'
          )}
          aria-hidden="true"
        >
          <span
            className={cn(
              'absolute mx-auto inset-x-0 top-9 h-full main-transition w-px bg-gray-100/50 dark:bg-border group-hover:bg-gray-200/80 dark:group-hover:bg-background-accent/80'
            )}
            aria-hidden="true"
          />
        </div>
        <AnimatePresence initial={false}>
          <motion.div
            animate={{
              marginLeft: hideReplies ? 50 : 0,
              width: 'auto',
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut',
            }}
            className={cn('flex items-start w-full space-x-2.5')}
          >
            <div className="relative p-1 -m-1">
              <UserPicture
                medium={true}
                authorId={comment.user?._id}
                img={comment?.user?.picture}
              />
            </div>
            <div
              className={cn(
                'relative flex-1 w-full',
                isRoot && highlightRoot && !hideReplies && 'px-3.5 mt-2 mb-3'
              )}
              id={`comment-${comment?.id}`}
            >
              {isRoot && highlightRoot && !hideReplies && (
                <div className="absolute -inset-y-2 -top-2.5 right-0 left-0 rounded-lg secondary-raised-card"></div>
              )}
              <div className="relative">
                <div className={!highlightRoot ? 'mt-[6.5px]' : ''}>{renderCommentTitle()}</div>
                {hideReplies ? null : (
                  <>
                    {!editContent ? (
                      <div className="relative mt-1.5 overflow-hidden text-sm text-gray-400 content dark:text-foreground">
                        <div
                          ref={editorHeightRef}
                          className={`${
                            highlightRoot || isShowingMore
                              ? 'h-full'
                              : 'max-h-[302px] overflow-hidden'
                          } py-1`}
                        >
                          <ContentModifier
                            openReadMore={() => {
                              setIsShowingMore(true)
                            }}
                            content={comment.content}
                          />
                        </div>
                        {!highlightRoot && !isShowingMore && editorHeight === 302 && (
                          <button
                            onClick={() => setIsShowingMore(true)}
                            className={cn(
                              'continue-reading-overlay group dark:from-card',
                              differentBackground && 'dark:from-card'
                            )}
                          >
                            <p className="mb-1 text-sm font-medium text-gray-500 border-b border-transparent dark:text-foreground group-hover:border-gray-200 dark:group-hover:border-background-accent main-transition">
                              {t('continue-reading')}
                            </p>
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="mt-1.5">
                        <TextEditor
                          className="styled-editor"
                          height={60}
                          author={comment?.user?._id}
                          setFormData={(data) => setNewContent((p) => ({ ...p, content: data }))}
                          formData={newContent}
                          insideContent={
                            <div className="p-3">
                              <button
                                onClick={() =>
                                  changeComment(
                                    comment.id,
                                    setLoading,
                                    loading,
                                    newContent,
                                    setEditContent,
                                    setNewContent,
                                    comment
                                  )
                                }
                                className="justify-center dashboard-primary py-1.5 px-3 font-medium text-[13px]"
                              >
                                {loading && (
                                  <div className="w-4 h-4 mr-1 text-background-accent dark:text-foreground">
                                    <Loader />
                                  </div>
                                )}
                                {t('change-content')}{' '}
                              </button>
                            </div>
                          }
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1.5">
                      {comment?.inReview &&
                        can(user?.id, 'moderate_comments', org) &&
                        !moderateView && (
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <button className="flex mr-1.5 items-center px-2 py-1 overflow-hidden text-xs font-medium border text-accent-foreground dark:text-white/90 bg-accent/5 border-accent/[15%] hover:bg-accent/10 dark:bg-accent/10 dark:hover:bg-accent/[18%] dark:border-accent/[7%]">
                                <ShieldCheckIcon className="w-4 h-4 mr-1.5 text-accent" />
                                Pending
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-52" align="start">
                              <DropdownMenuItem
                                onSelect={() => {
                                  approveComment(comment)
                                }}
                                key="approve-post"
                              >
                                <CheckIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                                Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => removeComment(comment.id)}
                                key="reject-post"
                              >
                                <XIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      {renderCommentActions()}
                      {renderEditingButtons()}
                    </div>

                    {showReply && (
                      <div className="py-3">
                        <TextEditor
                          className="styled-editor"
                          hideBg={true}
                          formData={formData}
                          author={comment?.user?._id}
                          setFormData={(data) => setFormData((p) => ({ ...p, content: data }))}
                          height={50}
                          insideContent={
                            <CommentSwitchButton
                              fixedPrivate={comment?.isPrivate}
                              isPrivateComment={isPrivateComment}
                              loading={loading}
                              org={org}
                              setIsPrivateComment={setIsPrivateComment}
                              elementId={comment?.id}
                              user={user}
                              buttonText={t('reply-to-comment')}
                              callback={(comId) =>
                                createReply(
                                  comId,
                                  formData,
                                  setFormData,
                                  setShowReply,
                                  setLoading,
                                  loading,
                                  setErrors,
                                  isPrivateComment
                                )
                              }
                              isReply={true}
                            />
                          }
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        {renderReplies()}
        {/* {wasLastMerged && comment.originalSubmission && (
          <div>
            <div className="w-full h-px mt-5 bg-gradient-to-r from-transparent to-gray-700" />
            <div className="flex justify-end">
              <a
                href={'/submissions/' + comment.originalSubmission}
                target="_blank"
                rel="noreferrer"
                className="flex ml-auto font-medium dark:bg-[#1C202C] text-gray-200 cursor-pointer hover:text-gray-100 main-transition pl-2 -mt-2 items-center text-xs"
              >
                This {comment.replies?.length > 0 ? 'comment' : 'thread'} was merged from another
                post <ArrowRightIcon className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </div>
          </div>
        )} */}
      </div>
    </div>
  )
}

export default CommentContent
