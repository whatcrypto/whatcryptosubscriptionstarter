import { useCurrentOrganization } from '@/data/organization'
import { getPlanName } from '@/lib/utils'
import {
  CheckCircleIcon,
  ArrowRightIcon,
  InformationCircleIcon,
  ExternalLinkIcon,
} from '@heroicons/react/solid'
import React from 'react'
import { useIntercom } from 'react-use-intercom'
import CreateTrialButton from './CreateTrialButton'
import Link from 'next/link'
import SimpleTooltip from './SimpleTooltip'
import featuresByPlan from '@/data/featuresByPlan'
import Feature from './PaywallFeature'

const PayWallContent: React.FC<{ title: string; plan: string; setOpen?: Function }> = ({
  title,
  plan,
  setOpen,
}) => {
  if (plan === 'starter') {
    plan = 'pro'
  }
  const { org } = useCurrentOrganization()
  const { show } = useIntercom()

  const getFeatures = (plan: string) => {
    if (plan === 'pro') {
      return featuresByPlan?.['starter']
    }
    // @ts-ignore
    return featuresByPlan?.[plan] || []
  }

  const features = getFeatures(plan)

  return (
    <div>
      <h1 className="text-lg max-w-[400px] font-semibold text-gray-600 dark:text-white sm:text-xl">
        {title} not available with the{' '}
        <span className={'first-letter:uppercase'}>{getPlanName(org?.plan)}</span> plan
      </h1>

      <p className="max-w-sm mt-3 text-sm font-medium text-gray-600 dark:text-foreground">
        Upgrade to <span className="capitalize">{getPlanName(plan)}</span> to unlock:
      </p>
      <div className="grid gap-3 mt-3 font-medium sm:grid-cols-8">
        {features.map((feature: any, index: any) => (
          <Feature key={index} feature={feature} />
        ))}
      </div>
      <div className="flex items-center justify-end gap-3  mt-6">
        <div>
          <a
            tabIndex={-1}
            className="dark:text-gray-200/80 text-gray-400 decoration-gray-400/60 dark:decoration-gray-200/60 link-style hover:text-gray-600 text-sm inline-flex items-center main-transition dark:hover:text-gray-100/80"
            href="https://www.featurebase.app/pricing"
            target="_blank"
            rel="noreferrer"
          >
            Compare all features <ExternalLinkIcon className="w-4 h-4 ml-1 opacity-60" />
          </a>
        </div>
        {(() => {
          if (org?.subscriptionStatus === 'free' || org?.subscriptionStatus === 'trial') {
            if (plan === 'premium' || plan === 'growth' || plan === 'pro') {
              return <CreateTrialButton successCallback={() => setOpen && setOpen()} plan={plan} />
            }
          }
          if (plan === 'enterprise') {
            return (
              <button className="ml-auto dashboard-primary" onClick={() => show()}>
                Contact us
              </button>
            )
          }
          return (
            <Link legacyBehavior href="/dashboard/settings/pricing">
              <button
                onClick={() => {
                  setOpen && setOpen()
                }}
                className="ml-auto dashboard-primary"
              >
                Upgrade now
              </button>
            </Link>
          )
        })()}
      </div>
    </div>
  )
}

export default PayWallContent
