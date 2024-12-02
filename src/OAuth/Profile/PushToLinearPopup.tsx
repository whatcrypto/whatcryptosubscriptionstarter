import React from 'react'
import PopupWrapper from './PopupWrapper'

import CreateNewLinearPost from './CreateNewLinearPost'
import { ISubmission } from '../interfaces/ISubmission'
import LinkExistingLinearIssue from './LinkExistingLinearIssue'
import { KeyedMutator } from 'swr'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const PushToLinearPopup: React.FC<{
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submission: ISubmission
  mutateSubmission: KeyedMutator<any[]>
  displayedPage?: 'New issue' | 'Link existing'
}> = ({ isOpen, setOpen, submission, mutateSubmission, displayedPage }) => {
  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setOpen}>
      <h3 className="text-lg font-medium text-gray-600 dark:text-white">
        {displayedPage === 'New issue'
          ? 'Create new Linear issue'
          : 'Link to existing Linear issue or project'}
      </h3>
      <div>
        {displayedPage === 'New issue' && (
          <CreateNewLinearPost
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
          <LinkExistingLinearIssue
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

export default PushToLinearPopup
