import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import { useCurrentOrganization } from '../data/organization'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { getLighterPrimaryColor } from './CustomThemeHandler'
import { createCSP } from '@/lib/contentSecurityPolicy'

// Common types
type CompanyThemeLinePosition = 'left' | 'bottom'

interface CompanyInfo {
  logo?: string
  name?: string
  themeColor: string
  themeLinePosition: CompanyThemeLinePosition
}

interface BaseMetaProps {
  type: 'root' | 'post'
  company: CompanyInfo
  title: string
  description?: string
}

// Root-specific type
interface RootMetaProps extends BaseMetaProps {
  type: 'root'
  category?: string
}

// Post-specific type
interface PostMetaProps extends BaseMetaProps {
  type: 'post'
  status?: {
    text?: string
    color: string
  }
  details?: {
    board?: string
    upvotes?: number
    comments?: number
  }
}

// Union type for SeoMeta function
type SeoMetaProps = RootMetaProps | PostMetaProps

function createOGImageUrl(props: SeoMetaProps, orgAccentHex: string): string {
  const baseUrl = 'https://og.featurebase.app'
  const url = new URL(baseUrl)

  // Common parameters
  url.searchParams.set('type', props.type)
  url.searchParams.set('title', props.title)
  if (props.description) url.searchParams.set('description', props.description)

  // Company parameters
  if (props.company.logo) url.searchParams.set('companyLogo', props.company.logo)
  if (props.company.name) url.searchParams.set('companyName', props.company.name)
  url.searchParams.set('companyThemeColor', orgAccentHex)
  url.searchParams.set('companyTLP', props.company.themeLinePosition)

  if (props.type === 'root') {
    // Root-specific parameters
    if (props.category) url.searchParams.set('category', props.category)
  } else {
    // Post-specific parameters
    if (props.status?.text) url.searchParams.set('statusText', props.status.text)
    if (props.status?.color) url.searchParams.set('statusColor', props.status.color)
    if (props.details?.board) url.searchParams.set('board', props.details.board)
    if (props.details?.upvotes !== undefined)
      url.searchParams.set('upvotes', props.details.upvotes.toString())
    if (props.details?.comments !== undefined)
      url.searchParams.set('comments', props.details.comments.toString())
  }

  return url.toString()
}

const SeoMetaPublic: React.FC<{
  page?: string
  meta?: string
  noindex?: boolean
  description?: string | null
  imageUrl?: string
  hideName?: boolean
  customDisplayName?: string
  helpcenter?: boolean
  ogImageProps?: SeoMetaProps
}> = ({
  page,
  meta,
  noindex,
  description,
  imageUrl,
  hideName,
  customDisplayName,
  helpcenter,
  ogImageProps,
}) => {
  const { org } = useCurrentOrganization()

  const {
    displayName,
    subscriptionStatus,
    picture,
    color,
    ogImage,
    name,
    customDomain,
    activeHelpCenter,
  } = org

  const { t } = useTranslation()
  const defaultDescription = t('give-name-feedback-on-how-they-could-improve-their-product', {
    name: displayName,
  })
  const router = useRouter() // Use useRouter to access the current path

  const orgAccentHex = useMemo(() => {
    if (!org) return '#fff'

    const color = getLighterPrimaryColor(org, true)

    return color
  }, [org])

  const ogImageUrl = useMemo(() => {
    return imageUrl
      ? imageUrl
      : (ogImageProps && orgAccentHex && createOGImageUrl(ogImageProps, orgAccentHex)) || ogImage
  }, [ogImageProps, orgAccentHex, imageUrl])

  const getPathWithoutQuery = (path: string) => {
    try {
      if (!path) return '' // Return an empty string if path is undefined or null
      return path.split(/[?#]/)[0]
    } catch (e) {
      console.error(e)
      return path
    }
  }

  const keywords = helpcenter
    ? `${displayName} helpdocs, ${displayName} help articles, find help for ${displayName}, ${displayName} support, ${displayName} documentation`
    : `${displayName} feedback, ${displayName} feedback, give feedback to ${displayName}, feedback, ${displayName}, ${displayName} submissions`

  return (
    <Head>
      <title>
        {`${page}${!hideName ? ` - ${customDisplayName ? customDisplayName : displayName}` : ''}`}
      </title>
      <meta name="description" content={description ? description : defaultDescription} />
      <link rel="apple-touch-icon" sizes="180x180" href={picture ? picture : '/'} />
      <link rel="icon" type="image/png" sizes="32x32" href={picture ? picture : '/'} />
      <link rel="icon" type="image/png" sizes="16x16" href={picture ? picture : '/'} />
      <link rel="manifest" href={picture ? picture : '/'} />
      {subscriptionStatus === 'paid' || name === 'formitize' ? null : (
        <meta name="robots" content="noindex" />
      )}
      {name === 'manyrequests' && <meta name="robots" content="noindex" />}
      {name === 'dema' && router?.pathname?.includes('changelog') && (
        <meta name="robots" content="noindex" />
      )}

      {subscriptionStatus === 'paid'
        ? helpcenter
          ? activeHelpCenter.externalDomain && (
              <link
                rel="canonical"
                href={`${activeHelpCenter.externalDomain}${
                  router.asPath === '/' ? '' : getPathWithoutQuery(router.asPath)
                }`}
              />
            )
          : customDomain && (
              <link
                rel="canonical"
                href={`https://${customDomain}${
                  router.asPath === '/' ? '' : getPathWithoutQuery(router.asPath)
                }`}
              />
            )
        : null}

      <link rel="mask-icon" href={picture ? picture : '/'} color={color} />
      <meta name="msapplication-TileColor" content={color} />
      <meta name="theme-color" content={color} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={displayName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* existing meta tags */}
      <meta property="og:title" content={`${page}${!hideName ? ` - ${displayName}` : ''}`} />
      <meta property="og:description" content={description || defaultDescription} />
      {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={`${page}${!hideName ? ` - ${displayName}` : ''}`} />
      <meta name="twitter:description" content={description || defaultDescription} />
      {ogImageUrl && <meta property="twitter:image" content={ogImageUrl} />}
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )
}
export default SeoMetaPublic
