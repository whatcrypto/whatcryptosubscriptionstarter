import React from 'react'
import DisplayMemberCheckmark from './AdminCheck'
import { useCurrentOrganization } from '@/data/organization'
import { cn } from '@/lib/utils'
import SimpleTooltip from './SimpleTooltip'

const UserPicture: React.FC<{
  img?: string
  authorId?: string
  small?: boolean
  large?: boolean
  medium?: boolean
  xSmall?: boolean
}> = ({ img, authorId, small, large, medium, xSmall }) => {
  const { org } = useCurrentOrganization()

  return img ? (
    <div className="relative rounded-full">
      <div
        className={cn(
          'relative flex items-center justify-center flex-shrink-0  overflow-hidden rounded-full w-7 h-7 bg-gray-100/30 dark:bg-secondary/50 ',
          small && 'h-5 w-5',
          large && 'h-10 w-10',
          medium && 'h-8 w-8',
          xSmall && 'h-4 w-4'
        )}
      >
        <img
          style={{ borderRadius: '100%' }}
          className="object-cover rounded-full h-full w-full"
          src={img}
        />
      </div>
      {authorId && (
        <SimpleTooltip
          contentProps={{ sideOffset: 4, side: 'top' }}
          allowHoverableContent={true}
          content={
            <p>
              Verified admin of <span className="font-medium">{org?.displayName}</span>.
            </p>
          }
        >
          <div className="absolute top-0 right-0">
            <DisplayMemberCheckmark authorId={authorId} smaller={large ? false : true} org={org} />
          </div>
        </SimpleTooltip>
      )}
    </div>
  ) : (
    <div
      className={cn(
        'bg-gray-100 rounded-full dark:bg-gray-500 h-7 w-7',
        small && 'h-5 w-5',
        large && 'h-10 w-10',
        medium && 'h-8 w-8',
        xSmall && 'h-4 w-4'
      )}
    >
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        className={cn(
          'font-semibold text-gray-400 rounded-full dark:text-gray-200 w-7 ',
          small && 'w-5',
          large && 'w-10',
          medium && 'h-8 w-8',
          xSmall && 'h-4 w-4'
        )}
      >
        <path
          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
          className="jsx-1981044996"
        />
      </svg>
    </div>
  )
}

export default UserPicture
