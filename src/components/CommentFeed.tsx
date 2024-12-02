import { ISubmission } from '../interfaces/ISubmission'
import { useComments } from '../data/comment'
import Loader from './Loader'
import EmptyIllustration from './EmptyIllustration'
import { useCurrentOrganization } from '../data/organization'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'next-i18next'
import { ClockIcon, EyeIcon, LockClosedIcon, TrendingUpIcon } from '@heroicons/react/solid'
import { cn } from '@/lib/utils'

import { useEffect, useRef, useState } from 'react'
import { useUser } from '@/data/user'
import { IComment } from '@/interfaces/IComment'
import { deleteComment, editComment, postComment, voteOnComment } from 'network/lib/submission'
import { useAtom } from 'jotai'
import { isTestingEnv } from '@/atoms/authAtom'
import { toast } from 'sonner'
import CommentContent from './CommentContent'
import MobileComment from './MobileComment'
import { InView } from 'react-intersection-observer'
import ActivityFeed from './ActivityFeed'
import ConfirmationModal from './ConfirmationModal'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import axios, { AxiosResponse } from 'axios'
import { handleVoteLogic } from '../lib/commentHelper'
import { IChangelog } from '@/interfaces/IChangelog'
import { useRouter } from 'next/router'
import { activeDeleteCommenAtom } from '@/atoms/commentAtom'
import { can } from '@/lib/acl'

export function mutateCommentById(comments: IComment[], id: string, updatedComment: IComment) {
  // Define the update function
  const update = (comment: IComment) => {
    // Create a new object with the same values as the old comment
    let newComment = { ...comment }
    if (newComment.id === id) {
      newComment = { ...updatedComment, replies: comment.replies }
      return newComment
    }

    // Recursively update the replies and assign the result to the new comment
    newComment.replies = mutateCommentById(newComment.replies, id, updatedComment)

    return newComment
  }

  // Map over the comments and apply the update function
  return comments.map(update)
}

const CommentFeed: React.FC<
  {
    changelog?: IChangelog
    sortBy: {
      sortBy: string
      submissionId?: string
      changelogId?: string
      commentThreadId?: string
    }
    setSortBy?: Function
    setAuthenitacteModal: React.Dispatch<React.SetStateAction<boolean>>
    changeSubmissionCommentCount?: (increase: boolean) => void
    isRegularPage?: boolean
    setIsWritingReply?: React.Dispatch<React.SetStateAction<boolean>>
    parentChangelog?: string
  } & (
    | {
        moderationView?: true
        submission?: string
      }
    | { moderationView?: undefined; submission?: ISubmission }
  )
> = ({
  submission,
  changelog,
  sortBy,
  setSortBy,
  setAuthenitacteModal,
  changeSubmissionCommentCount,
  isRegularPage,
  setIsWritingReply,
  moderationView,
  parentChangelog,
}) => {
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const { t, i18n } = useTranslation()

  const [selectedComments, setSelectedComments] = useState(
    (typeof submission === 'string' ? 0 : submission?.commentCount || 0) < 10
      ? 'New comments'
      : 'Top comments'
  )
  const [waitToRevalidate, setWaitToRevalidate] = useState(false)
  const [testingEnv, setTestingEnv] = useAtom(isTestingEnv)
  const [activeComment, setActiveComment] = useState<IComment | null>(null)
  const [renderedCommentData, setRenderedCommentData] = useState<IComment[]>([])
  const [isActivityFeed, setIsActivityFeed] = useState(false)
  const [activeDeleteCommentIdFromAtom, setActiveDeleteCommentIdFromAtom] =
    useAtom(activeDeleteCommenAtom)
  const [activeDeleteCommentId, setActiveDeleteCommentId] = useState('')

  const commentFeedRef = useRef<HTMLDivElement>(null)

  const router = useRouter()
  const {
    comments,
    commentsMutate,
    totalCommentResults,
    isCommentsLoading,
    setSize,
    size,
    rawComments,
  } = useComments(sortBy, org)

  useEffect(() => {
    if (router.pathname && router.pathname.includes('/comment/')) {
      setTimeout(() => {
        // Manually calculate the total offset from the top of the page
        //  Scroll to the bottom of the page
        window.scrollTo(0, document.body.scrollHeight + 800)
      }, 200)
    }
  }, [router.pathname])

  useEffect(() => {
    // idea is to redirect to all comments if we couldnt get the comment for the post for some reason
    if (!isCommentsLoading && !comments && submission && sortBy.commentThreadId) {
      router.push(`/p/${typeof submission === 'string' ? submission : submission.slug}`)
    }
  }, [comments, isCommentsLoading, submission, changelog, router, sortBy])

  const requestTarget = {
    submissionId: typeof submission === 'string' ? submission : submission?.id,
    changelogId: changelog?.id,
  }

  useEffect(() => {
    if (!user) {
      setWaitToRevalidate(true)
    }
    if (user && waitToRevalidate) {
      commentsMutate()
      setWaitToRevalidate(false)
    }
  }, [user, waitToRevalidate])

  const createReply = async (
    id: string,
    formData: {
      content: string
    },
    setFormData: React.Dispatch<
      React.SetStateAction<{
        content: string
      }>
    >,
    setShowReply: React.Dispatch<React.SetStateAction<boolean>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
    setErrors: React.Dispatch<React.SetStateAction<string>>,
    isPrivateComment: boolean
  ) => {
    if (loading) return
    if (formData.content.length <= 8) {
      setErrors(t('comment-is-empty'))
      return
    }

    setErrors('')
    setLoading(true)

    try {
      const resp = await postComment({
        content: formData.content,
        isPrivate: isPrivateComment,
        parentCommentId: id,
        ...requestTarget,
      })
      if (!resp.data.success) return

      if (rawComments && comments && !resp.data.comment.isSpam) {
        handleSuccessfulCommentPost(resp, id)
      }

      setIsWritingReply && setIsWritingReply(false)
      scrollToComment(resp.data.comment.id)
    } catch (err) {
      toast.error('Something went wrong when creating reply')
      commentsMutate()
    } finally {
      setLoading(false)
      setShowReply(false)
      setFormData({ content: '' })
    }
  }

  const scrollToComment = (commentId: string) => {
    setTimeout(() => {
      try {
        const comment = document?.getElementById('comment-' + commentId)

        if (comment) {
          comment.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          })
        }
      } catch (err) {
        console.log(err)
      }
    }, 200)
  }

  const handleSuccessfulCommentPost = (resp: AxiosResponse, id: string) => {
    if (!id) return
    commentsMutate(
      rawComments?.map((entry) => ({
        ...entry,
        results: findAndAddReply(comments || [], id, resp.data.comment),
      })),
      false
    )

    changeSubmissionCommentCount && changeSubmissionCommentCount(true)
  }

  const changeComment = (
    id: string,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
    newContent: { content: string },
    setEditContent: React.Dispatch<React.SetStateAction<boolean>>,
    setNewContent: React.Dispatch<
      React.SetStateAction<{
        content: string
      }>
    >,
    comment: IComment
  ) => {
    if (!rawComments || !comments) return
    if (newContent.content.length < 10) {
      toast.error('Comment must be at least 3 characters long')
      return
    }
    commentsMutate(
      rawComments.map((entry) => ({
        ...entry,
        results: mutateCommentById(comments, id, { ...comment, content: newContent.content }),
      })),
      false
    )

    setIsWritingReply && setIsWritingReply(false)

    editComment({ id, content: newContent.content })
      .then((resp) => {})
      .catch((err) => {
        commentsMutate()
        if (axios.isAxiosError(err)) {
          if (err.response?.data?.requiresMissingPermission) {
            toast.error('You do not have permission to edit this comment')
            return
          }
        }
        toast.error('Something went wrong when editing comment')
      })
      .finally(() => {
        setEditContent(false)
        setNewContent({ content: '' })
      })
  }

  const deleteCommentAfterConfirmation = () => {
    if (!activeDeleteCommentId || !rawComments || !comments) return

    let deletionComment: any = null

    commentsMutate(
      rawComments.map((entry) => ({
        ...entry,
        results: entry.results.filter((comment) => {
          if (comment.id === activeDeleteCommentId) {
            deletionComment = comment
            return false
          }
          return true
        }),
      })),
      false
    )

    deleteComment(activeDeleteCommentId)
      .then((resp) => {
        if (resp.data.success) {
          if (!deletionComment?.inReview) {
            changeSubmissionCommentCount && changeSubmissionCommentCount(false)
          }
          commentsMutate()
        }
      })
      .catch(() => {
        toast.error('Something went wrong when deleting comment')
        commentsMutate()
      })
  }

  const removeComment = (id: string) => {
    if (moderationView) {
      setActiveDeleteCommentIdFromAtom(id)
    } else {
      setActiveDeleteCommentId(id)
    }
  }

  const approveComment = (activeComment: IComment) => {
    if (!rawComments || !comments) return

    commentsMutate(
      rawComments?.map((entry) => ({
        ...entry,
        results: mutateCommentById(comments, activeComment.id, {
          ...activeComment,
          inReview: false,
        }),
      })),
      false
    )
    changeSubmissionCommentCount && changeSubmissionCommentCount(true)
    editComment({ id: activeComment.id, inReview: false }).catch(() => {
      toast.error('Something went wrong when changing comment privacy')
      commentsMutate()
    })
  }

  const switchCommentPrivacy = (
    id: string,
    content: string,
    loadingPrivate: boolean,
    setLoadingPrivate: React.Dispatch<React.SetStateAction<boolean>>,
    comment: IComment
  ) => {
    if (loadingPrivate) return
    if (!rawComments || !comments) return

    commentsMutate(
      rawComments.map((entry) => ({
        ...entry,
        results: mutateCommentById(comments, id, { ...comment, isPrivate: !comment?.isPrivate }),
      })),
      false
    )

    editComment({ id, content, isPrivate: !comment?.isPrivate }).catch(() => {
      toast.error('Something went wrong when changing comment privacy')
      commentsMutate()
    })
  }
  const pinComment = (id: string, content: string, comment: IComment) => {
    if (!rawComments || !comments) return

    commentsMutate(
      rawComments.map((entry) => ({
        ...entry,
        results: mutateCommentById(comments, id, { ...comment, pinned: !comment?.pinned }),
      })),
      false
    )

    editComment({ id, content, pinned: !comment?.pinned }).catch(() => {
      toast.error('Something went wrong when changing comment privacy')
      commentsMutate()
    })
  }

  const addVoteToComment = (id: string, vote: string) => {
    // First, we update the UI optimistically.
    if (!rawComments || !comments) return
    commentsMutate(
      rawComments.map((entry) => ({
        ...entry,
        results: mutateComment(comments, id, vote),
      })),
      false
    )

    // Then, we send the API request.
    voteOnComment({ commentId: id, type: vote })
      .then((resp) => {
        // After the request completes, we manually update the data based on the server response.
        commentsMutate(
          rawComments.map((entry) => ({
            ...entry,
            results: mutateCommentById(comments, id, resp.data.comment),
          })),
          false
        )
      })
      .catch((error) => {
        console.error('Error voting on comment:', error)
        // In case of error, revert to the original state
        commentsMutate()
      })
  }

  function mutateComment(comments: IComment[], id: string, vote: string) {
    const update = (comment: IComment) => {
      let newComment = { ...comment }

      if (newComment.id === id) {
        newComment = handleVoteLogic(newComment, vote)
        return newComment
      }

      if (newComment.replies) {
        newComment.replies = mutateComment(newComment.replies, id, vote)
      }

      return newComment
    }

    return comments.map(update)
  }

  function findAndAddReply(
    comments: IComment[],
    id: string,
    commentReply: IComment
  ): IComment[] | null {
    if (!comments) return null

    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        return {
          ...comment,
          replies: comment.replies ? [...comment.replies, commentReply] : [commentReply],
        }
      }

      if (comment.replies) {
        return {
          ...comment,
          replies: findAndAddReply(comment.replies, id, commentReply) as IComment[],
        }
      }

      return comment
    })

    return updatedComments
  }

  let showLoader = totalCommentResults ? size * 10 < totalCommentResults : false

  const menuButtonStyle = (isCommentView: boolean) => {
    return `flex focus:ring-0 rounded-none cursor-pointer items-center border-b-2  pb-1.5 ${
      isCommentView
        ? 'font-medium dark:border-border dark:hover:border-dark-accent'
        : 'border-transparent hover:border-gray-100/70 dark:hover:border-dark-accent'
    } px-2 text-gray-500 dark:text-foreground main-transition`
  }

  const renderCommentFeedMenu = () => {
    if (!setSortBy || typeof submission === 'string') return null

    // Check for conditions to display comment and activity feed buttons
    const showCommentAndActivityFeed =
      (totalCommentResults?.length !== 0 && comments !== undefined) ||
      selectedComments !== 'Top comments'

    // Check for conditions to display the dropdown menu
    const showDropdownMenu =
      (!isActivityFeed && comments?.length !== 0 && comments !== undefined) ||
      selectedComments !== 'Top comments'

    // Render the button for selecting comment type
    const renderCommentTypeButton = (text: string, count?: number) => (
      <button
        onClick={() => setIsActivityFeed(text === 'activity-feed')}
        className={menuButtonStyle(text === 'activity-feed' ? isActivityFeed : !isActivityFeed)}
      >
        {t(text)}
        {count ? (
          <div className="bg-gray-100/60 dark:bg-gray-200 ml-2 rounded-full inline-block px-1.5 text-gray-800 font-medium py-px text-xs">
            {count}
          </div>
        ) : null}
      </button>
    )

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 pb-2 text-sm">
          {showCommentAndActivityFeed && (
            <>
              {renderCommentTypeButton(
                'comments',
                submission?.commentCount || changelog?.commentCount
              )}
              {submission && renderCommentTypeButton('activity-feed')}
            </>
          )}
        </div>
        {showDropdownMenu && !isActivityFeed && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="text-xs shadow-none dark:shadow-none dashboard-secondary">
              {t(selectedComments.toLowerCase().replace(' ', '-'))}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {can(user?.id, 'view_comments_private', org) && (
                <>
                  <DropdownMenuItem
                    onSelect={() => {
                      setSortBy({ ...sortBy, privacy: 'private' })
                      setSelectedComments('Private comments')
                    }}
                  >
                    <LockClosedIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Private comments
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      setSortBy({ ...sortBy, privacy: 'public' })
                      setSelectedComments('Public comments')
                    }}
                  >
                    <EyeIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                    Public comments
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuItem
                onSelect={() => {
                  setSortBy({ ...sortBy, sortBy: 'best', privacy: '' })
                  setSelectedComments('Top comments')
                }}
              >
                <TrendingUpIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                {t('top-comments')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setSortBy({ ...sortBy, sortBy: 'new', privacy: '' })
                  setSelectedComments('New comments')
                }}
              >
                <ClockIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                {t('new-comments')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setSortBy({ ...sortBy, sortBy: 'old', privacy: '' })
                  setSelectedComments('Old comments')
                }}
              >
                <ClockIcon className="h-4 w-4 mr-1.5 secondary-svg" />
                {t('old-comments')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    )
  }

  return (
    <div className={cn(sortBy?.changelogId ? 'mt-6 sm:mt-0' : 'mt-6 mb-8')} ref={commentFeedRef}>
      <ConfirmationModal
        open={
          moderationView
            ? activeDeleteCommentIdFromAtom
              ? true
              : false
            : activeDeleteCommentId
            ? true
            : false
        }
        setOpen={() => {
          if (moderationView) {
            setActiveDeleteCommentIdFromAtom('')
          } else {
            setActiveDeleteCommentId('')
          }
        }}
        callBack={() => {
          deleteCommentAfterConfirmation()
        }}
        title="Are you sure you want to delete this comment?"
        description="This action cannot be undone."
        buttonTxt="Delete comment"
      />
      {renderCommentFeedMenu()}
      {isActivityFeed && submission && typeof submission !== 'string' ? (
        <ActivityFeed submission={submission} org={org} />
      ) : (
        <>
          {!moderationView && !isCommentsLoading && sortBy.commentThreadId ? (
            <div className="flex justify-between my-3">
              <button
                className={`p-0 focus:ring-0 ${cn(
                  comments && comments?.length > 0 && !comments[0].parentComment
                    ? 'text-gray-400 dark:text-foreground'
                    : 'accent-text-hover '
                )}`}
                disabled={comments && comments?.length > 0 && !comments[0].parentComment}
                aria-disabled={comments && comments?.length > 0 && !comments[0].parentComment}
                onClick={() => {
                  // set sortBy.commentThreadId to the id of the current comments parent comment
                  if (comments && comments.length > 0) {
                    if (comments[0].parentComment) {
                      // change route to the parent comment
                      if (requestTarget.changelogId && changelog) {
                        window.location.href = `/changelog/${changelog.slug}/comment/${comments[0].parentComment}`
                        // router.push(
                        //   `/changelog/${changelog.slug}/comment/${comments[0].parentComment}`
                        // )
                      } else if (requestTarget.submissionId && submission) {
                        window.location.href = `/p/${
                          typeof submission === 'string' ? submission : submission.slug
                        }/comment/${comments[0].parentComment}`
                        // router.push(`/p/${submission.slug}/comment/${comments[0].parentComment}`)
                      }
                      // setSortBy({ ...sortBy, commentThreadId: comments[0].parentComment })
                    } else {
                      // disable clicking the button if the current comment is a root comment
                      if (requestTarget.changelogId && changelog) {
                        window.location.href = `/changelog/${changelog.slug}`
                        // router.push(`/changelog/${changelog.slug}`)
                      } else if (requestTarget.submissionId && submission) {
                        window.location.href = `/p/${
                          typeof submission === 'string' ? submission : submission.slug
                        }`
                        // router.push(`/p/${submission.slug}`) // change route to the submission
                      }
                    }
                  }
                }}
              >
                {t('single-comment-thread')}
              </button>
              <button
                className="p-0 accent-text-hover focus:ring-0"
                onClick={() => {
                  if (requestTarget.changelogId && changelog) {
                    window.location.href = `/changelog/${changelog.slug}`
                  } else if (requestTarget.submissionId && submission) {
                    window.location.href = `/p/${
                      typeof submission === 'string' ? submission : submission.slug
                    }`
                  }
                }}
              >
                {t('see-full-discussion')}
              </button>
            </div>
          ) : null}
          <div className="">
            <div
              className={`flow-root ${
                (comments === undefined || comments.length === 0) && 'h-32'
              } justify-center items-center `}
            >
              <ul role="list" className="pl-0 list-none">
                {comments !== undefined &&
                  comments.length === 0 &&
                  (typeof submission === 'string' ? false : submission?.commentsAllowed) && (
                    <div className="flex flex-col items-center justify-center mt-8 space-y-3">
                      <div className="w-16 h-16">
                        <EmptyIllustration primary={org.color} />
                      </div>
                      <p className={`text-sm  text-gray-400 dark:text-foreground`}>
                        {t('no-one-has-commented-yet')}
                      </p>
                    </div>
                  )}
                <div
                  className={cn(
                    'overflow-x-auto custom-scrollbar-stronger',
                    !sortBy?.changelogId && comments?.length !== 0 && 'pb-8'
                  )}
                >
                  {comments && (
                    <div className="pt-2 ">
                      <Transition
                        appear={true}
                        show={comments?.length !== 0}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100 "
                        leave="ease-in duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        {comments?.map((comment, commentId) => {
                          return (
                            <Transition.Child
                              enter="transition-opacity ease-linear duration-1000"
                              enterFrom="opacity-0"
                              enterTo="opacity-100"
                              leave="transition-opacity ease-linear duration-500"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              key={comment.id}
                            >
                              <li>
                                <div className="w-full">
                                  <CommentContent
                                    slug={
                                      parentChangelog
                                        ? parentChangelog
                                        : changelog
                                        ? changelog?.slug
                                        : typeof submission === 'string'
                                        ? submission
                                        : submission?.slug
                                    }
                                    disableDeletion={typeof submission === 'string'}
                                    hideCreationDates={
                                      typeof submission !== 'string' &&
                                      submission?.postCategory?.hideCreationDates
                                        ? true
                                        : false
                                    }
                                    setIsWritingReply={setIsWritingReply}
                                    differentBackground={isRegularPage}
                                    isChangelog={
                                      changelog !== undefined || (parentChangelog ? true : false)
                                    }
                                    isFirst={commentId === 0}
                                    setAuthenitacteModal={setAuthenitacteModal}
                                    comment={comment}
                                    org={org}
                                    user={user}
                                    isRoot={true}
                                    highlightRoot={sortBy?.commentThreadId ? true : false}
                                    addVoteToComment={addVoteToComment}
                                    changeComment={changeComment}
                                    removeComment={removeComment}
                                    switchCommentPrivacy={switchCommentPrivacy}
                                    createReply={createReply}
                                    isLast={commentId === comments.length - 1}
                                    setActiveComment={setActiveComment}
                                    activeComment={activeComment}
                                    pinComment={pinComment}
                                    approveComment={approveComment}
                                    moderateView={moderationView}
                                    // wasLastMerged={
                                    //   comments[commentId - 2]?.originalSubmission ? true : false
                                    // }
                                    // isFirstMerged={
                                    //   comment.originalSubmission
                                    //     ? !comments[commentId - 1]?.originalSubmission
                                    //     : false
                                    // }
                                  />
                                </div>
                              </li>
                            </Transition.Child>
                          )
                        })}
                      </Transition>
                    </div>
                  )}
                  {isCommentsLoading && (
                    <div className="flex items-center justify-center pt-6">
                      <div className="w-6 h-6 py-6 secondary-svg">
                        <Loader />
                      </div>
                    </div>
                  )}
                  {!isCommentsLoading && showLoader && (
                    <InView
                      as="div"
                      onChange={(inView: boolean) => {
                        inView && setSize(size + 1)
                      }}
                    >
                      <div className="flex items-center justify-center pt-6">
                        <div className="w-6 h-6 py-6 secondary-svg">
                          <Loader />
                        </div>
                      </div>
                    </InView>
                  )}
                </div>
              </ul>
            </div>
          </div>
          <Transition
            appear={true}
            show={activeComment ? true : false}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100 "
            leave="ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <MobileComment
              activeComment={activeComment}
              org={org}
              t={t}
              user={user}
              setActiveComment={setActiveComment}
              createReply={createReply}
            />
          </Transition>
        </>
      )}
    </div>
  )
}

export default CommentFeed
