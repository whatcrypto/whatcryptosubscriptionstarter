import { getCSP, EVAL, INLINE, SELF, BLOB, DATA, NONE, REPORT_SAMPLE } from 'csp-header'

interface CSPOptions {
  allowAllIframes?: boolean
}

export function createCSP(options: CSPOptions = { allowAllIframes: false }) {
  const { allowAllIframes } = options

  const csp = getCSP({
    directives: {
      'default-src': [SELF],
      'base-uri': [NONE],
      'script-src': [
        SELF,
        REPORT_SAMPLE,
        INLINE,
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? EVAL : '',
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'http:' : '',
        process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' ? 'https:' : '',
        // intercom
        'https://app.intercom.io',
        'https://widget.intercom.io',
        'https://js.intercomcdn.com',
        // churnkey
        'https://assets.churnkey.co',
        // fb
        'https://featurebase.app',
        'https://*.featurebase.app',
        // posthog
        'https://app.posthog.com',
        // rewardful
        'https://r.wdfl.co/rw.js',
        // stripe
        'https://js.stripe.com',
        'https://maps.googleapis.com',

        // gtag
        'https://www.googletagmanager.com',
        'https://*.googletagmanager.com',

        // recaptcha
        'https://www.google.com/recaptcha/',
        'https://www.gstatic.com/recaptcha/',

        // customerio
        'assets.customer.io',

        // twitter
        'https://static.ads-twitter.com',

        // Zendesk
        'https://static.zdassets.com',

        'https://tb.featurebaseapp.com',
        'https://tbi.featurebaseapp.com',
      ],

      'style-src': [
        REPORT_SAMPLE,
        SELF,
        INLINE,
        'https://featurebase.app',
        'https://*.featurebase.app',
        'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com',
        'https://fb-usercontent.fra1.digitaloceanspaces.com',
        'https://fonts.googleapis.com',
        'https://assets.churnkey.co',
        // Rewardful
        'https://r.wdfl.co/rw.js',
      ],

      'frame-src': allowAllIframes
        ? ['*']
        : [
            SELF,
            'https://featurebase.app',
            'https://*.featurebase.app',
            'https://www.youtube.com',
            'https://youtube.com',
            'https://youtu.be',
            'https://*.youtube.com',
            'https://*.youtu.be',
            'https://www.google.com/recaptcha/',
            'https://www.gstatic.com/recaptcha/',

            // intercom
            'https://youtube.com',
            'https://intercom-sheets.com',
            'https://www.intercom-reporting.com',
            'https://player.vimeo.com',
            'https://fast.wistia.net',

            // Descript
            'https://share.descript.com/',
            'https://*.descript.com/',

            // Loom
            'https://www.loom.com/',

            // stripe
            'https://js.stripe.com',
            'https://hooks.stripe.com',

            // recaptcha
            'https://www.google.com/recaptcha/',
            'https://recaptcha.google.com/recaptcha/',
          ],

      'child-src': allowAllIframes
        ? ['*']
        : [
            'https://featurebase.app',
            'https://*.featurebase.app',
            'https://www.youtube.com',
            'https://youtu.be',
            'https://*.youtube.com',
            'https://*.youtu.be',
            // intercom
            'https://youtube.com',
            'https://intercom-sheets.com',
            'https://www.intercom-reporting.com',
            'https://player.vimeo.com',
            'https://fast.wistia.net',

            // Descript
            'https://share.descript.com/',
            'https://*.descript.com/',

            // Loom
            'https://www.loom.com/',

            // stripe
            'https://js.stripe.com',
            'https://hooks.stripe.com',
          ],

      'object-src': [NONE],
      'block-all-mixed-content': true,
      'upgrade-insecure-requests': true,

      'img-src': [
        SELF,
        DATA,
        BLOB,
        'https://featurebase.app',
        'https://*.featurebase.app',
        'https://fb-usercontent.fra1.digitaloceanspaces.com',
        'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com',

        // Emoji Picker
        'https://cdn.jsdelivr.net',

        // Intercom
        'https://js.intercomcdn.com',
        'https://static.intercomassets.com',
        'https://downloads.intercomcdn.com',
        'https://downloads.intercomcdn.eu',
        'https://downloads.au.intercomcdn.com',
        'https://uploads.intercomusercontent.com',
        'https://gifs.intercomcdn.com',
        'https://video-messages.intercomcdn.com',
        'https://messenger-apps.intercom.io',
        'https://messenger-apps.eu.intercom.io',
        'https://messenger-apps.au.intercom.io',
        'https://*.intercom-attachments-1.com',
        'https://*.intercom-attachments.eu',
        'https://*.au.intercom-attachments.com',
        'https://*.intercom-attachments-2.com',
        'https://*.intercom-attachments-3.com',
        'https://*.intercom-attachments-4.com',
        'https://*.intercom-attachments-5.com',
        'https://*.intercom-attachments-6.com',
        'https://*.intercom-attachments-7.com',
        'https://*.intercom-attachments-8.com',
        'https://*.intercom-attachments-9.com',
        'https://static.intercomassets.eu',
        'https://static.au.intercomassets.com',
        // End Intercom

        // gtag
        'https://*.google-analytics.com',
        'https://*.googletagmanager.com',
        'https://*.analytics.google.com',
        'https://*.g.doubleclick.net',
        'www.googletagmanager.com',

        // customerio
        'track.customer.io',
        // ...googleDomains,

        // instatus
        'https://instatus.com',
        'https://dashboard.instatus.com',

        // twitter ads
        'ads-twitter.com',
        'ads-api.twitter.com',
        'analytics.twitter.com',

        // zendesk images are served from subdomain of the customer or 'assets.zendesk.com'. Has to be wildcarded.
        'https://*.zendesk.com',
      ],

      'media-src': [
        SELF,
        'https://featurebase.app',
        'https://*.featurebase.app',
        'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com',
        'https://fb-usercontent.fra1.digitaloceanspaces.com',
        // intercom
        'https://js.intercomcdn.com',
      ],

      'form-action': [
        REPORT_SAMPLE,
        SELF,
        INLINE,
        'https://featurebase.app',
        'https://*.featurebase.app',
        // intercom
        'https://intercom.help',
        'https://api-iam.intercom.io',
        'https://api-iam.eu.intercom.io',
        'https://api-iam.au.intercom.io',
      ],

      'font-src': [
        SELF,
        'https://fonts.gstatic.com',
        'https://fonts.googleapis.com',
        'https://js.intercomcdn.com',
        'https://fonts.intercomcdn.com',
      ],

      'connect-src': [
        SELF,
        'https://featurebase.app',
        'https://*.featurebase.app',
        'https://*.algolia.net',
        'https://*.algolianet.com',
        'https://*.algolia.io',
        // intercom
        'https://via.intercom.io',
        'https://api.intercom.io',
        'https://api.au.intercom.io',
        'https://api.eu.intercom.io',
        'https://api-iam.intercom.io',
        'https://api-iam.eu.intercom.io',
        'https://api-iam.au.intercom.io',
        'https://api-ping.intercom.io',
        'https://nexus-websocket-a.intercom.io',
        'wss://nexus-websocket-a.intercom.io',
        'https://nexus-websocket-b.intercom.io',
        'wss://nexus-websocket-b.intercom.io',
        'https://nexus-europe-websocket.intercom.io',
        'wss://nexus-europe-websocket.intercom.io',
        'https://nexus-australia-websocket.intercom.io',
        'wss://nexus-australia-websocket.intercom.io',
        'https://uploads.intercomcdn.com',
        'https://uploads.intercomcdn.eu',
        'https://uploads.au.intercomcdn.com',
        'https://uploads.intercomusercontent.com',
        // sentry
        'https://o4504213851144192.ingest.sentry.io',
        // posthog
        'https://app.posthog.com',

        // gtag
        'https://*.google-analytics.com',
        'https://*.analytics.google.com',
        'https://*.googletagmanager.com',
        'https://*.g.doubleclick.net',

        // stripe
        'https://api.stripe.com',
        'https://maps.googleapis.com',

        // customerio
        'track.customer.io',

        // churnkey
        'https://api.churnkey.co',

        // twitter ads
        'ads-twitter.com',
        'ads-api.twitter.com',
        'analytics.twitter.com',

        // ...googleDomains,
        // digitalocean
        'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com',

        'https://tb.featurebaseapp.com',
        'https://tbi.featurebaseapp.com',
      ],

      'manifest-src': [
        SELF,
        'https://featurebase.app',
        'https://*.featurebase.app',
        'https://fb-usercontent.fra1.digitaloceanspaces.com',
        'https://fb-usercontent.fra1.cdn.digitaloceanspaces.com',
      ],

      'worker-src': [
        BLOB,
        // intercom
        'https://youtube.com',
        'https://share.descript.com/',
        'https://*.descript.com/',
        'https://www.loom.com/',
        'https://intercom-sheets.com',
        'https://www.intercom-reporting.com',
        'https://player.vimeo.com',
        'https://fast.wistia.net',
      ],
      // 'report-uri': 'https://6519703008615f75764fbb76.endpoint.csper.io?v=0',
    },
  })

  return csp
}
