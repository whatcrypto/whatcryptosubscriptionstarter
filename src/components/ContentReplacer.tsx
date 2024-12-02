import parse, { HTMLReactParserOptions, domToReact } from 'html-react-parser'
import { useEffect, useState } from 'react'
import { getSingleSubmissionWithoutSWR } from 'network/lib/submission'
import TagBullet from './TagBullet'
import Status from './Status'
import Loader from './Loader'
import { getSingleChangelog } from 'network/lib/changelog'
import { sanitizeHTML } from '@/lib/contentSanitizer'
import { ISubmission } from '@/interfaces/ISubmission'
import StandaloneMainPostViewPopup from './StandaloneMainPostViewPopup'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { cn } from '@/lib/utils'
import { common, createLowlight } from 'lowlight'
import { toHtml } from 'hast-util-to-html'
import { Accordion, AccordionItem } from '@radix-ui/react-accordion'
import { AccordionContent, AccordionTrigger } from './radix/Accordion'
import Callout from './Callout'
import CodeArea from './CodeArea'
import { getSingleHelpCenterArticle } from 'network/lib/helpcenter'
import { IHelpCenterArticleDocument } from '@/interfaces/IHelpCenter'
import { Base64 } from 'js-base64'
import { z } from 'zod'
import { useAtom } from 'jotai'
import { helpCenterUrlPartsAtom } from '@/atoms/orgAtom'
import SimpleTooltip from './SimpleTooltip'
import { BookOpenIcon } from '@heroicons/react/solid'
import React from 'react'
import { toast } from 'sonner'
import ReactPlayer from 'react-player'
import ScreenshotPlaceholder from './ScreenshotPlaceholder'
import { useTranslation } from 'next-i18next'
import { useCurrentOrganization } from '@/data/organization'
import { useKnowledgebaseStructure } from '@/data/knowledgebase'

const lowlight = createLowlight(common)

const ALLOWED_VIDEO_PLATFORMS = [
  {
    platform: 'youtube',
    hostname: 'www.youtube.com',
    dataAttr: 'data-youtube-video',
  },
  {
    platform: 'youtube',
    hostname: 'youtube.com',
    dataAttr: 'data-youtube-video',
  },
  {
    platform: 'youtube',
    hostname: 'youtu.be',
    dataAttr: 'data-youtube-video',
  },
  {
    platform: 'youtube',
    hostname: 'youtube-nocookie.com',
    dataAttr: 'data-youtube-video',
  },
  {
    platform: 'youtube',
    hostname: 'www.youtube-nocookie.com',
    dataAttr: 'data-youtube-video',
  },
  {
    platform: 'descript',
    hostname: 'share.descript.com',
    dataAttr: 'data-descript-video',
  },
  {
    platform: 'loom',
    hostname: 'www.loom.com',
    dataAttr: 'data-loom-video',
  },
  {
    platform: 'loom',
    hostname: 'loom.com',
    dataAttr: 'data-loom-video',
  },
]

export const SubbmisonTabElement: React.FC<{
  content: string | JSX.Element | JSX.Element[]
  id: string
  customClass?: string
  initialData?: ISubmission
  hideBullet?: boolean
}> = ({ content, id, customClass, initialData, hideBullet }) => {
  const [fetchedData, setFetchedData] = useState<any>(initialData ? initialData : null)
  const [activeSubmissionId, setActiveSubmissionId] = useState('')
  const [showPostView, setShowPostView] = useState(false)

  useEffect(() => {
    getSingleSubmissionWithoutSWR(id)
      .then((res) => {
        setFetchedData(res.data?.results[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <>
      <StandaloneMainPostViewPopup
        activeSubmissionId={activeSubmissionId}
        setShowPostView={() => {
          setShowPostView(false)
        }}
        showPostView={showPostView}
      />
      <SimpleTooltip
        content={
          fetchedData ? (
            <div className="p-1 text-left">
              {!fetchedData?.postStatus?.isDefault && (
                <div className="inline-block mb-2">
                  <Status
                    widget={true}
                    xSmall={true}
                    small={true}
                    status={fetchedData.postStatus}
                  />
                </div>
              )}
              <a className="text-sm font-semibold text-gray-500 cursor-pointer line-clamp-2 content dark:text-white">
                {fetchedData?.title}
              </a>
              {fetchedData?.content !== '<p></p>' && (
                <div className="text-xs mt-1.5 dark:text-foreground text-gray-400 line-clamp-5">
                  <ContentModifier removeAll={true} content={fetchedData?.content} />
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center w-48 py-8 ">
              {fetchedData === null ? (
                <div className="w-4 h-4 secondary-svg">
                  <Loader />
                </div>
              ) : (
                <p className="px-2 text-xs font-medium text-center text-gray-400 dark:text-foreground">
                  This post is private or has been deleted
                </p>
              )}
            </div>
          )
        }
      >
        {initialData ? (
          <button
            className="unstyled-button max-w-[280px] focus:ring-0"
            tabIndex={-1}
            onClick={() => {
              setActiveSubmissionId(id)
              setShowPostView(true)
            }}
          >
            <span className="flex items-center truncate">
              {!hideBullet && (
                <TagBullet
                  asSpan={true}
                  theme={fetchedData?.postStatus?.color ? fetchedData?.postStatus?.color : 'Gray'}
                />
              )}

              <span className="truncate">{fetchedData?.title || content}</span>
            </span>
          </button>
        ) : (
          <a
            tabIndex={-1}
            href={'/submissions/' + id}
            target="_blank"
            rel="noreferrer"
            className="mention-badge"
          >
            {/* <TagBullet
              asSpan={true}
              theme={fetchedData?.postStatus?.color ? fetchedData?.postStatus?.color : 'Gray'}
            /> */}
            <span className="truncate dark:text-accent-foreground">
              {fetchedData?.title || content}
            </span>
          </a>
        )}
      </SimpleTooltip>
    </>
  )
}
const articleMentionSchema = z.object({
  helpCenterId: z.string(),
  articleId: z.string(),
  organizationId: z.string(),
  locale: z.string(),
  // 'live' | 'draft'
  state: z.enum(['live', 'draft']),
})
export const HelpCenterArticleTabElement: React.FC<{
  content: string | JSX.Element | JSX.Element[]
  id: string
  activeLocale: string
  isHelpCenter?: boolean
}> = ({ content, id, activeLocale, isHelpCenter }) => {
  const [fetchedData, setFetchedData] = useState<IHelpCenterArticleDocument | null | undefined>(
    null
  )
  const [article, setArticle] = useState<z.infer<typeof articleMentionSchema> | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { data } = useKnowledgebaseStructure(false, undefined, !isHelpCenter)
  const isSingleLocaleHelpCenter = isHelpCenter ? data?.availableLocales?.length === 1 : true

  useEffect(() => {
    try {
      const articleInfoString = Base64.decode(id)
      const articleParseResult = articleMentionSchema.safeParse(JSON.parse(articleInfoString))

      if (!articleParseResult.success) {
        setArticle(null)
        setIsLoading(false)
        return
      }
      setArticle(articleParseResult.data)
    } catch (error) {
      setArticle(null)
      setIsLoading(false)
    }
  }, [id])

  useEffect(() => {
    if (!article) {
      return
    }

    setFetchedData(null)
    setIsLoading(true)

    getSingleHelpCenterArticle(article.articleId, article.helpCenterId, activeLocale)
      .then((res) => {
        setFetchedData(res.data?.results[0])
        setIsLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setFetchedData(undefined)
        setIsLoading(false)
      })
  }, [article, activeLocale])

  if (!article) {
    return <p>Could not load article.</p>
  }

  const url = fetchedData?.externalUrl || fetchedData?.featurebaseUrl

  return (
    <SimpleTooltip
      content={
        fetchedData ? (
          <div className="p-1 text-left">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="!text-sm font-semibold text-gray-500 line-clamp-2 dark:text-white"
            >
              {fetchedData?.title}
            </a>
            <div className="pt-1.5">
              <div className="space-y-2 overflow-hidden text-xs text-gray-400 dark:text-foreground max-h-72 line-clamp-4">
                {fetchedData?.description !== '<p></p>' ? (
                  <ContentModifier removeAll={true} content={fetchedData?.description || ''} />
                ) : (
                  'No description written..'
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 py-8 ">
            {fetchedData === null ? (
              <div className="w-4 h-4 secondary-svg">
                <Loader />
              </div>
            ) : (
              <p className="px-2 text-xs text-center text-gray-400 dark:text-foreground">
                This article is private or has been deleted
              </p>
            )}
          </div>
        )
      }
    >
      <div className="inline-block mb-0">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="relative pl-6 mention-badge mb-0 pb-0"
        >
          <BookOpenIcon className="inline-block w-3.5 h-3.5 mr-1.5 left-1.5 absolute text-text-accent opacity-80 dark:text-accent" />

          {isLoading ? (
            !isSingleLocaleHelpCenter ? (
              <span className="relative">
                <span className="opacity-0" aria-hidden>
                  {content}
                </span>
                <span className="animate-pulse py-1 inset-y-2 inset-x-0 w-full dark:bg-accent bg-accent opacity-20 rounded-md absolute"></span>
              </span>
            ) : (
              <span className="truncate">{content} </span>
            )
          ) : (
            <span className="truncate">{fetchedData?.title || content} </span>
          )}
        </a>
      </div>
    </SimpleTooltip>
  )
}

export const ChangelogTabElement: React.FC<{
  content: string | JSX.Element | JSX.Element[]
  id: string
}> = ({ content, id }) => {
  const [fetchedData, setFetchedData] = useState<any>(null)

  useEffect(() => {
    getSingleChangelog(id)
      .then((res) => {
        setFetchedData(res.data?.results[0])
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <SimpleTooltip
      content={
        fetchedData ? (
          <div className="-my-1.5 -mx-2 text-left">
            {fetchedData?.featuredImage && (
              <a href={'/changelog/' + id} target="_blank" rel="noreferrer">
                <img
                  src={fetchedData?.featuredImage}
                  className="object-cover w-full h-32 rounded-none"
                  alt="Featured"
                />
              </a>
            )}
            <div className="p-2.5">
              <a
                href={'/changelog/' + id}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-gray-500 line-clamp-2 content dark:text-white"
              >
                {fetchedData?.title}
              </a>
              {fetchedData?.content !== '<p></p>' && (
                <div className="pt-1.5">
                  <div className="space-y-2 overflow-hidden text-xs text-left text-gray-400 dark:text-foreground max-h-72 line-clamp-4">
                    <ContentModifier removeAll={true} content={fetchedData?.content} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-64 py-8 ">
            {fetchedData === null ? (
              <div className="w-4 h-4 secondary-svg">
                <Loader />
              </div>
            ) : (
              <p className="px-2 text-xs text-center text-gray-400 dark:text-foreground">
                This changelog is private or has been deleted
              </p>
            )}
          </div>
        )
      }
    >
      <a href={'/changelog/' + id} target="_blank" rel="noreferrer" className="mention-badge">
        <span className="truncate">{fetchedData?.title || content}</span>
      </a>
    </SimpleTooltip>
  )
}

export const ContentModifier: React.FC<{
  content: string
  removeAll?: boolean
  openReadMore?: () => any
  // Used to navigate to other articles in the AIO widget help center view
  setActiveView?: React.Dispatch<React.SetStateAction<{ type: string; id: string }>>
  documentationView?: boolean
  allowAllIframes?: boolean
  replaceEmWithMark?: boolean
}> = ({
  content,
  removeAll,
  openReadMore,
  setActiveView,
  documentationView,
  allowAllIframes = false,
  replaceEmWithMark = false,
}) => {
  content = sanitizeHTML(
    removeAll ? content?.replace('</p>', '</p> ') : content,
    removeAll ? false : true,
    documentationView
  )

  const [helpCenterUrlParts] = useAtom(helpCenterUrlPartsAtom)
  const [isProcessingScreenshot, setIsProcessingScreenshot] = useState(false)

  const handleImageError = (src: string) => {
    if (src.includes('/ss-')) {
      setIsProcessingScreenshot(true)
    }
  }

  const { i18n } = useTranslation()

  const copyLinkToClipboard = (id: string) => {
    const url = window.location.href.split('#')[0] + '#' + id
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast.success('Link copied to clipboard')
      })
      .catch((err) => toast.error('Could not copy link to clipboard'))
  }

  const options: HTMLReactParserOptions = {
    replace: ({ attribs, children, name }: any) => {
      if (documentationView && ['h1', 'h2', 'h3', 'h4'].includes(name)) {
        const id = attribs.id || ''
        return React.createElement(
          name,
          {
            id: id,
            className: 'heading-with-copy',
            onClick: () => copyLinkToClipboard(id),
            title: 'Click to copy link',
          },
          domToReact(children, options)
        )
      }
      if (attribs && name === 'video') {
        return (
          <ReactPlayer
            url={attribs.src}
            controls={true}
            width={attribs.width || '100%'}
            height={attribs.height || 'auto'}
            className="overflow-hidden rounded-xl"
          />
        )
      }

      if (attribs && attribs.src && name === 'img') {
        const alignment = attribs?.['data-align'] || 'left'
        const width = attribs?.['data-width']

        if (isProcessingScreenshot) {
          return <ScreenshotPlaceholder />
        }

        return (
          <Zoom zoomMargin={12} classDialog="custom-zoom">
            <img
              onClick={() => {
                openReadMore && openReadMore()
              }}
              width={attribs.width}
              src={attribs.src}
              style={{
                width: width ? (width === '100%' ? 'auto' : width) : 'auto',
              }}
              onError={() => handleImageError(attribs?.src)}
              className={cn(
                'object-cover h-auto max-h-[450px] aspect-auto w-auto rounded-md cursor-zoom-in',
                {
                  'w-auto': !width,
                  'w-1/2': width === '50%',
                  'w-1/3': width === '33%',
                  'w-2/3': width === '66%',
                  'w-1/4': width === '25%',
                  'w-3/4': width === '75%',
                  'mr-auto': alignment === 'left',
                  'ml-auto': alignment === 'right',
                  'mx-auto': alignment === 'center' && width !== '100%',
                }
              )}
              alt=""
            />
          </Zoom>
        )
      }

      if (attribs && name === 'iframe') {
        if (allowAllIframes) {
          return (
            <iframe
              src={attribs.src}
              className="w-full shadow aspect-video rounded-xl"
              allowFullScreen={true}
              // Consider adding rel attributes if applicable
            />
          )
        } else {
          let url: URL

          try {
            url = new URL(attribs.src)
          } catch (error) {
            return null
          }

          // Enforce HTTPS
          if (url.protocol !== 'https:') {
            return null
          }

          const urlHostname = url.hostname.toLowerCase()

          const matchedPlatform = ALLOWED_VIDEO_PLATFORMS.find(
            (platform) => platform.hostname.toLowerCase() === urlHostname
          )

          if (matchedPlatform) {
            // Optionally verify port if necessary
            if (url.port && url.port !== '443') {
              // Assuming HTTPS default port
              return null
            }

            return (
              <iframe
                src={attribs.src}
                className="w-full shadow aspect-video rounded-xl"
                allowFullScreen={true}
              />
            )
          }
          return (
            <div className="p-4 rounded-lg bg-secondary">
              <p>Unsupported embed platform in content</p>
            </div>
          )
        }
      }

      if (attribs && name === 'a') {
        const regex = /{{boardId:([0-9a-fA-F]+)}}/g
        // Check if regex matches
        if (regex.test(attribs.href)) {
          // const boardId = attribs.href.match(regex)[0].split(':')[1].replace('}}', '')
          return (
            <a
              onClick={() => {
                window.postMessage({
                  target: 'FeaturebaseWidget',
                  data: { action: 'openFeedbackWidget' },
                })
              }}
              className="text-indigo-500 cursor-pointer dark:text-indigo-400 hover:underline decoration-indigo-400/60"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              {domToReact(children, options)}
            </a>
          )
        }

        // check if links has data-collection-id or data-article-id

        if (
          attribs['data-collection-id'] &&
          attribs['data-help-center-id'] === helpCenterUrlParts.helpCenterId
        ) {
          // replace the link with a link starting with /
          return (
            <a
              onClick={() =>
                setActiveView &&
                setActiveView({ type: 'collection', id: attribs['data-collection-id'] })
              }
              href={
                setActiveView
                  ? '#'
                  : `${helpCenterUrlParts.subpath}collections/${attribs['data-slug']}`
              }
              className="text-indigo-500 dark:text-indigo-400 hover:underline decoration-indigo-400/60"
              target="_blank"
              rel="noopener noreferrer nofollow"
              data-organization-id={attribs['data-organization-id']}
              data-help-center-id={attribs['data-help-center-id']}
              data-collection-id={attribs['data-collection-id']}
              data-slug={attribs['data-slug']}
              data-locale={attribs['data-locale']}
            >
              {domToReact(children, options)}
            </a>
          )
        }

        if (
          attribs['data-article-id'] &&
          attribs['data-help-center-id'] === helpCenterUrlParts.helpCenterId
        ) {
          // Intra article link like #section-1
          if (
            attribs['data-hash'] &&
            // check if the hash starts with #. Very important to avoid XSS
            attribs['data-hash'].startsWith('#') &&
            attribs['data-article-id'] === helpCenterUrlParts.articleId
          ) {
            // set the hash to the url
            return (
              <a
                onClick={() =>
                  setActiveView &&
                  setActiveView({ type: 'article', id: attribs['data-article-id'] })
                }
                href={setActiveView ? undefined : `${attribs['data-hash']}`}
                className="text-indigo-500 cursor-pointer dark:text-indigo-400 hover:underline decoration-indigo-400/60"
                target="_self" // open in the same tab
                rel="noopener noreferrer nofollow"
                data-organization-id={attribs['data-organization-id']}
                data-help-center-id={attribs['data-help-center-id']}
                data-article-id={attribs['data-article-id']}
                data-slug={attribs['data-slug']}
                data-locale={attribs['data-locale']}
                data-hash={attribs['data-hash']}
              >
                {domToReact(children, options)}
              </a>
            )
          }
          // ensure hash starts with #
          const hash =
            attribs['data-hash'] && attribs['data-hash'].startsWith('#') ? attribs['data-hash'] : ''
          // replace the link with a link starting with /
          return (
            <a
              onClick={() =>
                setActiveView && setActiveView({ type: 'article', id: attribs['data-article-id'] })
              }
              href={
                setActiveView
                  ? hash
                    ? '#' + hash
                    : undefined
                  : `${helpCenterUrlParts.subpath}articles/${attribs['data-slug']}${hash}`
              }
              className="text-indigo-500 cursor-pointer dark:text-indigo-400 hover:underline decoration-indigo-400/60"
              target={setActiveView ? '_self' : '_blank'}
              rel="noopener noreferrer nofollow"
              data-organization-id={attribs['data-organization-id']}
              data-help-center-id={attribs['data-help-center-id']}
              data-article-id={attribs['data-article-id']}
              data-slug={attribs['data-slug']}
              data-locale={attribs['data-locale']}
              data-hash={attribs['data-hash']}
            >
              {domToReact(children, options)}
            </a>
          )
        }

        return (
          <a
            href={attribs.href}
            className="text-indigo-500 dark:text-indigo-400 hover:underline decoration-indigo-400/60"
            target={attribs.href?.startsWith('#') ? '_self' : '_blank'}
            rel="noopener noreferrer nofollow"
          >
            {domToReact(children, options)}
          </a>
        )
      }
      if (attribs && name === 'span' && attribs['data-type'] === 'mention') {
        if (attribs['data-id']) {
          const type = attribs['data-id'].split('-')[1]
          const id = attribs['data-id'].split('-')[0]

          if (type === 'user') {
            return (
              <span className="px-1 pointer-events-none mention-badge">
                {domToReact(children, options)}
              </span>
            )
          } else if (type === 'post' || type === 'changelog' || type === 'article') {
            // Remove first character of string
            children[0].data = children[0].data.slice(1)

            return type === 'changelog' ? (
              <ChangelogTabElement content={domToReact(children, options)} id={id} />
            ) : type === 'article' ? (
              <HelpCenterArticleTabElement
                isHelpCenter={documentationView}
                activeLocale={i18n.language === 'default' ? 'en' : i18n.language}
                content={domToReact(children, options)}
                id={id}
              />
            ) : (
              <SubbmisonTabElement content={domToReact(children, options)} id={id} />
            )
          }
        }

        return (
          <span className="text-indigo-500 px-1 py-0.5 dark:text-indigo-300">
            {domToReact(children, options)}
          </span>
        )
      }
      if (name === 'pre' && children && children.length > 0) {
        const codeNode = children[0]
        if (
          codeNode &&
          codeNode.name === 'code' &&
          codeNode.children &&
          codeNode.children.length > 0
        ) {
          const codeString = codeNode.children.reduce((acc: any, child: any) => {
            if (child.type === 'text') {
              return acc + child.data
            } else if (child.name === 'br') {
              return acc + '\n'
            }
            return acc
          }, '')
          try {
            const tree = lowlight?.highlightAuto(codeString)

            if (tree?.children?.length === 0) {
              return (
                <pre className="p-4 overflow-x-auto break-words whitespace-pre-wrap border rounded-lg bg-secondary/40">
                  <code>{codeString}</code>
                </pre>
              )
            } else {
              const highlightedHtml = toHtml(tree)
              return (
                <pre className="p-4 overflow-x-auto break-words whitespace-pre-wrap border rounded-lg bg-secondary/40">
                  <code dangerouslySetInnerHTML={{ __html: sanitizeHTML(highlightedHtml) }}></code>
                </pre>
              )
            }
          } catch (error) {
            // Fallback to raw code rendering
            return (
              <pre className="p-4 overflow-x-auto break-words whitespace-pre-wrap border rounded-lg bg-secondary/40">
                <code>{codeString}</code>
              </pre>
            )
          }
        }
      }

      if (name === 'details') {
        return (
          <div className="accordion-component">
            <Accordion collapsible type="single">
              <AccordionItem className="border-b" value="item-1">
                <AccordionTrigger>
                  {domToReact(
                    children.find((child: any) => child.name === 'summary').children,
                    options
                  )}
                </AccordionTrigger>
                <AccordionContent>
                  {domToReact(
                    children.filter((child: any) => child.name !== 'summary'),
                    options
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )
      }
      if (name === 'multicode-component') {
        if (attribs) {
          const data = JSON.parse(attribs.data)
          return (
            <div>
              <CodeArea lowlight={lowlight} examples={data} />
            </div>
          )
        }
      }
      if (name === 'callout-component') {
        return (
          // background attribute
          // <div className="accordion-component">
          //   <Accordion collapsible type="single">
          //     <AccordionItem className="border-b" value="item-1">
          //       <AccordionTrigger>
          //         {domToReact(
          //           children.find((child: any) => child.name === 'summary').children,
          //           options
          //         )}
          //       </AccordionTrigger>
          //       <AccordionContent>
          //         {domToReact(
          //           children.filter((child: any) => child.name !== 'summary'),
          //           options
          //         )}
          //       </AccordionContent>
          //     </AccordionItem>
          //   </Accordion>
          // </div>
          <div>
            <Callout
              background={attribs?.color !== 'Accent' ? attribs.color : 'hsl(var(--accent))'}
              editor={<></>}
            >
              {domToReact(children, options)}
            </Callout>
          </div>
        )
      }
    },
  }

  const modifiedContent = parse(content, options)

  return (
    <>
      {modifiedContent}
      {/* <PopupWrapper
        hasPadding={false}
        large={true}
        alwaysFull={true}
        isOpen={open}
        setIsOpen={() => {
          setOpen(false)
          setActiveImage('')
        }}
        imageZoomed={true}
      >
        {activeImage && <img src={activeImage || ''} className="w-full h-full rounded-lg" />}
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          className="absolute inset-0 w-full h-full "
        />
      </PopupWrapper> */}
    </>
  )
}
