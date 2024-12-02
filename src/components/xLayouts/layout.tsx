'use client';

import ChatbotWidget from '@/components/chatbot/Widget/ChatbotWidget';
import Intercom from '@/components/intercom';
import Navbar from '@/components/layout/Navbar/navbar';
import useUser from '@/components/useUser';
import { useTrack } from '@splitsoftware/splitio-react';
import clsx from 'clsx';
import { Inter } from 'next/font/google';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import FeaturebaseFeedbackWidget from '../featurebaseSurveyWidget/featurebaseFeedbackWidget';
import FeaturebaseSurvey from '../featurebaseSurveyWidget/featurebaseSurveyWidget';
import UpsellBanner from '../Rating/UpsellBanner/UpsellBanner';
import { TooltipProvider } from '../ui/tooltip';

type LayoutContextProps = {
  upgradePlanModal?: boolean;
  handleUpgradePlanModal?: (params: boolean) => void;
  navbarHeight: number | null;
};

export const Context = createContext<LayoutContextProps | null>(null);

const inter = Inter({
  subsets: ['latin'],
});

type LayoutProps = React.PropsWithChildren & {
  className?: string;
  contentClassName?: string;
};

export default function Layout({
  children,
  className,
  contentClassName,
}: LayoutProps) {
  const user = useUser();
  const [navbarHeight, setNavbarHeight] = useState<number | null>(null);

  const onHeightChange = (height: number) => {
    setNavbarHeight(height); // Update the navbar height state
    // Perform any other actions based on the navbar height change
  };

  const [upgradePlanModal, setUpgradePlanModal] = useState(false);

  const track = useTrack();

  const handleUpgradePlanModal = useCallback(
    (params: boolean) => {
      setUpgradePlanModal(params);
      track?.('user', 'upgrade_plan');
    },
    [track],
  );

  const value = useMemo(
    () => ({ upgradePlanModal, handleUpgradePlanModal, navbarHeight }),
    [upgradePlanModal, handleUpgradePlanModal, navbarHeight],
  );

  return (
    <TooltipProvider>
      <Context.Provider value={value}>
        <div
          className={`${user?.isLoggedIn ? 'h-auto' : 'h-screen min-h-screen'} flex min-h-screen w-full min-w-[100%] flex-col $${inter.className} ${className}`}
        >
          <Navbar onHeightChange={onHeightChange} />
          <main className="relative flex h-[100%] flex-1 flex-col">
            <div
              className={clsx(`flex h-full w-[100%] flex-1`, contentClassName)}
            >
              {children}
            </div>
          </main>
        </div>
        <FeaturebaseFeedbackWidget />
        <FeaturebaseSurvey />
        {user?.isLoggedIn && <Intercom user={user} />}
        <ChatbotWidget />

        <UpsellBanner
          upgradePlanModal={upgradePlanModal}
          handleUpgradePlanModal={handleUpgradePlanModal}
        />
      </Context.Provider>
    </TooltipProvider>
  );
}

export const useLayoutContext = () => {
  const context = useContext(Context);
  if (context === null) {
    throw new Error('useLayoutContext must be used within a LayoutProvider');
  }
  return context;
};
