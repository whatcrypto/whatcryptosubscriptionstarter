import React, { useState } from 'react'
import CommentFeed from './CommentFeed'
import { useAtom } from 'jotai'
import { authenitcateModalAtom } from '@/atoms/authAtom'
import { cn } from '@/lib/utils'
import ChangelogCommentEditor from './ChangelogCommentEditor'
import { IChangelog, IChangelogFilters } from '@/interfaces/IChangelog'
import { KeyedMutator } from 'swr'
import useElementSize from './useElementSize'
import { useTranslation } from 'next-i18next'
import { useComments } from '@/data/comment'
import { useCurrentOrganization } from '@/data/organization'
import { InView } from 'react-intersection-observer'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'

const FloatingChangelogComment: React.FC<{
  changelog: IChangelog
  mutateChangelogs: KeyedMutator<any>
  unOpenedChangelog?: boolean
  changelogFilters?: IChangelogFilters
  widget?: boolean
  commentThreadId?: string
}> = ({
  changelog,
  mutateChangelogs,
  unOpenedChangelog,
  changelogFilters,
  widget,
  commentThreadId,
}) => {
  const { org } = useCurrentOrganization()
  const defaultSortBy = {
    sortBy: 'best',
    changelogId: changelog.id,
    submissionId: undefined,
    commentThreadId,
  }
  const [sortByComments, setSortByComments] = useState(defaultSortBy)
  const [isInView, setIsInView] = useState(false)

  const { comments, isCommentsLoading } = useComments(
    commentThreadId ? sortByComments : isInView ? sortByComments : null,
    org
  )

  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [isShowingMore, setIsShowingMore] = useState(false)
  const [editorHeightRef, { width, height: editorHeight }] = useElementSize()
  const router = useRouter()
  const { t } = useTranslation()

  const muatateCommentCount = (increase: boolean) => {
    mutateChangelogs((changelogs: any) => {
      return changelogs?.map((item: any) => {
        return {
          results: item.results.map((changelog: any) => {
            if (changelog.id === sortByComments.changelogId) {
              changelog.commentCount += increase ? 1 : -1
            }
            return changelog
          }),
          ...item,
        }
      })
    }, false)
  }

  return (
    <>
      <ChangelogCommentEditor
        isInView={isInView}
        mutateChangelogs={mutateChangelogs}
        changelog={changelog}
        unOpenedChangelog={unOpenedChangelog}
        muatateCommentCount={muatateCommentCount}
        changelogId={changelog?.id}
        sortByComments={sortByComments}
        isCommentsLoading={isCommentsLoading}
        widget={widget}
      />
      <AnimatePresence>
        <InView
          as="div"
          onChange={(event: boolean) => {
            if (event && !isInView) {
              setIsInView(true)
            }
          }}
        >
          {(comments && comments?.length !== 0) ||
          JSON.stringify(defaultSortBy) !== JSON.stringify(sortByComments) ? (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              className={cn('sm:mt-6 px-4 -mx-4 relative ', !commentThreadId && 'overflow-hidden')}
              onClick={() => {
                if (!isShowingMore) {
                  setIsShowingMore(true)
                }
              }}
            >
              {!commentThreadId && !isShowingMore && editorHeight === 330 && (
                <button
                  className={
                    'unstyled-button z-10 absolute flex items-end w-full justify-center group -bottom-0.5 cursor-pointer -inset-x-4 h-16  bg-gradient-to-t from-white backdrop-blur-[2px]  dark:from-background to-transparent unstyled-button'
                  }
                >
                  <p className="mb-2 text-sm font-medium bg-gray-50/50 dark:bg-border/50 px-2 py-0.5 rounded-md main-transition">
                    {t('continue-reading')}
                  </p>
                </button>
              )}

              <div
                ref={editorHeightRef}
                className={cn(
                  isShowingMore || commentThreadId ? '' : 'max-h-[330px] overflow-hidden'
                )}
              >
                <CommentFeed
                  sortBy={sortByComments}
                  setSortBy={setSortByComments}
                  changeSubmissionCommentCount={(increase) => {
                    muatateCommentCount(increase)
                  }}
                  changelog={changelog}
                  setAuthenitacteModal={setAuthenitacteModal}
                />
              </div>
            </motion.div>
          ) : null}
        </InView>
      </AnimatePresence>
    </>
  )
}

export default FloatingChangelogComment
