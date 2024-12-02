import { updateSubmissionInfo } from 'network/lib/submission'
import { toast } from 'sonner'
import { mutateSubmissionItems } from './submissionMutator'
import { KeyedMutator } from 'swr'
import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import {
  determineOptionColorByNumberAndPattern,
  getPatternNumbers,
} from '@/components/PrioritizationOptions'
import { IOrganization } from '@/interfaces/IOrganization'

export const changeValueEffort = (
  type: 'value' | 'effort',
  value1: number,
  value2: number,
  submissionIds: string[],
  event: Event,
  mutateSubmissions: KeyedMutator<any>,
  rawSubmissionData: ISubmissionPaginate | ISubmissionPaginate[]
) => {
  event.preventDefault()
  mutateSubmissionItems(
    'prioritization.valueEffort.' + type,
    parseFloat(`${value1}.${value2}`),
    mutateSubmissions,
    rawSubmissionData,
    submissionIds
  )
  updateSubmissionInfo({
    [type === 'effort' ? 'effortRating' : 'valueRating']: parseFloat(`${value1}.${value2}`),
    submissionIds,
  }).catch(() => {
    toast.error('Something went wrong')
    mutateSubmissions()
  })
}

export const displayedValueEffortScore = (
  type: 'value' | 'effort',
  org?: IOrganization,
  submission?: ISubmission,
  value?: number
) => {
  if (value !== undefined) {
    if (org?.settings?.valueEffortScale === 'ten') {
      return value
    } else {
      return getPatternNumbers(org?.settings?.valueEffortScale || '')[value || 0]
    }
  }

  if (!org) return 0

  //   Change this to org setting for decimal places
  if (org?.settings?.valueEffortScale === 'ten') {
    return submission?.prioritization?.valueEffort?.[type] || 0
  } else {
    return getPatternNumbers(org?.settings?.valueEffortScale || '')[
      submission?.prioritization?.valueEffort?.[type] || 0
    ]
  }
}
export const displayedValueEffortColor = (
  type: 'value' | 'effort',
  org?: IOrganization,
  submission?: ISubmission
) => {
  if (!org || !submission) return 0

  const value = submission?.prioritization?.valueEffort?.[type] || 0

  //   Change this to org setting for decimal places
  return determineOptionColorByNumberAndPattern(
    Math.round(
      org?.settings?.valueEffortScale === 'ten'
        ? value < 1 && value !== 0.0
          ? 1
          : value / 2
        : value || 0
    ),
    type
  )
}
