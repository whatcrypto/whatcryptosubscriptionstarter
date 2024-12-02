import React from 'react'
import PopupWrapper from './PopupWrapper'

import { ISubmission } from '../interfaces/ISubmission'
import { KeyedMutator } from 'swr'
import CreateNewDevOpsWorkItem from './CreateNewDevOpsWorkItem'
import LinkExistingDevOpsWorkItem from './LinkExistingDevopsWorkItem'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const PushToDevOpsPopup: React.FC<{
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submission: ISubmission
  mutateSubmission: KeyedMutator<any[]>
  displayedPage?: 'New work item' | 'Link existing'
}> = ({ isOpen, setOpen, submission, mutateSubmission, displayedPage }) => {
  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setOpen}>
      <h3 className="text-lg font-medium text-gray-600 dark:text-white">
        {displayedPage === 'New work item'
          ? 'Create new DevOps work item'
          : 'Link to existing DevOps work item'}
      </h3>
      <div>
        {displayedPage === 'New work item' && (
          <CreateNewDevOpsWorkItem
            setOpen={setOpen}
            submission={submission}
            callback={() => {
              mutateSubmission()
            }}
          />
        )}
      </div>
      <div>
        {displayedPage === 'Link existing' && (
          <LinkExistingDevOpsWorkItem
            setOpen={setOpen}
            submission={submission}
            callback={() => {
              mutateSubmission()
            }}
          />
        )}
      </div>
    </PopupWrapper>
  )
}

export default PushToDevOpsPopup
