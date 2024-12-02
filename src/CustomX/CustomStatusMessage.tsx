import React from 'react'
import PopupWrapper from './PopupWrapper'
import CustomStatusMessageEditor from './CustomStatusMessageEditor'

export type CustomStatusMessageProps = {
  setCustomMessage: React.Dispatch<React.SetStateAction<boolean>>
  sendEmail: (postId?: string, content?: string) => void
  postId?: string
  setCustomModal?: React.Dispatch<React.SetStateAction<any>>
  setPages?: React.Dispatch<React.SetStateAction<any>>
  authorId?: string
}
const CustomStatusMessage: React.FC<CustomStatusMessageProps> = (props) => {
  return (
    <PopupWrapper
      hasPadding={false}
      setIsOpen={() => {
        props.setPages && props.setPages([])
        props.setCustomModal && props.setCustomModal(null)
      }}
      isOpen={true}
    >
      <CustomStatusMessageEditor {...props} />
    </PopupWrapper>
  )
}

export default CustomStatusMessage
