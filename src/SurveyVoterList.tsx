import { ISubmission } from '@/interfaces/ISubmission'
import { getSurveyVoters } from 'network/lib/submission'
import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { surveyTypeData } from './Survey'
import { BallArray } from './LargeSurvey'
import UserPicture from './UserPicture'
import { useTranslation } from 'next-i18next'

export type SurveyVoters = {
  id: string
  score: number
  type: 'often' | 'importance' | 'urgency'
  user: {
    id: string
    name: string
    email?: string
    picture: string
    type: 'customer' | 'admin' | 'guest'
  }
}

const SurveyVoterList: React.FC<{
  scoreType: 'often' | 'importance' | 'urgency'
  submission: ISubmission
}> = ({ scoreType, submission }) => {
  const isRequestInFlight = useRef(false)
  const [loading, setLoading] = useState(false)
  const [voters, setVoters] = useState<SurveyVoters[]>([])
  const totalVotes = submission?.surveyScores?.[scoreType]?.totalVotes || 0
  const { t } = useTranslation()
  useEffect(() => {
    if (!isRequestInFlight.current && !voters.length && submission) {
      isRequestInFlight.current = true
      setLoading(true)
      getSurveyVoters(submission.id, scoreType)
        .then((res) => {
          if (res.data.success) {
            setVoters(res.data?.surveyVoters)
          }
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          isRequestInFlight.current = false
          setLoading(false)
        })
    }
  }, [submission])

  if (!totalVotes) return null
  return (
    <div className="w-64 overflow-auto custom-scrollbar max-h-64 custom-scrollbar-stronger">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 mx-auto secondary-svg">
            <Loader />
          </div>
        </div>
      ) : voters.length === 0 ? (
        <div className="flex items-center justify-center py-7">
          <p className="text-xs max-w-[200px] font-medium text-center">
            No people have voted on surveys
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100/60 dark:divide-gray-500/40">
          {voters?.map((voter) => (
            <div
              className="flex items-center justify-between px-3 py-3 dark:odd:bg-border/20 odd:bg-gray-50/70 border-gray-100/60"
              key={voter.id}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  {voter?.user?.picture && (
                    <div className="mr-0.5">
                      <UserPicture img={voter.user.picture || ''} authorId={voter.user.id || ''} />
                    </div>
                  )}
                </div>
                <div className="">
                  <p className="text-xs max-w-[120px] truncate font-semibold text-gray-500 dark:text-gray-100">
                    {voter?.user?.name || 'Deleted user'}
                  </p>
                  <div className={`text-[10px] font-medium dark:text-foreground text-gray-400`}>
                    {t(surveyTypeData[scoreType]?.options[voter?.score])}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-medium text-background-accent dark:text-foreground/60 text-[10px]"></p>
              </div>
              <div className="flex items-center gap-1.5">
                <BallArray
                  scoreType={scoreType}
                  customScore={voter.score}
                  submission={submission}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SurveyVoterList
