import { useCurrentOrganization } from '@/data/organization'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import React, { useEffect, useState } from 'react'
import SimpleTooltip from './SimpleTooltip'
import { cn } from '@/lib/utils'
import { useUser } from '@/data/user'
import { PencilIcon, XIcon } from '@heroicons/react/solid'
import PostCreationCustomFields from './PostCreationCustomFields'
import { mutateSubmissionItems } from '@/lib/submissionMutator'
import { updateSubmissionInfo } from 'network/lib/submission'
import { Button } from './radix/Button'
import { validateCustomFields } from './CreatePost'
import { toast } from 'sonner'
import { can } from '@/lib/acl'

export type StandaloneCustomFieldProps = ISubmission['customInputValues'] | {}

const CustomPostFields: React.FC<{
  submission: ISubmission
  mutateSubmissions: any
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[]
}> = ({ submission, mutateSubmissions, rawSubmissionData }) => {
  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [customInputFieldErrors, setCustomInputFieldErrors] = useState<{
    [key: string]: boolean
  }>({})
  const [customFieldData, setCustomFieldData] = useState<ISubmission['customInputValues'] | {}>(
    submission.customInputValues || {}
  )

  const [currentValueForSubmissionId, setCurrentValueForSubmissionId] = useState<string | null>(
    submission?.id
  )

  useEffect(() => {
    if (currentValueForSubmissionId !== submission?.id) {
      setIsEditing(false)
      setCustomFieldData(submission.customInputValues)
      setCurrentValueForSubmissionId(submission?.id)
    }
  }, [submission.id, currentValueForSubmissionId])

  // Implementing setSelectedOptions function
  const updateSelectedOptions = (
    updateFunction: (oldResult: StandaloneCustomFieldProps) => StandaloneCustomFieldProps
  ) => {
    const newData: any = updateFunction({ customInputValues: customFieldData })

    setCustomFieldData(newData?.customInputValues || {})
  }

  const saveFields = () => {
    if (
      !validateCustomFields(
        Object.keys(customFieldData as any),
        org,
        { customInputValues: customFieldData } as any,
        setCustomInputFieldErrors
      )
    ) {
      toast.error('Please fill in all required custom fields', {
        position: 'bottom-right',
      })
      return
    }

    updateSubmissionInfo({
      submissionId: submission.id,
      customInputValues: customFieldData,
    }).catch(() => {
      toast.error('Failed to update custom fields.')
    })

    mutateSubmissionItems(
      'customInputValues',
      customFieldData,
      mutateSubmissions,
      rawSubmissionData,
      submission.id
    )

    setIsEditing(false)
  }

  if (!submission.customInputValues || !can(user?.id, 'set_post_custom_fields', org)) return null

  return (
    <div className="rounded-md secondary-raised-card divide-y mt-4 border -mb-3">
      {isEditing ? (
        <div>
          <div className="flex items-center p-3 px-4 justify-between">
            <p className="text-[13px] font-medium">Edit custom fields</p>
            <button
              onClick={() => setIsEditing(false)}
              className="unstyled-button p-1 rounded-md hover:bg-white dark:hover:bg-border"
            >
              <XIcon className="secondary-svg" />
            </button>
          </div>
          <PostCreationCustomFields
            selectedOptions={{ customInputValues: customFieldData }}
            setSelectedOptions={updateSelectedOptions}
            customInputFieldErrors={customInputFieldErrors}
            setCustomInputFieldErrors={setCustomInputFieldErrors}
            isSubmission={true}
          />
          <div className="p-3 flex border-t items-center justify-end">
            <Button onClick={() => saveFields()} size={'sm'}>
              Save
            </Button>
          </div>
        </div>
      ) : (
        submission.customInputValues &&
        Object.keys(submission.customInputValues).map((key, index) => {
          const customFieldInstance = org?.customInputFields?.find((field) => field._id === key)

          if (!customFieldInstance) {
            return null
          }

          const content = (submission?.customInputValues?.[key] || '-').toString()

          return (
            <div
              key={key}
              className="flex px-2.5 gap-2 py-2 text-[13px] dashboard-border items-center group relative"
            >
              <div className="absolute inset-y-0 group-hover:opacity-100 opacity-0 main-transition delay-100 right-0">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex unstyled-button items-center gap-1 h-full pr-3.5 hover:dark:text-foreground dark:text-foreground/60 backdrop-blur-md transform-gpu text-xs"
                >
                  <PencilIcon className="!h-3 !w-3 dark:!text-current text-background-accent/60" />{' '}
                  Change
                </button>
              </div>
              <SimpleTooltip
                delayDuration={500}
                content={
                  customFieldInstance.label && customFieldInstance.label?.length > 18 ? (
                    <p>{customFieldInstance.label}</p>
                  ) : null
                }
              >
                <div className="w-1/4 truncate dark:text-foreground/80 text-background-accent">
                  <span className="truncate cursor-default select-none">
                    {customFieldInstance.label}
                  </span>
                </div>
              </SimpleTooltip>
              <div className="w-3/4">
                <SimpleTooltip
                  delayDuration={2000}
                  content={content && content?.length > 200 ? <p>{content}</p> : null}
                >
                  <span
                    className={cn(
                      'line-clamp-4 font-medium',
                      content === '-' && 'dark:text-foreground/60 text-background-accent'
                    )}
                  >
                    {content}
                  </span>
                </SimpleTooltip>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default CustomPostFields
