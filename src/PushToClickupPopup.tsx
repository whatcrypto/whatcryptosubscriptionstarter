import React from 'react'
import PopupWrapper from './PopupWrapper'

import { ISubmission } from '../interfaces/ISubmission'
import { KeyedMutator } from 'swr'
import CreateNewClickupPost from './CreateNewClickupPost'
import LinkExistingClickupIssue from './LinkExistingClickupIssue'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const PushToClickupPopup: React.FC<{
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
          ? 'Create new ClickUp issue'
          : 'Link to existing ClickUp issue'}
      </h3>
      <div>
        {displayedPage === 'New issue' && (
          <CreateNewClickupPost
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
          <LinkExistingClickupIssue
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

export default PushToClickupPopup
