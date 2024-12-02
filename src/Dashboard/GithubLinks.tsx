import { ISubmission } from '@/interfaces/ISubmission'
import React from 'react'
import PostExternalLink from './PostExternalLink'
import { unlinkGithubIssue } from 'network/lib/submission'
import ConfirmationModal from './ConfirmationModal'
import { KeyedMutator } from 'swr'
import { toast } from 'sonner'
import { AxiosResponse } from 'axios'

const GithubLinks: React.FC<{ submission: ISubmission; mutateSubmissions: KeyedMutator<any> }> = ({
  submission,
  mutateSubmissions,
}) => {
  const [showModal, setShowModal] = React.useState(false)
  const [activeId, setActiveId] = React.useState('')

  const unlink = () => {
    if (activeId) {
      unlinkGithubIssue({ submissionId: submission.id, issueId: activeId })
        .then(() => {
          mutateSubmissions()
          toast.success('Issue unlinked successfully')
        })
        .catch((err: AxiosResponse) => {
          toast.error(err?.data?.message)
        })
        .finally(() => {
          setActiveId('')
        })
    }
  }

  if (submission?.githubIssues?.length === 0) return null
  return (
    <>
      <ConfirmationModal
        title="Unlink GitHub Issue"
        callBack={unlink}
        description="Are you sure you want to unlink this issue?"
        open={showModal}
        setOpen={setShowModal}
        buttonTxt="Unlink"
      />
      <div>
        {submission?.githubIssues?.map((issue, index) => (
          <div key={index} className="mt-3">
            <PostExternalLink
              bgColor="bg-gray-100 dark:bg-dark-accent"
              onClick={() => {
                setActiveId(issue.id)
                setShowModal(true)
              }}
              icon={
                <>
                  {/*?xml version="1.0" encoding="UTF-8"?*/}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    className="w-3.5 h-3.5 text-gray-500 dark:text-white"
                    width="22px"
                    height="22px"
                    viewBox="0 0 22 21"
                    version="1.1"
                  >
                    <g id="surface1">
                      <path
                        style={{
                          stroke: 'none',
                          fillRule: 'evenodd',
                          fill: 'currentColor',
                          fillOpacity: 1,
                        }}
                        d="M 10.96875 0 C 4.902344 0 0 4.8125 0 10.765625 C 0 15.523438 3.140625 19.554688 7.5 20.980469 C 8.042969 21.085938 8.242188 20.746094 8.242188 20.464844 C 8.242188 20.214844 8.226562 19.359375 8.226562 18.464844 C 5.175781 19.109375 4.539062 17.183594 4.539062 17.183594 C 4.050781 15.933594 3.324219 15.613281 3.324219 15.613281 C 2.324219 14.953125 3.394531 14.953125 3.394531 14.953125 C 4.503906 15.027344 5.085938 16.058594 5.085938 16.058594 C 6.066406 17.699219 7.644531 17.238281 8.28125 16.953125 C 8.371094 16.257812 8.660156 15.773438 8.96875 15.507812 C 6.535156 15.257812 3.976562 14.332031 3.976562 10.195312 C 3.976562 9.019531 4.414062 8.058594 5.101562 7.308594 C 4.992188 7.039062 4.613281 5.9375 5.210938 4.457031 C 5.210938 4.457031 6.136719 4.171875 8.226562 5.5625 C 9.121094 5.324219 10.042969 5.207031 10.96875 5.203125 C 11.894531 5.203125 12.835938 5.328125 13.707031 5.5625 C 15.796875 4.171875 16.722656 4.457031 16.722656 4.457031 C 17.324219 5.9375 16.941406 7.039062 16.832031 7.308594 C 17.539062 8.058594 17.957031 9.019531 17.957031 10.195312 C 17.957031 14.332031 15.398438 15.238281 12.945312 15.507812 C 13.347656 15.847656 13.691406 16.488281 13.691406 17.503906 C 13.691406 18.949219 13.671875 20.105469 13.671875 20.460938 C 13.671875 20.746094 13.871094 21.085938 14.417969 20.980469 C 18.773438 19.554688 21.917969 15.523438 21.917969 10.765625 C 21.933594 4.8125 17.011719 0 10.96875 0 Z M 10.96875 0 "
                      />
                    </g>
                  </svg>
                </>
              }
              link={issue.url}
              title={`#${issue.number} ${issue.title}`}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default GithubLinks
