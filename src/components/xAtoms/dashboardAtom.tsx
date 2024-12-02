import { ISubmissionFilters } from '../interfaces/ISubmission'
import { atom } from 'jotai'

export const defaultFilters: ISubmissionFilters = {
  sortBy: 'date:desc',
  advancedFilters: [],
  searchByComments: true,
}

export const postsFilterAtom = atom(defaultFilters)

export const helpcenterActiveLocaleAtom = atom('en')

export const expandedAnalyticsAtom = atom<{ [key: string]: boolean }>({})

export const postRowHeightsAtom = atom<{ [key: string]: number }>({})
