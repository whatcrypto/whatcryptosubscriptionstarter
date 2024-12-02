import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import {
  ChatAlt2Icon,
  CodeIcon,
  QuestionMarkCircleIcon,
  RefreshIcon,
  StatusOnlineIcon,
  SwitchVerticalIcon,
  XIcon,
} from '@heroicons/react/solid'
import { isPlan } from '@/lib/utils'
import { useAtom } from 'jotai'
import { chatWithAIAtom, upgradePlanAtom } from '@/atoms/orgAtom'
import { useCurrentOrganization } from '@/data/organization'
import { useIntercom } from 'react-use-intercom'
import { IOrganization } from '@/interfaces/IOrganization'
import { useUser } from '@/data/user'
import { authenitcateModalAtom } from '@/atoms/authAtom'

const SelfServeDropdown: React.FC<{ customOrg?: IOrganization }> = ({ customOrg }) => {
  const { org: currentOrg } = useCurrentOrganization()

  const org = customOrg || currentOrg

  const [chatWithAI, setChatWithAI] = useAtom(chatWithAIAtom)

  const { show, isOpen, hide } = useIntercom()

  const { user } = useUser()

  const [upgradePlan, setUpgradePlan] = useAtom(upgradePlanAtom)
  const [authenitcateModal, setAuthenitacteModal] = useAtom(authenitcateModalAtom)

  return chatWithAI || isOpen ? (
    <button
      onClick={() => {
        setChatWithAI(false)
        if (isOpen) {
          hide()
        }
      }}
      className="fixed z-40 flex items-center justify-center w-10 h-10 p-0 rounded-full bottom-6 right-6 dashboard-secondary"
    >
      <XIcon className="!w-5 !h-5 !text-gray-400 dark:!text-gray-200/80" />
    </button>
  ) : (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="fixed z-40 flex items-center justify-center w-10 h-10 p-0 rounded-full bottom-6 right-6 dashboard-secondary">
          {chatWithAI ? (
            <XIcon className="!w-5 !h-5 !text-gray-400 dark:!text-gray-200/80" />
          ) : (
            <QuestionMarkCircleIcon className="!w-5 !h-5 !text-gray-400 dark:!text-gray-200/80" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => {
            // Open help center in new tab
            window.open('https://feedback.featurebase.app/changelog', '_blank')
          }}
        >
          <RefreshIcon className="secondary-svg mr-2.5" />
          Latest updates
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            // Open help center in new tab
            window.open('https://feedback.featurebase.app/', '_blank')
          }}
        >
          <SwitchVerticalIcon className="secondary-svg mr-2.5" />
          Vote on features
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            // Open help center in new tab
            window.open(
              'https://help.featurebase.app/en/help/collections/8270391-developers',
              '_blank'
            )
          }}
        >
          <CodeIcon className="secondary-svg mr-2.5" />
          Developer documentation
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            // Open help center in new tab
            window.open('https://help.featurebase.app/', '_blank')
          }}
        >
          <QuestionMarkCircleIcon className="secondary-svg mr-2.5" />
          Help center
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            // Open help center in new tab
            window.open('https://discord.com/invite/9wFwqHW4HZ', '_blank')
          }}
        >
          <svg
            className="secondary-svg mr-2.5"
            viewBox="0 -28.5 256 256"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            preserveAspectRatio="xMidYMid"
          >
            <g>
              <path
                d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z"
                fill="currentColor"
                fillRule="nonzero"
              ></path>
            </g>
          </svg>
          Join our community
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => {
            window.postMessage({
              target: 'FeaturebaseWidget',
              data: { action: 'openFeedbackWidget' },
            })
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="secondary-svg mr-2.5"
          >
            <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.897 28.897 0 0 0 15.293-7.155.75.75 0 0 0 0-1.114A28.897 28.897 0 0 0 3.105 2.288Z" />
          </svg>
          Contact us
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => {
            user ? setChatWithAI(true) : setAuthenitacteModal(true)
          }}
        >
          <ChatAlt2Icon className="secondary-svg mr-2.5" />
          Chat with assistant
        </DropdownMenuItem>
        {isPlan(org?.plan, 'growth') && org?.subscriptionStatus !== 'trial_ended' ? (
          <DropdownMenuItem
            onSelect={() => {
              !isPlan(org?.plan, 'growth')
                ? setUpgradePlan({ plan: 'growth', title: 'Live chat is' })
                : show()
            }}
          >
            <StatusOnlineIcon className="secondary-svg mr-2.5" />
            Live chat
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default SelfServeDropdown
