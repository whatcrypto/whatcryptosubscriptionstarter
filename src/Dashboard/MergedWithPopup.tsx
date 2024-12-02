import { useActivityFeed } from '@/data/comment'
import { useCurrentOrganization } from '@/data/organization'
import React from 'react'
import { MergeIcon } from './PostSearchWithAlgolia'
import { TooltipContent, TooltipProvider, TooltipTrigger, Tooltip } from './radix/Tooltip'
import Loader from './Loader'
import { InView } from 'react-intersection-observer'
import { ISubmission } from '@/interfaces/ISubmission'
import { ContentModifier } from './ContentReplacer'
import { ArrowRightIcon } from '@heroicons/react/solid'

const MergedWithPopup: React.FC<{ submission: ISubmission }> = ({ submission }) => {
  const { org } = useCurrentOrganization()

  const shouldFetch = (submission.mergedSubmissionCount || 0) > 0

  const [openTooltip, setOpenTooltip] = React.useState(false)

  const { activities, isActivitiesLoading, totalActivityResults, size, setSize } = useActivityFeed(
    {
      submissionId: shouldFetch ? submission.id : undefined,
      type: 'merge',
    },
    org
  )

  let showLoader = totalActivityResults ? size * 10 < totalActivityResults : false

  if (!shouldFetch || !activities) return null

  return (
    <div className="text-xs flex-shrink-0">
      <TooltipProvider>
        <Tooltip open={openTooltip} onOpenChange={setOpenTooltip} delayDuration={200}>
          <TooltipTrigger onClick={() => setOpenTooltip(true)} asChild>
            <p className="p-1.5 py-1 cursor-default select-none flex items-center shadow-none rounded-md secondary-raised-card">
              <div className="flex-shrink-0 w-4 h-4 text-accent mr-1">
                <MergeIcon />
              </div>
              {submission.mergedSubmissionCount || 0}
            </p>
          </TooltipTrigger>
          <TooltipContent className="w-[380px] max-w-[380px] lg:w-[600px] overscroll-contain max-h-[700px] overflow-auto custom-scrollbar-stronger lg:max-w-[600px] p-0 text-sm divide-y dark:divide-white/5 divide-dashboard">
            {activities?.map((activity) => (
              <div key={activity.id} className="p-4">
                <p className="font-semibold text-gray-600 dark:text-white">
                  {activity.submissionDetails.title}
                </p>
                {activity.submissionDetails.content !== '<p></p>' && (
                  <div className="mt-2 line-clamp-[14] text-[13px]">
                    <ContentModifier content={activity.submissionDetails.content} />
                  </div>
                )}
                <div className="mt-2 flex text-xs items-center justify-end">
                  <a
                    href={`/p/${activity?.mergedSubmissionId}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent font-medium hover:underline flex items-center"
                  >
                    View full post <ArrowRightIcon className="w-3 h-3 ml-1.5 opacity-75" />
                  </a>
                </div>
              </div>
            ))}
            {isActivitiesLoading && (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 secondary-svg">
                  <Loader />
                </div>
              </div>
            )}
            {!isActivitiesLoading && showLoader && (
              <InView
                as="div"
                onChange={(inView: boolean) => {
                  inView && setSize(size + 1)
                }}
              >
                <div className="flex items-center justify-center py-6">
                  <div className="w-6 h-6 py-6 secondary-svg">
                    <Loader />
                  </div>
                </div>
              </InView>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default MergedWithPopup
