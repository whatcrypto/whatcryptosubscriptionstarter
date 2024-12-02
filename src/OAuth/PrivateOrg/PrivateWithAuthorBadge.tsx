import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './radix/Tooltip'
import { EyeOffIcon } from '@heroicons/react/solid'
import { useUser } from '@/data/user'
import { useCurrentOrganization } from '@/data/organization'
import { isMember } from '@/lib/acl'
import { ISubmission } from '@/interfaces/ISubmission'

const PrivateWithAuthorBadge: React.FC<{ submission?: ISubmission }> = ({ submission }) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const submissionAuthorId = submission?.user?._id
  const authorEmail = submission?.user?.email

  const isCompanyOnly = submission?.postCategory?.defaultCompanyOnly

  const isAuthorAdmin = submissionAuthorId && isMember(submissionAuthorId, org)

  const getBadgeText = () => {
    if (isCompanyOnly && !isAuthorAdmin) {
      return 'Company only'
    }
    return isMember(user?.id, org)
      ? isAuthorAdmin
        ? 'Admins only'
        : 'Author only'
      : 'Only shown to you'
  }

  const getTooltipText = () => {
    if (isCompanyOnly && !isAuthorAdmin) {
      return "This post is only visible to the author's company members."
    }
    return isMember(user?.id, org)
      ? `This post is only visible to the ${isAuthorAdmin ? 'admins' : 'author'}.`
      : 'This post is only visible to you and the admins.'
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={
              'text-xs px-1.5 inline-flex space-x-1 items-center font-medium text-gray-400 dark:text-foreground'
            }
          >
            <EyeOffIcon className="h-3.5 w-3.5 mr-1 -ml-0.5 text-background-accent/50 dark:text-background-accent" />
            {getBadgeText()}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-[11px] text-center text-background-accent dark:text-foreground font-medium">
            {getTooltipText()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PrivateWithAuthorBadge
