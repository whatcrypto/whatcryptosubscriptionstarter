import { PlusCircleIcon } from '@heroicons/react/solid'
import ObjectID from 'bson-objectid'
import React, { useEffect } from 'react'
import { useCurrentOrganization } from '../data/organization'
import PopupWrapper from './PopupWrapper'
import UserSegmentView from './UserSegmentView'
import PayWall from './PayWall'
import { isPlan } from '@/lib/utils'
import Loader from './Loader'
import { UserSegment } from '@/interfaces/IOrganization'
import { createSegment } from 'network/lib/organization'
import { toast } from 'sonner'

const CreateSegments: React.FC<{ open: boolean; setOpen: Function }> = ({ open, setOpen }) => {
  const [page, setPage] = React.useState('main')
  const { org, mutateCurrentOrg } = useCurrentOrganization()

  const [selectedSegment, setSelectedSegment] = React.useState<UserSegment | undefined>(undefined)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (open) {
      setPage('main')
    }
  }, [open])

  return (
    <PopupWrapper medium={true} isOpen={open} setIsOpen={setOpen}>
      {/* {!isPlan(org?.plan, 'premium') && (
        <PayWall noMargin={true} title="User segmentation" plan="premium" />
      )} */}
      {page === 'main' ? (
        <>
          <h2 className="text-lg font-medium text-gray-600 dark:text-white flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 text-gray-200 dark:text-foreground/80  h-6 mb-1"
            >
              <path
                fillRule="evenodd"
                d="M2.25 13.5a8.25 8.25 0 018.25-8.25.75.75 0 01.75.75v6.75H18a.75.75 0 01.75.75 8.25 8.25 0 01-16.5 0z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                className="text-accent"
                d="M12.75 3a.75.75 0 01.75-.75 8.25 8.25 0 018.25 8.25.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V3z"
                clipRule="evenodd"
                fill="currentColor"
              />
            </svg>
            User Segments
          </h2>
          <p className="mt-1.5 pb-5 text-sm text-gray-400 dark:text-foreground">
            <span className="tex">Specify the user groups that are most important to you.</span> Set
            up segments to selectively view feedback from these specific groups.
          </p>

          {!org.segments ? (
            <div className="secondary-svg mx-auto">
              <Loader />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2">
                {org.segments?.map((item) => (
                  <button
                    onClick={() => {
                      setSelectedSegment(item)
                      setPage('viewSegment')
                    }}
                    key={item['_id']}
                    className="py-2 text-left  dashboard-secondary"
                  >
                    <span className="truncate">{item.name}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={loading}
                onClick={() => {
                  setLoading(true)
                  createSegment({
                    name: 'New Segment',
                    operator: 'AND',
                    segmentGroups: [],
                  })
                    .then((res) => {
                      mutateCurrentOrg()
                      setSelectedSegment(res?.data?.segment)
                      setPage('viewSegment')
                    })
                    .catch((err) => {
                      toast.error('Error creating segment')
                    })
                    .finally(() => {
                      setLoading(false)
                    })
                }}
                className="mt-4 ml-auto dashboard-primary "
              >
                {loading ? (
                  <div className="h-4 w-4 mr-1.5">
                    <Loader />
                  </div>
                ) : (
                  <PlusCircleIcon className="mr-1.5 text-indigo-100" />
                )}
                New
              </button>
            </>
          )}
        </>
      ) : (
        selectedSegment && (
          <UserSegmentView
            mutateCurrentOrg={mutateCurrentOrg}
            setPage={setPage}
            allData={org.segments ?? []}
            setSelectedSegment={setSelectedSegment as any}
            selectedSegment={selectedSegment}
          />
        )
      )}
    </PopupWrapper>
  )
}

export default CreateSegments
