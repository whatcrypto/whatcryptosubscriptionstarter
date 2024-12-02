import Head from 'next/head'
const SeoMetaDashboard: React.FC<{
  page: string
}> = ({ page }) => (
  <Head>
    <title>{page}</title>
    <meta
      name="description"
      content={
        'Create a powerful free feedback board to capture, manage and organize your feedback, feature requests and bug reports. We help you build products your customers love.'
      }
    />
    <meta
      name="keywords"
      content={`customer feeback, featurebase feeback, feedback tool, featurebase, feature voting tool, manage user feedback, user feedback, customer feedback manager, upvoty, canny, hellonext`}
    />
    <meta name="robots" content="noindex" />
    <link rel="apple-touch-icon" sizes="180x180" href="/images/fav/apple-touch-icon.png" />
    <link rel="icon" type="image/png" sizes="32x32" href="/images/fav/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/images/fav/favicon-16x16.png" />
    <link rel="manifest" href="/images/fav/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@featurebasehq" />
    <meta name="twitter:title" content={'Featurebase - Customer Feedback Tool'} />
    <meta
      name="twitter:description"
      content={
        'Create a powerful free feedback board to capture, manage and organize your customer feedback, feature requests and bug reports. We help you build products your customers love.'
      }
    />
    <meta name="twitter:image" content={'https://featurebase.app/images/banner-new.jpg'} />
  </Head>
)
export default SeoMetaDashboard
