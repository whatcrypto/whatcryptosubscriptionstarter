import { getCommentVoters } from 'network/lib/submission'
import React, { useEffect, useRef, useState } from 'react'
import Loader from './Loader'
import { IComment } from '@/interfaces/IComment'
import { ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/solid'
import { cn } from '@/lib/utils'
import { useTranslation } from 'next-i18next'
import { dateDifference } from './MainPostView'
import UserPicture from './UserPicture'
import { IOrganization } from '@/interfaces/IOrganization'
import { IAdmin, ICustomer } from '@/interfaces/IUser'
import { isMember } from '@/lib/acl'

type SurveyVoters = {
  id: string
  score: number
  time: number
  user: {
    name: string
    email: string
    profilePicture: string
  }
}

const CommentVoterList: React.FC<{
  comment: IComment
  org: IOrganization
  user?: IAdmin | ICustomer
}> = ({ comment, org, user }) => {
  const isRequestInFlight = useRef(false)
  const [loading, setLoading] = useState(false)
  const [voters, setVoters] = useState<SurveyVoters[]>([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (!isRequestInFlight.current && !voters.length && comment) {
      isRequestInFlight.current = true
      setLoading(true)
      getCommentVoters(comment.id)
        .then((res) => {
          if (res.data.success) {
            setVoters(res.data?.voters)
          }
        })
        .catch((err) => {
          console.log('Error fetching comment voters', err)
        })
        .finally(() => {
          isRequestInFlight.current = false
          setLoading(false)
        })
    }
  }, [comment])

  return (
    <div className="w-56 overflow-auto max-h-64 custom-scrollbar">
      {loading ? (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 mx-auto secondary-svg">
            <Loader />
          </div>
        </div>
      ) : voters.length === 0 ? (
        <div className="flex items-center justify-center py-7">
          <p className="text-xs max-w-[200px] dark:text-gray-100 text-gray-500 font-medium text-center">
            No people have liked this comment
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100/60 dark:divide-gray-500/40">
          {voters?.map((voter) => (
            <div
              className="flex items-center justify-between gap-1.5 px-3 py-3 dark:odd:bg-border/20 odd:bg-gray-50/70 border-gray-100/60"
              key={voter.id}
            >
              <div className="flex items-center gap-2">
                <div className="relative flex items-center flex-shrink-0">
                  {voter?.user?.profilePicture && (
                    <div className="mr-0.5">
                      <UserPicture img={voter.user.profilePicture} authorId={voter.id || ''} />
                    </div>
                  )}
                </div>
                <div className="">
                  <p className="text-xs max-w-[100px] truncate font-semibold text-gray-500 dark:text-gray-100">
                    {voter?.user?.name}
                  </p>
                  {voter.time ? (
                    <div
                      className={`text-[10px] first-letter:uppercase truncate font-medium dark:text-foreground text-gray-400`}
                    >
                      {dateDifference(new Date(voter.time)?.toISOString(), i18n.language)}
                    </div>
                  ) : null}
                </div>
              </div>
              <div className="flex items-center flex-shrink-0 gap-1">
                {voter.score === 1 ? (
                  <ThumbUpIcon className={cn('secondary-svg h-4 w-4')} />
                ) : (
                  <ThumbDownIcon className={cn('secondary-svg h-4 w-4')} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default CommentVoterList
