import { useMembers, useCurrentOrganization } from '@/data/organization'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { mutateSubmissionItems } from '@/lib/submissionMutator'
import { updateSubmissionInfo } from 'network/lib/submission'
import React from 'react'
import { toast } from 'sonner'
import { KeyedMutator } from 'swr'
import { CommandGroup, CommandItem } from './radix/Command'
import ModularComboBox from './radix/ModularComboBox'
import MultiselectButton from './MultiselectButton'
import { IMember } from '@/interfaces/IOrganization'
import { can, memberHasAccessToSubmission } from '@/lib/acl'
import { useUser } from '@/data/user'

const AssignPicker: React.FC<
  {
    submission: ISubmission | undefined
  } & (
    | {
        submission: ISubmission
        mutateSubmissions: KeyedMutator<any[]>
        rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[]
      }
    | {
        submission: undefined
        activeAssignee: string
        setActiveAssignee: (id: string) => void
        customButton: (admin?: IMember) => JSX.Element
        popoverContentProps?: any
      }
  )
> = (props) => {
  const { members } = useMembers(true)
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const { submission } = props

  const activeAdmin = members?.find(
    (member) => member.id === (submission ? submission.assignee : props.activeAssignee)
  )

  const changeSubmissionAssignee = (newAssignee: string | null) => {
    if (!submission) {
      props.setActiveAssignee(newAssignee || '')
      return
    }
    mutateSubmissionItems(
      'assignee',
      newAssignee,
      props.mutateSubmissions,
      props.rawSubmissionData,
      submission.id
    )
    updateSubmissionInfo({
      submissionId: submission?.id,
      assignee: newAssignee,
    }).catch((err) => {
      toast.error('Error updating post assignee')
      props.mutateSubmissions()
    })
  }

  return (
    <div>
      <ModularComboBox
        popoverContentProps={!submission ? props?.popoverContentProps : undefined}
        TriggerButton={
          props.submission
            ? () => (
                <MultiselectButton
                  icon={
                    activeAdmin?.profilePicture && (
                      <img
                        src={activeAdmin.profilePicture}
                        className="w-5 h-5 mr-2 -mt-px rounded-full"
                      />
                    )
                  }
                  className={`${activeAdmin?.profilePicture && 'pl-1.5'} ${
                    !can(user?.id, 'set_post_assignee', org) && 'pointer-events-none'
                  }`}
                >
                  {activeAdmin?.name}
                </MultiselectButton>
              )
            : () => props.customButton(activeAdmin)
        }
        CommandItems={({ closeComboBox }) => {
          return (
            <CommandGroup>
              {(props.submission && props.submission.assignee) ||
              (!props.submission && props.activeAssignee) ? (
                <CommandItem
                  value="Unassigned"
                  key="Unassigned"
                  onSelect={() => {
                    changeSubmissionAssignee(null)
                    closeComboBox()
                  }}
                >
                  <div className="w-5 h-5 mr-2 bg-gray-100 rounded-full dark:bg-gray-500">
                    <svg
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="w-5 font-semibold text-gray-400 rounded-full dark:text-foreground "
                    >
                      <path
                        d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                        className="jsx-1981044996"
                      />
                    </svg>
                  </div>
                  <p className="truncate">No assignee</p>
                </CommandItem>
              ) : null}

              {members
                ?.filter((member) => member.id !== activeAdmin?.id)
                .filter((member) =>
                  submission ? memberHasAccessToSubmission(member.id, submission, org) : true
                )
                ?.map((member) => (
                  <CommandItem
                    value={member.name}
                    key={member.id}
                    onSelect={() => {
                      closeComboBox()
                      changeSubmissionAssignee(member.id)
                    }}
                  >
                    <img src={member.profilePicture} className="w-5 h-5 rounded-full mr-1.5" />
                    {member.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          )
        }}
        allowNewCreation={false}
        searchableDisplayName="assignee"
      />
    </div>
  )
}

export default AssignPicker
