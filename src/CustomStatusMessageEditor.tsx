import React, { useEffect } from 'react'
import { CustomStatusMessageProps } from './CustomStatusMessage'
import TextEditor from './TextEditor'
import { toast } from 'sonner'
import { useUser } from '@/data/user'

const CustomStatusMessageEditor: React.FC<
  CustomStatusMessageProps & { setDisablePopupClosing?: (value: boolean) => void }
> = ({
  setCustomMessage,
  sendEmail,
  postId,
  setCustomModal,
  setPages,
  authorId,
  setDisablePopupClosing,
}) => {
  const { user } = useUser()
  const [formData, setFormData] = React.useState({ content: '' })

  useEffect(() => {
    if (setDisablePopupClosing !== undefined) {
      setDisablePopupClosing(true)
    }
  }, [setDisablePopupClosing])

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
      <div className="flex items-start gap-3 p-4 pb-0">
        <img src={user?.profilePicture} className="flex-shrink-0 rounded-full h-9 w-9" />
        <div className="w-full">
          <p className="mb-1.5 font-medium">{user?.name || 'Loading...'}</p>
          <TextEditor
            className="styled-editor"
            formData={formData}
            placeholder="Write a custom message for the upvoters..."
            setFormData={(data) => setFormData({ content: data })}
            height={60}
            author={authorId}
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <button
              tabIndex={-1}
              className="text-xs dashboard-secondary"
              onClick={() => {
                sendEmail(postId)
                setPages && setPages([])
              }}
            >
              Send default email
            </button>
            <button
              className="text-xs dashboard-primary"
              onClick={() => {
                if (formData?.content !== '<p></p>') {
                  sendEmail(postId, formData?.content)
                  setPages && setPages([])
                } else {
                  toast.error('Please write a message to send.')
                }
              }}
            >
              Send customized email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomStatusMessageEditor
