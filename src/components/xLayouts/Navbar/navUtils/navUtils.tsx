export const getAnalyticsRoutes = (t: Function) => ({
  mainHeading: t('navbar:homeHeaderAnalytics'),
  route: [
    {
      tabName: t('navbar:homeHeaderMarket'),
      urlName: '/market',
    },
    {
      tabName: t('navbar:homeHeaderRatings'),
      urlName: '/ratings',
    },
    {
      tabName: t('navbar:homeHeaderIndices'),
      urlName: '/indices',
    },
    // {
    //     tabName: t("navbar:homeHeaderTokenLists"),
    //     urlName: "/tokenlist/categories",
    // },
    // {
    //     tabName: t("navbar:homeHeaderPortfolio"),
    //     urlName: "/portfolio",
    // },
    // {
    //     tabName: t("navbar:homeHeaderLivePrice"),
    //     urlName: "/liveprice",
    // },
  ],
});

export const getRoutes = (t: Function) => [
  // {
  //     tabName: t("navbar:homeHeaderTradingBot"),
  //     urlName: "/trading-bot/highest-rated",
  // },
  {
    tabName: t('navbar:homeHeaderChatBot'),
    urlName: '/tmai',
  },
  {
    tabName: t('navbar:homeHeaderResearch'),
    urlName: 'https://research.tokenmetrics.com',
    newTab: true,
  },
];

export const getSupportRoutes = (t: Function) => ({
  mainHeading: t('navbar:homeHeaderSupport'),
  routesVar: {
    mainHeading: t('navbar:homeHeaderLearn'),
    minWidth: 170,
    route: [
      {
        tabName: t('navbar:homeHeaderIndices'),
        newTab: true,
        urlName:
          'https://help.tokenmetrics.com/en/articles/8486525-indices-tutorial',
      },
      {
        tabName: t('navbar:homeHeaderRatings'),
        newTab: true,
        urlName:
          'https://help.tokenmetrics.com/en/articles/5359788-ratings-page-tutorial?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
      },
      {
        tabName: t('navbar:homeHeaderPricePrediction'),
        newTab: true,
        urlName:
          'https://help.tokenmetrics.com/en/collections/2593474-token-metrics-price-predictions?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
      },
      // {
      //     tabName: t("navbar:homeHeaderMachineLearning"),
      //     newTab: true,
      //     urlName:
      //         "https://help.tokenmetrics.com/en/collections/2400222-token-metrics-machine-learning?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w",
      // },
      // {
      //     tabName: t("navbar:homeHeaderManagingPortfolio"),
      //     newTab: true,
      //     urlName:
      //         "https://help.tokenmetrics.com/en/collections/2593535-managing-a-portfolio-with-token-metrics?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w",
      // },
      {
        tabName: t('navbar:homeHeaderAffiliateProgram'),
        newTab: true,
        urlName:
          'https://help.tokenmetrics.com/en/collections/2091910-affiliate-referral-program?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
      },
      {
        tabName: t('navbar:homeHeaderFaq'),
        newTab: true,
        urlName:
          'https://help.tokenmetrics.com/en/collections/2036122-faqs-and-troubleshooting?_ga=2.215636695.1719762614.1701035992-1625637914.1700550321&_gl=1*1vcqhh9*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
      },
    ],
  },
  route: [
    {
      tabName: t('navbar:homeHeaderHelpMenu'),
      newTab: true,
      urlName:
        'https://help.tokenmetrics.com/en/?_ga=2.149100534.1719762614.1701035992-1625637914.1700550321&_gl=1*1uubbm3*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
    },
    {
      tabName: t('navbar:homeHeaderContactus'),
      urlName: 'https://www.tokenmetrics.com/contact-us',
      newTab: true,
    },
  ],
});

export const getMoreRoutes = (t: Function) => ({
  mainHeading: t('navbar:homeHeaderMore'),
  // routesVar: {
  //     mainHeading: t("navbar:homeHeaderPortfolio"),
  //     minWidth: 100,
  //     route: [
  //         {
  //             tabName: t("navbar:homeHeaderOverview"),
  //             urlName: "/overview",
  //         },
  //         {
  //             tabName: t("navbar:homeHeaderHoldings"),
  //             urlName: "/holdings",
  //         },
  //         {
  //             tabName: t("navbar:homeHeaderWatchlist"),
  //             urlName: "/watchlist",
  //         },
  //     ],
  // },
  route: [
    {
      tabName: t('navbar:homeHeaderAffiliates'),
      newTab: true,
      urlName:
        'https://affiliate.tokenmetrics.com/signup/?_ga=2.215169623.1719762614.1701035992-1625637914.1700550321&_gl=1*2wos3i*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
    },
  ],
});

export const getAdditionalResponsiveRoutes = (t: Function) => [
  {
    tabName: t('navbar:homeHeaderAffiliates'),
    newTab: true,
    urlName:
      'https://affiliate.tokenmetrics.com/signup/?_ga=2.215169623.1719762614.1701035992-1625637914.1700550321&_gl=1*2wos3i*_ga*MTYyNTYzNzkxNC4xNzAwNTUwMzIx*_ga_WW36F3TJ75*MTcwMTA4ODA4OC4xOC4xLjE3MDEwODgxMDMuNDUuMC4w',
  },
  {
    tabName: t('navbar:homeHeaderSettings'),
    urlName: '/settings',
  },
  {
    tabName: t('navbar:homeHeaderSignOut'),
    urlName: '/logout',
  },
];

export function getInitials(name: string) {
  // Extracts the first letter of the first and last names to form initials
  let names = name.split(' '),
    initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1 && names[names.length - 1]?.[0]?.toUpperCase()) {
    initials += names[names.length - 1][0].toUpperCase();
  }
  return initials;
}
