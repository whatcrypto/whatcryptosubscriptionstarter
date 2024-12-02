import { LockClosedIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import React from 'react'
import { useCurrentOrganization } from '../data/organization'
import { cn } from '@/lib/utils'

const OAuthAuthenticate: React.FC<{
  onClickHandler: () => void
  serviceName: string
  mode: 'register' | 'login'
}> = ({ onClickHandler, serviceName, mode }) => {
  const { org } = useCurrentOrganization()
  const { t } = useTranslation()
  return (
    <div className="w-full">
      <button
        onClick={onClickHandler} //
        className={cn(
          `justify-center relative w-full ${
            serviceName === 'Google'
              ? 'bg-blue-600 border border-blue-600 hover:bg-blue-500 hover:border-blue-500 text-blue-50'
              : 'border-border hover:bg-gray-800 dark:bg-secondary/50 border dark:border-border dark:hover:bg-secondary text-gray-100'
          } ${
            serviceName === 'Discord' &&
            'bg-[#404EED] hover:bg-[#404bc9] dark:bg-[#404EED] text-indigo-50 dark:text-indigo-50 border-[#404EED] hover:dark:bg-[#404bc9] dark:border-[#404EED]'
          }   ${
            serviceName === 'Steam' &&
            'bg-[#171A21] hover:bg-[#252a35] dark:bg-[#171A21] border-[#171A21] hover:dark:bg-[#15171d]  dark:border-[#171A21]'
          } font-semibold`,
          serviceName === 'Github' &&
            'bg-gray-700 hover:bg-gray-700/[85%] dark:border-dark-accent dark:hover:bg-dark-accent/80 border dark:bg-border',
          mode === 'register' && '!p-2'
        )}
      >
        {serviceName === 'Github' && (
          <svg
            className="absolute left-0 ml-3 "
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
          </svg>
        )}
        {serviceName === 'Google' && (
          <svg
            className="absolute left-0 ml-3"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17.788 5.108a9 9 0 1 0 3.212 6.892h-8" />
          </svg>
        )}
        {serviceName === 'SSO' && (
          <div className="absolute left-0 ml-3">
            <LockClosedIcon width={24} height={24}></LockClosedIcon>
          </div>
        )}
        {serviceName === 'Discord' && (
          <svg
            className="absolute left-0 w-6 h-6 ml-3 text-indigo-100"
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
              />
            </g>
          </svg>
        )}
        {serviceName === 'Steam' && (
          <svg
            version="1.1"
            className="absolute left-0 w-6 h-6 ml-3 text-gray-200"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 88.3 88.5"
            xmlSpace="preserve"
          >
            <g fill="currentColor">
              <path
                className="st0"
                d="M44.1,0C20.8,0,1.8,17.9,0,40.7l23.7,9.8c2-1.4,4.4-2.2,7-2.2c0.2,0,0.5,0,0.7,0L42,33.1c0-0.1,0-0.1,0-0.2 c0-9.2,7.5-16.7,16.7-16.7c9.2,0,16.7,7.5,16.7,16.7s-7.5,16.7-16.7,16.7c-0.1,0-0.3,0-0.4,0l-15,10.7c0,0.2,0,0.4,0,0.6 c0,6.9-5.6,12.5-12.5,12.5c-6.1,0-11.1-4.3-12.3-10.1l-17-7c5.2,18.6,22.3,32.2,42.6,32.2c24.4,0,44.2-19.8,44.2-44.2 C88.3,19.8,68.5,0,44.1,0"
              />
              <path
                className="st0"
                d="M27.7,67.1l-5.4-2.2c1,2,2.6,3.7,4.8,4.6c4.8,2,10.3-0.3,12.3-5.1c1-2.3,1-4.9,0-7.2c-1-2.3-2.8-4.1-5.1-5.1 c-2.3-1-4.8-0.9-6.9-0.1l5.6,2.3c3.5,1.5,5.2,5.5,3.7,9C35.3,66.9,31.2,68.6,27.7,67.1"
              />
              <path
                className="st0"
                d="M69.8,32.8c0-6.1-5-11.1-11.1-11.1c-6.1,0-11.1,5-11.1,11.1c0,6.1,5,11.1,11.1,11.1 C64.8,43.9,69.8,39,69.8,32.8 M50.3,32.8c0-4.6,3.7-8.3,8.4-8.3s8.4,3.7,8.4,8.3s-3.7,8.3-8.4,8.3S50.3,37.4,50.3,32.8"
              />
            </g>
          </svg>
        )}
        {t('continue-with-service', { serviceName })}
        {/* {`Continue with ${serviceName}`} */}
      </button>
    </div>
  )
}

export default OAuthAuthenticate
