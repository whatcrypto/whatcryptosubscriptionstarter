import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import Notification from './Notification'
import { isTestingEnv } from '../atoms/authAtom'
import { Toaster, resolveValue } from 'react-hot-toast'
import { Toaster as SonnerToaster } from '@/components/radix/Toaster'
import { Transition } from '@headlessui/react'
import {
  domainTypeAtom,
  forcedThemeAtom,
  helpCenterUrlPartsAtom,
  hideLogoAtom,
  hidePublicMenuAtom,
  meilisearchClientAtom,
  metaDataAtom,
  missingPermissionAtom,
  showIntercomChatAtom,
  upgradePlanAtom,
} from '../atoms/orgAtom'
import { useRouter } from 'next/router'
import axiosClient, {
  setAccessToken,
  setTinybirdFallbackSessionId,
  setTinybirdToken,
} from '../../network/apiClient'
import { useCurrentOrganization } from '@/data/organization'
import DashboardLoadingPage from './DashboardLoadingPage'
import { ThemeProvider, useTheme } from 'next-themes'
import { useHydrateAtoms } from 'jotai/utils'
import { useUser } from '@/data/user'
import { parseMetadataJson } from '@/lib/utils'
import { IntercomProvider } from 'react-use-intercom'
import { isMountedAtom } from '@/atoms/editorAtom'
import { analyticsEventOriginAtom } from '@/atoms/widgetAtom'
import Head from 'next/head'
import { createCSP } from '@/lib/contentSecurityPolicy'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

export const updateAxiosToken = (token: string) => {
  setAccessToken(token)
}

const AppWrapper: React.FC<{
  children: React.ReactNode
  Component: any
  pageProps: any
  alwaysShowChat?: boolean
}> = ({ children, Component, pageProps, alwaysShowChat }) => {
  const [metaData, setMetaData] = useAtom(metaDataAtom)
  const [testingEnv, setTestingEnv] = useAtom(isTestingEnv)
  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)
  const [requiresMissingPermission, setRequiresMissingPermission] = useAtom(missingPermissionAtom)
  const [isMounted, setIsMounted] = useAtom(isMountedAtom)
  const [urlParts, setUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const [payWall, setPayWall] = useState(false)

  const { theme = 'system' } = useTheme()

  useHydrateAtoms([
    [forcedThemeAtom, pageProps?.defaultTheme],
    [hidePublicMenuAtom, pageProps?.queryParams?.hideMenu === 'true' ? true : false],
    [hideLogoAtom, pageProps?.queryParams?.hideLogo === 'true' ? true : false],
    [domainTypeAtom, pageProps?.domainType === 'helpcenter' ? 'helpcenter' : 'feedback'],
    [
      helpCenterUrlPartsAtom,
      pageProps?.helpCenterUrlParts
        ? pageProps?.helpCenterUrlParts
        : { subpath: '/help/', locale: 'en', helpCenterId: '', articleId: '' },
    ],
    [
      metaDataAtom,
      pageProps?.queryParams?.metaData
        ? parseMetadataJson(pageProps?.queryParams?.metaData)
        : undefined,
    ],
    [
      analyticsEventOriginAtom,
      pageProps?.analyticsEventOrigin ? pageProps?.analyticsEventOrigin : 'portal',
    ],
    ...(pageProps?.meilisearchApiKey
      ? [
          [
            meilisearchClientAtom,
            instantMeiliSearch(
              process.env.NEXT_PUBLIC_MEILISEARCH_HOST as string,
              pageProps?.meilisearchApiKey
            ).searchClient,
          ] as [any, any],
        ]
      : []),
  ])

  setTinybirdFallbackSessionId()
  setAccessToken(pageProps?.queryParams?.jwt ? pageProps?.queryParams?.jwt : '')

  // This has to be after the useHydrateAtoms call
  const [defaultTheme, setDefaultTheme] = useAtom(forcedThemeAtom)
  const [showChat, setShowChat] = useAtom(showIntercomChatAtom)

  const router = useRouter()
  const { org } = useCurrentOrganization()
  const { user } = useUser()

  useEffect(() => {
    if (
      pageProps?.helpCenterUrlParts &&
      JSON.stringify(pageProps?.helpCenterUrlParts) !== JSON.stringify(urlParts)
    ) {
      setUrlParts(pageProps?.helpCenterUrlParts)
    }
  }, [JSON.stringify(pageProps?.helpCenterUrlParts), JSON.stringify(urlParts)])

  // useEffect(() => {
  //   if (pageProps?.queryParams?.jwt) {
  //     // console.log('Settings jwt token in axios', pageProps?.queryParams?.jwt)
  //     updateAxiosToken(pageProps?.queryParams?.jwt)
  //   }
  // }, [
  //   pageProps?.queryParams?.jwt,
  //   pageProps?.queryParams?.embed,
  //   org,
  //   axiosClient?.interceptors?.request,
  // ])
  // updateAxiosToken(pageProps?.queryParams?.jwt)

  useEffect(() => {
    if (pageProps?.queryParams?.embed) {
      if (org && org.plan === 'free' && new Date(org?.createdAt) > new Date('2024-02-03')) {
        setPayWall(true)
      }
    }
  }, [org, pageProps?.queryParams?.embed])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const via = urlParams.get('via')

    axiosClient.interceptors.response.use(
      (response) => {
        // If there's no error, just return the response
        return response
      },
      (error) => {
        // Check if there's an error and if it includes "free"
        if (error.response?.data?.requiresPlanUpgrade) {
          setUpgradePlan({
            plan: org?.plan === 'pro' ? 'premium' : 'pro',
            title: 'This feature is',
          })
        }
        if (error.response?.data?.requiresMissingPermission) {
          setRequiresMissingPermission({
            permission: error.response?.data?.requiresMissingPermission,
          })
        }

        // Always return the error to keep the promise chain consistent
        return Promise.reject(error)
      }
    )
  }, [org?.plan])

  // useEffect(() => {
  //   let subdomain = ''

  //   try {
  //     subdomain = window?.location?.hostname?.split('.')?.[0]
  //   } catch (error) {}
  //   // isMember(user?.id, org) ||
  //   if (window.top === window.self) {
  // Sentry.init({
  //   dsn: 'https://acd1a34d390f4d35bf395c8f8d0fa1bd@o4504213851144192.ingest.sentry.io/4504213853175808',
  //   // Adjust this value in production, or use tracesSampler for greater control
  //   tracesSampleRate: 0,
  //   // Note: if you want to override the automatic release value, do not set a
  //   // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  //   // that it will also get attached to your source maps
  //   // This sets the sample rate to be 10%. You may want this to be 100% while
  //   // in development and sample at a lower rate in production
  //   replaysSessionSampleRate: 0,
  //   // If the entire session is not sampled, use the below sample rate to sample
  //   // sessions when an error occurs.
  //   replaysOnErrorSampleRate: 1.0,
  //   ignoreErrors: ['Non-Error exception captured', 'Non-Error promise rejection captured'],
  //   enableTracing: false,
  //   enabled: process.env.NODE_ENV !== 'development',
  //   denyUrls: [
  //     // Facebook flakiness
  //     /graph\.facebook\.com/i,
  //     // Facebook blocked
  //     /connect\.facebook\.net\/en_US\/all\.js/i,
  //     // Woopra flakiness
  //     /eatdifferent\.com\.woopra-ns\.com/i,
  //     /static\.woopra\.com\/js\/woopra\.js/i,
  //     // Chrome extensions
  //     /extensions\//i,
  //     /^chrome:\/\//i,
  //   ],
  // })
  //   }
  // }, [org, user, router?.pathname])
  useEffect(() => {
    let subdomain = ''

    try {
      subdomain = window?.location?.hostname?.split('.')?.[0]
    } catch (error) {}

    if (window.top === window.self && !router.pathname.startsWith('/widget/')) {
      import('@sentry/nextjs').then((Sentry) => {
        Sentry.init({
          dsn: 'https://acd1a34d390f4d35bf395c8f8d0fa1bd@o4504213851144192.ingest.sentry.io/4504213853175808',
          // Adjust this value in production, or use tracesSampler for greater control
          tracesSampleRate: 0,
          // Note: if you want to override the automatic release value, do not set a
          // `release` value here - use the environment variable `SENTRY_RELEASE`, so
          // that it will also get attached to your source maps
          // This sets the sample rate to be 10%. You may want this to be 100% while
          // in development and sample at a lower rate in production
          replaysSessionSampleRate: 0,
          // If the entire session is not sampled, use the below sample rate to sample
          // sessions when an error occurs.
          replaysOnErrorSampleRate: 1.0,
          ignoreErrors: ['Non-Error exception captured', 'Non-Error promise rejection captured'],
          enableTracing: false,
          enabled: process.env.NODE_ENV !== 'development',
          denyUrls: [
            // Facebook flakiness
            /graph\.facebook\.com/i,
            // Facebook blocked
            /connect\.facebook\.net\/en_US\/all\.js/i,
            // Woopra flakiness
            /eatdifferent\.com\.woopra-ns\.com/i,
            /static\.woopra\.com\/js\/woopra\.js/i,
            // Chrome extensions
            /extensions\//i,
            /^chrome:\/\//i,
          ],
        })
      })
    }
  }, [org, user, router?.pathname])

  useEffect(() => {
    let interceptor: any
    if (org?.csrfToken) {
      interceptor = axiosClient.interceptors.request.use((config) => {
        if (config.method === 'get') return config
        // if we don't already have set the x-csrf-token header, set it
        if (!config.headers) config.headers = {}
        if (!config.headers!['x-csrf-token']) config.headers!['x-csrf-token'] = org.csrfToken

        return config
      })
    }

    return () => {
      if (interceptor !== undefined) {
        axiosClient.interceptors.request.eject(interceptor)
      }
    }
  }, [org?.csrfToken])

  useEffect(() => {
    setIsMounted(true)
    window.addEventListener(
      'message',
      (event) => {
        if (event.data.type === 'auth') {
          updateAxiosToken(event.data.jwt)
        }
      },
      false
    )
    // Supported via the widget for adding extra data to a user
    window.addEventListener(
      'message',
      (e) => {
        e.preventDefault()
        if (!e.data) return
        if (e?.data?.data?.type === 'metadata') {
          setMetaData(e.data.data.metadata)
        }
      },
      false
    )

    // Post message saying the app is ready
    try {
      window.parent.postMessage({ target: 'FeaturebaseEmbed', action: 'widgetReady' }, '*')
    } catch (e) {
      console.warn('Could not send widgetReady message to parent window')
    }
  }, [])

  if (payWall) {
    return (
      <div>
        <div className="p-6 ">
          <p className="text-lg font-medium text-gray-600 dark:text-gray-50">
            Not available with the free plan
          </p>
          <p className="max-w-xs mt-1 text-sm text-gray-400 dark:text-foreground">
            Please upgrade your account to Starter to use this feature.
          </p>
        </div>
      </div>
    )
  }

  const allowAllCsp =
    router.pathname.includes('/dashboard/changelog') ||
    router.pathname.includes('/dashboard/articles')

  return (
    <IntercomProvider shouldInitialize={showChat || alwaysShowChat} appId={'stpthwlv'}>
      <ThemeProvider
        storageKey="theme"
        enableSystem={true}
        themes={['light', 'dark']}
        disableTransitionOnChange={true}
        forcedTheme={
          Component.theme ||
          (defaultTheme !== 'client' && !router.pathname.startsWith('/dashboard')
            ? defaultTheme
            : undefined)
        }
        attribute="class"
      >
        <Head>
          <meta
            httpEquiv="Content-Security-Policy"
            content={createCSP({ allowAllIframes: true })}
          />
        </Head>
        <Toaster position="bottom-right">
          {(t) => (
            <Transition
              appear={true}
              show={t.visible}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100 "
              leave="ease-in duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Notification
                title={t.type}
                isError={t.type === 'error'}
                content={resolveValue(t.message, t)}
              />
            </Transition>
          )}
        </Toaster>
        <SonnerToaster />

        {/* <SonnerToaster
          duration={1800}
          theme={theme as any}
          offset={10}
          // className="mr-8 group"
          toastOptions={{
            classNames: {
              icon: 'group-[.toast]:text-foreground/60',

              toast:
                'group toast group-[.toaster]:dropdown-background group-[.toaster]:text-foreground group-[.toaster]:shadow-lg',
              description: 'group-[.toast]:text-muted-foreground',
              actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
              cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
              error: 'group-[.toast]:bg-rose-500 group-[.toast]:text-rose-50',
              warning: 'group-[.toast]:bg-yellow-500 group-[.toast]:text-yellow-50',
            },
          }}
        /> */}

        {router.pathname.startsWith('/dashboard') && !org ? <DashboardLoadingPage /> : children}
      </ThemeProvider>
    </IntercomProvider>
  )
}

export default AppWrapper

// if (urlParams?.get('skipRecaptchaSecret')) {
//   setTestingEnv(true)
//   axiosClient.interceptors.request.use((config) => {
//     // Get the secret from the URL
//     const urlParams = new URLSearchParams(window.location.search)
//     const skipRecaptchaSecret = urlParams.get('skipRecaptchaSecret')

//     // Only add the secret to requests that can accept a body
//     if (config.data && skipRecaptchaSecret && config?.method?.toLowerCase() === 'post') {
//       // Check the existing data type
//       if (typeof config.data === 'string') {
//         // If it's a string, try to parse it as JSON
//         try {
//           const jsonData = JSON.parse(config.data)
//           config.data = JSON.stringify({
//             ...jsonData,
//             skipRecaptchaSecret: skipRecaptchaSecret,
//           })
//         } catch (error) {
//           // Handle cases where the payload is not JSON
//           console.error('Could not parse request data as JSON:', error)
//         }
//       } else if (typeof config.data === 'object' && !(config.data instanceof FormData)) {
//         // If it's an object (but not FormData), add the secret directly
//         config.data.skipRecaptchaSecret = skipRecaptchaSecret
//       } else if (config.data instanceof FormData) {
//         // If it's FormData, append the secret
//         config.data.append('skipRecaptchaSecret', skipRecaptchaSecret)
//       }
//     }

//     return config
//   })
// }
