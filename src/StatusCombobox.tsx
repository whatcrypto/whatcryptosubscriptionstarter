import React, { useMemo, useState } from 'react'
import ModularComboBox from './radix/ModularComboBox'
import { IOrganizationStatus } from '@/interfaces/IOrganization'
import { CommandGroup, CommandItem } from './radix/Command'
import MessageComponent from './MessageComponent'
import { createStatusAndMutate } from '@/lib/status'
import TagBullet from './TagBullet'
import { getFilteredAndSortedStatuses, statusTypes } from './Status'
import { useCurrentOrganization } from '@/data/organization'
import { KeyedMutator } from 'swr'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { tagColorData } from './AddTagModal'

type StatusComboboxProps = {
  TriggerButton: () => JSX.Element
  popoverContentProps?: any
  closeCallback?: (input: string) => void
} & (
  | {
      submission: ISubmission
      mutateSubmissions?: KeyedMutator<any[]>
      commentsMutate?: KeyedMutator<any[]>
      setEditingModal: React.Dispatch<React.SetStateAction<any>>
      currentStatus: IOrganizationStatus
      changeStatus: (status: IOrganizationStatus) => void
      rawSubmissionData?: ISubmissionPaginate | ISubmissionPaginate[]
    }
  | { submission: undefined; customCallback: (status: IOrganizationStatus) => any }
)

const StatusCombobox = (props: StatusComboboxProps) => {
  const { submission, TriggerButton } = props

  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const [newStatusData, setNewStatusData] = useState<IOrganizationStatus>({
    color: '',
    id: '',
    isDefault: false,
    name: '',
    type: 'reviewing',
  })

  const getAvailableStatuses = useMemo(() => {
    return getFilteredAndSortedStatuses(org?.postStatuses).filter((s) => {
      if (!submission) return true
      return submission.postStatus.id !== s.id
    })
  }, [org?.postStatuses, submission?.postStatus?.id])

  return (
    <ModularComboBox
      setNewItemName={(name) => {
        setNewStatusData((prev) => ({ ...prev, name }))
      }}
      closeCallback={(input) => {
        props.closeCallback && props.closeCallback(input)
      }}
      TriggerButton={TriggerButton}
      popoverContentProps={props?.popoverContentProps}
      CommandItems={({
        setPages,
        setOnlyDisplayCustomPage,
        setExtendWidthOnCustomPage,
        closeComboBox,
      }) => {
        return (
          <CommandGroup>
            {getAvailableStatuses.map((status) => {
              return (
                <CommandItem
                  value={status.name}
                  key={status.id}
                  onSelect={() => {
                    if (submission) {
                      props.changeStatus(status)

                      if (!(submission.upvoted && submission.upvotes === 1)) {
                        setPages((prev) => [...prev, 'statusQuestion'])
                        setOnlyDisplayCustomPage(true)
                        setExtendWidthOnCustomPage('w-[310px]')
                      } else {
                        setPages([])
                        closeComboBox()
                      }
                    } else {
                      props?.customCallback(status)
                      setPages([])
                      closeComboBox()
                    }
                  }}
                >
                  <TagBullet theme={status?.color} />
                  {status.name}
                </CommandItem>
              )
            })}
          </CommandGroup>
        )
      }}
      allowNewCreation={true}
      firstNewStep={'color'}
      searchableDisplayName="status"
      CustomPage={({
        closeComboBox,
        setPages,
        activePage,
        setOnlyDisplayCustomPage,
        setExtendWidthOnCustomPage,
      }) => {
        if (activePage === 'statusQuestion' && submission) {
          return (
            <MessageComponent
              setCustomModal={props.setEditingModal}
              commentsMutate={props.commentsMutate}
              setOpen={closeComboBox}
              setPages={setPages}
              submission={submission}
              rawSubmissionData={props.rawSubmissionData}
              submissionMutate={props.mutateSubmissions}
            />
          )
        } else {
          if (activePage === 'color') {
            return (
              <CommandGroup className="pb-1">
                {tagColorData.map((color) => (
                  <CommandItem
                    value={color.name}
                    key={color.name}
                    onSelect={() => {
                      setNewStatusData((prev) => ({
                        ...prev,
                        color: color.name,
                      }))
                      setPages((prev) => [...prev, 'type'])
                    }}
                  >
                    <TagBullet theme={color?.name} />
                    {color.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          } else if (activePage === 'type') {
            return (
              <CommandGroup>
                {statusTypes.map((type) => (
                  <CommandItem
                    value={type}
                    key={type}
                    onSelect={() => {
                      const { color, isDefault, name } = newStatusData

                      if (submission && !(submission.upvoted && submission.upvotes === 1)) {
                        setPages((prev) => [...prev, 'statusQuestion'])
                        setOnlyDisplayCustomPage(true)
                        setExtendWidthOnCustomPage('w-[310px]')
                      } else {
                        setPages([])
                        closeComboBox()
                      }
                      createStatusAndMutate(
                        {
                          name,
                          color: color[0].toUpperCase() + color.slice(1),
                          type: type as any,
                          isDefault,
                        },
                        org,
                        mutateCurrentOrg
                      ).then((resp: any) => {
                        const status = resp?.data?.status

                        if (status) {
                          mutateCurrentOrg(
                            { ...org, postStatuses: [...org.postStatuses, status] },
                            false
                          )
                          if (submission) {
                            props.changeStatus(status)
                          } else {
                            props.customCallback(status)
                          }
                        }
                      })
                    }}
                  >
                    <span className="first-letter:capitalize">{type}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          }
        }
        return null
      }}
    />
  )
}

export default StatusCombobox
