import { IHelpCenterArticleDocument, IHelpCenterCollectionDocument } from '@/interfaces/IHelpCenter'
import React, { useState } from 'react'
import { ArrowRightIcon } from '@heroicons/react/solid'
import Link from 'next/link'
import { cn } from '@/lib'
import { useAtom } from 'jotai'
import { domainTypeAtom, helpCenterUrlPartsAtom } from '@/atoms/orgAtom'
import DocsMeilisearch from './DocsMeilisearch'
import FeaturedIcon from './FeaturedIcon'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/radix/Avatar'
import { useCurrentOrganization } from '@/data/organization'
import SeoMetaPublic from '../SeoMetaPublic'
import { useTranslation } from 'next-i18next'

const processNavData = (
  data: any,
  urlParts: {
    locale: string
    subpath: string
  }
) => {
  return (
    data?.structure?.map((item: any) => ({
      name: item.type === 'collection' ? item.name : item.title,
      href: `${urlParts.subpath}${item.type === 'collection' ? 'collections' : 'articles'}/${
        item.slug
      }`,
      icon: item?.icon,
      pages: item.structure.length,
      authors: item.authors,
      description: item.description,
      articleCount: item.articleCount || 0,
      collectionId: item.collectionId,
    })) || []
  )
}

const MainCenter: React.FC<{
  docsData: any
  widget?: boolean
  setActiveView?: React.Dispatch<React.SetStateAction<{ type: string; id: string }>>
}> = ({ docsData, widget, setActiveView }) => {
  const [domainType] = useAtom(domainTypeAtom)
  const [helpCenterUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const { t } = useTranslation()

  const { org } = useCurrentOrganization()

  const [navData, setNavData] = useState<
    | {
        name: string
        current: boolean
        href: string
        icon: IHelpCenterArticleDocument['icon']
        pages: number
        authors: IHelpCenterCollectionDocument['authors']
        description: string
        articleCount: number
        collectionId: string
      }[]
    | []
  >(processNavData(docsData, helpCenterUrlParts))

  return (
    <div className="">
      {!widget && (
        <SeoMetaPublic
          hideName={true}
          helpcenter={true}
          page={docsData?.displayName || org?.displayName + ' - Help Center'}
          description={docsData.description ? docsData.description : undefined}
          ogImageProps={
            org && {
              company: {
                name: org?.displayName,
                logo: org?.picture,
                themeColor: org?.color,
                themeLinePosition: 'bottom',
              },
              title: t('help-center'),
              description:
                'Search for helpful articles from our team to find an answer to your question.',
              type: 'root',
            }
          }
        />
      )}
      {!widget && (
        <div className="mt-8 text-center installation-content">
          <h1>{docsData?.title || t('how-can-we-help-you')}</h1>
          <p>
            {docsData?.description ||
              t('search-for-any-helpful-articles-from-our-team-to-find-an-answer-to-your-question')}
          </p>
        </div>
      )}
      <div className={cn('max-w-3xl mx-auto mt-10', widget && 'mt-0')}>
        <DocsMeilisearch setActiveView={setActiveView} widget={widget} />
      </div>
      <div className={cn('grid gap-3 mt-16 sm:grid-cols-2', widget && 'mt-8')}>
        {navData
          .filter((item) => item.articleCount && item.articleCount > 0)
          .map((item, index) => (
            <Link legacyBehavior href={widget ? '#' : item.href} key={item.name}>
              <a>
                <div
                  onClick={() => {
                    setActiveView && setActiveView({ type: 'collection', id: item.collectionId })
                  }}
                  className={cn(
                    'p-4 cursor-pointer flex flex-col h-full justify-end rounded-lg relative group  main-transition',
                    widget
                      ? `border bg-white/90 backdrop-blur-md transform-gpu dark:bg-background/60 ${
                          index !== 0 ? 'dark:hover:bg-card' : 'dark:hover:bg-background/80'
                        } dark:border-border/60`
                      : // index == 0
                        //   ? 'dark:border-accent/10 dark:border aio-widget-first-card dark:hover:bg-accent/[15%]'
                        //   : 'backdrop-blur-md transform-gpu dark:border-border/40 bg-white/90 hover:bg-white dark:bg-background dark:hover:bg-card'
                        'dark:shadow dark:hover:border-accent/[15%] dark:hover:ring-2 hover:ring-2 ring-accent/[8%] hover:bg-gray-50/60 dark:bg-foreground/[1%] dark:hover:bg-foreground/[2.5%] border-gray-100/60 border dark:border-foreground/[6%]'
                  )}
                >
                  {item.icon && (
                    <div className="inline-flex h-9 w-9 text-primary-modified bg-white dark:text-accent items-center border-gray-100/60 dark:border-accent/5 border justify-center mb-4 rounded-md shadow-sm dark:group-hover:bg-accent/[13%] main-transition dark:bg-accent/[10%]">
                      <FeaturedIcon small={true} icon={item.icon} />
                    </div>
                  )}
                  <h3 className="text-base font-semibold text-gray-500 dark:text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm line-clamp-3 text-foreground">{item.description}</p>
                  <div className="flex items-center gap-3 pt-5 mt-auto">
                    <div className="flex items-center -space-x-2">
                      {item.authors?.map((author, index) => {
                        if (index > 4) return null
                        return (
                          <Avatar
                            key={index}
                            className="w-5 h-5 ring-2 ring-background dark:ring-background"
                          >
                            <AvatarImage src={author.avatarUrl} />
                            <AvatarFallback className="text-foreground dark:text-foreground">
                              {author?.name
                                ?.split(' ')
                                .map((name) => name[0])
                                .join('') || 'A'}
                            </AvatarFallback>
                          </Avatar>
                        )
                      })}
                    </div>
                    <p className="text-[13px] text-foreground/80 dark:text-foreground/70">
                      <span className="font-semibold">{item.articleCount}</span> {t('articles')}
                    </p>
                  </div>
                  <ArrowRightIcon className="absolute w-5 h-5 text-gray-400 delay-300 rotate-0 opacity-0 main-transition group-hover:-rotate-45 dark:text-foreground/40 right-5 bottom-5 group-hover:opacity-75" />
                </div>
              </a>
            </Link>
          ))}
      </div>
    </div>
  )
}

export default MainCenter
