import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TagBullet from './TagBullet'
import MergePopup from './MergePopup'
import { ContentModifier } from './ContentReplacer'
import { cn } from '@/lib/utils'
import { ISubmission } from '@/interfaces/ISubmission'
import { useUser } from '@/data/user'
import { useCurrentOrganization } from '@/data/organization'
import { KeyedMutator } from 'swr'
import { VERY_SIMILAR_SUBMISSION_CONFIDENCE } from './SimilarPostResults'
import { can } from '@/lib/acl'
import { IHelpCenterArticleDocument } from '@/interfaces/IHelpCenter'
import FeaturedIcon from './docs/FeaturedIcon'
import Link from './CustomLink'
import { getAccessToken } from 'network/apiClient'

export const similarEntryClass = (widget: boolean, submission: boolean) =>
  cn(
    submission
      ? 'font-medium dark:text-foreground rounded-md main-transition text-gray-400 mr-2 py-2 px-2.5 hover:bg-gray-100/40 dark:hover:bg-border/50 w-full flex gap-1 items-start'
      : 'font-medium hover:bg-white dark:hover:bg-secondary/60 hover:shadow-sm dark:text-foreground text-gray-400 cursor-pointer py-2 px-2 w-full flex gap-1 items-start',
    widget &&
      !submission &&
      'border border-transparent dark:hover:!border-white/5 hover:!border-gray-200/40 hover:!bg-gray-50/60 hover:!shadow dark:hover:!bg-white/5'
  )

const SimilarSubmissionsList: React.FC<
  {
    similarSubmissions: (ISubmission & {
      _rankingScoreDetails: {
        vectorSort: {
          order: number
          similarity: number
        }
      }
    })[]
    similarArticles: (IHelpCenterArticleDocument & {
      _rankingScoreDetails: {
        vectorSort: {
          order: number
          similarity: number
        }
      }
    })[]
    confidenceLimit: number
    submissionKey?: string
    handleReverseMerge?: (submissionId: string) => void
    widget?: boolean
  } & (
    | {
        submissionView: true
        activityMutate: KeyedMutator<any[]>
        rawSubmissionData: any
        mutateSubmissions: KeyedMutator<any[]>
        commentsMutate: KeyedMutator<any[]>
        submissionId: string
      }
    | {
        submissionView?: false
        setActiveSubmissionId: React.Dispatch<React.SetStateAction<string>>
        setActiveSlugId: (slug: string) => void
      }
  )
> = (props) => {
  const { similarSubmissions, confidenceLimit } = props

  const { org } = useCurrentOrganization()
  const { user } = useUser()

  const isTopLevel = !props?.widget && typeof window !== 'undefined' && window.top === window.self

  const activeResults = similarSubmissions
    ?.filter((sub) => (sub?._rankingScoreDetails?.vectorSort?.similarity || 0) >= confidenceLimit)
    ?.filter((sub) => (props.submissionView ? !sub.mergedToSubmissionId : true))

  const modifiedActiveResults =
    confidenceLimit === VERY_SIMILAR_SUBMISSION_CONFIDENCE && props.submissionView
      ? activeResults?.splice(0, 2)
      : activeResults

  const shouldDisplayPosts = modifiedActiveResults?.some(
    (sub) => (sub?._rankingScoreDetails?.vectorSort?.similarity || 0) >= confidenceLimit
  )

  return (
    <AnimatePresence initial={false}>
      <div>
        {!props.submissionView &&
          props.similarArticles?.some(
            (article) => (article?._rankingScoreDetails?.vectorSort?.similarity || 0) >= 0.4
          ) && (
            <div className={cn(shouldDisplayPosts && 'mb-2 border-b dark:border-white/5')}>
              <motion.div
                initial={{ height: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', overflowY: 'hidden' }}
                exit={{ height: 0, overflow: 'hidden' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {props.similarArticles.map((article, index) => {
                  return (
                    <div
                      key={article._id}
                      className={cn(
                        'flex items-center group text-sm rounded-md mx-1.5 py-0.5 px-0.5',
                        index === 0 && (props.submissionView || props?.widget) && 'mt-2.5',
                        index === props.similarArticles.length - 1 && 'mb-1.5'
                      )}
                    >
                      {props.submissionView ? (
                        <Link legacyBehavior href={article?.featurebaseUrl || ''}>
                          <a
                            target={'_blank'}
                            rel={'noreferrer'}
                            // @ts-ignore
                            className={similarEntryClass(props?.widget ? true : false, false)}
                          >
                            <div className="mt-[2px] mr-[5px]">
                              {article.icon ? (
                                <div className="text-accent">
                                  <FeaturedIcon small={true} icon={article.icon} />
                                </div>
                              ) : (
                                <svg
                                  className="!w-3.5 mt-px !h-3.5 secondary-svg"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                                </svg>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center gap-1.5 cursor-pointer w-full">
                                <span className="font-medium text-left line-clamp-1">
                                  {article.title}
                                </span>
                              </div>
                              <div className="text-xs text-left line-clamp-2 mt-0.5 opacity-80">
                                {article.description}
                              </div>
                            </div>
                          </a>
                        </Link>
                      ) : (
                        <Link legacyBehavior href={article?.featurebaseUrl || ''}>
                          <a className="w-full" target={'_blank'} rel={'noreferrer'}>
                            <button
                              className={cn(
                                'font-medium hover:bg-white dark:hover:bg-secondary/60 hover:shadow-sm dark:text-foreground text-gray-400 cursor-pointer py-2 px-2 w-full flex gap-1 items-start',
                                props?.widget &&
                                  'border border-transparent dark:hover:!border-white/5 hover:!border-gray-200/40 hover:!bg-gray-50/60 hover:!shadow dark:hover:!bg-white/5'
                              )}
                            >
                              <div className="mt-[2px] mr-[5px]">
                                {article.icon ? (
                                  <div className="text-accent">
                                    <FeaturedIcon small={true} icon={article.icon} />
                                  </div>
                                ) : (
                                  <svg
                                    className="!w-3.5 mt-px !h-3.5 secondary-svg"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                  >
                                    <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                                  </svg>
                                )}
                              </div>

                              <div>
                                <div className="flex items-center gap-1.5 cursor-pointer w-full">
                                  <span className="font-medium text-left line-clamp-1">
                                    {article.title}
                                  </span>
                                </div>
                                <div className="text-xs text-left line-clamp-2 mt-0.5 opacity-80">
                                  {article.description}
                                </div>
                              </div>
                            </button>
                          </a>
                        </Link>
                      )}
                    </div>
                  )
                })}
              </motion.div>
            </div>
          )}
        {shouldDisplayPosts && (
          <div
            className={cn(
              props.submissionView
                ? ' border -mt-1 border-t-0 rounded-b-lg rounded-x-lg'
                : '-mt-3 pt-2.5'
            )}
          >
            <motion.div
              initial={{ height: 0, overflow: 'hidden' }}
              animate={{ height: 'auto', overflowY: 'auto' }}
              exit={{ height: 0, overflow: 'hidden' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className={cn(
                'custom-scrollbar-stronger max-h-64',
                !props.submissionView && 'max-h-40'
              )}
            >
              {modifiedActiveResults.map((submission, index) => {
                return (
                  <div
                    key={submission.id}
                    className={cn(
                      'flex items-center group text-sm rounded-md mx-1.5 py-0.5 px-0.5',
                      index === 0 && (props.submissionView || props?.widget) && 'mt-2.5',
                      index === modifiedActiveResults.length - 1 && 'mb-1.5'
                    )}
                  >
                    {props.submissionView ? (
                      <Link
                        legacyBehavior
                        href={'/p/' + submission?.slug}
                        // target="_blank"
                        // rel="noreferrer"
                      >
                        <a
                          target={isTopLevel ? '_blank' : undefined}
                          rel={isTopLevel ? 'noreferrer' : undefined}
                          className="font-medium dark:text-foreground rounded-md main-transition text-gray-400 mr-2 py-2 px-2.5 hover:bg-gray-100/40 dark:hover:bg-border/50 w-full flex gap-1 items-start"
                        >
                          <div className="mt-[7px]">
                            <TagBullet theme={submission.postStatus.color} />
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 cursor-pointer w-full">
                              <span className="font-medium text-left line-clamp-1">
                                {submission.title}
                              </span>
                            </div>
                            <div className="text-xs text-left line-clamp-2 mt-0.5 opacity-80">
                              <ContentModifier removeAll={true} content={submission?.content} />
                            </div>
                          </div>
                        </a>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          props.setActiveSubmissionId(submission.id)
                          props.setActiveSlugId(submission.slug)
                        }}
                        className={cn(
                          'font-medium hover:bg-white dark:hover:bg-secondary/60 hover:shadow-sm dark:text-foreground text-gray-400 cursor-pointer py-2 px-2 w-full flex gap-1 items-start',
                          props?.widget &&
                            'border border-transparent dark:hover:!border-white/5 hover:!border-gray-200/40 hover:!bg-gray-50/60 hover:!shadow dark:hover:!bg-white/5'
                        )}
                      >
                        <div className="mt-[7px]">
                          <TagBullet theme={submission.postStatus.color} />
                        </div>

                        <div className="max-w-xl">
                          <div className="flex items-center gap-1.5 cursor-pointer w-full">
                            <span className="font-medium text-left line-clamp-1">
                              {submission.title}
                            </span>
                          </div>
                          <div className="text-xs line-clamp-2 text-left mt-0.5 opacity-80">
                            <ContentModifier removeAll={true} content={submission?.content} />
                          </div>
                        </div>
                      </button>
                    )}

                    {can(user?.id, 'post_merge', org) &&
                      !submission?.mergedToSubmissionId &&
                      props.submissionView && (
                        <span className="ml-auto">
                          <MergePopup
                            similarPostView={true}
                            customIconClasses="h-4 w-4 secondary-svg"
                            activityMutate={props.activityMutate}
                            isPending={submission?.inReview}
                            activeTitle={submission?.title}
                            rawSubmissionData={props.rawSubmissionData}
                            mutateSubmissions={props.mutateSubmissions}
                            submissionKey={props.submissionKey}
                            activeSubId={props.submissionId}
                            defaultMergingPostId={submission?.id}
                            commentsMutate={props.commentsMutate}
                            closeSubmissionModal={() => {
                              props.handleReverseMerge && props.handleReverseMerge(submission?.id)
                            }}
                          />
                        </span>
                      )}
                  </div>
                )
              })}
            </motion.div>
          </div>
        )}
      </div>
    </AnimatePresence>
  )
}

export default SimilarSubmissionsList
