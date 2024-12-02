import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

interface MentionItemProps extends React.ComponentPropsWithoutRef<'div'> {
  isActive: boolean
}

export const MentionItem = ({ isActive, className, style, ...props }: MentionItemProps) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isActive) {
      ref.current?.scrollIntoView({ block: 'nearest', inline: 'start' })
    }
  }, [isActive])

  return (
    <div
      ref={ref}
      className={cn('dropdown-item truncate', isActive && 'active-dropdown-item')}
      style={{
        // backgroundColor: isActive ? 'lightgrey' : undefined,
        ...style,
      }}
      {...props}
    />
  )
}
