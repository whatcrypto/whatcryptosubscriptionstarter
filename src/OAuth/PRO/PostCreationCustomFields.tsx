import { useCurrentOrganization } from '@/data/organization'
import { IPostCategory, ISubmission } from '@/interfaces/ISubmission'
import { cn } from '@/lib/utils'
import React from 'react'
import { createPostType } from './CreatePost'
import CustomFieldEntry from './CustomFieldEntry'
import { StandaloneCustomFieldProps } from './CustomPostFields'

const PostCreationCustomFields: React.FC<{
  activeCategory?: IPostCategory
  selectedOptions: createPostType | { customInputValues: ISubmission['customInputValues'] }
  setSelectedOptions:
    | React.Dispatch<React.SetStateAction<createPostType>>
    | ((
        updateFunction: (oldResult: StandaloneCustomFieldProps) => StandaloneCustomFieldProps
      ) => void)
  customInputFieldErrors: {
    [key: string]: boolean
  }
  setCustomInputFieldErrors: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
  isSubmission?: boolean
  isWidget?: boolean
}> = ({
  activeCategory,
  selectedOptions,
  setSelectedOptions,
  customInputFieldErrors,
  setCustomInputFieldErrors,
  isSubmission,
  isWidget,
}) => {
  const { org } = useCurrentOrganization()

  const inputValues = selectedOptions.customInputValues

  if (typeof inputValues === 'object' && Object.keys(inputValues).length <= 0) {
    return null
  }

  return (
    <div
      className={cn(
        !isSubmission ? 'mt-1 -mb-px dark:bg-popover/50 bg-gray-50/60 border-y' : 'border-t',
        ' max-h-[500px]  custom-scrollbar-stronger overflow-auto px-0 relative dark:border-border/90 divide-y gap-[-1px]',
        isWidget
          ? 'mb-1 flex flex-col mx-6 overflow-hidden rounded-md white-bg'
          : 'dark:shadow-inner'
      )}
    >
      {selectedOptions?.customInputValues &&
        Object.entries(selectedOptions.customInputValues).map(([key, value]) => {
          const customField = org?.customInputFields?.find((field) => field._id === key)
          if (!customField) {
            return null
          }

          return (
            <div
              key={key}
              className={cn(
                customInputFieldErrors[customField._id]
                  ? ' dark:bg-rose-500/[6%] bg-red-300/[15%]'
                  : ''
              )}
            >
              <div className={cn(isWidget ? '-mx-0.5' : '')}>
                <CustomFieldEntry
                  customInputFieldErrors={customInputFieldErrors}
                  setCustomInputFieldErrors={setCustomInputFieldErrors}
                  selectedOptions={selectedOptions}
                  setSelectedOptions={setSelectedOptions}
                  customField={customField}
                />
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default PostCreationCustomFields
