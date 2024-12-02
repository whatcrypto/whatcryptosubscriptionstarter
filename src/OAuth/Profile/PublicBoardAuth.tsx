import React, { useEffect, useRef, useState } from 'react'
import OAuthAuthenticate from './OAuthAuthenticate'
import PopupWrapper from './PopupWrapper'
import {
  getRecaptchaToken,
  handleLogin,
  handleRegister,
  hasInvalidInputsLogin,
  hasInvalidInputsRegister,
  signInDiscord,
  signInGithub,
  signInGoogle,
} from '../lib/authHandler'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import InlineError from './InlineError'
import ReCAPTCHA from 'react-google-recaptcha'
import { useUser } from '../data/user'
import { usePlausible } from 'next-plausible'
import { useCurrentOrganization } from '../data/organization'
import Router from 'next/router'
import { useTranslation } from 'next-i18next'
import { updateAxiosToken } from './AppWrapper'
import Loader from './Loader'
import { useAtom } from 'jotai'
import { isTestingEnv } from '../atoms/authAtom'
import ButtonLoader from './ButtonLoader'
import { toast } from 'sonner'
import { IAdmin, ICustomer } from '@/interfaces/IUser'
import { cn } from '@/lib/utils'

const PublicBoardAuth: React.FC<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  callback?: (user?: IAdmin | ICustomer) => void
  widget?: boolean
  disableSSO?: boolean
  authType?: 'admin' | 'customer'
}> = ({ isOpen, setIsOpen, callback, widget, disableSSO, authType }) => {
  const authenticationType = authType || 'customer'
  const defualtErrors = {
    name: '',
    email: '',
    password: '',
    response: '',
  }
  const { userMutate, user } = useUser()
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const [currentPage, setCurrentPage] = useState('choose')
  const [authCredentials, setAuthCredentials] = useState({ name: '', email: '', password: '' })
  const { t } = useTranslation()

  const [errors, setErrors] = useState<{
    name?: string
    email: string
    password: string
    response: string
  }>(defualtErrors)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, [event.target.name]: '' }))
    setAuthCredentials((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }
  const [testingEnv, setTestingEnv] = useAtom(isTestingEnv)
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef<any>()
  const plausible = usePlausible()
  useEffect(() => {
    setErrors({
      name: '',
      email: '',
      password: '',
      response: '',
    })
  }, [currentPage])

  useEffect(() => {
    if (authenticationType === 'customer' && org?.ssoUrl && isOpen && !disableSSO) {
      try {
        let url = new URL(org.ssoUrl) // Construct the URL
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          // Only allow HTTP and HTTPS protocols to prevent potential javascript: protocol attacks
          throw new Error('Invalid protocol')
        }

        // Check if org.id is 5febde12dc56d60012d47db6(feedback.featurebase.app) and environment is development
        if (
          org.id === '5febde12dc56d60012d47db6' &&
          process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
        ) {
          url.host = 'auth.fbasedev.com'
        }

        setCurrentPage('redirecting')

        // Add the current window location as a parameter
        url.searchParams.append('return_to', window.location.href)
        Router.push(url.toString())
      } catch (e) {
        console.error('Invalid URL or other error:', e)
        // Handle the error accordingly
      }
    }
  }, [org, isOpen, disableSSO, authenticationType])

  const authenticate = async () => {
    let hasErrors = false
    if (currentPage === 'signin') {
      hasErrors = hasInvalidInputsLogin(authCredentials, setErrors, t)
    } else {
      hasErrors = hasInvalidInputsRegister(authCredentials, setErrors, t)
    }

    if (loading) {
      toast.error('Please wait for the request to finish')
      return
    }

    if (!hasErrors) {
      setLoading(true)
      if (currentPage === 'signin') {
        handleLogin(
          {
            email: authCredentials.email,
            password: authCredentials.password,
            type: authenticationType,
          },
          await getRecaptchaToken(recaptchaRef, org, user, testingEnv),
          setErrors,
          (user) => {
            if (user?.jwtToken) {
              updateAxiosToken(user.jwtToken)
            }
            userMutate(user)
            setIsOpen(false)
            if (authenticationType === 'customer') {
              mutateCurrentOrg()
            }
            callback && callback(user)
          },
          t
        ).finally(() => setLoading(false))
      } else {
        handleRegister(
          { ...authCredentials, type: authenticationType },
          await getRecaptchaToken(recaptchaRef, org, user, testingEnv),
          (user) => {
            if (user?.jwtToken) {
              updateAxiosToken(user.jwtToken)
            }
            plausible('register', {
              props: {
                name: user.name,
                email: user.email,
              },
            })
            userMutate(user)
            setIsOpen(false)
            if (authenticationType === 'customer') {
              mutateCurrentOrg()
            }

            callback && callback(user)
          },
          setErrors,
          t
        ).finally(() => setLoading(false))
      }
    }
  }

  return (
    <PopupWrapper
      hasPadding={false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      xSmall={true}
      small={true}
    >
      <div>
        <ReCAPTCHA
          ref={recaptchaRef}
          size="invisible"
          sitekey="6Le2uucZAAAAABsXNpeE8_pJ400DDC9aKVsJQKJy"
        />
        {currentPage === 'redirecting' && authenticationType === 'customer' && (
          <>
            <p className="px-5 pt-5 text-lg font-semibold text-gray-700 dark:text-white">
              {t('redirecting-for-authentication', { organization: org?.displayName })}
            </p>
            <div className="w-8 h-8 mx-auto mt-10 mb-10 secondary-svg">
              <Loader />
            </div>
          </>
        )}
        {currentPage === 'choose' && (
          <>
            <p className="px-5 pt-5 font-semibold text-gray-600 dark:text-white">
              {t('sign-up-to-continue')}
            </p>
            <div className="px-5 mt-3 space-y-3">
              {authenticationType === 'customer' && org?.ssoUrl && !disableSSO && (
                <OAuthAuthenticate
                  onClickHandler={() => {
                    if (org?.ssoUrl && window) {
                      try {
                        const url = new URL(org.ssoUrl) // Construct the URL
                        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
                          // Only allow HTTP and HTTPS protocols to prevent potential javascript: protocol attacks
                          throw new Error('Invalid protocol')
                        }

                        // Add the current window location as a parameter
                        url.searchParams.append('return_to', window.location.href)
                        Router.push(url.toString())
                      } catch (e) {
                        console.error('Invalid URL or other error:', e)
                        // Handle the error accordingly
                      }
                    }
                  }}
                  serviceName="SSO"
                  mode="login"
                />
              )}

              {authenticationType === 'customer' && org?.settings?.discordAuthEnabled && (
                <OAuthAuthenticate
                  onClickHandler={() => {
                    signInDiscord(authenticationType, org.id, (user) => {
                      userMutate(user)
                      // check if user account was made less than 60 seconds ago
                      setIsOpen(false)
                      mutateCurrentOrg()
                      if (user?.jwtToken) {
                        updateAxiosToken(user.jwtToken)
                      }

                      callback && callback(user)
                    })
                  }}
                  serviceName="Discord"
                  mode="login"
                />
              )}
              {(authenticationType === 'admin' ||
                (authenticationType === 'customer' && org?.name !== 'worldwidewebb')) && (
                <>
                  <OAuthAuthenticate
                    onClickHandler={() => {
                      signInGoogle(
                        authenticationType,
                        authenticationType === 'customer' ? org.id : null,
                        (user) => {
                          if (user?.jwtToken) {
                            updateAxiosToken(user.jwtToken)
                          }
                          userMutate(user)
                          if (authenticationType === 'customer') {
                            mutateCurrentOrg()
                          }
                          setIsOpen(false)

                          callback && callback(user)
                        }
                      )
                    }}
                    serviceName="Google"
                    mode="login"
                  />
                  <OAuthAuthenticate
                    onClickHandler={() => {
                      signInGithub(
                        authenticationType,
                        authenticationType === 'customer' ? org.id : null,
                        (user) => {
                          if (user?.jwtToken) {
                            updateAxiosToken(user.jwtToken)
                          }
                          userMutate(user)
                          if (authenticationType === 'customer') {
                            mutateCurrentOrg()
                          }
                          setIsOpen(false)
                          callback && callback(user)
                        }
                      )
                    }}
                    serviceName="Github"
                    mode="login"
                  />
                </>
              )}
            </div>
            {(authenticationType === 'admin' ||
              (authenticationType === 'customer' && org?.name !== 'worldwidewebb')) && (
              <>
                <div className="relative w-full my-5 ">
                  <div className="relative flex justify-center text-sm leading-5">
                    <span className="px-2 text-xs font-medium text-background-accent dark:text-foreground">
                      {t('or-continue-with-email')}
                    </span>
                  </div>
                </div>
                <div className="px-5 pb-5 space-y-3">
                  <button
                    onClick={() => setCurrentPage('signin')}
                    className="justify-center w-full dashboard-secondary"
                  >
                    {t('sign-in-with-email')}
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="justify-center w-full dashboard-secondary"
                  >
                    {t('register-with-email')}
                  </button>
                </div>
              </>
            )}

            <div
              className={cn(
                'pt-4 pb-4 border-gray-100 rounded-b-lg bg-gray-50 dark:border-t dark:border-border dark:bg-secondary/60',
                authenticationType === 'customer' && org?.name === 'worldwidewebb' && 'mt-5'
              )}
            >
              <p className="px-5 text-xs text-center text-background-accent dark:text-foreground">
                {t(
                  'we-use-featurebase-to-collect-feedback-from-users-like-you-sign-up-to-post-and-vote'
                )}
              </p>
            </div>
          </>
        )}
        {currentPage === 'signin' && (
          <>
            <div className="px-5 py-5">
              <p className="flex items-center font-semibold text-gray-600 dark:text-white ">
                <button
                  onClick={() => setCurrentPage('choose')}
                  className="p-1.5 mr-2 border rounded-full shadow-none white-btn darkborder-secondary/50 dark:bg-secondary/40"
                >
                  <ArrowLeftIcon className="w-3 h-3 secondary-svg" />
                </button>
                {t('sign-in')}
              </p>
              <div className="mt-3">
                <div>
                  <input onChange={handleChange} name="email" placeholder={t('email-address')} />
                  <InlineError error={errors.email} />
                </div>
                <div className="my-3">
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    placeholder={t('password')}
                  />
                  <InlineError error={errors.password} />
                  <InlineError error={errors.response} />
                </div>
                <button
                  onClick={() => authenticate()}
                  className="justify-center w-full dashboard-primary"
                >
                  <ButtonLoader primary={true} loading={loading} />

                  {t('sign-in')}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-4 pb-4 border-gray-100 rounded-b-lg bg-gray-50 dark:border-t dark:border-border dark:bg-secondary/60">
              <button
                className="text-xs dashboard-secondary"
                onClick={() => setCurrentPage('register')}
              >
                {t('register')}
              </button>
              <a
                target="_blank"
                rel="noreferrer"
                href={
                  process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
                    ? `https://auth.fbasedev.com/forgot-password${
                        authenticationType === 'admin' ? '' : `?oid=${org?.id}`
                      }`
                    : `https://auth.featurebase.app/forgot-password${
                        authenticationType === 'admin' ? '' : `?oid=${org?.id}`
                      }`
                }
              >
                <button className="text-xs dashboard-secondary">{t('reset-password')}</button>
              </a>
            </div>
          </>
        )}
        {currentPage === 'register' && (
          <>
            <div className="px-5 py-5">
              <p className="flex items-center font-semibold text-gray-600 dark:text-white ">
                <button
                  onClick={() => setCurrentPage('choose')}
                  className="p-1.5 mr-2 border rounded-full shadow-none white-btn darkborder-secondary/50 dark:bg-secondary/40"
                >
                  <ArrowLeftIcon className="w-3 h-3 secondary-svg" />
                </button>
                {t('register')}
              </p>
              <div className="mt-3 ">
                <div className="">
                  <input onChange={handleChange} name="name" placeholder={t('username')} />
                  {errors.name && <InlineError error={errors.name} />}
                </div>
                <div className="mt-3">
                  <input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder={t('email-address')}
                  />
                  <InlineError error={errors.email} />
                  <InlineError error={errors.response} />
                </div>
                <div className="mt-3">
                  <input
                    type="password"
                    onChange={handleChange}
                    name="password"
                    placeholder={t('password')}
                  />
                  <InlineError error={errors.password} />
                </div>

                <button
                  onClick={() => authenticate()}
                  className="justify-center w-full mt-4 dashboard-primary"
                >
                  <ButtonLoader primary={true} loading={loading} />

                  {t('sign-up')}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2.5 pt-4 pb-4 border-gray-100 rounded-b-lg bg-gray-50 dark:border-t dark:border-border dark:bg-secondary/60">
              <button
                onClick={() => setCurrentPage('signin')}
                className="text-xs dashboard-secondary"
              >
                {t('log-in-with-an-existing-account')}
              </button>
            </div>
          </>
        )}
      </div>
    </PopupWrapper>
  )
}

export default PublicBoardAuth
