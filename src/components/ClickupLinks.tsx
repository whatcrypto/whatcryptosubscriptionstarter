import { ISubmission } from '@/interfaces/ISubmission'
import React from 'react'
import PostExternalLink from './PostExternalLink'
import { unLinkClickupTask } from 'network/lib/submission'
import ConfirmationModal from './ConfirmationModal'
import { KeyedMutator } from 'swr'
import { toast } from 'sonner'
import { AxiosResponse } from 'axios'

const ClickupLinks: React.FC<{ submission: ISubmission; mutateSubmissions: KeyedMutator<any> }> = ({
  submission,
  mutateSubmissions,
}) => {
  const [showModal, setShowModal] = React.useState(false)
  const [activeId, setActiveId] = React.useState('')

  const unlink = () => {
    if (activeId) {
      unLinkClickupTask({ submissionId: submission.id, taskId: activeId })
        .then(() => {
          mutateSubmissions()
          toast.success('Task unlinked successfully')
        })
        .catch((err: AxiosResponse) => {
          toast.error(err.data.message)
        })
        .finally(() => {
          setActiveId('')
        })
    }
  }

  if (submission?.clickupTasks?.length === 0) return null
  return (
    <>
      <ConfirmationModal
        title="Unlink Clickup Task"
        callBack={unlink}
        description="Are you sure you want to unlink this task?"
        open={showModal}
        setOpen={setShowModal}
        buttonTxt="Unlink"
      />
      <div>
        {submission?.clickupTasks?.map((task, index) => (
          <div key={index} className="mt-3">
            <PostExternalLink
              onClick={() => {
                setActiveId(task.id)
                setShowModal(true)
              }}
              icon={
                <>
                  <svg
                    width={10}
                    height={12}
                    className="w-3.5 h-3.5 text-white"
                    viewBox="0 0 14 17"
                    fill="none"
                    color="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 12.3831L2.46097 10.498C3.76783 12.2043 5.15566 12.9905 6.70213 12.9905C8.24008 12.9905 9.58976 12.2132 10.838 10.5206L13.333 12.3605C11.5331 14.801 9.29394 16.0904 6.70213 16.0904C4.11894 16.0904 1.859 14.8101 0 12.3831Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.69273 4.18985L2.3126 7.96414L0.289062 5.61578L6.70143 0.090332L13.0639 5.6201L11.0305 7.95984L6.69273 4.18985Z"
                      fill="currentColor"
                    />
                  </svg>
                </>
              }
              link={task.url}
              title={task.title}
            />
          </div>
        ))}
      </div>
    </>
  )
}

export default ClickupLinks
