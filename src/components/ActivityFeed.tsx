import { useActivityFeed } from '@/data/comment'
import { IOrganization } from '@/interfaces/IOrganization'
import { ISubmission } from '@/interfaces/ISubmission'
import { Transition } from '@headlessui/react'
import React from 'react'
import Loader from './Loader'
import { InView } from 'react-intersection-observer'
import { MergeIcon } from './PostSearchWithAlgolia'
import { ArrowRightIcon, StatusOnlineIcon } from '@heroicons/react/solid'
import { dateDifference } from './MainPostView'
import { getColor } from './TagBullet'
import EmptyIllustration from './EmptyIllustration'
import { useTranslation, Trans } from 'next-i18next'

const ActivityFeed: React.FC<{ submission: ISubmission; org: IOrganization }> = ({
  submission,
  org,
}) => {
  const sortBy = {
    submissionId: submission.id,
  }

  const { t, i18n } = useTranslation()

  const { activities, isActivitiesLoading, totalActivityResults, size, setSize } = useActivityFeed(
    sortBy,
    org
  )

  let showLoader = totalActivityResults ? size * 10 < totalActivityResults : false

  return (
    <div className="">
      <div
        className={`flow-root  ${
          (activities === undefined || activities?.length === 0) && 'h-32'
        } justify-center items-center `}
      >
        <ul className="pl-0 -mb-16 list-none">
          {activities !== undefined && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-8 space-y-3">
              <div className="w-16 h-16">
                <EmptyIllustration primary={org.color} />
              </div>
              <p className={`text-sm  text-gray-400 dark:text-foreground`}>
                {t('no-activity-yet')}
              </p>
            </div>
          )}
          <div className={'overflow-x-auto pb-28'}>
            {activities && (
              <div className="py-2 ">
                <Transition
                  appear={true}
                  show={activities?.length !== 0}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100 "
                  leave="ease-in duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  {activities?.map((activity, activityId) => {
                    const color2 =
                      activity.type === 'statusUpdate'
                        ? getColor(
                            org?.postStatuses?.find(
                              (s) => s.name === activity.statusUpdate.newStatus
                            )?.color || 'Gray'
                          )
                        : ''

                    return (
                      <Transition.Child
                        enter="transition-opacity ease-linear duration-1000"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity ease-linear duration-500"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        key={activity.id}
                        className={''}
                      >
                        {activity.type === 'merge' ? (
                          <li className="relative mb-6 ">
                            {activityId !== activities.length - 1 ? (
                              <span
                                className="absolute h-6 -bottom-6 left-5 z-0 -ml-px w-0.5 bg-gray-100/50 dark:bg-border"
                                aria-hidden="true"
                              />
                            ) : null}

                            <div className="relative p-3 dark:shadow-sm secondary-raised-card">
                              {/* <div className="p-3 border rounded-md border-accent-200 bg-accent/10 dark:border-accent/10 dark:bg-accent/10"> */}
                              <div className="flex ">
                                <div className="flex-shrink-0 w-5 h-5 text-accent">
                                  <MergeIcon />
                                </div>
                                <div className="relative flex items-center justify-between w-full gap-2 ml-3 overflow-hidden sm:gap-6">
                                  <p className="text-[13px] leading-5 text-accent-foreground font-medium break-words line-clamp-2 dark:text-gray-100 text-gray-600">
                                    <Trans
                                      i18nKey="post-merged-with"
                                      components={[
                                        // This span will apply the bold styling to "Post merged with"
                                        <span
                                          key="0"
                                          className="mr-1 font-normal dark:text-foreground text-gray-500 break-all truncate"
                                        />,
                                        // The title will not have additional styling, so it uses React.Fragment
                                        <React.Fragment key="1" />,
                                      ]}
                                      values={{
                                        title: activity.submissionDetails.title,
                                      }}
                                    />
                                  </p>
                                  {/* <p className="text-sm leading-5 text-green-800 break-words line-clamp-2 dark:text-green-100">
                                    <span className="mr-1 font-medium text-green-800 break-all truncate dark:text-green-200">
                                      Post merged with
                                    </span>
                                    {activity.submissionDetails.title}
                                  </p> */}
                                  <div className="flex-shrink-0">
                                    <a
                                      href={'/submissions/' + activity.mergedSubmissionId}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <p className="flex items-center flex-shrink-0 text-xs font-medium whitespace-no-wrap cursor-pointer text-background-accent dark:text-foreground hover:underline">
                                        {t('view-original-post')}{' '}
                                        <ArrowRightIcon className="w-3 h-3 ml-1.5 secondary-svg" />
                                      </p>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ) : (
                          <>
                            <li className="relative mb-6 " key={activity?.id}>
                              {activityId !== activities.length - 1 ? (
                                <span
                                  className="absolute h-6 -bottom-6 left-5 z-0 -ml-px w-0.5 bg-gray-100/50 dark:bg-border"
                                  aria-hidden="true"
                                />
                              ) : null}
                              <div className="relative p-3 dark:shadow-sm secondary-raised-card">
                                <div className="flex items-center">
                                  <div style={{ color: color2 }} className="flex-shrink-0 w-4 h-4">
                                    <StatusOnlineIcon />
                                  </div>
                                  <div className="flex items-center justify-between flex-1 gap-2 ml-3 sm:gap-6">
                                    <p className="text-[13px] text-gray-500 line-clamp-2 dark:text-foreground">
                                      <Trans
                                        i18nKey="user-changed-status-to"
                                        components={[
                                          <span
                                            key="author"
                                            className="font-medium dark:text-gray-100"
                                          />,
                                          <span
                                            key="postStatus"
                                            className="font-medium"
                                            style={{ color: color2 }}
                                          />,
                                        ]}
                                        values={{
                                          author: activity?.initiator?.name,
                                          status: activity?.statusUpdate?.newStatus,
                                        }}
                                      />
                                    </p>
                                    <div className="flex-shrink-0 ml-auto">
                                      <p className="flex items-center text-xs leading-5 text-background-accent dark:text-foreground">
                                        <span className="first-letter:uppercase mr-[3px]">
                                          {dateDifference(activity.createdAt, i18n.language)}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                {/* {comment?.content && (
                              <div className="ml-7 mt-1.5">
                                <ContentModifier content={comment?.content} />
                              </div>
                            )} */}
                              </div>
                            </li>
                          </>
                        )}
                      </Transition.Child>
                    )
                  })}
                </Transition>
              </div>
            )}
            {isActivitiesLoading && (
              <div className="flex items-center justify-center pt-6">
                <div className="w-6 h-6 py-6 secondary-svg">
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
  )
}

export default ActivityFeed
