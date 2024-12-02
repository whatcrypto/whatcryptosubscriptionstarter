import React, { SetStateAction } from 'react'
import { XIcon } from '@heroicons/react/solid'
import { submissionStatusChangedNotification } from 'network/lib/submission'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'
import CustomStatusMessage from './CustomStatusMessage'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { performSubmissionMutation } from '@/lib/submissionMutator'
import { PopoverClose } from './radix/Popover'

const MessageComponent: React.FC<{
  submission: ISubmission
  setOpen?: any
  commentsMutate?: KeyedMutator<any>
  submissionMutate?: KeyedMutator<any>
  fullWidth?: boolean
  activeTitle?: string
  setCustomModal?: React.Dispatch<SetStateAction<any>>
  setPages?: React.Dispatch<SetStateAction<any>>
  rawSubmissionData?: ISubmissionPaginate | ISubmissionPaginate[]
  emailSentCallback?: () => void
}> = ({
  setOpen,
  submission,
  commentsMutate,
  submissionMutate,
  fullWidth,
  activeTitle,
  setCustomModal,
  setPages,
  rawSubmissionData,
  emailSentCallback,
}) => {
  const [customMessage, setCustomMessage] = React.useState(false)

  const sendEmail = (postId?: string, content?: string) => {
    if (postId) {
      setOpen && setOpen(false)
      setPages && setPages([])
      toast.success('Emails are being sent to upvoters')
      setCustomModal && setCustomModal(null)
      if (submissionMutate && rawSubmissionData) {
        performSubmissionMutation(
          submissionMutate,
          (oldResults: ISubmission[]) => {
            return oldResults.map((result) => {
              if (result.id === submission?.id) {
                return {
                  ...result,
                  commentCount: content
                    ? result.commentCount
                      ? result.commentCount + 1
                      : 1
                    : result.commentCount,
                  statusUpdateSentForStatusId: submission?.postStatus.id,
                }
              }
              return result
            })
          },
          rawSubmissionData
        )
      }

      submissionStatusChangedNotification({
        submissionId: postId,
        statusId: submission?.postStatus.id || '',
        statusUpdateComment: content,
      })
        .then(() => {
          emailSentCallback && emailSentCallback()
          commentsMutate && commentsMutate()
        })
        .catch(() => {
          toast.error('Something went wrong, please try again later.')
        })
    }
  }

  const getNotifyTargetName = () => {
    if (submission.postCategory.private) {
      return 'admin upvoters'
    }
    if (submission.postCategory?.roles && submission.postCategory.roles.length > 0) {
      return 'upvoters with role access'
    }
    return 'upvoters'
  }

  return (
    <div className={`p-3 ${!fullWidth ? 'w-[308px]' : 'w-full'}`}>
      <>
        <div className="flex items-center text-sm font-medium text-gray-600 dark:text-gray-100">
          Notify{' '}
          {activeTitle ? (
            <div className="flex items-center px-1">
              "<div className="truncate max-w-[150px]">{activeTitle}</div>"
            </div>
          ) : (
            ' '
          )}{' '}
          {getNotifyTargetName()} by email?
        </div>
        <p className="mt-1 text-xs text-background-accent dark:text-foreground">
          Send an automatic email update to notify {getNotifyTargetName()} about the status change.
        </p>
        <div className="flex items-center justify-between mt-3 flex-nowrap">
          {activeTitle ? (
            <button
              onClick={() => {
                if (customMessage) {
                  setCustomMessage(false)
                } else {
                  setPages && setPages([])
                  setOpen && setOpen(false)
                }
              }}
              tabIndex={-1}
              className="dashboard-secondary px-1.5 shadow-none dark:bg-transparent text-xs"
            >
              <XIcon className="w-4 h-4" />
            </button>
          ) : (
            <PopoverClose
              onClick={() => {
                if (customMessage) {
                  setCustomMessage(false)
                } else {
                  setPages && setPages([])
                  setOpen && setOpen(false)
                }
              }}
              tabIndex={-1}
              className="dashboard-secondary px-1.5 shadow-none dark:bg-transparent text-xs"
            >
              <XIcon className="w-4 h-4" />
            </PopoverClose>
          )}
          <div className="flex items-center space-x-2">
            <button
              tabIndex={-1}
              onClick={() => {
                setOpen && setOpen(false)
                setCustomModal &&
                  setCustomModal(
                    <CustomStatusMessage
                      authorId={submission?.user?._id}
                      setCustomMessage={setCustomMessage}
                      sendEmail={sendEmail}
                      postId={submission.id}
                      setPages={setPages}
                      setCustomModal={setCustomModal}
                    />
                  )
              }}
              className="text-xs dashboard-secondary"
            >
              Customize email
            </button>
            <button onClick={() => sendEmail(submission.id)} className="text-xs dashboard-primary">
              Notify voters
            </button>
          </div>
        </div>
      </>
    </div>
  )
}

export default MessageComponent
