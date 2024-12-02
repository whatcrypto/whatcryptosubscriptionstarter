export const urls = {
  app: {
    base: "https://app.whatcrypto.org",
    oidc: "https://oidc.whatcrypto.org",
    tradingBot: "https://tradingbotapi-ckxbxkknxa-df.a.run.app",
  },

  storage: {
    s3: {
      base: "https://whatcrypto.s3.amazonaws.com",
      icons: {
        placeholder: {
          color: "https://whatcrypto.s3.amazonaws.com/icons/icon-placeholder-color.png",
          black: "https://whatcrypto.s3.amazonaws.com/icons/icon-placeholder.png",
        },
        token: (cgId: string) => 
          `https://whatcrypto.s3.amazonaws.com/icons/${cgId.toLowerCase().replace(/ /g, "-")}_large.png`,
      }
    }
  },

  api: {
    token: {
      base: "/api/token",
      tvDetail: "/api/token/getTvData",
      prediction: "/api/token/getPredictionData",
      chartData: "/api/token/getChartData",
      investmentResearch: "/api/token/getInvestmentResearchData",
      markets: "/api/token/markets",
      favorite: "/api/token-detail/favorite",
      cacheDataByCgId: (cgId: string) => `/api/token/cacheDataByCgId?cg_id=${cgId}`,
      cacheDataByTokenId: (tokenId: number) => `/api/token/cacheDataByTokenId/${tokenId}`,
      cacheStatsData: (id: number) => `/api/token/cacheStatsData/${id}`,
      chartByCgId: (cgId: string) => `/api/token/chart?cg_id=${cgId}`,
      forecastByCgId: (cgId: string) => `/api/token/forecast?cg_id=${cgId}`,
    },
    trader: {
      reportByCgId: (cgId: string) => `/api/token_detail/trader_report?cg_id=${cgId}`,
    },
    investor: {
      reportByCgId: (cgId: string) => `/api/token_detail/investor_report?cg_id=${cgId}`,
    },
    coingecko: {
      base: "/api/coingecko",
      exchanges: (cgId: string) => `/api/coingecko/exchanges?cg_id=${cgId}`,
    },
    user: {
      base: "/api/users",
      update: "/api/users/updateUser",
      changePassword: "/api/users/change-password",
      basic: "/api/users/basic-user",
      defaultPage: "/api/users/default-page",
      delete: "/api/users/deleteUser",
      cancelPlan: "/api/users/cancel-plan",
    }
  },

  help: {
    indices: "https://help.whatcrypto.org/articles/8486525-indices-tutorial",
    ratings: "https://help.whatcrypto.org/articles/5359788-ratings-page-tutorial",
    pricePrediction: "https://help.whatcrypto.org/collections/2593474-price-predictions",
    affiliateProgram: "https://help.whatcrypto.org/collections/2091910-affiliate-referral-program",
  },

  external: {
    analytics: {
      google: {
        analytics: "https://*.google-analytics.com",
        tagManager: "https://*.googletagmanager.com",
        doubleClick: "https://*.g.doubleclick.net",
      },
      posthog: "https://app.posthog.com",
      twitter: {
        ads: "ads-twitter.com",
        adsApi: "ads-api.twitter.com",
        analytics: "analytics.twitter.com",
      }
    },
    services: {
      stripe: "https://api.stripe.com",
      sentry: "https://o4504213851144192.ingest.sentry.io",
      customerio: "track.customer.io",
      churnkey: "https://api.churnkey.co",
      intercom: {
        websocketA: {
          https: "https://nexus-websocket-a.intercom.io",
          wss: "wss://nexus-websocket-a.intercom.io",
        },
        websocketB: {
          https: "https://nexus-websocket-b.intercom.io",
          wss: "wss://nexus-websocket-b.intercom.io",
        },
        websocketEurope: {
          https: "https://nexus-europe-websocket.intercom.io",
          wss: "wss://nexus-europe-websocket.intercom.io",
        },
        websocketAustralia: {
          https: "https://nexus-australia-websocket.intercom.io",
          wss: "wss://nexus-australia-websocket.intercom.io",
        },
        uploads: {
          cdn: "https://uploads.intercomcdn.com",
          cdnEu: "https://uploads.intercomcdn.eu",
          cdnAu: "https://uploads.au.intercomcdn.com",
          user: "https://uploads.intercomusercontent.com",
        }
      }
    }
  }
}; 