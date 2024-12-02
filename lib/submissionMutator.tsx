import { ISubmission, ISubmissionPaginate } from '@/interfaces/ISubmission'
import { KeyedMutator } from 'swr'
const setDeepValue = (obj: any, path: string, value: any): any => {
  const keys = path.split('.')
  const clonedObj = JSON.parse(JSON.stringify(obj)) // This will clone the original object
  let current = clonedObj

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {}
    current = current[keys[i]]
  }

  current[keys[keys.length - 1]] = value

  return clonedObj
}

// Check if a submission should be updated
const shouldUpdateSubmission = (
  submission: ISubmission,
  submissionNeededToMutate: string | string[] | undefined
): boolean => {
  if (!submissionNeededToMutate) return true

  if (Array.isArray(submissionNeededToMutate)) {
    return submissionNeededToMutate.includes(submission.id)
  }

  return submission.id === submissionNeededToMutate
}

export const mutateSubmissionItems = (
  key: string,
  value: any,
  mutateSubmissions: KeyedMutator<any[]>,
  rawSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate | undefined,
  submissionNeededToMutate: string | string[] | undefined,
  customNewSubmissionData?: (oldResults: ISubmission[]) => ISubmission[],
  modifyResultCount?: number
) => {
  const generateNewSubmissionData = (oldResults: ISubmission[]) => {
    return oldResults.map((sub) => {
      if (shouldUpdateSubmission(sub, submissionNeededToMutate)) {
        return setDeepValue({ ...sub }, key, value)
      }
      return sub
    })
  }
  if (mutateSubmissions && rawSubmissionData) {
    performSubmissionMutation(
      mutateSubmissions,
      customNewSubmissionData ? customNewSubmissionData : generateNewSubmissionData,
      rawSubmissionData,
      modifyResultCount
    )
  } else {
    console.log('no mutateSubmissions or rawSubmissionData')
  }
}

export const mutateSingleAndMultipleSubmission = (
  mutateAllSubmissions: KeyedMutator<any[]>,
  rawAllSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate | undefined,
  mutateSingleSubmission: KeyedMutator<any[]>,
  rawSingleSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate | undefined,
  customNewSubmissionData?: (oldResults: ISubmission[]) => ISubmission[],
  modifyResultCount?: number
) => {
  if (mutateAllSubmissions && rawAllSubmissionData) {
    performSubmissionMutation(
      mutateAllSubmissions,
      customNewSubmissionData ? customNewSubmissionData : (oldResults: ISubmission[]) => oldResults,
      rawAllSubmissionData,
      modifyResultCount
    )
  } else {
    console.log(
      'no mutateSubmissions or rawSubmissionData',
      mutateAllSubmissions,
      rawAllSubmissionData
    )
  }

  if (typeof mutateSingleSubmission !== undefined && typeof mutateSingleSubmission !== undefined) {
    performSubmissionMutation(
      mutateSingleSubmission,
      customNewSubmissionData ? customNewSubmissionData : (oldResults: ISubmission[]) => oldResults,
      rawSingleSubmissionData,
      modifyResultCount
    )
  } else {
    console.log(
      'no mutateSubmissions or rawSubmissionData',
      typeof mutateAllSubmissions,
      typeof rawAllSubmissionData
    )
  }
}

export const performSubmissionMutation = (
  mutateSubmissions: KeyedMutator<any[]>,
  generateNewSubmissionData: (oldResults: ISubmission[]) => ISubmission[],
  rawSubmissionData: ISubmissionPaginate[] | ISubmissionPaginate | undefined,
  modifyResultCount?: number,
  revalidate?: boolean
) => {
  if (!Array.isArray(rawSubmissionData)) {
    // Mutate data for single submission
    mutateSubmissions(
      {
        ...rawSubmissionData,
        // @ts-ignore
        results: generateNewSubmissionData(rawSubmissionData?.results || []),
      },
      revalidate ? true : false
    )
  } else if (Array.isArray(rawSubmissionData)) {
    // Mutate data for multiple submissions
    mutateSubmissions(
      rawSubmissionData.map((entry) => ({
        ...entry,
        results: generateNewSubmissionData(entry?.results),
        totalResults: entry.totalResults + (modifyResultCount || 0),
      })),
      revalidate ? true : false
    )
  }
}
