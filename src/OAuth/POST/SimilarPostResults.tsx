import React, { useEffect, useState } from 'react'
import { useSimilarPostsAndArticles } from '@/data/submission'
import { ArrowRightIcon, SparklesIcon } from '@heroicons/react/solid'
import { motion } from 'framer-motion'
import { useActivityFeed } from '@/data/comment'
import { KeyedMutator } from 'swr'
import { useCurrentOrganization } from '@/data/organization'
import SimilarSubmissionsList from './AnimatedSimilarResultList'
import { useTranslation } from 'next-i18next'
import { searchKeyAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'
import { ISubmission } from '@/interfaces/ISubmission'
import { getSubmissionSimilarKey } from '@/lib/utils'
import isEqual from 'lodash/isEqual'

export const VERY_SIMILAR_SUBMISSION_CONFIDENCE = 0.865

const SimilarPostResults: React.FC<{
  submissionId: string
  rawSubmissionData: any
  mutateSubmissions: KeyedMutator<any>
  commentsMutate: KeyedMutator<any>
  handleReverseMerge?: (submissionId: string) => void
  submission: ISubmission
}> = ({
  submissionId,
  commentsMutate,
  mutateSubmissions,
  rawSubmissionData,
  handleReverseMerge,
  submission,
}) => {
  const { org } = useCurrentOrganization()

  const [searchKey, setSearchKey] = useAtom(searchKeyAtom)

  const submissionKey = getSubmissionSimilarKey(submission)

  const { data: similarData } = useSimilarPostsAndArticles(submissionKey, searchKey)

  const [data, setData] = useState<{ articles: any[]; posts: any[] }>({
    articles: [],
    posts: [],
  })

  useEffect(() => {
    if (similarData?.posts && similarData?.articles) {
      const newData = {
        articles: similarData.articles,
        posts: similarData.posts,
      }

      if (!isEqual(newData, data)) {
        setData(newData)
      }
    }
  }, [similarData])

  const [confidenceLimit, setConfidenceLimit] = useState(VERY_SIMILAR_SUBMISSION_CONFIDENCE)
  const { activityMutate } = useActivityFeed({ submissionId: submissionId }, org)
  const { t } = useTranslation()

  return (
    <div className="mt-3">
      <div className="relative bg-white rounded-md dark:bg-card">
        <button
          tabIndex={-1}
          onClick={() => {
            setConfidenceLimit((p) => (p === 0 ? VERY_SIMILAR_SUBMISSION_CONFIDENCE : 0))
          }}
          className="z-50 flex items-center justify-between w-full p-2 px-3 rounded-md shadow-sm cursor-pointer dashboard-secondary secondary-raised-card dark:hover:border-border dark:hover:bg-border/60 main-transition"
        >
          <p className="flex items-center text-sm font-medium ">
            <SparklesIcon className="secondary-svg mr-1.5" />
            {confidenceLimit === 10
              ? t('show-only-very-similar-posts')
              : t('view-all-similar-posts')}
          </p>
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: confidenceLimit === 0 ? 90 : 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <ArrowRightIcon style={{ height: 14, width: 14 }} className="secondary-svg " />
          </motion.div>
        </button>
      </div>
      <div className="-mt-0.5 pt-0.5">
        <SimilarSubmissionsList
          submissionView={true}
          similarSubmissions={data.posts?.filter((post) => post.id !== submissionId)}
          similarArticles={data.articles}
          confidenceLimit={confidenceLimit}
          activityMutate={activityMutate}
          rawSubmissionData={rawSubmissionData}
          mutateSubmissions={mutateSubmissions}
          commentsMutate={commentsMutate}
          submissionId={submissionId}
          submissionKey={submissionKey}
          handleReverseMerge={handleReverseMerge}
        />
      </div>
    </div>
  )
}

export default SimilarPostResults
