'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

const PostHogPageView = () => {
  const postHog = usePostHog();

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window?.origin + pathname;

      const searchParamsValue = searchParams?.toString();

      if (searchParamsValue) {
        url = url + '?' + searchParamsValue;
      }

      postHog.capture('$pageview', { $current_url: url });
    }
  }, [pathname, searchParams, postHog]);

  return null;
};

export default PostHogPageView;
