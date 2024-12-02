import { useCurrentOrganization } from '@/data/organization'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useUser } from '@/data/user'
import UserPicture from './UserPicture'
import ModularComboBox from './radix/ModularComboBox'
import { CommandGroup } from './radix/Command'
import ActiveUserSearchResults from './ActiveUserSearchResults'
import { TooltipProvider } from './radix/Tooltip'
import { updateSubmissionInfo } from 'network/lib/submission'
import { performSubmissionMutation } from '@/lib/submissionMutator'
import { KeyedMutator } from 'swr'
import { ICustomer } from '@/interfaces/IUser'
import AddNewUserAuthorModal from './AddNewUserAuthorModal'
import { can } from '@/lib/acl'
import { toast } from 'sonner'

const AuthorDisplayer: React.FC<{
  submission: ISubmission
  mutateSubmissions: KeyedMutator<any[]>
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[]
}> = ({ submission, mutateSubmissions, rawSubmissionData }) => {
  const { t } = useTranslation()
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const [createNewUser, setCreateNewUser] = React.useState(false)

  return (
    <>
      <div className="col-span-2">
        <span className="font-medium">{t('author')}</span>
        <AddNewUserAuthorModal
          isOpen={createNewUser}
          setIsOpen={setCreateNewUser}
          onSubmit={(data) => {
            updateSubmissionInfo({
              submissionId: submission.id,
              author: {
                name: data.name || '',
                email: data.email || undefined,
                type: 'customer',
              },
            })
              .catch(() => {
                toast.error('Failed to update author.')
              })
              .finally(() => {
                mutateSubmissions()
              })
          }}
        />
      </div>
      <TooltipProvider>
        {can(user?.id, 'set_post_author', org) ? (
          <ModularComboBox
            TriggerButton={() => (
              <button className="flex -m-1.5 p-1.5 hover:dark:bg-border hover:bg-gray-50 items-center col-span-3 truncate">
                <UserPicture authorId={submission?.user?._id} img={submission?.user?.picture} />
                <p className="ml-2 font-medium truncate dark:font-semibold">
                  {submission?.user?.name ? submission?.user?.name : 'An Anonymous User'}
                </p>
              </button>
            )}
            CommandItems={({ closeComboBox }) => {
              return (
                <CommandGroup>
                  <ActiveUserSearchResults
                    setNewAuthor={(user?: ICustomer) => {
                      closeComboBox()
                      if (user) {
                        updateSubmissionInfo({
                          submissionId: submission.id,
                          author: {
                            _id: user.id,
                            type: user.type,
                          },
                        }).catch(() => {
                          toast.error('Failed to update author.')
                        })
                        if (mutateSubmissions && rawSubmissionData) {
                          performSubmissionMutation(
                            mutateSubmissions,
                            (oldResults) =>
                              oldResults.map((sub) =>
                                sub.id === submission?.id
                                  ? {
                                      ...sub,
                                      user: {
                                        _id: user.id,
                                        name: user.name || '',
                                        picture: user.profilePicture || '',
                                        type: user.type,
                                      },
                                    }
                                  : sub
                              ),
                            rawSubmissionData
                          )
                        }
                      } else {
                        setCreateNewUser(true)
                      }
                    }}
                  />
                </CommandGroup>
              )
            }}
            allowNewCreation={false}
            searchableDisplayName="users"
          />
        ) : (
          <div className="flex items-center col-span-3">
            <UserPicture authorId={submission?.user?._id} img={submission?.user?.picture} />
            <p className="ml-2 font-medium truncate dark:font-semibold">
              {submission?.user?.name ? submission?.user?.name : 'An Anonymous User'}
            </p>
          </div>
        )}
      </TooltipProvider>
    </>
  )
}

export default AuthorDisplayer
