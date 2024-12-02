import React from 'react'
import PopupWrapper from './PopupWrapper'

import { ISubmission } from '../interfaces/ISubmission'
import { KeyedMutator } from 'swr'
import CreateNewGithubIssue from './CreateNewGithubIssue'
import LinkExistingGithubIssue from './LinkExistingGithubIssue'

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

const PushToGithubPopup: React.FC<{
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
          ? 'Create new GitHub issue'
          : 'Link to existing GitHub issue'}
      </h3>
      <div>
        {displayedPage === 'New issue' && (
          <CreateNewGithubIssue
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
          <LinkExistingGithubIssue
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

export default PushToGithubPopup
