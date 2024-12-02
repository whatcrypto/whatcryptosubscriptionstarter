import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import Script from 'next/script'
import React, { useEffect } from 'react'
import { useIntercom } from 'react-use-intercom'
import { KeyedMutator } from 'swr'
import { getAlgoliaKey } from '../../network/lib/organization'
import { createPostAtom } from '../atoms/displayAtom'
import {
  meilisearchClientAtom,
  searchKeyAtom,
  showIntercomChatAtom,
  upgradePlanAtom,
} from '../atoms/orgAtom'
import { useCurrentOrganization } from '../data/organization'
import { useUser } from '../data/user'
import { ISubmission, ISubmissionPaginate } from '../interfaces/ISubmission'
import CreatePost from './CreatePost'
import DashboardLoadingPage from './DashboardLoadingPage'
import DashboardUpperBar from './DashboardUpperBar'
import DashboardVerticalMenu from './DashboardVerticalMenu'
import SeoMetaDashboard from './SeoMetaDashboard'
import { IOrganization } from '../interfaces/IOrganization'
import { useTheme } from 'next-themes'
import PayWallPopup from './PayWallPopup'
import BoardAndDashboardWrapper from './BoardAndDashboardWrapper'
import PopupWrapper from './PopupWrapper'
import { cn, initIntercom } from '@/lib/utils'
import FBAIBot from './FBAIBot'
import SelfServeDropdown from './SelfServeDropdown'
import { can, isMember } from '@/lib/acl'
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import dynamic from 'next/dynamic'
import { capturePageView, initializePostHog } from '@/lib/posthog'

declare global {
  interface Window {
    Featurebase: any
  }
}

// Define the props type
type DashboardWrapperProps = {
  children: React.ReactNode
  title: string
  upperBar: React.ReactNode
  noPadding?: boolean
  mutateSubmissions?: KeyedMutator<any[]>
  rawSubmissionData?: ISubmissionPaginate[] | ISubmissionPaginate | undefined
  submissionResults?: ISubmission[] | undefined
  ChangelogUpperBar?: React.ReactNode
  noWidth?: boolean
  customTitle?: React.ReactNode
  transparentBackground?: boolean
  fixedElement?: React.ReactNode
  allowOverflow?: boolean
  wrapAt2xl?: boolean
  scrollingContainerRef?: React.RefObject<HTMLDivElement>
}

// Extend the component type with the static property
type DashboardWrapperComponent = React.FC<DashboardWrapperProps>

// Implement the component
const DashboardWrapper: DashboardWrapperComponent = ({
  children,
  title,
  upperBar,
  mutateSubmissions,
  rawSubmissionData,
  noPadding = false,
  submissionResults,
  ChangelogUpperBar,
  noWidth = false,
  customTitle,
  transparentBackground,
  fixedElement,
  allowOverflow,
  wrapAt2xl = false,
  scrollingContainerRef,
}) => {
  const [createPost, setCreatePost] = useAtom(createPostAtom)
  const { loggedOut, user } = useUser(true)
  const { org } = useCurrentOrganization()
  const router = useRouter()
  const [meilisearchClient, setMeilisearchClient] = useAtom(meilisearchClientAtom)
  const [searchKey, setSearchKey] = useAtom(searchKeyAtom)
  const { boot } = useIntercom()
  const { theme, systemTheme } = useTheme()
  const activeTheme = theme !== 'dark' && theme !== 'light' ? systemTheme : theme
  const [showChat, setShowChat] = useAtom(showIntercomChatAtom)

  useEffect(() => {
    getAlgoliaKey()
      .then((res) => {
        if (res?.data?.publicKey) {
          setSearchKey(res.data.publicKey)
          setMeilisearchClient(
            instantMeiliSearch(
              process.env.NEXT_PUBLIC_MEILISEARCH_HOST as string,
              res.data.publicKey
            ).searchClient
          )
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }, [user])

  useEffect(() => {
    if (org && user) {
      if (!isMember(user.id, org)) {
        router.push('/login')
      }

      if (org && org.subscriptionStatus === 'trial_ended') {
        if (!router.pathname.includes('settings')) {
          router.push('/dashboard/settings/pricing')
        }
      }
    }
  }, [router, org, user])

  useEffect(() => {
    if (loggedOut) router.push('/login')
  }, [loggedOut, router])

  function objectIdToTimestamp(objectId: string) {
    if (objectId) {
      objectId = objectId.toString()
      return (
        parseInt(objectId.slice(0, 8), 16) * 1000 +
        Math.floor(parseInt(objectId.slice(-6), 16) / 16777.217)
      ) // convert 0x000000 ~ 0xffffff to 0 ~ 999
    } else {
      return 10000
    }
  }
  const getFirstPartOfNameSafely = (name: string) => {
    if (name) {
      return name.split(' ')[0]
    } else {
      return ''
    }
  }

  // adds test+{org.id}@example.com subaddress to email
  const addFeaturebaseSubaddressToEmail = (email: string, org: IOrganization) => {
    try {
      const [name, domain] = email.split('@')
      return `${name}+${org.id}@${domain}`
    } catch (error) {
      return email
    }
  }

  useEffect(() => {
    if (user && org && user.type === 'admin' && can(user?.id, 'manage_billing', org)) {
      const win = window as any
      if (win && win._cio && win._cio.identify) {
        try {
          win._cio.identify({
            // Required attributes
            id: `${user?.id}-${org.id}`, // Create an id that uniquely identifies this user based on the organization id and the user id.
            created_at: Math.floor(objectIdToTimestamp(user?.id) / 1000), // Timestamp in your system that represents when
            name: user?.name, // Insert the user's full name here.
            first_name: getFirstPartOfNameSafely(user?.name), // send name as first_name as well
            // We want to send customerio campaigns on a per-organization per-admin basis. In order to do that, we need to
            // add the organization id to the email address. We do this by adding a subaddress to the email address.
            // In customerio, we are going to send emails to the real_email field, which is the email address without the subaddress.
            // This makes sure that all emails are delivered and that we save costs on custom objects in customerio which would be
            // super costly very quickly.
            email: addFeaturebaseSubaddressToEmail(user.email, org), // Email address of the user with subaddress. Gets past the customerio deduplication.
            real_email: user.email, // Email address of the user without the subaddress.
            board_url: org?.name + '.featurebase.app', // URL to the board
            company_name: org?.displayName, // Name of the org.
            company_subdomain: org?.name, // Subdomain of the org.
            plan: org?.plan,
            subscription_status: org?.subscriptionStatus, // To
            subscription_period: org?.subscriptionPeriod,
            is_owner: org?.owner === user?.id,
            is_admin: true,

            // Strongly recommended attributes
            // the user first signed up. You'll want to send it
            // as seconds since the epoch.

            // Example attributes (you can name attributes what you wish)
          })
        } catch (error) {
          console.error('Customer.io identify crashed', error)
        }
      }
      initIntercom(user, org, boot, setShowChat)
    }
  }, [user, org])

  const getMonthlySpend = (plan: IOrganization['plan']) => {
    switch (plan) {
      case 'free':
        return 0
      case 'pro':
        return 49
      case 'pro_lifetime':
        return 49
      case 'growth':
        return 119
      case 'enterprise':
        return 300
      case 'premium':
        return 249
      default:
        return 0
    }
  }

  function getFirstName(name: string) {
    // Trim the string to remove leading and trailing spaces
    const trimmedName = name?.trim()

    // Split the string by spaces and get the first element
    const firstName = trimmedName?.split(' ')[0]

    return firstName
  }

  useEffect(() => {
    if (user && user.type === 'admin' && org && window?.Featurebase) {
      window.Featurebase('initialize_changelog_widget', {
        organization: 'feedback',
        placement: 'top',
        theme: activeTheme,
        fullscreenPopup: true,
        usersName: getFirstName(user?.name),
        email: user?.email,
        userId: user?.id,
        userHash: user.featurebaseUserHash,
      })
      window.Featurebase(
        'initialize_feedback_widget',
        {
          organization: 'feedback',
          theme: activeTheme,
          userHash: user.featurebaseUserHash,
          email: user?.email,
          userId: user?.id,
        },
        (err: any, data: any) => {
          if (err) {
            console.log(err)
          } else {
            console.log(data)
          }
        }
      )
      window.Featurebase(
        'initialize_survey_widget',
        {
          organization: 'feedback', // required
          placement: 'bottom-right', // optional (bottom-right or bottom-left)
          theme: activeTheme, // optional (light or dark)
          email: user?.email,
          userId: user?.id,
          userHash: user.featurebaseUserHash,
        },
        (err: any) => {
          // Callback function. Called when identify completed.
          if (err) {
            console.error(err)
          } else {
            // console.log("Data sent successfully!");
          }
        }
      )

      const interval = setInterval(() => {
        if (window?.Featurebase && user?.featurebaseUserHash) {
          clearInterval(interval)
          window?.Featurebase(
            'identify',
            {
              organization: 'feedback',
              userHash: user.featurebaseUserHash,
              email: user.email,
              name: user.name,
              id: user.id,
              createdAt: (objectIdToTimestamp(user?.id) / 1000).toString(),
              companies: [
                {
                  id: org?.id,
                  name: org?.displayName,
                  monthlySpend: getMonthlySpend(org?.plan),
                  createdAt: (objectIdToTimestamp(org?.id) / 1000).toString(),
                  customFields: {
                    subscriptionStatus: org?.subscriptionStatus,
                    plan: org?.plan,
                    actualName: org?.name,
                  },
                },
              ],
            },
            (err: any) => {
              console.log(err)
            }
          )
        }
      }, 1000)
      return () => clearInterval(interval) // Cleanup on unmount
    }
  }, [org, user, router.pathname, activeTheme])

  useEffect(() => {
    initializePostHog()
  }, [])

  useEffect(() => {
    const handleRouteChange = () => {
      capturePageView()
    }
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  if (isMember(user?.id, org)) {
    // Paywall if free trial and not owner
    return (
      <div className="DashboardWrapper">
        <FBAIBot />
        <SelfServeDropdown />

        <BoardAndDashboardWrapper>
          <div className="min-h-screen bg-gray-50 dark:bg-background lg:flex">
            <Script
              id="churn"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              !function(){  
                if (!window.churnkey || !window.churnkey.created) {
                  window.churnkey = { created: true };
                  const a = document.createElement('script');
                  a.src = 'https://assets.churnkey.co/js/app.js?appId=28iygjgqs';
                  a.async = true;
                  const b = document.getElementsByTagName('script')[0];
                  b.parentNode.insertBefore(a, b);
                }
              }();
            `,
              }}
            />
            <Script
              id="featurebase-embedding"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              window.FEATUREBASE_ENV="${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'development' : 'production'
              }";
              const SDK_URL = "${
                process.env.NEXT_PUBLIC_ENVIRONMENT === 'development'
                  ? 'https://sdk.fbasedev.com/dist/sdk.js'
                  : 'https://do.featurebase.app/js/sdk.js'
              }";

              !(function (e, t) {
                const a = "featurebase-sdk";
                function n() {
                  if (!t.getElementById(a)) {
                    var e = t.createElement("script");
                    (e.id = a),
                      (e.src = SDK_URL),
                      t
                        .getElementsByTagName("script")[0]
                        .parentNode.insertBefore(e, t.getElementsByTagName("script")[0]);
                  }
                }
                "function" != typeof e.Featurebase &&
                  (e.Featurebase = function () {
                    (e.Featurebase.q = e.Featurebase.q || []).push(arguments);
                  }),
                  "complete" === t.readyState || "interactive" === t.readyState
                    ? n()
                    : t.addEventListener("DOMContentLoaded", n);
              })(window, document);
            `,
              }}
            />

            <Script
              id="rewardful"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              (function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');
              `,
              }}
            />
            {/* Google Tag */}
            <Script async src={`https://www.googletagmanager.com/gtag/js?id=GTM-N38MN8X`} />
            <Script
              id="google-tag-manager"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'GTM-N38MN8X', {
                    page_path: window.location.pathname
                  });
              `,
              }}
            />
            {/* End Google Tag */}
            {can(user?.id, 'manage_billing', org) && (
              <Script
                id="customer-io"
                dangerouslySetInnerHTML={{
                  __html: `var _cio = _cio || [];
    (function() {
      var a,b,c;a=function(f){return function(){_cio.push([f].
      concat(Array.prototype.slice.call(arguments,0)))}};b=["load","identify",
      "sidentify","track","page"];for(c=0;c<b.length;c++){_cio[b[c]]=a(b[c])};
      var t = document.createElement('script'),
          s = document.getElementsByTagName('script')[0];
      t.async = true;
      t.id    = 'cio-tracker';
      t.setAttribute('data-site-id', 'db04a2847242b50fcda8');
      t.src = '/js/customerio.js';
      s.parentNode.insertBefore(t, s);
    })();
  `,
                }}
              />
            )}

            <Script src="https://r.wdfl.co/rw.js" data-rewardful="826f64" />

            <SeoMetaDashboard page={title + ' - Featurebase'} />

            <DashboardVerticalMenu wrapAt2xl={wrapAt2xl} />
            <div
              className={cn(
                '  w-full',
                title !== 'Settings' && 'h-[100dvh] p-2.5',
                wrapAt2xl ? '2xl:pl-[304px]' : 'lg:pl-[304px]'
              )}
            >
              <div
                className={cn(
                  'flex flex-col',
                  title === 'Settings'
                    ? 'bg-transparent h-full dark:bg-transparent'
                    : 'up-element h-full dark:border-border/60 dark:bg-card/50 relative w-full',
                  transparentBackground && 'bg-white/50 dark:bg-card/[25%]'
                )}
              >
                {!noPadding ? (
                  <div
                    className={cn(
                      '',
                      transparentBackground && 'dark:bg-card/50 bg-white rounded-t-lg'
                    )}
                  >
                    <DashboardUpperBar
                      customTitle={customTitle}
                      ChangelogUpperBar={ChangelogUpperBar}
                      title={title}
                    >
                      {upperBar}
                    </DashboardUpperBar>
                    {fixedElement && fixedElement}
                  </div>
                ) : fixedElement ? (
                  <div
                    className={cn(
                      '',
                      transparentBackground && 'dark:bg-card/50 rounded-t-lg bg-white'
                    )}
                  >
                    {fixedElement}
                  </div>
                ) : null}
                <div
                  ref={scrollingContainerRef}
                  className={cn(
                    'max-h-full w-full mx-auto flex-1 custom-scrollbar-stronger',
                    title === 'Settings' && 'py-6 px-6',
                    allowOverflow
                      ? ''
                      : title.includes('Posts')
                      ? 'overflow-hidden'
                      : 'overflow-auto'
                  )}
                >
                  {children}
                </div>
              </div>
            </div>
            <PopupWrapper
              hasPadding={false}
              fixToTop={true}
              isOpen={createPost}
              setIsOpen={setCreatePost}
              medium={true}
            >
              <CreatePost
                isOpen={createPost}
                mutateSubmissions={mutateSubmissions}
                setIsOpen={setCreatePost}
                rawSubmissionData={rawSubmissionData}
                submissionResults={submissionResults}
              />
            </PopupWrapper>
          </div>
        </BoardAndDashboardWrapper>
      </div>
    )
  }
  return <DashboardLoadingPage />
}

export default DashboardWrapper
