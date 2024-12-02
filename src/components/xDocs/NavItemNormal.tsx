import React from 'react'
import { navItemType } from '../DevDocsNavigation'
import Link from '../CustomLink'
import { cn } from '@/lib'
import { useRouter } from 'next/router'
import FeaturedIcon from './FeaturedIcon'
import { helpcenterActivePageAtom } from '@/atoms/orgAtom'
import { useAtom } from 'jotai'

const NavItemNormal: React.FC<{ navItem: navItemType; index: number; close: () => void }> = ({
  navItem,
  index,
  close,
}) => {
  const [activePage] = useAtom(helpcenterActivePageAtom)

  return (
    <div key={index} className={index !== 0 ? 'mt-7' : 'mt-2'}>
      <Link legacyBehavior href={navItem.href}>
        <a
          onClick={close}
          className="mb-2 px-3 flex items-center text-[11px] font-semibold line-clamp-2 tracking-[0.05em] text-gray-500 uppercase dark:text-foreground"
        >
          {/* {navItem.icon && (
        <div className="opacity-75 -mt-[2px] mr-1.5">
          <FeaturedIcon small={true} icon={navItem.icon} />
        </div>
      )} */}
          {navItem.name}
        </a>
      </Link>
      <div className="mt-2 space-y-1">
        {navItem.pages.map((page, index) => (
          <Link legacyBehavior key={index} href={page.href}>
            <a
              onClick={close}
              className={cn(
                'flex items-center  h-8 main-transition px-3 hover:bg-accent/[7%] hover:dark:bg-secondary py-1.5  rounded-md cursor-pointer mx-0',
                activePage?.slug === page.slug
                  ? 'bg-accent/10  hover:bg-accent/[15%] dark:bg-accent/10 dark:hover:bg-accent/[15%] dark:text-primary-modified'
                  : ''
              )}
            >
              <span
                className={cn(
                  'text-[13px] truncate font-medium flex items-center',
                  activePage?.slug === page.slug
                    ? 'text-primary-modified dark:text-accent-foreground'
                    : 'text-gray-400 dark:text-foreground/80'
                )}
              >
                {/* {getFirstEmoji(page?.name) && (
              <div className={cn('pr-1 mr-[3px]')}>
                <span className="w-4">{getFirstEmoji(page?.name)}</span>
              </div>
            )} */}
                {page.icon && (
                  <div className="opacity-75 mr-1.5">
                    <FeaturedIcon small={true} icon={page?.icon} />
                  </div>
                )}
                <span className="truncate">{page?.name}</span>
              </span>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default NavItemNormal
