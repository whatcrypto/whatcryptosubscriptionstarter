let isInitialized = false

export const initializePostHog = async () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    const { default: posthog } = await import('posthog-js')
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.opt_out_capturing()
      },
    })
    isInitialized = true
  }
}

export const capturePageView = async () => {
  if (typeof window !== 'undefined' && !isInitialized) {
    await initializePostHog()
  }
  const { default: posthog } = await import('posthog-js')
  if (typeof posthog.capture === 'function') {
    posthog.capture('$pageview')
  }
}
