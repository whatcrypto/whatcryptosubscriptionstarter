import React from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './radix/Tooltip'
import { cn } from '@/lib/utils'

const SimpleTooltip: React.FC<{
  children: React.ReactNode
  content: React.ReactNode
  delayDuration?: number
  allowHoverableContent?: boolean
  contentProps?: any
  contentClass?: string
  open?: boolean
}> = ({
  children,
  content,
  delayDuration,
  allowHoverableContent,
  contentProps,
  contentClass,
  open,
}) => {
  return (
    <TooltipProvider>
      <Tooltip
        open={open ? true : undefined}
        delayDuration={delayDuration ? delayDuration : 300}
        disableHoverableContent={allowHoverableContent ? false : true}
      >
        <TooltipTrigger autoFocus={false} asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent
          {...contentProps}
          className={cn(
            content === null ? 'hidden' : 'text-center max-w-[300px] tracking-wide',
            contentClass
          )}
        >
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default SimpleTooltip
