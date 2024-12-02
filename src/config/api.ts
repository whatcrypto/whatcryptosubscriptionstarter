import { PeriodType } from "@/types/default";

const config = {
  indices: {
    traders_portfolio: "/api/indices/traders-portfolio",
    traders_roi: "/api/indices/traders-roi",
    traders_holding: "/api/indices/traders-holding",
    traders_transactions: "/api/indices/traders-transactions",
    traders_transactions_log: "/api/indices/traders-transactions-log",

    investor_portfolio: "/api/indices/investor-portfolio",
    investor_roi: "/api/indices/investor-roi",
    investor_holding: "/api/indices/investor-holding",
    investor_transactions: "/api/indices/investor-transactions",
    investor_transactions_log: "/api/indices/investor-transactions-log",
    index_alerts: "/api/indices/index-alerts",
  },
  tradingBot: {
    saveExchangeAPIKey: "/api/trading-bot/save-exchange-api",
    testExchangeAPIKey: "/api/trading-bot/test-exchange-api",
    deleteExchangeAPIKey: "/api/trading-bot/delete-exchange-api",
    getExchangeInfo: "/api/trading-bot/get-exchange",
    submitBot: "/api/trading-bot/submit-bot",
    changeBotPosition: "/api/trading-bot/change-bot-position",
    updateBotNotification: "/api/trading-bot/update-bot-notification",
    exitBot: "/api/trading-bot/exit-bot",
    exitAllBots: "/api/trading-bot/exit-all-bots",
    botList: "/api/trading-bot/bot-list",
    performanceOverview: "/api/trading-bot/performance-overview",
    botsPerformanceList: "/api/trading-bot/bots-performance-list",
    performanceChart: "/api/trading-bot/performance-chart",
    tradeHistory: "/api/trading-bot/trade-history",
  },
  tokens: {
    tokenList: "/api/token/token-list",
    trendingToken: "/api/token/trending-token",
  },
  tokenDetail: {
    tokenId: "tokenId",
    tokenGrades: "/api/token/grades?cg_id=",
    tokenTechnology: "/api/token/technology?cg_id=",
    tokenFundamentalAnalysis: "/api/token/fundamental/analysis?cg_id=",
    tokenCurrencyConversion: "/api/token/currency/conversion?cg_id=",
    tokenStatistic: "/api/token/statistics?cg_id=",
    tokenPriceTvOhlcv: "/api/token/price/tv/ohlcv?cg_id=",
    tokenCorrelation: "/api/token/correlation?cg_id=",
    tokenFrama: (cgId: string, period: PeriodType) => {
      return `/api/token/frama?cg_id=${cgId}&period=${period}`;
    },
    tokenPerformanceMetrics: (cgId: string, period: PeriodType) => {
      return `/api/performance/metrics?cg_id=${cgId}&period=${period}`;
    },
    tokenNews: "/api/token/news?cg_id=",
    tokenVideos: "/api/token/videos?cg_id=",
    tokenScenarioAnalysis: "/api/tokens/scenario/analysis?cg_id=",
    tokenPricePrediction: (cgId: string) => {
      return `/api/tokens/price/prediction?cg_id=${cgId}`;
    },
    tokenAnalytics: "/api/token/analytics?cg_id=",
    tokenData: "api/token/tokenDataByTokenName",
    tokenTechCombinedStatsData: "api/token/tokenTechCombinedStatsData",
    AIReport: "api/token/AIReport",
    tvDetail: "api/token/getTvData",
    prediction: "api/token/getPredictionData",
    chartData: "api/token/getChartData",
    fakeData: "fake",
    investmentResearch: "api/token/getInvestmentResearchData",
    markets: "/api/token/markets",
    favoriteToken: "/api/token-detail/favorite",
    cacheDataByCgId: (cgId: string) => {
      return `/api/token/cacheDataByCgId?cg_id=${cgId}`;
    },
    cacheDataByTokenId: (tokenId: number) => {
      return `/api/token/cacheDataByTokenId/${tokenId}`;
    },
    cacheStatsDataById: (id: number) => {
      return `/api/token/cacheStatsData/${id}`;
    },
    chartDataByCgId: (cgId: string) => {
      return `/api/token/chart?cg_id=${cgId}`;
    },
    forecastDataByCgId: (cgId: string) => {
      return `/api/token/forecast?cg_id=${cgId}`;
    },
    aiTraderReportDataByCgId: (cgId: string) => {
      return `/api/token_detail/trader_report?cg_id=${cgId}`;
    },
    aiInvestorReportDataByCgId: (cgId: string) => {
      return `/api/token_detail/investor_report?cg_id=${cgId}`;
    },
  },
  coingecko: {
    btc_eth_price: "btc_eth_price",
    market_detail: "market_detail",
    exchangesByCgId: (cgId: string) => {
      return `/api/coingecko/exchanges?cg_id=${cgId}`;
    },
  },
  user: {
    userID: "userID",
    userInfo: "user",
    updateUser: "/api/users/updateUser",
    changePassword: "/api/users/change-password",
    plan: "plan",
    basicUser: "/api/users/basic-user",
    defaultPage: "/api/users/default-page",
    deleteUser: "/api/users/deleteUser",
    cancelPlan: "/api/users/cancel-plan",
  },
  ratings: {
    analytics: "/api/ratings/analytics",
    analyticsTrader: "/api/ratings/analytics/trade",
    analyticsInvestor: "/api/ratings/analytics/investor",
    categories: "/api/ratings/categories",
    tokenCount: "/api/ratings/tokenCount",
    exchanges: "/api/ratings/exchanges",
    columns: "/api/ratings/columns",
    updateColumns: "/api/ratings/updateColumns",
    dailyTrading: "/api/ratings/dailyTrading",
    favorites: "/api/ratings/favorites",
    top10Tokentreatment: "top_10_token",
    upgradePlan: "/api/ratings/upgradePlan",
    ratingData: "/api/ratings/ratingData",
    userPlan: "/api/ratings/userPlan",
    dataSynch: "/api/ratings/dataSynch",
  },
  market: {
    sectorAnalysis: "/api/market/sectorAnalysis",
    bestDailyPerformers: "/api/market/bestDailyPerformers",
    worstDailyPerformers: "/api/market/worstDailyPerformers",
    recentlyTurnedBullish: "/api/market/recentlyTurnedBullish",
    recentlyTurnedBearish: "/api/market/recentlyTurnedBearish",
    researchReports: "/api/market/researchReports",
    mediumTermTrend: "/api/market/mediumTermTrend",
    marketMetrics: "/api/market/marketMetrics",
  },
  chatbot: {
    save_chat_history: "/api/chatbot/save-chat-history",
    share_preview_link: "/api/chatbot/preview",
    request_count_check: "/api/chatbot/request-count-check",
  },
  tokenlist: {
    createTokenList: "/api/tokenlist/create",
    updateTokenList: "/api/tokenlist/update",
    deleteTokenList: "/api/tokenlist/delete",
    fetchTokenListAnalyticsData: "/api/tokenlist/fetchtokenlistanalyticsdata",
    fetchTMTokenList: "/api/tokenlist/tmtokenlist",
    getOverallTradingRating: "api/tokenlist/overalltradingrating",
    getTokenlists: "/api/tokenlist/gettokenlists",
    addTokens: "/api/tokenlist/addtokens",
    insertNotifications: "/api/tokenlist/insertnotifications",
    getMyTokenList: (id: number) => {
      return `/api/tokenlist/getmytokenlist/${id}`;
    },
    getMyTokenListStat: (id: number, user: number) => {
      return `/api/tokenlist/getmytokenliststat/${id}/${user}`;
    },
    getMyTokenListAnalyticsData: (id: number, user: number) => {
      return `/api/tokenlist/fetchtokenlistanalyticsdata/${id}/${user}`;
    },
    getMyTokenLists: "/api/tokenlist/getmytokenlists",
    getTokenLists: (s: string, primaryTag: string, secondaryTags: string[]) => {
      return `/api/tokenlist/gettokenlists?s=${s}&primaryTag=${primaryTag}&secondaryTags=${secondaryTags}`;
    },
    tokenListAnalyticsData: (id: number, user: number) => {
      return `/api/tokenlist/fetchtokenlistanalyticsdata/${id}/${user}`;
    },
    getFundraisingData: "/api/tokenlist/fundraising",
    getTokenlistCategories: "/api/tokenlist/categories",
    getEcosystemNames: "/api/tokenlist/ecosystemNames",
    getTokenInvestorData: "/api/tokenlist/investorData",
    getGainersData: "/api/tokenlist/gainersData",
    getLosersData: "/api/tokenlist/losersData",
    getMyTokenListsRatings: (id: number) => {
      return `/api/tokenlist/getmytokenlistsratings/${id}`;
    },
    overallTradingRating: (id: number, user: number) => {
      return `/api/tokenlist/overalltradingrating/${id}/${user}`;
    },
    overallInvestorRating: (id: number, user: number) => {
      return `/api/tokenlist/overallinvestorrating/${id}/${user}`;
    },
    getGainersLosersData: (id: number, user: number) => {
      return `/api/tokenlist/gainerslosersdata/${id}/${user}`;
    },
    getMarketCapHistory: (id: number, user: number) => {
      return `/api/tokenlist/marketcaphistory/${id}/${user}`;
    },
    getFDVHistory: (id: number, user: number) => {
      return `/api/tokenlist/fdvhistory/${id}/${user}`;
    },
    getSumMcapAndFdvDifference: (id: number, user: number) => {
      return `/api/tokenlist/averagemcapandfdvdifference/${id}/${user}`;
    },
    getTags: "/api/tokenlist/gettags",
    updateUserNotificationSettings: "/api/tokenlist/updatenotification",
    deleteUserNotificationSetting: "/api/tokenlist/deletenotification",
  },
};

export default config;
