import { mutateSubmissionItems, performSubmissionMutation } from '@/lib/submissionMutator'
import React, { useState } from 'react'
import { KeyedMutator } from 'swr'
import { updateSubmissionInfo } from '../../network/lib/submission'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { IOrganizationStatus } from '../interfaces/IOrganization'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import { sortOrder } from '../pages/dashboard/settings/statuses'
import StatusCombobox from './StatusCombobox'
import TagBullet from './TagBullet'
import MultiselectButton from './MultiselectButton'
import { cn } from '@/lib/utils'
import { can } from '@/lib/acl'
import { toast } from 'sonner'

export const statusTypes = ['reviewing', 'unstarted', 'active', 'completed', 'canceled']

export const statusColorData = [
  {
    name: 'Red',
    color:
      'bg-rose-50 hover:shadow hover:bg-rose-100 hover:shadow-rose-200/40 dark:hover:shadow-rose-700/20 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 hover:border-rose-200 dark:text-rose-500 text-rose-600 dark:border-rose-500/10 dark:hover:border-rose-500/10 border-rose-100',
  },
  {
    name: 'Orange',
    color:
      'bg-orange-50 hover:shadow hover:bg-orange-100 hover:shadow-orange-200/40 dark:hover:shadow-orange-700/20 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 hover:border-orange-200 dark:text-orange-500 text-orange-600 dark:border-orange-500/10 dark:hover:border-orange-500/10 border-orange-100',
  },
  {
    name: 'Yellow',
    color:
      'bg-yellow-50 hover:shadow hover:bg-yellow-100 hover:shadow-yellow-200/40 dark:hover:shadow-yellow-700/20 dark:bg-yellow-500/10 dark:hover:bg-yellow-500/20 hover:border-yellow-200 dark:text-yellow-500 text-yellow-600 dark:border-yellow-500/10 dark:hover:border-yellow-500/10 border-yellow-100',
  },
  {
    name: 'Green',
    color:
      'bg-green-100/80 hover:shadow hover:bg-green-100 hover:shadow-green-200/40 dark:hover:shadow-green-700/20 dark:bg-green-500/10 dark:hover:bg-green-500/20 hover:border-green-200 dark:text-green-500 text-green-600 dark:border-green-500/10 dark:hover:border-green-500/10 border-green-200/80',
  },
  {
    name: 'Sky',
    color:
      'bg-sky-50 hover:shadow hover:bg-sky-100 hover:shadow-sky-200/40 dark:hover:shadow-sky-700/20 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 hover:border-sky-200 dark:text-sky-500 text-sky-600 dark:border-sky-500/10 dark:hover:border-sky-500/10 border-sky-100',
  },
  {
    name: 'Teal',
    color:
      'bg-teal-50 hover:shadow hover:bg-teal-100 hover:shadow-teal-200/40 dark:hover:shadow-teal-700/20 dark:bg-teal-500/10 dark:hover:bg-teal-500/20 hover:border-teal-200 dark:text-teal-500 text-teal-600 dark:border-teal-500/10 dark:hover:border-teal-500/10 border-teal-100',
  },
  {
    name: 'Blue',
    color:
      'bg-blue-50 hover:shadow hover:bg-blue-100 hover:shadow-blue-200/40 dark:hover:shadow-blue-700/20 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 hover:border-blue-200 dark:text-blue-500 text-blue-600 dark:border-blue-500/10 dark:hover:border-blue-500/10 border-blue-100',
  },
  {
    name: 'Indigo',
    color:
      'bg-indigo-50 hover:shadow hover:bg-indigo-100 hover:shadow-indigo-200/40 dark:hover:shadow-indigo-700/20 dark:bg-indigo-500/10 dark:hover:bg-indigo-500/20 hover:border-indigo-200 dark:text-indigo-500 text-indigo-600 dark:border-indigo-500/10 dark:hover:border-indigo-500/10 border-indigo-100',
  },
  {
    name: 'Purple',
    color:
      'bg-purple-50 hover:shadow hover:bg-purple-100 hover:shadow-purple-200/40 dark:hover:shadow-purple-700/20 dark:bg-purple-500/10 dark:hover:bg-purple-500/20 hover:border-purple-200 dark:text-purple-500 text-purple-600 dark:border-purple-500/10 dark:hover:border-purple-500/10 border-purple-100',
  },
  {
    name: 'Pink',
    color:
      'bg-pink-50 hover:shadow hover:bg-pink-100 hover:shadow-pink-200/40 dark:hover:shadow-pink-700/20 dark:bg-pink-500/10 dark:hover:bg-pink-500/20 hover:border-pink-200 dark:text-pink-500 text-pink-600 dark:border-pink-500/10 dark:hover:border-pink-500/10 border-pink-100',
  },
  {
    name: 'Gray',
    color:
      'bg-gray-50 hover:shadow hover:bg-gray-100 hover:shadow-gray-200/40 dark:hover:shadow-border/20 dark:bg-gray-500/10 dark:hover:bg-gray-500/20 hover:border-gray-200 dark:text-gray-100 text-gray-600 dark:border-gray-500/10 dark:hover:border-gray-500/10 border-gray-100',
  },
  {
    name: 'Primary',
    color:
      'bg-accent/5 hover:shadow hover:bg-accent/20 hover:shadow-accent/30 dark:hover:shadow-accent/10 dark:bg-accent/10 dark:hover:bg-accent/20 hover:border-accent/20 dark:text-accent-foreground  text-accent-foreground dark:border-accent/10 dark:hover:border-accent/10 border-accent/20',
  },
]

type StatusProps = {
  status: IOrganizationStatus
  small?: boolean
  postId?: string
  mutateSubmissions?: KeyedMutator<any[]>
  activityMutate?: KeyedMutator<any[]>
  widget?: boolean
  dashboard?: boolean
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate
  xSmall?: boolean
  submission?: ISubmission
  commentsMutate?: KeyedMutator<any[]>
  closeCallback?: (input: string) => void
  postView?: boolean
}

export const getFilteredAndSortedStatuses = (statuses: IOrganizationStatus[]) => {
  // Make copy of statuses
  const copyOfStatuses = [...statuses]

  return copyOfStatuses.sort((a, b) => sortOrder[a.type] - sortOrder[b.type])
}

const Status: React.FC<StatusProps> = ({
  status,
  small = false,
  postId,
  mutateSubmissions,
  widget = false,
  dashboard,
  rawSubmissionData,
  xSmall,
  submission,
  activityMutate,
  commentsMutate,
  closeCallback,
  postView,
}) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const getStyles = (status: IOrganizationStatus) => {
    return statusColorData.find((color) =>
      status?.color ? color?.name === status?.color : color?.name === 'Gray'
    )?.color
  }
  const [editingModal, setEditingModal] = useState<any>()

  const hideStatus =
    user && can(user?.id, 'set_post_status', org)
      ? false
      : org?.settings?.hideStatusFromPublic || false

  const changeStatus = (newStatus: IOrganizationStatus) => {
    if (!postId) return
    updateSubmissionInfo({ submissionId: postId, postStatus: newStatus, notifyVoters: false })
      .then(() => {
        if (activityMutate) {
          activityMutate()
        }
      })
      .catch(() => {
        toast.error('Failed to update status.')
      })
    if (mutateSubmissions && rawSubmissionData) {
      performSubmissionMutation(
        mutateSubmissions,
        (oldResults: ISubmission[]) => {
          return oldResults.map((result) => {
            if (result.id === postId) {
              return {
                ...result,
                postStatus: newStatus,
                statusUpdateSentForStatusId: postView ? undefined : 'not-sent',
              }
            }
            return result
          })
        },
        rawSubmissionData
      )
    }
  }

  // If it has post ID enable editing
  if (postId && can(user?.id, 'set_post_status', org) && submission) {
    return (
      <div>
        {editingModal ? editingModal : null}
        <StatusCombobox
          rawSubmissionData={rawSubmissionData}
          TriggerButton={() => (
            <MultiselectButton
              icon={
                !dashboard ? <TagBullet theme={status?.color ? status?.color : ''} /> : undefined
              }
              compact={dashboard}
              className={cn(dashboard && getStyles(status), dashboard && 'truncate max-w-[90px]')}
            >
              {status?.name}
            </MultiselectButton>
          )}
          closeCallback={(input) => {
            closeCallback && closeCallback(input)
          }}
          changeStatus={changeStatus}
          currentStatus={status}
          submission={submission}
          setEditingModal={setEditingModal}
          commentsMutate={commentsMutate}
          mutateSubmissions={mutateSubmissions}
        />
      </div>
    )
  } else {
    if (hideStatus) return null
    return (
      <p
        className={`${getStyles(status)} pointer-events-none px-2 ${
          xSmall ? 'py-0.5' : 'py-1'
        }  flex items-center ${small ? 'text-xs' : 'text-sm'} font-medium rounded-md border`}
      >
        {status?.name}
      </p>
    )
  }
}

export default Status
