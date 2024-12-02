import React from 'react'
import PopupWrapper from './PopupWrapper'
import { InformationCircleIcon } from '@heroicons/react/solid'
import { useCurrentOrganization } from '../data/organization'
import CreateTrialButton from './CreateTrialButton'
import { isPlan } from '@/lib/utils'

const DeeperInsightPopup: React.FC<{ isOpen: boolean; setOpen: Function }> = ({
  isOpen,
  setOpen,
}) => {
  const { org } = useCurrentOrganization()
  return (
    <PopupWrapper isOpen={isOpen} setIsOpen={setOpen}>
      <h2 className="flex items-center text-lg font-semibold text-gray-600 dark:text-white">
        Get deeper insights by syncing user data with Featurebase
      </h2>
      <p className="mt-1.5 text-sm text-gray-400 dark:text-foreground ">
        Sync your customer data with Featurebase to view and segment feedback by monthly revenue,
        payment plan, and custom attributes.
      </p>
      <div className="relative mt-4 ">
        {!isPlan(org?.plan, 'pro') ? (
          <div className="absolute inset-0 z-20 -m-2 overflow-hidden rounded-md dark:m-0 bg-white/90 dark:bg-secondary/95">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center justify-between mb-4">
                <CreateTrialButton plan={'pro'} />
              </div>
            </div>
          </div>
        ) : null}
        <div className="grid grid-cols-2 text-gray-600 dark:text-white">
          <div className="p-4 rounded-md shadow-md bg-gray-50 up-element dark:bg-secondary dark:border-dark-accent">
            <p className="text-base font-medium">Use SDK</p>
            <p className="text-sm text-gray-400 mt-1.5 dark:text-gray-100">
              Embed our SDK in your website to sync data.
            </p>
            <a
              href="https://help.featurebase.app/en/help/articles/2796697-install-featurebase"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <button className="mt-2 text-xs dashboard-secondary dark:bg-white/5 dark:hover:bg-white/10">
                View documentation
              </button>
            </a>{' '}
            <p className="pt-3 mt-3 text-xs text-gray-400 border-t border-gray-100 dark:border-white/10 dark:text-gray-100">
              This is the recommended way, since the data is much easier to keep in sync with
              Featurebase.
            </p>
          </div>
          <div className="p-4 pl-6">
            <p className="text-base font-medium">Use API (Business)</p>
            <p className="text-sm max-w-[160px] text-gray-400 mt-1.5 dark:text-foreground">
              Sync user data with our API.
            </p>
            <a
              className="inline-block"
              href="https://docs.featurebase.app/identify"
              target="_blank"
              rel="noreferrer"
            >
              <button className="mt-2 text-xs dashboard-secondary">View documentation</button>
            </a>
            <p className="pt-3 mt-3 text-xs text-gray-400 border-t border-gray-100 dark:border-white/10 dark:text-foreground">
              Great for initially importing data, but it can be difficult to always keep data in
              sync with Featurebase.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="w-5 h-5 text-accent" aria-hidden="true" />
          </div>
          <div className="ml-2">
            <h3 className="text-sm font-medium text-accent-foreground dark:text-white/90">
              This setup should take less than 10 minutes for an engineer.
            </h3>
          </div>
        </div>
      </div>
    </PopupWrapper>
  )
}

export default DeeperInsightPopup
