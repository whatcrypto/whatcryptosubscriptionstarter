import { BadgeCheckIcon, BellIcon, EyeIcon, LockClosedIcon, XIcon } from '@heroicons/react/solid'
import { HoverCard, HoverCardTrigger } from '@radix-ui/react-hover-card'
import React from 'react'
import { HoverCardContent } from './radix/HoverCard'
import Loader from './Loader'
import { IOrganization } from '@/interfaces/IOrganization'
import { IAdmin, ICustomer } from '@/interfaces/IUser'
import { Switch } from './radix/Switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { ISubmission } from '@/interfaces/ISubmission'
import { Button } from './radix/Button'
import { can, isMember } from '@/lib/acl'

const CommentSwitchButton: React.FC<{
  org: IOrganization | undefined
  user: IAdmin | ICustomer | undefined
  isPrivateComment: boolean
  setIsPrivateComment: React.Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  callback: (output: string, notify: boolean) => any
  elementId: string
  buttonText: string
  fixedPrivate?: boolean
  isReply?: boolean
  isNotEmpty?: boolean
  submission?: ISubmission
}> = ({
  org,
  user,
  isPrivateComment,
  setIsPrivateComment,
  callback,
  loading,
  elementId,
  buttonText,
  fixedPrivate = false,
  isReply,
  isNotEmpty,
  submission,
}) => {
  if (fixedPrivate) {
    isPrivateComment = true
  }

  const hideForAdminIfDefaultState = submission?.upvotes === 1 && submission?.upvoted

  return (
    <div className="flex items-center justify-end p-3 space-x-4">
      <div className="flex items-center gap-3">
        {can(user?.id, 'view_comments_private', org) ? (
          <div className="flex items-center gap-2 my-auto text-sm font-medium text-gray-400 ">
            <HoverCard openDelay={230}>
              <HoverCardTrigger>
                <Switch
                  tabIndex={-1}
                  icon={
                    isPrivateComment ? (
                      <LockClosedIcon className="w-2 h-2 " />
                    ) : (
                      <EyeIcon className="w-2 h-2 " />
                    )
                  }
                  id="comment-type"
                  checked={isPrivateComment}
                  onCheckedChange={() =>
                    fixedPrivate === false ? setIsPrivateComment(!isPrivateComment) : null
                  }
                />
              </HoverCardTrigger>
              <HoverCardContent>
                {isPrivateComment
                  ? 'Comment will only be visible to admins'
                  : 'Comment will be visible to everyone'}
              </HoverCardContent>
            </HoverCard>
          </div>
        ) : null}
        {isMember(user?.id, org) && !isReply && isNotEmpty && !hideForAdminIfDefaultState ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button className="justify-center whitespace-nowrap truncate py-1 px-3 font-medium text-[13px]">
                {loading && (
                  <div className="w-4 h-4 mr-1 text-primary-foreground/80">
                    <Loader />
                  </div>
                )}
                {buttonText}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={!isPrivateComment ? 'w-48' : 'w-56'} align="end">
              <DropdownMenuItem
                onSelect={() => {
                  callback(elementId, true)
                }}
              >
                {isPrivateComment ? (
                  <BadgeCheckIcon className="w-4 h-4 mr-1.5 flex-shrink-0 secondary-svg" />
                ) : (
                  <BellIcon className="w-4 h-4 mr-1.5 flex-shrink-0 secondary-svg" />
                )}
                Notify {isPrivateComment ? 'admin upvoters' : 'upvoters'}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  callback(elementId, false)
                }}
              >
                <XIcon className="w-4 h-4 mr-1.5 secondary-svg" />
                Don't notify
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            onClick={() => callback(elementId, false)}
            className="justify-center whitespace-nowrap truncate py-1 px-3 font-medium text-[13px]"
          >
            {loading && (
              <div className="w-4 h-4 mr-1 text-primary-foreground/80">
                <Loader />
              </div>
            )}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default CommentSwitchButton
