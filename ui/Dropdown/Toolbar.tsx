import React, { ButtonHTMLAttributes, HTMLProps, forwardRef } from 'react'

import { cn } from '@/lib/utils'
import { Surface } from './Surface'
import Tooltip from './Tooltip'
import { Button, ButtonProps } from '@/components/radix/Button'

export type ToolbarWrapperProps = {
  shouldShowContent?: boolean
  isVertical?: boolean
} & HTMLProps<HTMLDivElement>

const ToolbarWrapper = forwardRef<HTMLDivElement, ToolbarWrapperProps>(
  // @ts-ignore
  ({ shouldShowContent = true, children, isVertical = false, className, ...rest }, ref) => {
    const toolbarClassName = cn(
      'text-black inline-flex h-full leading-none gap-0.5',
      isVertical ? 'flex-col p-2' : 'flex-row p-1 items-center',
      className
    )

    return (
      shouldShowContent && (
        // @ts-ignore
        <Surface className={toolbarClassName} {...rest} ref={ref}>
          {children}
        </Surface>
      )
    )
  }
)

ToolbarWrapper.displayName = 'Toolbar'

export type ToolbarDividerProps = {
  horizontal?: boolean
} & HTMLProps<HTMLDivElement>

const ToolbarDivider = forwardRef<HTMLDivElement, ToolbarDividerProps>(
  ({ horizontal, className, ...rest }, ref) => {
    const dividerClassName = cn(
      'bg-gray-50 dark:bg-white/10 flex-shrink-0',
      horizontal
        ? 'w-full  min-w-[1rem] h-[1px] first:mt-0 last:mt-0'
        : 'h-full mx-1 min-h-[1rem] w-[1px] first:ml-0 last:mr-0',
      className
    )

    return <div className={dividerClassName} ref={ref} {...rest} />
  }
)

ToolbarDivider.displayName = 'Toolbar.Divider'

export type ToolbarButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
  activeClassname?: string
  tooltip?: string
  bottomTooltip?: boolean
  tooltipShortcut?: string[]
  buttonSize?: any
  variant?: ButtonProps['variant']
}

const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  (
    {
      children,
      buttonSize = 'icon',
      variant = 'ghost',
      bottomTooltip,
      className,
      tooltip,
      tooltipShortcut,
      activeClassname,
      ...rest
    },
    ref
  ) => {
    const buttonClass = cn(
      'gap-1 min-w-[2rem] px-2 w-auto dashboard-secondary shadow-none dark:shadow-none border-0 bg-transparent dark:bg-transparent dark:hover:border-0 hover:border-0',
      className,
      tooltip && 'h-8 rounded-none',
      rest.active ? 'bg-gray-50 dark:bg-white/5' : ''
    )

    const content = (
      <Button
        // activeClassname={activeClassname}
        className={buttonClass}
        variant={variant}
        // buttonSize={buttonSize}
        ref={ref}
        {...rest}
      >
        {children}
      </Button>
    )

    if (tooltip) {
      return (
        <Tooltip bottomTooltip={bottomTooltip} title={tooltip} shortcut={tooltipShortcut}>
          {content}
        </Tooltip>
      )
    }

    return content
  }
)

ToolbarButton.displayName = 'ToolbarButton'

export const Toolbar = {
  Wrapper: ToolbarWrapper,
  Divider: ToolbarDivider,
  Button: ToolbarButton,
}
