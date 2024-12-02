import React, { Fragment, useEffect, useMemo, useState } from 'react'
import VotingHandler from './VotingHandler'
import Link from '@/components/CustomLink'
import { ISubmission, ISubmissionFilters, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { KeyedMutator } from 'swr'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import Category from './Category'
import QuarterBadge from './QuarterBadge'
import CommentCounter from './CommentCounter'
import { dateDifference } from './MainPostView'
import Status from './Status'
import Image from 'next/legacy/image'
import { useTranslation } from 'next-i18next'
import { useUser } from '@/data/user'
import { useCurrentOrganization } from '@/data/organization'
import { AnimatePresence, motion } from 'framer-motion'
import useMeasure from 'react-use-measure'
import Survey from './Survey'
import { isPostPrivateWithUsers } from '@/lib/utils'
import chroma from 'chroma-js'
import TagComponent from './Tag'
import PrivateWithAuthorBadge from './PrivateWithAuthorBadge'
import { useAtom } from 'jotai'
import { lastViewedSubmissionAtom } from '@/atoms/displayAtom'
import { useIsMounted } from '@/lib/hooks'
import { isMember } from '@/lib/acl'
import { stripHtml } from 'string-strip-html'

interface ISubmissionResultProps {
  submission: ISubmission
  rawSubmissionData: ISubmissionPaginate[] | undefined
  mutateSubmissions: KeyedMutator<any>
  filters: ISubmissionFilters
  renderDate?: Date | undefined
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>>
  setMainPostView?: React.Dispatch<React.SetStateAction<boolean>>
  widget?: boolean
  setUrl?: (url: string) => void
  timezone?: string
}

const PublicSubmissionResult: React.FC<ISubmissionResultProps> = ({
  submission,
  rawSubmissionData,
  mutateSubmissions,
  filters,
  renderDate,
  setActiveSubmissionId,
  setMainPostView,
  widget = false,
  setUrl,
  timezone,
}) => {
  // We don't need to sanitize the content here, as we are not inserting it with dangerouslySetInnerHTML,
  // instead we just use {textContent} in the JSX
  const textContent = stripHtml(submission.content || '').result
  const [justVoted, setJustVoted] = useState(false)
  const [hasAdjustedVote, setHasAdjustedVote] = useState(false)
  const { t, i18n } = useTranslation()
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const [lastViewedSubmission, setLastViewedSubmission] = useAtom(lastViewedSubmissionAtom) // Correctly initializing a ref with an empty string
  const isMoutned = useIsMounted()

  useEffect(() => {
    if (user && submission && !hasAdjustedVote) {
      if (
        submission.user?._id === user.id &&
        submission.date &&
        new Date(submission.date).getTime() + 600000 > new Date(renderDate || new Date()).getTime()
      ) {
        setJustVoted(true)
        setHasAdjustedVote(true)
      }
    }
  }, [submission, user, hasAdjustedVote])

  const getAllEnabledBoards = useMemo(() => {
    const enabledStatuses: any = []

    filters?.advancedFilters?.forEach((filter) => {
      if (filter.type === 'b') {
        filter.values.forEach((value) => {
          enabledStatuses.push(value)
        })
      }
    })

    return enabledStatuses
  }, [filters?.advancedFilters])

  let [ref, { width }] = useMeasure()

  if (!submission.id) {
    return <></>
  }

  const hideStatus =
    user && isMember(user?.id, org) ? false : org?.settings?.hideStatusFromPublic || false

  const reducedOpacity = chroma(org.color).luminance(0.25).css()

  const handleSubmissionClick = () => {
    setActiveSubmissionId && setActiveSubmissionId(submission.id)
    setMainPostView && setMainPostView(true)
    setUrl && setUrl(`/p/${submission.slug}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>) => {
    // Activates the link on 'Enter' or 'Space' key press
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault() // Prevent the default action for these keys
      handleSubmissionClick()
    }
  }

  const PostContent = () => {
    return (
      <div className="relative">
        {submission.pinned && (
          <div className="absolute flex items-center p-1 rounded-md -top-4 -right-2">
            <svg
              style={{ color: reducedOpacity }}
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 -mt-[3px] mr-0.5"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M15.113 3.21l.094 .083l5.5 5.5a1 1 0 0 1 -1.175 1.59l-3.172 3.171l-1.424 3.797a1 1 0 0 1 -.158 .277l-.07 .08l-1.5 1.5a1 1 0 0 1 -1.32 .082l-.095 -.083l-2.793 -2.792l-3.793 3.792a1 1 0 0 1 -1.497 -1.32l.083 -.094l3.792 -3.793l-2.792 -2.793a1 1 0 0 1 -.083 -1.32l.083 -.094l1.5 -1.5a1 1 0 0 1 .258 -.187l.098 -.042l3.796 -1.425l3.171 -3.17a1 1 0 0 1 1.497 -1.26z"
                strokeWidth="0"
                fill="currentColor"
              />
            </svg>
            <p className=" text-gray-500  dark:text-foreground uppercase text-[11px] tracking-wide font-semibold">
              {t('pinned')}
            </p>
          </div>
        )}
        {!submission.postStatus.isDefault && !hideStatus && (
          <div className="inline-block mb-2">
            <Status widget={true} xSmall={true} small={true} status={submission.postStatus} />
          </div>
        )}
        <p className="text-base font-semibold text-gray-500 line-clamp-2 content dark:text-white">
          {submission.title}
        </p>

        {textContent && (
          <p className="mt-1 text-sm text-gray-400 line-clamp-2 dark:text-foreground">
            {<Fragment>{textContent}</Fragment>}
          </p>
        )}
        <div className="flex flex-wrap items-end justify-between gap-3 pt-3.5">
          {org?.settings?.hideAuthorInfo && !isMember(user?.id, org) ? (
            <div className="flex items-center mr-2">
              <Category
                widget={true}
                xSmall={true}
                small={true}
                dash={true}
                category={submission.postCategory}
              />
              {!submission?.postCategory?.hideCreationDates || isMember(user?.id, org) ? (
                <p className="text-sm ml-1.5 text-gray-400 dark:text-foreground">
                  <span className="text-xs font-medium ml-1.5 dark:text-foreground/70 text-background-accent">
                    {dateDifference(
                      submission?.date,
                      i18n.language,
                      isMoutned ? new Date() : renderDate
                    )}
                  </span>
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center mr-2">
              {submission?.user?.picture ? (
                <div className="relative flex items-center justify-center flex-shrink-0 w-5 h-5 rounded-full bg-gray-100/60 dark:bg-secondary/50 ">
                  <Image
                    unoptimized
                    className="object-cover rounded-full"
                    src={submission?.user?.picture}
                    height={20}
                    width={20}
                  />
                </div>
              ) : (
                <div className="w-5 h-5 bg-gray-100 rounded-full dark:bg-gray-500">
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="w-5 font-semibold text-gray-400 rounded-full dark:text-foreground "
                  >
                    <path
                      d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                      className="jsx-1981044996"
                    />
                  </svg>
                </div>
              )}
              <p className="text-sm ml-1.5 text-gray-400 dark:text-foreground">
                <span className="font-medium ">
                  {submission.user?.name ? submission.user.name : 'An Anonymous User'}
                </span>{' '}
                {!submission?.postCategory?.hideCreationDates || isMember(user?.id, org) ? (
                  <span className="text-xs font-medium ml-1.5 dark:text-foreground/70 text-background-accent">
                    {dateDifference(
                      submission?.date,
                      i18n.language,
                      isMoutned ? new Date() : renderDate
                    )}
                  </span>
                ) : null}
              </p>
            </div>
          )}

          <div className={'flex items-center space-x-2 -mb-[3px]'}>
            {submission.commentCount ? <CommentCounter count={submission.commentCount} /> : null}
            {submission?.eta && (
              <div className="items-center hidden sm:inline-flex">
                <QuarterBadge timezone={timezone} small={true} date={submission.eta} />
              </div>
            )}
            {submission.postTags?.length !== 0 && (
              <div className="hidden sm:block">
                <TagComponent widget={true} xSmall={true} small={true} tags={submission.postTags} />
              </div>
            )}
            {isPostPrivateWithUsers(submission) ? (
              <PrivateWithAuthorBadge submission={submission} />
            ) : null}

            {org?.postCategories?.length > 1 &&
              getAllEnabledBoards?.length === 0 &&
              (!org?.settings?.hideAuthorInfo || isMember(user?.id, org)) && (
                <Category
                  widget={true}
                  xSmall={true}
                  small={true}
                  dash={true}
                  category={submission.postCategory}
                />
              )}
            {submission.inReview && (
              <div className="flex items-center px-1.5 rounded-md py-0.5 overflow-hidden text-xs font-medium border hover:bg-transparent text-accent-foreground dark:text-white/90 bg-accent/5 border-accent/20 dark:bg-accent/10 dark:border-accent/[7%]">
                <b className="flex items-center font-medium">
                  <ShieldCheckIcon className="w-3.5 h-3.5 mr-1 text-accent" />
                  Pending
                </b>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const shouldAnimate = lastViewedSubmission === submission.id

  return (
    <motion.div
      // Disable the animation
      // Animate the post in
      initial={lastViewedSubmission === submission.id ? 'hidden' : undefined}
      whileInView={lastViewedSubmission === submission.id ? 'visible' : undefined}
      viewport={shouldAnimate ? { once: true } : undefined}
      transition={shouldAnimate ? { duration: 0.3 } : undefined}
      variants={
        shouldAnimate
          ? {
              visible: { opacity: 1, scale: 1 },
              hidden: { opacity: 0, scale: 0.8 },
            }
          : undefined
      }
      key={submission.id}
    >
      <div
        ref={ref}
        className="relative flex w-full pr-0 duration-75 ease-in sm:items-stretch hover:bg-gray-50/90 dark:hover:bg-border/30"
      >
        {widget ? (
          <button
            onClick={() => {
              setActiveSubmissionId && setActiveSubmissionId(submission.id)
              setMainPostView && setMainPostView(true)
            }}
            className="w-full h-full min-w-0 py-4 pl-4 pr-3 my-auto overflow-auto rounded-md cursor-pointer unstyled-button sm:pl-5 sm:py-5 "
          >
            <PostContent />
          </button>
        ) : (
          <>
            <Link
              scroll={false}
              href={`/?p/${submission.slug}`}
              as={`/p/${submission.slug}`}
              shallow={true}
            >
              <a
                onClick={() => {
                  setActiveSubmissionId && setActiveSubmissionId(submission.id)
                  setMainPostView && setMainPostView(true)
                  setUrl && setUrl(`/p/${submission.slug}`)
                }}
                aria-label={`View post ${submission?.title || 'details'}`}
                role="button"
                onKeyDown={(e) => handleKeyDown(e)}
                className="hidden w-full h-full min-w-0 py-4 pl-4 pr-3 my-auto overflow-auto rounded-md cursor-pointer unstyled-button sm:block sm:pl-5 sm:py-5 "
              >
                <PostContent />
              </a>
            </Link>
            <Link href={`/p/${submission.slug}`}>
              <a
                onClick={() => setLastViewedSubmission(submission.id)}
                className="w-full h-full min-w-0 py-4 pl-4 pr-3 my-auto overflow-auto rounded-md cursor-pointer sm:hidden sm:pl-5 sm:py-5 "
              >
                <PostContent />
              </a>
            </Link>
          </>
        )}
        {rawSubmissionData && (
          <div className="flex">
            <VotingHandler
              renderDate={renderDate}
              width={width}
              justVoted={justVoted}
              setJustVoted={setJustVoted}
              small={false}
              submission={submission}
              rawSubmissionData={rawSubmissionData}
              mutateSubmissions={mutateSubmissions}
            />
          </div>
        )}
      </div>
      <div className="sm:hidden">
        <AnimatePresence>
          {justVoted && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              transition={{ duration: 0.4, type: 'easeInOut' }}
              className="w-full overflow-hidden bg-gradient-to-b from-transparent to-gray-50/60 dark:to-border/60"
            >
              <div className="h-px bg-gradient-to-r from-transparent to-gray-100/50 dark:to-border"></div>
              <Survey
                mutateSubmissions={mutateSubmissions}
                rawSubmissionData={rawSubmissionData}
                renderDate={renderDate}
                submission={submission}
                justVoted={justVoted}
                submissionId={submission.id}
                setJustVoted={setJustVoted}
                width={width}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default PublicSubmissionResult
