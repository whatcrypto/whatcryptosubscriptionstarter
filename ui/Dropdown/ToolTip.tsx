'use client'
import React from 'react'
import { TooltipProps } from './types'
import SimpleTooltip from '@/components/SimpleTooltip'

const isMac =
  typeof window !== 'undefined' ? navigator.platform.toUpperCase().indexOf('MAC') >= 0 : false

const ShortcutKey = ({ children }: { children: string }): JSX.Element => {
  const className =
    'pointer-events-none inline-flex h-5 mr-0.5 select-none items-center gap-1 rounded border bg-gray-50 dark:border-dark-accent/60 font-semibold dark:bg-dark-accent/30 px-1.5 font-mono text-[10px] text-muted-foreground opacity-100'

  if (children === 'Mod') {
    return <kbd className={className}>{isMac ? '⌘' : 'Ctrl'}</kbd> // ⌃
  }

  if (children === 'Shift') {
    return <kbd className={className}>⇧</kbd>
  }

  if (children === 'Alt') {
    return <kbd className={className}>{isMac ? '⌥' : 'Alt'}</kbd>
  }

  return <kbd className={className}>{children}</kbd>
}

export const Tooltip = ({
  children,
  enabled = true,
  title,
  shortcut,
  bottomTooltip,
}: TooltipProps): JSX.Element => {
  if (enabled) {
    return (
      // <Tippy
      //   delay={500}
      //   offset={[0, 8]}
      //   touch={false}
      //   zIndex={99999}
      //   appendTo={document.body}
      //   // eslint-disable-next-line react/jsx-props-no-spreading
      //   {...tippyOptions}
      //   render={renderTooltip}
      // >
      //   <span>{children}</span>
      // </Tippy>
      (<SimpleTooltip
        contentProps={{ side: bottomTooltip ? 'bottom' : 'top' }}
        content={
          <span className="flex items-center gap-2">
            {title && <span className="text-xs font-medium">{title}</span>}
            {shortcut && (
              <span className="flex items-center gap-0.5">
                {shortcut.map((shortcutKey) => (
                  <ShortcutKey key={shortcutKey}>{shortcutKey}</ShortcutKey>
                ))}
              </span>
            )}
          </span>
        }
      >
        {children}
      </SimpleTooltip>)
    );
  }

  return <>{children}</>
}

export default Tooltip
