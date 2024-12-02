import { useTrackedUser, useUser } from '@/data/user'
import React from 'react'
import Loader from './Loader'
import UsersInfo from './UsersInfo'
import { ChevronRightIcon, ExternalLinkIcon, IdentificationIcon } from '@heroicons/react/solid'
import { useCurrentOrganization } from '@/data/organization'
import { can } from '@/lib/acl'
import CustomLink from './CustomLink'

const TrackedUserPreview: React.FC<{
  userId: string
  setOpenInsights?: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ userId, setOpenInsights }) => {
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const { trackedUser, isValidating } = useTrackedUser(userId, can(user?.id, 'view_users', org))

  if (isValidating) {
    return (
      <div className="flex items-center justify-center px-4 py-6 pb-8 cursor-pointer">
        <div className="flex-shrink-0 w-5 h-5 py-3 text-gray-200 dark:text-foreground/60">
          <Loader />
        </div>
      </div>
    )
  } else {
    if (trackedUser) {
      return (
        <div className="relative -mx-4 overflow-hidden group md:mx-0">
          <div className="-mb-2 ">
            <p className="absolute inset-x-0 top-0 flex w-full items-center p-4 font-medium border-b rounded-none dark:text-foreground backdrop-blur-lg dashboard-border dark:bg-border/30 bg-gray-50/50">
              <div className="flex items-center justify-between w-full">
                <p className="leading-none flex items-center">
                  <IdentificationIcon className="secondary-svg mr-1.5" />
                  Author info
                </p>
                <CustomLink href={`/u/${userId}`}>
                  <a
                    target="_blank"
                    className="leading-none flex items-center text-foreground hover:bg-foreground/5 text-xs p-1.5 -m-1.5 rounded-md main-transition"
                  >
                    <ExternalLinkIcon className="secondary-svg mr-1.5" />
                    View profile
                  </a>
                </CustomLink>
              </div>
            </p>

            <div className="h-14"></div>
            <UsersInfo postView={true} activeUser={trackedUser} />
          </div>
        </div>
      )
    } else {
      return (
        <button
          onClick={() => {
            setOpenInsights && setOpenInsights(true)
          }}
          className="unstyled-button flex items-center gap-2 px-4 py-3 cursor-pointer hover:bg-gray-50 main-transition border-gray-100/60 dark:hover:bg-secondary dark:border-border/50"
        >
          <div className="pr-3">
            <p className="flex items-center font-semibold">Author info not synced</p>
            <p className="mt-1.5 text-xs dark:text-foreground/90 font-medium">
              Sync your customer data with Featurebase to view and sort posts by customers monthly
              spend and other parameters.
            </p>
          </div>
          <ChevronRightIcon className="flex-shrink-0 w-4 h-4 text-gray-200 dark:text-foreground/60" />
        </button>
      )
    }
  }
}

export default TrackedUserPreview
