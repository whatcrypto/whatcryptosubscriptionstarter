import React from 'react'
import PopupWrapper from './PopupWrapper'
import { useSingleSubmission } from '@/data/submission'
import MainPostView from './MainPostView'
import Loader from './Loader'

const StandaloneMainPostViewPopup: React.FC<{
  activeSubmissionId: string
  showPostView: boolean
  setShowPostView: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ activeSubmissionId, showPostView, setShowPostView }) => {
  const { isSubmissionsLoading, submission, mutateSingleSubmission, rawSubmissionData } =
    useSingleSubmission(activeSubmissionId)

  return (
    <PopupWrapper
      hasPadding={false}
      fullScreen={true}
      large={true}
      isOpen={showPostView}
      setIsOpen={setShowPostView}
    >
      {activeSubmissionId !== '' && submission && rawSubmissionData && !isSubmissionsLoading ? (
        <MainPostView
          setOpen={setShowPostView}
          mutateSubmissions={mutateSingleSubmission}
          submission={submission}
          rawSubmissionData={rawSubmissionData}
          fetchResults={showPostView}
        />
      ) : (
        <div className="flex items-center justify-center min-h-[426px]">
          <div className="text-background-accent h-7 w-7 dark:text-background-accent">
            <Loader />
          </div>
        </div>
      )}
    </PopupWrapper>
  )
}

export default StandaloneMainPostViewPopup
