import { MoonIcon, SunIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import { useTheme } from 'next-themes'
import React, { useEffect, useState } from 'react'
import { DropdownMenuItem } from './radix/DropdownMenu'

const PublicTheme: React.FC<{ register?: boolean }> = ({ register = false }) => {
  const { theme, setTheme, systemTheme } = useTheme()

  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const activeTheme = theme !== 'dark' && theme !== 'light' ? systemTheme : theme

  if (register) {
    return (
      <button
        onClick={() => {
          if (theme !== 'dark' && theme !== 'light') {
            setTheme(systemTheme === 'dark' ? 'light' : 'dark')
          } else {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }
        }}
        className={`${
          !register
            ? 'rounded-full flex items-center justify-center relative dashboard-secondary-rounded h-9 w-9 p-[7px]'
            : 'dashboard-secondary'
        }  p-[7px]`}
      >
        {activeTheme === 'dark' ? (
          <SunIcon className="w-5 h-5 secondary-svg" />
        ) : (
          <MoonIcon className="w-5 h-5 secondary-svg" />
        )}{' '}
        {register && (
          <span className="first-letter:capitalize ml-1.5">
            {activeTheme === 'dark' ? t('light-mode') : t('dark-mode')}
          </span>
        )}
      </button>
    )
  } else {
    return (
      <DropdownMenuItem
        onClick={() => {
          if (theme !== 'dark' && theme !== 'light') {
            setTheme(systemTheme === 'dark' ? 'light' : 'dark')
          } else {
            setTheme(theme === 'dark' ? 'light' : 'dark')
          }
        }}
      >
        {activeTheme === 'dark' ? (
          <SunIcon className="h-4 w-4 mr-1.5 secondary-svg" />
        ) : (
          <MoonIcon className="h-4 w-4 mr-1.5 secondary-svg" />
        )}{' '}
        {activeTheme === 'dark' ? t('light-mode') : t('dark-mode')}
      </DropdownMenuItem>
    )
  }
}

export default PublicTheme
