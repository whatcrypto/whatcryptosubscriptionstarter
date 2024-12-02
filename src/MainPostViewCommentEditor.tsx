import { useCurrentOrganization } from '@/data/organization'
import { useUser } from '@/data/user'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import React, { useEffect, useRef, useState } from 'react'
import TextEditor from './TextEditor'
import { postComment } from 'network/lib/submission'
import { useComments } from '@/data/comment'
import { mutateSubmissionItems } from '@/lib/submissionMutator'
import { KeyedMutator } from 'swr'
import { toast } from 'sonner'
import { useTranslation } from 'next-i18next'
import CommentSwitchButton from './CommentSwitchButton'
import { InformationCircleIcon } from '@heroicons/react/solid'
import { Editor } from '@tiptap/react'

const MainPostViewCommentEditor: React.FC<{
  submission: ISubmission
  sortByComments: {
    sortBy: string
    submissionId: string
  }
  mutateSubmissions: KeyedMutator<any[]>
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[]
  setAuthenitacteModal: React.Dispatch<React.SetStateAction<boolean>>
  setDisablePopupClosing?: (value: boolean) => void
}> = ({
  submission,
  sortByComments,
  mutateSubmissions,
  rawSubmissionData,
  setAuthenitacteModal,
  setDisablePopupClosing,
}) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const { commentsMutate, rawComments, comments } = useComments(sortByComments, org)

  const [formData, setFormData] = useState({ content: '' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState('')
  const [isPrivateComment, setIsPrivateComment] = useState(false)
  const editorRef: React.MutableRefObject<Editor | null> = useRef(null)

  const { t } = useTranslation()

  useEffect(() => {
    if (setDisablePopupClosing !== undefined) {
      if (formData.content.length > 8) {
        setDisablePopupClosing(true)
      } else {
        setDisablePopupClosing(false)
      }
    }
  }, [submission, formData.content, setDisablePopupClosing])

  useEffect(() => {
    editorRef.current?.commands?.clearContent(true)
  }, [submission?.id])

  const postNewComment = async (submissionId: string, notify: boolean) => {
    if (!loading) {
      if (formData.content.length > 8) {
        setErrors('')
        setLoading(true)
        postComment({
          content: formData.content,
          isPrivate: isPrivateComment,
          submissionId,
          sendNotification: notify,
        })
          .then((resp) => {
            if (resp.data.success) {
              if (rawComments && comments && resp.data.comment.isSpam === false) {
                commentsMutate(
                  rawComments.map((entry) => ({
                    ...entry,
                    results: [resp.data.comment, ...comments],
                  })),
                  false
                )
              }
              setFormData({ content: '' })
              setLoading(false)
              mutateSubmissionItems(
                'commentCount',
                (submission?.commentCount || 0) + 1 || 1,
                mutateSubmissions,
                rawSubmissionData,
                submission.id
              )
              setDisablePopupClosing && setDisablePopupClosing(false)
              // Reset editor
              editorRef.current?.commands?.clearContent(true)

              toast.success('Comment successfully posted!')
            }
          })
          .catch((err) => {
            setLoading(false)
            toast.error(err?.response?.data?.error)
          })
      } else {
        setErrors(t('comment-is-empty'))
      }
    }
  }

  // const isIframeContext = React.useMemo(() => {
  //   if (typeof window === 'undefined') return false
  //   return window.parent !== window
  // }, [])

  return (
    <div>
      <style>{`
      .ProseMirror p.is-editor-empty:first-child::after {
        margin-top: -20px !important;
      }
      @media (max-width: 640px) {
        .ProseMirror p.is-editor-empty:first-child::after {
          margin-top: -24px !important;
        }
      }
      `}</style>
      {user || org?.settings?.anyoneCanComment ? (
        submission?.commentsAllowed && (
          <div className="mt-4 text-sm rounded-md shadow-sm dark:shadow">
            <TextEditor
              dontAutoFocus={true}
              editorRef={editorRef}
              formData={formData}
              compactMode={true}
              className="styled-editor"
              setFormData={(data) => setFormData({ content: data })}
              placeholder={
                (isPrivateComment ? t('write-a-private-comment') : t('write-a-comment')) + '...'
              }
              height={60}
              insideContent={
                <CommentSwitchButton
                  buttonText={t('post-comment')}
                  isPrivateComment={isPrivateComment}
                  loading={loading}
                  org={org}
                  isNotEmpty={formData.content === '<p></p>' ? false : true}
                  setIsPrivateComment={setIsPrivateComment}
                  elementId={submission?.id}
                  user={user}
                  callback={(subId, notify) => postNewComment(subId, notify)}
                  isReply={false}
                  submission={submission}
                />
              }
              author={submission?.user?._id}
            />
          </div>
        )
      ) : (
        <div className="mt-4">
          <div className="p-3 border border-blue-100 rounded-md bg-blue-50 dark:border-blue-500/10 dark:bg-blue-500/10">
            <div className="flex">
              <div className="flex-shrink-0">
                <InformationCircleIcon className="w-5 h-5 text-blue-400 dark:text-blue-500" />
              </div>
              <div className="flex-1 ml-3 md:flex md:justify-between">
                <p className="text-sm leading-5 text-blue-900 dark:text-blue-100">
                  {t('please-authenticate-to-join-the-conversation')}
                </p>
                <p className="flex items-center mt-3 text-sm font-medium leading-5 md:mt-0 md:ml-6">
                  <button
                    onClick={() => setAuthenitacteModal(true)}
                    className="text-xs text-blue-700 whitespace-no-wrap transition duration-150 ease-in-out cursor-pointer hover:text-blue-500 main-transition dark:hover:text-blue-200 dark:text-blue-100 hover:text-lightblue-600 unstyled-button"
                  >
                    {org?.ssoUrl
                      ? t('log-in-with-organization-account', {
                          organization: org.displayName,
                        })
                      : `${t('sign-in')} / ${t('sign-up')}`}{' '}
                    →
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainPostViewCommentEditor
