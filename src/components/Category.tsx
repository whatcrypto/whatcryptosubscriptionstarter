import { mutateSubmissionItems } from '@/lib/submissionMutator'
import { cn } from '@/lib/utils'
import { LockClosedIcon } from '@heroicons/react/solid'
import React from 'react'
import { KeyedMutator } from 'swr'
import { updateSubmissionInfo } from '../../network/lib/submission'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import CategoryCombobox from './CategoryCombobox'
import MultiselectButton from './MultiselectButton'
import { can } from '@/lib/acl'
import { toast } from 'sonner'

const Category: React.FC<{
  category: ISubmission['postCategory']
  small?: boolean
  postId?: string
  mutateSubmissions?: KeyedMutator<any[]>
  roadmap?: boolean
  dash?: boolean
  widget?: boolean
  transparent?: boolean
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate
  xSmall?: boolean
  noBg?: boolean
}> = ({
  category,
  small = false,
  postId,
  mutateSubmissions,
  roadmap,
  dash,
  widget = false,
  transparent = false,
  rawSubmissionData,
  xSmall = false,
  noBg = false,
}) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()

  const changeCategory = (category: any) => {
    if (!postId) return
    updateSubmissionInfo({ submissionId: postId, category }).catch(() => {
      toast.error('Failed to update board.')
    })
    if (mutateSubmissions && rawSubmissionData) {
      mutateSubmissionItems('postCategory', category, mutateSubmissions, rawSubmissionData, postId)
    }
  }

  if (postId && can(user?.id, 'set_post_category', org)) {
    return (
      <>
        <CategoryCombobox
          callBack={changeCategory}
          selectedCategory={category}
          TriggerButton={() => (
            <MultiselectButton
              compact={dash}
              icon={
                category?.private ? (
                  <LockClosedIcon
                    className={`h-4 flex-shrink-0 w-4 mr-1 text-background-accent/60 dark:text-background-accent`}
                  />
                ) : undefined
              }
            >
              {category?.category}
            </MultiselectButton>
          )}
        />
      </>
    )
  } else {
    return (
      <div
        className={`px-2 ${
          xSmall ? 'py-0.5' : 'py-1'
        } truncate flex items-center text-background-accent dark:text-foreground ${
          small ? 'text-xs' : 'text-sm'
        } font-medium border-gray-100/50 bg-gray-50/50 dark:bg-secondary dark:border-border/70 dark:shadow-sm ${
          noBg && 'dark:bg-white/[3%] dark:border-white/[5%] dark:shadow-none'
        } ${transparent && 'dark:bg-border'} rounded-md border`}
      >
        {category?.private ? (
          <p className={`truncate flex items-center`}>
            <LockClosedIcon
              className={cn(
                `h-4 w-4 mr-1 text-background-accent/60 dark:text-background-accent`,
                noBg && 'dark:text-white/60'
              )}
            />
            {category?.category}
          </p>
        ) : (
          <p className={`truncate`}>{category?.category}</p>
        )}
      </div>
    )
  }
}

export default Category
