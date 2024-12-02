import { atom } from 'jotai'
import { v4 as uuidv4 } from 'uuid'

export const authenitcateModalAtom = atom(false)
export const cookieAccessStateAtom = atom('loading')
export const isTestingEnv = atom(false)
export const viaAtom = atom('')
export const csrfToken = atom('')
export const fallbackSessionIdAtom = atom(uuidv4())
