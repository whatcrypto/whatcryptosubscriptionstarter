import { IComment } from '@/interfaces/IComment'

export function handleVoteLogic(comment: IComment, vote: string) {
  const isUpvote = vote === 'upvote'
  const isDownvote = vote === 'downvote'

  if (isUpvote) {
    return handleUpvote(comment)
  } else if (isDownvote) {
    return handleDownvote(comment)
  }

  return comment
}

function handleUpvote(comment: IComment) {
  if (comment.upvoted) {
    comment.upvoted = false
    comment.score--
    comment.upvotes--
  } else if (!comment.upvoted && !comment.downvoted) {
    comment.upvoted = true
    comment.score++
    comment.upvotes++
  } else if (!comment.upvoted && comment.downvoted) {
    comment.upvoted = true
    comment.downvoted = false
    comment.score += 2
    comment.upvotes++
    comment.downvotes--
  }
  return comment
}

function handleDownvote(comment: IComment) {
  if (comment.downvoted) {
    comment.downvoted = false
    comment.score++
  } else if (!comment.downvoted && !comment.upvoted) {
    comment.downvoted = true
    comment.score--
  } else if (!comment.downvoted && comment.upvoted) {
    comment.downvoted = true
    comment.upvoted = false
    comment.score -= 2
    comment.upvotes--
    comment.downvotes++
  }
  return comment
}
