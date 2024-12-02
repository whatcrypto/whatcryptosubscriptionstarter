import React from 'react'
import PopupWrapper from './PopupWrapper'

import { ISubmission } from '../interfaces/ISubmission'
import { KeyedMutator } from 'swr'
import LinkExistingJiraIssue from './LinkExistingJiraIssue'
import CreateNewJiraPost from './CreateNewJiraPost'

const PushToJiraPopup: React.FC<{
  isOpen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  submission: ISubmission
  mutateSubmission: KeyedMutator<any[]>
  displayedPage?: 'New issue' | 'Link existing'
}> = ({ isOpen, setOpen, submission, mutateSubmission, displayedPage }) => {
  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setOpen}>
      <h3 className="text-lg font-medium text-gray-600 dark:text-white">
        {displayedPage === 'New issue' ? 'Create new Jira issue' : 'Link to existing Jira issue'}
      </h3>
      <div>
        {displayedPage === 'New issue' && (
          <CreateNewJiraPost
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
          <LinkExistingJiraIssue
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

export default PushToJiraPopup
