import { cn } from '@/lib/utils'
import { XIcon } from '@heroicons/react/solid'
import React from 'react'

const PostExternalLink: React.FC<{
  link: string
  title: string
  icon: React.ReactNode
  onClick: Function
  bgColor?: string
}> = ({ icon, link, title, onClick, bgColor = 'clickup-bg' }) => {
  return (
    <div className="relative flex items-center justify-between overflow-hidden border rounded-md shadow-sm main-transition dark:shadow secondary-raised-card dark:hover:border-border dark:hover:bg-border/60 dashboard-border ring-0 dark:ring-0">
      <a
        className="relative flex items-center w-full p-2 mr-2 group"
        href={link}
        target="_blank"
        rel="noreferrer"
      >
        {/* <div
          className={cn(
            'absolute inset-0 opacity-0 main-transition group-hover:opacity-[6%] dark:group-hover:opacity-10',
            bgColor
          )}
        ></div> */}
        {/* <div className="absolute inset-0 pointer-events-none from-transparent to-[#FDFDFD] bg-gradient-to-r dark:to-secondary dark:from-transparent"></div> */}

        <div className="p-1 relative flex-shrink-0 mr-2.5  rounded-md overflow-hidden">
          <div className={cn('absolute inset-0 opacity-70', bgColor)}></div>
          <div className="relative dark:text-white">{icon}</div>
        </div>
        <div className="relative mr-8 truncate">
          <p className="text-sm font-medium text-gray-500 dark:text-foreground ">
            <span className="max-w-full truncate">{title}</span>
          </p>
        </div>
      </a>
      <button
        onClick={() => onClick()}
        className="absolute right-0 p-1 mr-2 text-xs bg-white shadow-sm dark:shadow onboarding-button"
      >
        <XIcon className="secondary-svg !h-3 !w-3" />
      </button>
    </div>
  )
}

export default PostExternalLink
