'use client';

import postHog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { PropsWithChildren, Suspense } from 'react';

import PostHogPageView from './PostHogPageView';

if (typeof window !== 'undefined') {
  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_API_KEY;
  const apiHost = process.env.NEXT_PUBLIC_POSTHOG_API_HOST;

  if (apiKey && apiHost) {
    postHog.init(apiKey, {
      api_host: apiHost,
      capture_pageview: false,
    });
  }
}

const PostHogProvider = ({ children }: PropsWithChildren) => {
  return (
    <PHProvider client={postHog}>
      {children}
      <Suspense fallback={'...'}>
        <PostHogPageView />
      </Suspense>
    </PHProvider>
  );
};

export default PostHogProvider;
