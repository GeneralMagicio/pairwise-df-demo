import React, { FC, useState, useEffect, useMemo } from 'react';
// import { useAccount } from 'wagmi';
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ConnectButton } from '@/app/utils/wallet/Connect';
import { PwLogo } from '@/public/assets/icon-components/PairwiseLogo';
import { ThinExternalLinkIcon } from '@/public/assets/icon-components/ThinExternalLink';
import { BadgesEnum, IActiveBadge } from './ActiveBadges';
import Modal from '../../utils/Modal';
import BadgesModal from './modals/BadgesModal';
import { useGetPublicBadges } from '@/app/utils/getBadges';
import DelegationsModal from './modals/DelegationsModal';
import { useGetDelegationStatus } from '@/app/utils/getConnectionStatus';
import StorageLabel from '@/app/lib/localStorage';
import { ArrowLeft2Icon } from '@/public/assets/icon-components/ArrowLeft2';
import { useAuth } from '@/app/utils/wallet/AuthProvider';

interface HeaderProps {
  progress?: number
  category?: string
  projImage?: string
  // question?: string
  isFirstSelection?: boolean
  showBackButton?: boolean
  allEvaluation?: boolean
}

const PAIRWISE_REPORT_URL
  = 'https://github.com/GeneralMagicio/pairwise-df-demo/issues/new?assignees=MoeNick&labels=&projects=&template=report-an-issue.md&title=%5BFeedback%5D+';

const HeaderRF6: FC<HeaderProps> = ({
  progress,
  category,
  projImage,
  showBackButton,
  // question,
  allEvaluation,
  isFirstSelection = false,
}) => {
  const path = usePathname();
  const router = useRouter();
  const { data: badges } = useGetPublicBadges();
  const { data: delegates } = useGetDelegationStatus();
  const { githubHandle: address } = useAuth();
  const chainId = 'github';
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isDelegateModalOpen, setIsDelegateModalOpen] = useState(false);
  const [isBarFixed, setIsBarFixed] = useState(false);

  const activeBadges = useMemo(() => {
    if (!badges || !Object.keys(badges).length) return [];

    const { recipientsPoints, badgeholderPoints, holderType, delegateType }
      = badges;
    const activeBadgesArray: IActiveBadge[] = [];
    if (holderType) {
      activeBadgesArray.push({
        type: BadgesEnum.HOLDER,
        variation: holderType,
      });
    }
    if (delegateType) {
      activeBadgesArray.push({
        type: BadgesEnum.DELEGATE,
        variation: delegateType,
      });
    }
    if (badgeholderPoints) {
      activeBadgesArray.push({
        type: BadgesEnum.BADGE_HOLDER,
      });
    }
    if (recipientsPoints) {
      activeBadgesArray.push({
        type: BadgesEnum.RECIPIENT,
      });
    }
    return activeBadgesArray;
  }, [badges]);

  useEffect(() => {
    const HEADER_HEIGHT = 80;

    const handleScroll = () => {
      if (window.scrollY > HEADER_HEIGHT) {
        setIsBarFixed(true);
      }
      else {
        setIsBarFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!category || !chainId || !delegates) return;

    const currentUserKey = `${chainId}_${address}`;

    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.PRE_VOTING_DELEGATION_POPUP) || '{}'
    );

    const categories = storedData[currentUserKey] || {};
    const isAlreadyShown = categories[category];

    if (
      path.includes('comparison')
      && delegates?.toYou?.uniqueDelegators
      && !isAlreadyShown
    ) {
      setIsDelegateModalOpen(true);
    }
  }, [path]);

  const markAsShown = () => {
    if (!category || !chainId || !delegates) return;

    const currentUserKey = `${chainId}_${address}`;

    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.PRE_VOTING_DELEGATION_POPUP) || '{}'
    );

    const categories = storedData[currentUserKey] || {};

    localStorage.setItem(
      StorageLabel.PRE_VOTING_DELEGATION_POPUP,
      JSON.stringify({
        ...storedData,
        [currentUserKey]: {
          ...categories,
          [category]: true,
        },
      })
    );

    setIsDelegateModalOpen(false);
  };

  return (
    <>
      <Modal
        isOpen={isBadgesModalOpen || isDelegateModalOpen}
        onClose={() => {
          if (isDelegateModalOpen) markAsShown();
          else setIsBadgesModalOpen(false);
        }}
        showCloseButton
      >
        {isBadgesModalOpen && <BadgesModal badges={activeBadges} />}
        {isDelegateModalOpen && (
          <DelegationsModal
            category={category}
            badges={activeBadges}
            delegates={delegates}
            onClose={markAsShown}
          />
        )}
      </Modal>

      <div className="relative z-40 flex w-full flex-row justify-between gap-6 border-b bg-white px-10 py-6">
        {!allEvaluation && !category && !isFirstSelection && (
          <div onClick={() => router.push('/allocation')} className="m-3 flex cursor-pointer items-center">
            <PwLogo />
          </div>
        )}
        {showBackButton && (
          <button onClick={() => router.push('/allocation')} className="fles-row flex justify-center gap-1.5 rounded-lg border border-[#D0D5DD] px-4 py-2.5">
            <ArrowLeft2Icon color="#344054" />
            <span className="text-base font-semibold text-[#344054]">Back</span>
          </button>
        )}

        <div className="flex grow items-center justify-start">
          {allEvaluation && (
            <span className="text-xl font-bold">
              All Evaluations
            </span>
          )}
          <div className="flex flex-row justify-center gap-2 text-dark-600">
            {projImage && (
              <span>
                <Image src={projImage} alt="repo image" width={24} height={24} />
              </span>
            )}
            <span className="font-semibold">
              {category}
            </span>
          </div>
          {/* {category && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-center text-sm text-dark-500">
              {category}
            </span>
          )} */}
          {/* <div className="flex items-center gap-4">

            {category && (
              <>
                <div className={`py-2 ${isFirstSelection ? 'px-0' : 'px-4'}`}>
                  <span className="mr-4 rounded-full bg-gray-200 px-3 py-1 text-center text-sm text-dark-500">
                    {category}
                  </span>
                  <span className="text-center text-lg font-semibold">
                    Which dependency gets more credit for
                    {' '}
                    {category}
                    's success?
                  </span>
                </div>
              </>
            )}
            <div
              className={`${
                category ? 'hidden 2xl:flex' : 'flex'
              } items-center gap-4`}
            >

            </div>

          </div> */}

        </div>
        <div className="mx-2 my-auto flex flex-row gap-4">
          <ConnectButton />
          <button
            className="flex items-center justify-center gap-2 text-nowrap rounded-lg border border-gray-200 p-2 text-sm font-semibold"
            onClick={() => window.open(PAIRWISE_REPORT_URL, '_blank')}
          >
            Report an issue
            <ThinExternalLinkIcon />
          </button>
        </div>
      </div>
      {category && (
        <div
          className={`h-1.5 w-full bg-gray-100 ${
            isBarFixed ? 'fixed left-0 top-0 z-50 w-full' : ''
          }`}
        >
          <div
            className="relative h-full bg-primary"
            style={{ width: `${progress}%` }}
          >

            <div className={`${!isBarFixed ? 'shadow-tooltip-shadow absolute right-0 top-0 z-50 -translate-y-1/2 rounded-md border-gray-border bg-white px-3 py-2 text-[#344054]' : 'hidden'}`}>
              {progress?.toFixed(2)}
              %
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderRF6;
