import {
  KnockFeedProvider,
  KnockProvider,
  NotificationFeedPopover,
  UnseenBadge,
  type ColorMode,
} from '@knocklabs/react';
import { useTheme } from 'next-themes';
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { GoBell } from 'react-icons/go';

import { Button } from '@/components/ui/button';
import useUser from '@/components/useUser';
import { cn } from '@/lib/utils';

// Required CSS import, unless you're overriding the styling
import componentIDs from '@/constants/componentIDs';
import '@knocklabs/react/dist/index.css';

export default function NotificationFeed({
  className = '',
}: {
  readonly className?: string;
}) {
  const user = useUser();
  const { theme } = useTheme();

  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  if (!user.isLoggedIn) return null;

  return (
    <div className={className}>
      <KnockProvider
        apiKey={process.env.NEXT_PUBLIC_KNOCK_CLIENT_ID!}
        userId={String(user.userID)}
      >
        <KnockFeedProvider
          feedId={process.env.NEXT_PUBLIC_KNOCK_FEED_CHANNEL_ID!}
          colorMode={(theme || 'light') as ColorMode}
        >
          <>
            <NotificationButton
              notifButtonRef={notifButtonRef}
              isVisible={isVisible}
              setIsVisible={setIsVisible}
            />

            <NotificationFeedPopover
              buttonRef={notifButtonRef}
              isVisible={isVisible}
              onClose={() => setIsVisible(false)}
            />
          </>
        </KnockFeedProvider>
      </KnockProvider>
    </div>
  );
}

function NotificationButton({
  notifButtonRef,
  isVisible,
  setIsVisible,
}: {
  notifButtonRef: MutableRefObject<null>;
  isVisible: boolean;
  setIsVisible: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Button
      className={cn(
        'relative hidden h-[30px] w-[30px] items-center justify-center rounded-[4px] border border-[#E6E9EF] bg-[#ffffff] p-0 dark:border-[#414249] dark:bg-[#1a1a20] sm:flex xsl:h-[40px] xsl:w-[40px]',
      )}
      ref={notifButtonRef}
      onClick={() => setIsVisible(!isVisible)}
      id={componentIDs.header.notificationsDropdownButton}
    >
      <UnseenBadge />
      <GoBell className="text-[16px]" />
    </Button>
  );
}
