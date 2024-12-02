// Remove { Dict, Query } if not using TypeScript
import mixpanel, { Callback, Dict, Query, RequestOptions } from 'mixpanel-browser'

let mixpanelReady = false
if (
  typeof window !== 'undefined' &&
  window.location.hostname !== 'features.invmon.com' &&
  window.location.hostname !== 'invmon.featurebase.app'
) {
  mixpanel.init('28ed7b963398d2c490581475462854bf', {
    api_host: '/mp',
    loaded: () => {
      mixpanelReady = true
    },
    cross_subdomain_cookie: true,
    debug: false,
  })
  mixpanel.set_config({ debug: false, ignore_dnt: true })
}

type IMixpanelEventName = 'View dashboard' | 'Register Referrer'

// These were moved to backend for better tracking
// | 'Organization created'
// | 'Create post'
// | 'Create comment'
// | 'Create changelog'
// | 'Publish changelog'
// | 'Create survey'
// | 'Publish survey'
// | 'Click "Powered by"'
// | 'Upvote'
// | 'Payment success'
// | 'Start trial'
// | 'Add team member(s)'
export const Mixpanel = {
  isLoaded: () => mixpanelReady,
  register_once: (props: Dict) => mixpanel.register_once(props),
  identify: (id: string) => {
    mixpanel.identify(id)
  },
  alias: (id: string) => {
    mixpanel.alias(id)
  },
  track: (name: IMixpanelEventName, props: Dict, options?: RequestOptions, callBack?: Callback) => {
    try {
      mixpanel.track(name, props, options, callBack)
    } catch (error: any) {
      console.error('Mixpanel error:', error)
      callBack?.(error)
    }
  },
  track_links: (query: Query, name: string) => {
    mixpanel.track_links(query, name, {
      referrer: document.referrer,
    })
  },
  get_property: (name: string) => {
    return mixpanel.get_property(name)
  },
  people: {
    set: (props: Dict) => {
      mixpanel.people.set(props)
    },
    set_once: (props: Dict) => {
      mixpanel.people.set_once(props)
    },
    increment: (props: Dict) => {
      mixpanel.people.increment(props)
    },
  },
  reset: () => {
    return mixpanel.reset()
  },
}
