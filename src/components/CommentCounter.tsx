import { ChatIcon } from '@heroicons/react/solid'
import React from 'react'

const CommentCounter: React.FC<{ count: number }> = ({ count }) => {
  return (
    <div className="flex items-center px-2 py-1 text-xs font-medium text-gray-400 border-gray-200 rounded-md dark:text-foreground">
      <ChatIcon className="w-3.5 h-3.5 mr-1 text-background-accent/50 dark:text-background-accent" />
      {count}
    </div>
  )
}

export default CommentCounter
