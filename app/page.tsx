'use client';

import dynamic from 'next/dynamic';
import { PwLogo } from '@/public/assets/icon-components/PairwiseLogo';
import { ConnectButton } from './utils/wallet/Connect';
import { LandingPart0 } from './landing/part0';

const NoSSRModals = dynamic(() => import('./utils/wallet/Modals'), {
  ssr: false,
});

const Landing = () => {
  return (
    <div className="relative min-h-screen w-full bg-[#F2F3F8] bg-river-left-right bg-river bg-no-repeat">
      <NoSSRModals />
      <div className="mx-[120px] w-[90%] space-y-8 pt-4 sm:w-[85%]">
        <div className="sticky top-0 z-[5] flex h-24 w-full items-center justify-between">
          <span className="flex size-32 items-center sm:size-40 md:size-60 lg:size-full">
            <div className="flex flex-col justify-end bg-[#F2F3F8]">
              <PwLogo />
              <div className="text-end text-sm">for Deep Funding</div>
            </div>
          </span>
          <ConnectButton />
        </div>
        <LandingPart0 />
      </div>
    </div>
  );
};

export default Landing;
