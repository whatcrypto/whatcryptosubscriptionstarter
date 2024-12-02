import React from 'react'
import StatusCombobox from './StatusCombobox'
import { cn } from '@/lib/utils'
import { IOrganizationStatus } from '@/interfaces/IOrganization'
import TagBullet, { getColor } from './TagBullet'
import {
  CalendarIcon,
  StatusOnlineIcon,
  TagIcon,
  UserCircleIcon,
} from '@heroicons/react/solid'
import TagComponent from './Tag'
import AssignPicker from './AssignPicker'
import { DatePicker } from './radix/DatePicker'
import { useCurrentOrganization } from '@/data/organization'
import chroma from 'chroma-js'
import { createPostType } from './CreatePost'
import { useUser } from '@/data/user'
import { can } from '@/lib/acl'

const CreatePostOptions: React.FC<{
  selectedOptions: createPostType
  setSelectedOptions: React.Dispatch<React.SetStateAction<createPostType>>
}> = ({ selectedOptions, setSelectedOptions }) => {
  const { org } = useCurrentOrganization()
  const { user } = useUser()

  return (
    <div className="overflow-auto custom-scrollbar-stronger p-1.5 -m-1.5">
      <div className="flex items-center gap-2">
        {can(user?.id, 'set_post_status', org) && (
          <StatusCombobox
            popoverContentProps={{
              side: 'bottom',
              align: 'start',
            }}
            TriggerButton={() => (
              <button
                className={cn(
                  'flex items-center px-1.5 py-0.5 text-[11px] rounded-md create-post-btn',
                  'truncate max-w-[120px]'
                )}
              >
                <div className="mr-1.5">
                  <StatusOnlineIcon
                    style={{
                      fill: selectedOptions.status?.color
                        ? getColor(selectedOptions.status?.color || '')
                        : undefined,
                    }}
                    className={cn('w-3.5 h-3.5 text-background-accent/60 dark:text-foreground/60')}
                    aria-hidden="true"
                  />
                </div>
                <span className="truncate">{selectedOptions.status?.name || 'Status'}</span>
              </button>
            )}
            customCallback={(activeItem: IOrganizationStatus) => {
              setSelectedOptions((prev) => {
                return { ...prev, status: activeItem }
              })
            }}
            submission={undefined}
          />
        )}

        {can(user?.id, 'set_post_tags', org) && (
          <TagComponent
            popoverContentProps={{
              side: 'bottom',
              align: 'start',
            }}
            tags={selectedOptions.tags}
            postCreation={true}
            customTriggerButton={() => (
              <button
                className={cn(
                  'flex  flex-shrink-0 items-center px-1.5 py-0.5 text-[11px] rounded-md h-[26px] create-post-btn',
                  //   selectedOptions?.status && getStyles(selectedOptions.tags[0]),
                  'truncate max-w-[120px]'
                )}
              >
                <div className="flex-shrink-0 flex items-center justify-center">
                  {selectedOptions?.tags?.length > 0 ? (
                    <span className="ml-1 -mr-1">
                      <TagBullet theme={selectedOptions?.tags[0]?.color} />
                    </span>
                  ) : (
                    <TagIcon
                      className={cn(
                        'flex-shrink-0 h-3.5 w-3.5 text-background-accent/60 dark:text-foreground/60'
                      )}
                      aria-hidden="true"
                    />
                  )}
                </div>
                {selectedOptions.tags[0]?.name && (
                  <span className="ml-0.5 truncate">{selectedOptions.tags[0]?.name} </span>
                )}
                {selectedOptions.tags.length > 1 && (
                  <span className="text-[9px] ml-1 dark:text-foreground text-background-accent/60">
                    (+{' '}
                    {selectedOptions.tags.length > 1
                      ? selectedOptions.tags.length - 1
                      : selectedOptions.tags.length}
                    )
                  </span>
                )}
              </button>
            )}
            postCreationTagCallback={(tags) => {
              setSelectedOptions((prev) => {
                return { ...prev, tags: tags }
              })
            }}
          />
        )}

        {org?.members?.length > 0 && can(user?.id, 'set_post_assignee', org) && (
          <AssignPicker
            popoverContentProps={{
              side: 'bottom',
              align: 'start',
            }}
            submission={undefined}
            activeAssignee={selectedOptions.assignee || ''}
            setActiveAssignee={(id) => setSelectedOptions((prev) => ({ ...prev, assignee: id }))}
            customButton={(member) => (
              <button
                className={cn(
                  'flex items-center px-1.5 py-0.5 text-[11px] rounded-md h-[26px] create-post-btn'
                )}
              >
                {member ? (
                  <img src={member.profilePicture} className="w-3.5 h-3.5  rounded-full" />
                ) : (
                  <UserCircleIcon
                    className={cn('h-4 w-4 text-background-accent/60 dark:text-foreground/60')}
                    aria-hidden="true"
                  />
                )}
                {member && <span className="truncate ml-1.5">{member.name?.split(' ')[0]}</span>}
              </button>
            )}
          />
        )}

        {can(user?.id, 'set_post_eta', org) && (
          <DatePicker
            popoverContentProps={{
              side: 'bottom',
              align: 'start',
            }}
            unscheduling={selectedOptions?.eta ? true : undefined}
            onSelect={(date: Date | null) => {
              setSelectedOptions((prev) => ({ ...prev, eta: date?.toISOString() }))
            }}
            CustomButton={
              <button
                className={cn(
                  'flex items-center px-1.5 py-0.5 text-[11px] rounded-md h-[26px] create-post-btn'
                )}
              >
                <CalendarIcon
                  style={{
                    fill: selectedOptions?.eta
                      ? chroma(org.color).luminance(0.25).css()
                      : undefined,
                  }}
                  className={cn('h-4 w-4 text-background-accent/60 dark:text-foreground/60')}
                  aria-hidden="true"
                />
              </button>
            }
            showQuarterButtons={true}
            selected={selectedOptions?.eta ? new Date(selectedOptions?.eta) : undefined}
          />
        )}
      </div>
    </div>
  )
}

export default CreatePostOptions
