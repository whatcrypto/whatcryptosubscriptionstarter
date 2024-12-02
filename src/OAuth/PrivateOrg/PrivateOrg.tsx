import React, { useEffect, useMemo, useState } from 'react'
import { useCurrentOrganization } from '../data/organization'
import { authenitcateModalAtom } from '../atoms/authAtom'
import { useAtom } from 'jotai'
import { useUser } from '../data/user'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { toast } from 'sonner'
import Loader from './Loader'
import { getUser, logOut, loginWithToken } from '../../network/lib/user'
import router from 'next/router'
import MicrosoftTokenRegister from './MicrosoftTokenRegister'
import { cn } from '@/lib/utils'
import { linkToMicrosoft } from 'network/lib/organization'
import jwt from 'jsonwebtoken'
import { Trans, useTranslation } from 'next-i18next'
import { Mixpanel } from '@/lib/mixpanel'
import { isMember } from '@/lib/acl'
import { checkMicrosoftAccess } from '@/lib/checkMicrosoftAccess'

const PrivateOrg: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { org, mutateCurrentOrg } = useCurrentOrganization()
  const { user, userMutate } = useUser()
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)
  const [loading, setLoading] = useState(false)
  const [emailNotAllowed, setEmailNotAllowed] = useState(false)
  const [microsoftToken, setMicrosoftToken] = useState('')
  const [userFromMicrosoftExists, setUserFromMicrosoftExists] = useState(false)
  const [fetchingUserFromMicrosoft, setFetchingUserFromMicrosoft] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (window.location.href.includes('microsoftJwt')) {
      const token = window.location.href.split('microsoftJwt=')[1]
      setMicrosoftToken(token)
    }
  }, [])
  useEffect(() => {
    if (window.location.href.includes('tempLoginToken')) {
      const token = window.location.href.split('tempLoginToken=')[1]

      loginWithToken({ token })
        .then((res) => {
          if (res.data.success) {
            userMutate(res.data.user)
            mutateCurrentOrg()
          } else {
            toast.error('Something went wrong when logging in')
          }
        })
        .catch((err) => {
          toast.error('Something went wrong when logging in')
        })
    }
  }, [])

  useEffect(() => {
    if (user && org) {
      const userEmailDomain = user.email?.split('@')[1]
      if (!userEmailDomain || !org.allowedDomains.includes(userEmailDomain)) {
        setEmailNotAllowed(true)
      }
    }
  }, [org, user])

  const linkMicrosoftAccountIfNeeded = () => {
    if (!fetchingUserFromMicrosoft) {
      setFetchingUserFromMicrosoft(true)
      linkToMicrosoft(microsoftToken)
        .then((res) => {
          if (res.data.success) {
            toast.success('Successfully linked')
            userMutate()
          } else {
            toast.error(res?.data?.message)
          }
        })
        .catch(() => toast.error('Something went wrong when linking account'))
    }
  }

  const checkVerificationStatus = async () => {
    setLoading(true)

    const refreshedUser = await getUser().then((user) => user.data)
    userMutate(refreshedUser).then((newUser) => {
      mutateCurrentOrg()
      setLoading(false)
      if (newUser) {
        if (newUser.verified) {
          return true
        } else {
          toast.error(
            'You have not verified your email address. Please check your inbox and verify your email address.'
          )
        }
      } else {
        return false
      }
    })
  }

  const isPrivateOrgSsoAccess = org?.ssoUrl && org?.settings?.privateOrgNonAdminSsoAccess

  const handleOrgMemberAccess = (): boolean => {
    if (org?.microsoft?.tenantId) {
      // const decodedToken: any = jwt?.decode(microsoftToken)
      if (userFromMicrosoftExists && !checkMicrosoftAccess(user, org)) {
        linkMicrosoftAccountIfNeeded()
        return false
      }
    }
    return true
  }

  const checkUserDomainAndVerification = (): boolean => {
    if (!user || !user.email) return false

    const userEmailDomain = user.email.split('@')[1]
    if (userEmailDomain && org.allowedDomains.includes(userEmailDomain) && user.verified) {
      // Additional checks or messages based on allowed account emails can be added here
      return true
    }
    return false
  }

  const handleOrgNonMemberAccess = (): boolean => {
    if (org?.hasNonAdminPrivateOrgSsoAccess && org?.settings?.privateOrgNonAdminSsoAccess) {
      return true
    }
    if (org?.microsoft?.tenantId && checkMicrosoftAccess(user, org)) {
      return true
    }

    if (org?.microsoft?.tenantId) {
      // const decodedToken: any = jwt?.decode(microsoftToken)
      if (userFromMicrosoftExists && !checkMicrosoftAccess(user, org)) {
        linkMicrosoftAccountIfNeeded()
        return false
      }
    }

    return checkUserDomainAndVerification()
  }

  const hasUserAccess = useMemo(() => {
    if (!org?.settings?.private) {
      return true
    }

    if (!user) {
      return false
    }

    if (isMember(user?.id, org)) {
      return handleOrgMemberAccess()
    } else {
      return handleOrgNonMemberAccess()
    }
  }, [
    org,
    user,
    userFromMicrosoftExists,
    microsoftToken,
    fetchingUserFromMicrosoft,
    handleOrgMemberAccess,
  ])

  if (!hasUserAccess) {
    return (
      <>
        <div className="fixed inset-0 z-[50] overflow-x-hidden overflow-y-auto">
          <div
            className={`fixed inset-0 transform-gpu sm:bg-white/40 dark:sm:bg-background/40 backdrop-filter backdrop-blur-md `}
          />
          <div className="flex items-center justify-center min-h-screen">
            <div
              className={`relative shadow-xl dark:border dark:border-border/50 dark:shadow-2xl max-w-sm w-full  px-5 py-5 bg-white dark:bg-card 2xl:mx-0 mx-4 sm:mx-8 my-10 rounded-lg`}
            >
              {emailNotAllowed ? (
                <>
                  <div className="relative flex items-center justify-center w-10 h-10 p-4 mb-3">
                    <div className="absolute inset-0 dark:bg-red-500/25 bg-red-500/20 blur-md"></div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="flex-none w-10 h-10 text-red-400 dark:text-red-400"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <h2 className="text-lg font-medium text-gray-700 dark:text-white">
                    {t('this-email-doesnt-have-access')}
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 dark:text-foreground">
                    <Trans
                      i18nKey={'contact-organization-owner'}
                      values={{ email: user?.email }}
                      components={[<span className="font-semibold" key="contactowner" />]}
                    />
                    {/* Please contact the organization owner to make sure that{' '}
                    <span className="font-semibold">{user?.email}</span> is added to the allowed
                    emails list. */}
                  </p>
                  <div className="gap-2 mt-4 ">
                    {/* <button
                      onClick={() => checkVerificationStatus()}
                      style={{ backgroundColor: org.color }}
                      className="items-center justify-center w-full branded-btn dark:shadow"
                    >
                      {loading && (
                        <div className="h-4 w-4 mr-1.5">
                          <Loader />
                        </div>
                      )}
                      I have verified my email
                    </button> */}
                    <button
                      onClick={() =>
                        logOut().then(() => {
                          router.reload()
                          Mixpanel.reset()
                        })
                      }
                      className="flex items-center mt-1 text-xs cursor-pointer unstyled-button text-background-accent dark:text-foreground hover:underline main-transition"
                    >
                      <ArrowLeftIcon className="w-4 h-3 mr-1" /> {t('try-different-email')}
                    </button>
                  </div>
                </>
              ) : user ? (
                <>
                  <div className="relative flex items-center justify-center w-10 h-10 p-4 mb-3">
                    <div className="absolute inset-0 dark:bg-blue-500/25 bg-blue-300/60 blur-md"></div>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      className="relative flex-none w-10 h-10"
                    >
                      <path
                        d="M2.75 7.75a3 3 0 0 1 3-3h12.5a3 3 0 0 1 3 3v8.5a3 3 0 0 1-3 3H5.75a3 3 0 0 1-3-3v-8.5Z"
                        className="fill-blue-100 stroke-blue-400 dark:fill-blue-500/60 dark:stroke-blue-400/80"
                      />
                      <path
                        d="m4 6 6.024 5.479a2.915 2.915 0 0 0 3.952 0L20 6"
                        className="stroke-blue-400 dark:stroke-blue-400/80"
                      />
                    </svg>
                  </div>

                  <h2 className="text-lg font-medium text-gray-700 dark:text-white">
                    Please check your email inbox to verify your email address
                  </h2>
                  <p className="mt-1 text-sm text-gray-400 dark:text-foreground">
                    Click the button below once you have verified your email address.
                  </p>
                  <div className="flex justify-between gap-2 mt-4 ">
                    <button
                      onClick={() =>
                        logOut().then(() => {
                          Mixpanel.reset()
                          router.reload()
                        })
                      }
                      className="flex items-center justify-center mt-1 text-xs cursor-pointer unstyled-button text-background-accent dark:text-foreground hover:underline main-transition"
                    >
                      <ArrowLeftIcon className="w-4 h-3 mr-1" /> {t('try-different-email')}
                    </button>
                    <button
                      onClick={() => checkVerificationStatus()}
                      className="items-center dashboard-primary dark:shadow"
                    >
                      {loading && (
                        <div className="h-4 w-4 mr-1.5">
                          <Loader />
                        </div>
                      )}
                      I have verified my email
                    </button>
                  </div>
                </>
              ) : microsoftToken ? (
                <MicrosoftTokenRegister
                  userFromMicrosoftExists={userFromMicrosoftExists}
                  setUserFromMicrosoftExists={setUserFromMicrosoftExists}
                  setToken={setMicrosoftToken}
                  token={microsoftToken}
                />
              ) : (
                <>
                  <h2 className="text-lg font-medium dark:text-white">
                    {isPrivateOrgSsoAccess
                      ? t('please-sign-in-organization', { organization: org?.displayName })
                      : t('name-has-private-feedback-board', { name: org?.displayName })}
                  </h2>

                  <p className="mt-1 text-sm text-gray-400 dark:text-foreground">
                    {isPrivateOrgSsoAccess
                      ? t('sign-in-with-organization-account', { organization: org?.displayName })
                      : t('please-authenticate')}
                  </p>
                  <div
                    className={cn(
                      'flex justify-end gap-2 mt-4 ',
                      org?.microsoft?.tenantId && 'justify-start'
                    )}
                  >
                    {isPrivateOrgSsoAccess ? (
                      <button
                        onClick={() => setAuthenitacteModal(true)}
                        className="dashboard-primary dark:shadow"
                      >
                        {t('continue-with-organization-account', {
                          organization: org?.displayName,
                        })}
                      </button>
                    ) : org?.microsoft?.tenantId ? (
                      <button
                        onClick={() => {
                          window.location.href = `/api/v1/auth/microsoft?returnTo=${window.location.href}`
                        }}
                        className="dashboard-primary dark:shadow"
                      >
                        {t('sign-in-with-service', { service: 'Microsoft' })}
                      </button>
                    ) : (
                      <button
                        onClick={() => setAuthenitacteModal(true)}
                        className="dashboard-primary dark:shadow"
                      >
                        {t('sign-in')}
                        {' / '}
                        {t('register')}
                      </button>
                    )}
                  </div>
                  {isPrivateOrgSsoAccess ? (
                    org.id === '65b8c4f017b7640940510065' ? (
                      <div className="mt-3 text-xs font-semibold text-gray-400 dark:text-foreground">
                        {t('admin-or-employee')}{' '}
                        <button
                          className="inline-block ml-1 font-medium cursor-pointer unstyled-button hover:underline"
                          onClick={() => {
                            window.location.href = `/api/v1/auth/microsoft?returnTo=${window.location.href}`
                          }}
                        >
                          {t('sign-in-here')}
                        </button>
                      </div>
                    ) : (
                      <div className="mt-3 text-xs font-semibold text-gray-400 dark:text-foreground">
                        {t('admin-of-organization')}{' '}
                        <a
                          href="https://auth.featurebase.app/"
                          className="font-medium text-gray-400 cursor-pointer hover:underline dark:text-foreground"
                        >
                          {t('sign-in-here')}
                        </a>
                      </div>
                    )
                  ) : org?.microsoft?.tenantId ? (
                    <div className="mt-3 text-xs font-semibold text-gray-400 dark:text-foreground">
                      {t('admin-of-organization')}{' '}
                      <button
                        className="inline-block ml-1 font-medium cursor-pointer unstyled-button hover:underline"
                        onClick={() => setAuthenitacteModal(true)}
                      >
                        {t('sign-in-here')}
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </>
    )
  } else {
    return children ? <>{children}</> : null
  }
}

export default PrivateOrg
