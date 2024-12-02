import React from 'react'
import { Button } from './radix/Button'
import { useCurrentOrganization } from '@/data/organization'
import { cn } from '@/lib/utils'
import { useAtom } from 'jotai'
import { authenitcateModalAtom } from '@/atoms/authAtom'
import { useTranslation } from 'next-i18next'
import { useUser } from '@/data/user'
import { ArrowLeftIcon } from '@heroicons/react/solid'
import { logOut } from 'network/lib/user'
import { useRouter } from 'next/router'
import Loader from './Loader'
import { Mixpanel } from '@/lib/mixpanel'

const PrivateRoleOrg = () => {
  const { org, isValidatingOrg } = useCurrentOrganization()
  const { user, isValidatingUser, userError } = useUser()

  const [authenitacteModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)

  const { t } = useTranslation()

  const router = useRouter()

  return (
    <div className="p-4 -mx-4 overflow-hidden rounded-none border-x-0 sm:border-x sm:rounded-lg sm:mx-0 dark:shadow-lg dark:bg-secondary/70 up-element">
      {isValidatingUser || isValidatingOrg ? (
        <div className="w-5 h-5 mx-auto my-11 secondary-svg">
          <Loader />
        </div>
      ) : (
        <>
          <p className="text-lg font-semibold dark:text-white">
            {user
              ? t('no-access')
              : t('welcome-to-role-based-access-org', { displayName: org?.displayName })}
          </p>

          {user ? (
            <div>
              <p className="mt-1.5 text-sm">
                {t('your-account-doesnt-have-access-to-any-feedback-board', { email: user.email })}
              </p>
              <p className="mt-1.5 text-sm">{t('contact-admin-to-gain-access')}</p>
              <div className={cn('flex justify-end gap-2 mt-5')}>
                <Button
                  onClick={() =>
                    logOut().then(() => {
                      Mixpanel.reset()
                      router.reload()
                    })
                  }
                >
                  <ArrowLeftIcon className="w-3.5 h-3.5 mr-1" /> {t('try-different-email')}
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <p className="mt-1.5 text-sm">{t('auth-to-submit-and-view')}</p>
              <div className={cn('flex justify-end gap-2 mt-5')}>
                {org?.microsoft?.tenantId ? (
                  <Button
                    onClick={() => {
                      window.location.href = `/api/v1/auth/microsoft?returnTo=${window.location.href}`
                    }}
                  >
                    {t('sign-in-with-service', { service: 'Microsoft' })}
                  </Button>
                ) : (
                  <Button onClick={() => setAuthenitacteModal(true)}>
                    {t('sign-in')}
                    {' / '}
                    {t('register')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default PrivateRoleOrg
