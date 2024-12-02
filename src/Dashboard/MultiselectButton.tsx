import { cn } from '@/lib/utils'
import { SelectorIcon } from '@heroicons/react/solid'
import { useTranslation } from 'next-i18next'
import React, { ButtonHTMLAttributes, ForwardedRef, ReactNode } from 'react'

interface MultiselectButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: ReactNode
  children?: ReactNode
  compact?: boolean
  customBadge?: ReactNode
  unSelected?: boolean
}

const MultiselectButton = React.forwardRef(
  (props: MultiselectButtonProps, forwardedRef: ForwardedRef<HTMLButtonElement>) => {
    const { icon, compact, children, customBadge, unSelected, className, ...buttonProps } = props
    const { t } = useTranslation()
    return (
      <button
        {...buttonProps}
        ref={forwardedRef}
        className={cn(
          compact
            ? 'px-2 border relative w-full py-1 max-w-[165px] text-left truncate flex items-center text-xs font-medium dashboard-secondary border-gray-100/50 bg-gray-50/50 shadow-none dark:text-gray-100 dark:shadow-sm'
            : 'w-full relative py-1 pl-2.5 pr-10 text-left border rounded-md dashboard-secondary sm:text-sm',
          !props.children || unSelected
            ? 'dark:text-foreground/70 text-background-accent'
            : 'text-background-accent dark:text-foreground',
          customBadge ? (compact ? 'pr-11' : 'pr-16') : "",
          className
        )}
      >
        {icon ? icon : null}
        <span className={`truncate font-medium`}>
          <p
            className={cn(
              `truncate`,
              className?.includes('text-xs')
                ? 'text-[13px]'
                : className?.includes('text-xxs')
                ? 'text-xs'
                : ''
            )}
          >
            {props.children || t('unselected')}
          </p>
        </span>
        {customBadge && (
          <span
            className={cn(
              'absolute inset-y-0 right-5 flex items-center pr-2 pointer-events-none',
              compact && 'right-0'
            )}
          >
            {customBadge}
          </span>
        )}
        {!compact && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <SelectorIcon className="w-5 h-5 opacity-75 secondary-svg" aria-hidden="true" />
          </span>
        )}
      </button>
    )
  }
)

MultiselectButton.displayName = 'MultiselectButton'

export default MultiselectButton
