import { LogoutIcon, OfficeBuildingIcon, UserCircleIcon } from '@heroicons/react/solid'
import React from 'react'
import { useUser } from '../data/user'
import Loader from './Loader'
import Image from "next/legacy/image"
import { logOut } from '../../network/lib/user'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { useCurrentOrganization } from '../data/organization'
import PublicTheme from './PublicTheme'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './radix/DropdownMenu'
import { useAtom } from 'jotai'
import { forcedThemeAtom } from '@/atoms/orgAtom'
import { getAccessToken } from 'network/apiClient'
import { Mixpanel } from '@/lib/mixpanel'
import { isMember } from '@/lib/acl'
import { cn } from '@/lib/utils'
const ProfileDropdown: React.FC<{
  xSmall?: boolean
  small?: boolean
  myProfileCallback?: () => any
}> = ({ small, myProfileCallback, xSmall }) => {
  const { user } = useUser()
  const { org } = useCurrentOrganization()
  const router = useRouter()
  const { t } = useTranslation()
  // const [profileSettings, setProfileSettings] = useState(false)
  const [forcedTheme, setForcedTheme] = useAtom(forcedThemeAtom)

  return (
    <div className="relative flex items-center flex-shrink-0">
      {/* <ProfileSettingsModal open={profileSettings} setOpen={setProfileSettings} /> */}
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex p-0 text-sm rounded-full shadow-none dark:bg-transparent ring-transparent hover:bg-transparent focus:ring-0">
            <span className="sr-only">Open user menu</span>
            <div
              className={cn(
                'flex items-center justify-center overflow-hidden bg-gray-100 rounded-full dark:bg-secondary',
                small ? 'h-[30px] w-[30px]' : 'h-9 w-9',
                xSmall ? 'h-[28px] w-[28px]' : ''
              )}
            >
              {user?.profilePicture ? (
                <Image
                  unoptimized
                  className={cn(
                    'object-cover rounded-full',
                    small ? 'h-[30px] w-[30px]' : 'h-9 w-9'
                  )}
                  src={user?.profilePicture}
                  height={36}
                  width={36}
                  alt="profile_pic"
                />
              ) : (
                <div className="flex items-center justify-center w-5 h-5 text-gray-400 dark:text-background-accent">
                  <Loader />
                </div>
              )}
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-52" align="end">
          <DropdownMenuItem
            onSelect={() => {
              if (myProfileCallback) {
                myProfileCallback()
                return
              }
              const accessToken = getAccessToken()
              let href = '/u/' + user?.id
              let hrefWithAppendedToken = href
              if (accessToken) {
                const url = new URL(href.toString(), window.location.origin)
                url.searchParams.append('jwt', accessToken)
                hrefWithAppendedToken = url.toString() // Convert URL object to string
              }

              router.push(hrefWithAppendedToken, href)
            }}
          >
            <UserCircleIcon className="h-4 w-4 mr-1.5 secondary-svg" />
            {t('my-profile')}
          </DropdownMenuItem>

          {(forcedTheme === 'client' || forcedTheme === undefined) && <PublicTheme />}
          {!myProfileCallback && (
            <DropdownMenuItem
              onSelect={() => {
                window.open(`https://auth.featurebase.app/choose-org`, '_blank')
              }}
            >
              <OfficeBuildingIcon className="h-4 w-4 mr-1.5 secondary-svg" />
              {t('my-organizations')}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onSelect={() =>
              logOut().then(() => {
                Mixpanel.reset()
                router.reload()
              })
            }
          >
            <LogoutIcon className="h-4 w-4 mr-1.5 secondary-svg" />
            {t('sign-out')}
          </DropdownMenuItem>
          {!org?.whitelabel && !isMember(user?.id, org) ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => {
                  window.open(
                    `https://featurebase.app?utm_source=${org.name}&utm_medium=feedback-board-profile-dropdown&utm_campaign=powered-by&utm_id=${org?.id}`,
                    '_blank'
                  )
                }}
              >
                {t('create-your-own-feedback-board')}
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export default ProfileDropdown
