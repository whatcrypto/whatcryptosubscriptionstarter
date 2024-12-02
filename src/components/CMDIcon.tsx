import React from 'react'

const CMDIcon: React.FC<{ cmdKey: string }> = ({ cmdKey }) => {
  return (
    <kbd className="inline-flex items-center justify-center w-5 h-5 gap-1 ml-2 font-mono font-semibold border rounded opacity-100 pointer-events-none select-none bg-gray-50 dark:bg-background-accent/20 dark:border-background-accent/20 text-muted-foreground">
      <span className="text-[11px] leading-0">{cmdKey}</span>
    </kbd>
  )
}

export default CMDIcon
