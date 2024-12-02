import { useCurrentOrganization } from '@/data/organization'
import React, { useEffect, useState } from 'react'
import Loader from './Loader'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createMicrosoftAccount } from 'network/lib/organization'
import { AxiosError } from 'axios'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { authenitcateModalAtom } from '@/atoms/authAtom'
import { useUser } from '@/data/user'
import { useTranslation } from 'next-i18next'

const schema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email format'),
})

const MicrosoftTokenRegister: React.FC<{
  token: string
  setToken: React.Dispatch<React.SetStateAction<string>>
  setUserFromMicrosoftExists?: React.Dispatch<React.SetStateAction<boolean>>
  userFromMicrosoftExists?: boolean
  customSuccessCallback?: () => void
  adminInviteToken?: string
}> = ({
  token,
  setToken,
  setUserFromMicrosoftExists,
  userFromMicrosoftExists,
  customSuccessCallback,
  adminInviteToken,
}) => {
  const { org } = useCurrentOrganization()
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
  })
  const { t } = useTranslation()
  const [errorName, setErrorName] = useState(false)
  const [errorEmail, setErrorEmail] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwt.decode(token)
      setRegisterData({ name: decodedToken?.name, email: decodedToken?.email })
    }
  }, [token])

  const submit = () => {
    try {
      schema.parse(registerData)
      // Continue your logic if data is valid

      setLoading(true)
      createMicrosoftAccount(token, registerData.email, registerData.name, adminInviteToken)
        .then((res) => {
          if (res.data.success) {
            if (!customSuccessCallback) {
              toast.success('Successfully registered')
              window.location.href = '/'
            } else {
              toast.success('Successfully registered')
              customSuccessCallback()
            }
          } else {
            if (res.data.message === 'User already exists.') {
              setUserFromMicrosoftExists && setUserFromMicrosoftExists(true)
            } else {
              toast.error(res.data.message)
            }
          }
        })
        .catch((err: AxiosError) => {
          toast.error(err.response?.data?.message || 'Something went wrong')
        })
        .finally(() => {
          setLoading(false)
        })
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        console.error(error.errors) // log the validation errors
        // you can use setErrorTitle and setErrorEmail based on the error messages.
        if (error.message.includes('name')) setErrorName(true)
        if (error.message.includes('email')) setErrorEmail(true)
      } else {
        // some other error occurred
      }
    }
  }

  if (userFromMicrosoftExists) {
    return (
      <div>
        <div className="relative flex items-center justify-center w-10 h-10 p-4 mb-3">
          <div className="absolute inset-0 dark:bg-emerald-500/25 bg-emerald-300/30 blur-md"></div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="relative flex-none w-10 h-10"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"
              opacity=".3"
              className="fill-emerald-200/80 stroke-emerald-300 dark:fill-emerald-500/60 dark:stroke-emerald-400/80"
            ></path>
            <path
              fill="currentColor"
              className="text-emerald-400"
              d="m15.535 8.381-4.95 4.95-2.12-2.121a1 1 0 1 0-1.415 1.414l2.758 2.758a1.1 1.1 0 0 0 1.556 0l5.586-5.586a1 1 0 1 0-1.415-1.415Z"
            ></path>
          </svg>
        </div>
        <h2 className="text-lg font-medium text-gray-700 dark:text-white">
          {t('user-already-exists')}
        </h2>
        <p className="mt-1 text-sm text-gray-400 dark:text-foreground">
          {t('sign-in-link-existing-account')}
        </p>

        <div className="flex justify-between gap-2 mt-4 ">
          <button
            onClick={() => setToken('')}
            className="flex items-center justify-center mt-1 text-xs text-background-accent cursor-pointer dark:text-foreground hover:underline main-transition unstyled-button"
          >
            <ArrowLeftIcon className="w-4 h-3 mr-1" /> {t('sign-out')}
          </button>
          <button
            onClick={() => setAuthenitacteModal(true)}
            className="items-center bg-emerald-600 text-white hover:bg-emerald-500 dark:shadow"
          >
            {loading && (
              <div className="h-4 w-4 mr-1.5">
                <Loader />
              </div>
            )}
            {t('sign-in-and-link-account')}
          </button>
        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div
          className={cn(
            adminInviteToken && 'flex -mt-6 flex-col items-center justify-center w-full'
          )}
        >
          <div className="relative flex items-center justify-center w-10 h-10 p-4 mb-3">
            <div className="absolute inset-0 dark:bg-emerald-500/25 bg-emerald-300/30 blur-md"></div>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="relative flex-none w-10 h-10"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2Z"
                opacity=".3"
                className="fill-emerald-200/80 stroke-emerald-300 dark:fill-emerald-500/60 dark:stroke-emerald-400/80"
              ></path>
              <path
                fill="currentColor"
                className="text-emerald-400"
                d="m15.535 8.381-4.95 4.95-2.12-2.121a1 1 0 1 0-1.415 1.414l2.758 2.758a1.1 1.1 0 0 0 1.556 0l5.586-5.586a1 1 0 1 0-1.415-1.415Z"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-lg font-medium text-gray-700 dark:text-white">
          {t('successfully-identified')}
        </h2>
        <p className="mt-1 text-sm text-gray-400 dark:text-foreground">
          {t('double-check-information')}
        </p>
        <div className="mt-3">
          <input
            type="text"
            value={registerData.name}
            onChange={(e) => {
              setRegisterData((prev) => ({ ...prev, name: e.target.value }))
              setErrorName(false)
            }}
            placeholder={t('username')}
            className={cn(
              errorName &&
                'ring-rose-200 dark:ring-offset-gray-800 dark:ring-rose-500/40 ring-offset-white ring-offset-1 ring-2'
            )}
          />
          <input
            type="email"
            value={registerData.email}
            onChange={(e) => {
              setRegisterData((prev) => ({ ...prev, email: e.target.value }))
              setErrorEmail(false)
            }}
            placeholder="Email"
            className={cn(
              'mt-2',
              errorEmail &&
                'ring-rose-200 dark:ring-offset-gray-800 dark:ring-rose-500/40 ring-offset-white ring-offset-1 ring-2'
            )}
          />
        </div>
        <div className="flex justify-between gap-2 mt-4 ">
          <button
            onClick={() => setToken('')}
            className="flex items-center justify-center mt-1 text-xs text-background-accent cursor-pointer dark:text-foreground hover:underline main-transition unstyled-button"
          >
            <ArrowLeftIcon className="w-4 h-3 mr-1" /> {t('back')}
          </button>
          <button
            onClick={() => submit()}
            className="items-center text-white dark:text-white bg-emerald-600 hover:bg-emerald-500 dark:shadow"
          >
            {loading && (
              <div className="h-4 w-4 mr-1.5">
                <Loader />
              </div>
            )}
            {t('save-and-continue')}
          </button>
        </div>
      </div>
    )
  }
}

export default MicrosoftTokenRegister
