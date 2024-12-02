import React from 'react'
import PopupWrapper from './PopupWrapper'
import MainPostView from './MainPostView'
import Loader from './Loader'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { KeyedMutator } from 'swr'

const MainPostViewPopup: React.FC<{
  activeSubmissionId: string
  showPostView: boolean
  setShowPostView: React.Dispatch<React.SetStateAction<boolean>>
  activeSubmission?: ISubmission
  rawSubmissionData?: ISubmissionPaginate | ISubmissionPaginate[]
  mutateSubmissions?: KeyedMutator<any[]>
  submission: ISubmission
  rawSingleSubmissionData: any
  mutateSingleSubmission: KeyedMutator<any[]>
  removeOutsideCloseCheck?: boolean
  setActiveSubmissionId?: React.Dispatch<React.SetStateAction<string>>
}> = (props) => {
  return (
    <PopupWrapper
      hideBg={true}
      fullScreen={true}
      hasPadding={false}
      large={true}
      isOpen={props.showPostView}
      setIsOpen={props.setShowPostView}
      removeOutsideCloseCheck={props.removeOutsideCloseCheck}
    >
      <div className="relative">
        {props.activeSubmission || props.submission ? (
          <MainPostView
            setActiveSubmissionId={props.setActiveSubmissionId}
            setOpen={props.setShowPostView}
            mutateSubmissions={
              (props.activeSubmission && props.mutateSubmissions) || props.mutateSingleSubmission
            }
            submission={props.activeSubmission || props.submission}
            rawSubmissionData={
              (props.activeSubmission && props.rawSubmissionData) || props.rawSingleSubmissionData
            }
            fetchResults={props.showPostView}
          />
        ) : (
          <div className="flex items-center justify-center min-h-[426px]">
            <div className="secondary-svg h-7 w-7">
              <Loader />
            </div>
          </div>
        )}
      </div>
    </PopupWrapper>
  )
}

export default MainPostViewPopup
