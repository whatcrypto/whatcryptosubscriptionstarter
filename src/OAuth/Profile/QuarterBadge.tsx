import { CalendarIcon } from '@heroicons/react/solid'
import React, { useEffect } from 'react'
// import Tooltip from './Tooltip'
import { getETADate } from './MainPostView'
import { useTranslation } from 'next-i18next'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './radix/Tooltip'
import { retrieveDateWithoutTimezone } from '@/lib/utils'

const QuarterBadge: React.FC<{ date: Date; small?: boolean; timezone?: string }> = ({
  date,
  small,
  timezone,
}) => {
  const [isClient, setClient] = React.useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    setClient(true)
  }, [])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={
              small
                ? 'text-xs inline-flex flex-shrink-0 space-x-1 items-center font-medium text-gray-400 dark:text-foreground'
                : 'raised-badge'
            }
          >
            <CalendarIcon className="h-3.5 w-3.5 mr-1 -ml-0.5 text-background-accent/50 dark:text-background-accent" />

            {getETADate(
              retrieveDateWithoutTimezone(date),
              i18n.language === 'default' ? 'en' : i18n.language,
              true,
              timezone
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          {isClient ? (
            <p className="text-[11px] text-background-accent dark:text-foreground font-medium">
              Due on{' '}
              {getETADate(
                retrieveDateWithoutTimezone(date),
                i18n.language === 'default' ? 'en' : i18n.language,
                true,
                timezone
              )}
            </p>
          ) : null}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default QuarterBadge
