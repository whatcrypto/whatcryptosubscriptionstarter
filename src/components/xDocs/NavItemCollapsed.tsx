import React, { useState, useEffect, useMemo, useRef } from 'react'
import { navItemType } from '../DevDocsNavigation'
import { Accordion, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion'
import { AccordionContent } from '../radix/Accordion'
import Link from '../CustomLink'
import FeaturedIcon from './FeaturedIcon'
import { cn } from '@/lib'
import { ChevronRightIcon } from '@heroicons/react/solid'
import { useAtom } from 'jotai'
import { helpcenterActivePageAtom, helpcenterShowBackButtonAtom } from '@/atoms/orgAtom'

const NavItemCollapsed: React.FC<{ navItem: navItemType; index: number; close: () => void }> = ({
  navItem,
  index,
  close,
}) => {
  const [showBackButton] = useAtom(helpcenterShowBackButtonAtom)
  const [activePage] = useAtom(helpcenterActivePageAtom)

  const isActive = useMemo(() => {
    return (
      activePage?.breadcrumbs?.some((breadcrumb: any) => breadcrumb.collectionId === navItem.id) ||
      (activePage?.type === 'collection' && activePage?.collectionId === navItem.id) ||
      (activePage?.type === 'article' && activePage?.articleId === navItem.id)
    )
  }, [navItem, activePage])

  const [isOpen, setIsOpen] = useState(isActive)

  useEffect(() => {
    setIsOpen(isActive)
  }, [isActive])

  const handleToggle = (value: string) => {
    setIsOpen((prevIsOpen) => (value === 'item-1' ? !prevIsOpen : false))
  }

  if (navItem.pages.length === 0 && showBackButton?.show) {
    return (
      <div key={index} className={index !== 0 ? 'mt-1.5' : ''}>
        <Link legacyBehavior href={navItem.href || '#'}>
          <a
            onClick={close}
            className={cn(
              'flex items-center h-9 main-transition px-3 py-1.5 rounded-md cursor-pointer mx-0 hover:bg-foreground/[7%] hover:dark:bg-secondary/60',
              isActive
                ? 'bg-accent/10 hover:bg-accent/[15%] dark:bg-accent/10 dark:hover:bg-accent/[15%] dark:text-primary-modified'
                : ''
            )}
          >
            <span
              className={cn(
                'text-sm select-none truncate font-medium flex items-center',
                isActive
                  ? 'text-primary-modified dark:text-accent-foreground'
                  : 'text-gray-400 dark:text-foreground/80'
              )}
            >
              {navItem.icon && (
                <div className="opacity-60 mr-1.5">
                  <FeaturedIcon small={true} icon={navItem?.icon} />
                </div>
              )}
              <span className="truncate">{navItem?.name}</span>
            </span>
          </a>
        </Link>
      </div>
    )
  }

  return (
    <div key={index} className={index !== 0 ? 'mt-1.5' : ''}>
      <Accordion
        type="single"
        collapsible
        value={isOpen ? 'item-1' : ''}
        onValueChange={handleToggle}
      >
        <AccordionItem className={cn('p-0 mr-1 main-transition')} value="item-1">
          <AccordionTrigger asChild>
            <a
              className={cn(
                'flex [&[data-state=open]>svg]:rotate-90 hover:bg-foreground/[7%] hover:dark:bg-secondary/60 -ml-0.5 items-center h-9 main-transition px-3 py-1.5 rounded-md cursor-pointer mx-0'
              )}
            >
              <span
                className={cn(
                  'text-sm select-none truncate font-medium flex items-center',
                  isActive
                    ? 'text-gray-600 dark:text-white/80'
                    : 'text-gray-400 dark:text-foreground/80'
                )}
              >
                {navItem.icon && showBackButton?.show && (
                  <div className="opacity-60 mr-1.5">
                    <FeaturedIcon small={true} icon={navItem?.icon} />
                  </div>
                )}
                <span className="truncate">{navItem?.name}</span>
              </span>
              <ChevronRightIcon className="w-4 h-4 ml-auto secondary-svg" />
            </a>
          </AccordionTrigger>
          <AccordionContent className="p-1 px-2 dashboard-border">
            <div className="space-y-1">
              {navItem.pages.map((page, index) => {
                const isActivePage =
                  (activePage?.type === 'article'
                    ? activePage?.articleId === page.id
                    : activePage?.collectionId === page.id) ||
                  activePage?.breadcrumbs?.some((breadcrumb) => breadcrumb.collectionId === page.id)

                return (
                  <Link legacyBehavior key={index} href={page.href}>
                    <a
                      onClick={close}
                      className={cn(
                        'flex select-none items-center h-8 text-[15px] main-transition px-2 hover:bg-foreground/[7%] hover:dark:bg-secondary/60 py-1.5 rounded-md cursor-pointer mx-0',
                        isActivePage
                          ? 'bg-accent/10 hover:bg-accent/[15%] dark:bg-accent/10 dark:hover:bg-accent/[15%] dark:text-primary-modified'
                          : ''
                      )}
                    >
                      <span
                        className={cn(
                          'text-[13px] truncate font-medium flex items-center',
                          isActivePage
                            ? 'text-primary-modified dark:text-accent-foreground'
                            : 'text-gray-400 dark:text-foreground/80'
                        )}
                      >
                        {page.icon && (
                          <div className="opacity-60 mr-1.5">
                            <FeaturedIcon small={true} icon={page?.icon} />
                          </div>
                        )}
                        <span className="truncate">{page?.name}</span>
                      </span>
                    </a>
                  </Link>
                )
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}

export default NavItemCollapsed
