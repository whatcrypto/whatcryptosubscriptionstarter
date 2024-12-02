import { notificationAtom, notificationTypeAtom } from '@/atoms/notificationAtom'
import { useCurrentOrganization, useNotificationsWithFiltering } from '@/data/organization'
import { useAtom } from 'jotai'
import React from 'react'
import { getActualType } from './NotificationResults'
import { useRouter } from 'next/router'
import Script from 'next/script'
import CustomThemeHandler from './CustomThemeHandler'
import { useUser } from '@/data/user'
import { missingPermissionAtom, upgradePlanAtom } from '@/atoms/orgAtom'
import PermissionRequiredPopup from './PermissionRequiredPopup'
import PayWallPopup from './PayWallPopup'

const BoardAndDashboardWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [notificationType, setNotificationType] = useAtom(notificationTypeAtom)
  const [notifications, setNotifications] = useAtom(notificationAtom)
  const [requiresMissingPermission, setRequiresMissingPermission] = useAtom(missingPermissionAtom)
  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)

  const { org } = useCurrentOrganization()
  const { user } = useUser()
  const router = useRouter()

  const {
    notificationResults,
    size,
    setSize,
    rawNotificationResults,
    mutateNotifications,
    totalNotificationResults,
    totalUnviewedResults,
    notificationLoading,
  } = useNotificationsWithFiltering(
    user
      ? { type: getActualType(notificationType.type, org), viewed: notificationType.viewed }
      : null,
    org
  )
  const isIframeContext = React.useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.parent !== window
  }, [])
  const currentDataString = JSON.stringify(notificationResults)
  React.useEffect(() => {
    if (
      currentDataString !== JSON.stringify(notifications?.notificationResults || {}) ||
      notificationLoading !== notifications?.notificationLoading
    ) {
      //   console.log('setting this again')
      setNotifications({
        notificationResults: notificationResults || [],
        size,
        setSize,
        rawNotificationResults,
        mutateNotifications,
        totalNotificationResults,
        totalUnviewedResults,
        notificationLoading,
      })
    }
  }, [currentDataString, notificationLoading])

  React.useEffect(() => {
    // Notify parent window of route changes
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          from: 'featurebase',
          target: 'FeaturebaseEmbed',
          action: 'routeChange',
          url: router.asPath,
        },
        '*'
      )
    }
  }, [router.asPath])

  return (
    <CustomThemeHandler>
      {isIframeContext ? <Script src="/js/iframe-resize.js"></Script> : null}
      {children}
      {requiresMissingPermission?.permission && (
        <PermissionRequiredPopup
          isOpen={requiresMissingPermission ? true : false}
          setOpen={() => setRequiresMissingPermission(undefined)}
          permission={requiresMissingPermission.permission}
        />
      )}
      {upgradePlan?.plan && (
        <PayWallPopup
          isOpen={upgradePlan ? true : false}
          setOpen={() => setUpgradePlan(undefined)}
          title={upgradePlan?.title}
          plan={upgradePlan?.plan}
        />
      )}
    </CustomThemeHandler>
  )
}

export default BoardAndDashboardWrapper
