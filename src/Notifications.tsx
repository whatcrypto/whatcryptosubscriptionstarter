import { BellIcon } from '@heroicons/react/solid'
import React, { useState } from 'react'
import { useCurrentOrganization } from '../data/organization'
import { useSubmissionsWithFiltering } from '../data/submission'
import { Popover, PopoverTrigger, PopoverContent } from './radix/Popover'
import NotificationResults from './NotificationResults'
import { useAtom } from 'jotai'
import { notificationAtom } from '@/atoms/notificationAtom'
import NotificationPopupUpperBar from './NotificationPopupUpperBar'
import useSubmissionUrl from '@/hooks/submissionUrlSyncer'
import StandaloneMainPostViewPopup from './StandaloneMainPostViewPopup'
import { submissionActiveFilterURIAtom } from '@/atoms/submissionAtom'

const Notifications: React.FC<{
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>> | undefined
  customButton?: React.ReactNode
}> = ({ customButton }) => {
  const [notifications, setNotifications] = useAtom(notificationAtom)
  const { org } = useCurrentOrganization()
  const [activeSubmissionId, setActiveId] = useState('')
  const [showPostView, setShowPostView] = useState(false)

  const [openNotifications, setOpenNotifications] = useState(false)
  const { restoreUrl, setUrl } = useSubmissionUrl()

  const [activeFilterURI, setActiveFilterURI] = useAtom(submissionActiveFilterURIAtom)

  const { mutateSubmissions } = useSubmissionsWithFiltering(
    activeFilterURI ? activeFilterURI : null,
    org
  )

  return (
    <>
      <div className="">
        <StandaloneMainPostViewPopup
          activeSubmissionId={activeSubmissionId}
          setShowPostView={() => {
            setShowPostView(false)
            setOpenNotifications(true)
            restoreUrl()
            mutateSubmissions()
          }}
          showPostView={showPostView}
        />
        <Popover open={openNotifications} onOpenChange={setOpenNotifications}>
          <PopoverTrigger asChild>
            {customButton ? (
              customButton
            ) : (
              <button
                className={`rounded-full flex items-center justify-center relative dashboard-secondary-rounded h-9 w-9 p-[7px]`}
              >
                {notifications?.totalUnviewedResults ? (
                  <div className="absolute -top-1.5 px-1.5 leading-3 py-0.5 -right-1.5  text-[10px] font-semibold bg-accent text-white rounded-full">
                    {notifications.totalUnviewedResults}
                  </div>
                ) : null}

                <span className="sr-only">View notifications</span>
                <BellIcon className="w-5 h-5 secondary-svg" aria-hidden="true" />
              </button>
            )}
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            zIndex={50}
            side={customButton ? 'right' : 'bottom'}
            className={'w-[380px] ml-1 sm:ml-0 sm:w-[410px]'}
            align={customButton ? 'start' : 'end'}
          >
            <div>
              <div key="dropdown-item" className="text-gray-200 ">
                <NotificationPopupUpperBar />
              </div>
              <NotificationResults
                setUrl={setUrl}
                setActiveId={setActiveId}
                setShowPostView={(value) => {
                  setShowPostView(value)
                  setOpenNotifications(false)
                }}
                isPopup={true}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  )
}

export default Notifications
