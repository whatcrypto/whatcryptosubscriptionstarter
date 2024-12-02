import { atom } from 'jotai'

export const submissionFilteringAtom = atom({
  popularity: 'Trending Posts',
  status: ['In Review', 'In Progress', 'Planned', 'Completed', 'Rejected'],
  categories: ['Feature request', 'Bugs', 'Feedback'],
})

export const createPostAtom = atom(false)

export const lastViewedSubmissionAtom = atom('')

export const anyPopUpOpenAtom = atom(false)
