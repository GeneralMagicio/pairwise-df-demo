import React, { FC, useState, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { usePathname, useRouter } from 'next/navigation';
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

interface HeaderProps {
  progress?: number
  category?: string
  question?: string
  isFirstSelection?: boolean
}

const PAIRWISE_REPORT_URL
  = 'https://github.com/GeneralMagicio/pairwise-rf6/issues/new?assignees=MoeNick&labels=&projects=&template=report-an-issue.md&title=%5BFeedback%5D+';

const HeaderRF6: FC<HeaderProps> = ({
  progress,
  category,
  question,
  isFirstSelection = false,
}) => {
  const path = usePathname();
  const router = useRouter();
  const { data: badges } = useGetPublicBadges();
  const { data: delegates } = useGetDelegationStatus();
  const { address, chainId } = useAccount();

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

      <div className="relative z-40 flex w-full flex-row justify-between gap-10 border-b bg-white">
        {!isFirstSelection && (
          <div onClick={() => router.push('/allocation')} className="flex cursor-pointer items-center">
            <PwLogo />
          </div>
        )}
        <div className="flex grow items-center justify-start px-6 py-4 md:px-12 lg:px-4">

          {category && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-center text-sm text-dark-500">
              {category}
            </span>
          )}
          <div className="flex items-center gap-4">

            {question && (
              <div className={`py-2 ${isFirstSelection ? 'px-0' : 'px-4'}`}>
                <h2 className="text-center text-xl font-semibold">{question}</h2>
              </div>
            )}
            <div
              className={`${
                category ? 'hidden 2xl:flex' : 'flex'
              } items-center gap-4`}
            >
              {/* {activeBadges.length > 0 && (
                <button
                  onClick={() => setIsBadgesModalOpen(true)}
                  className="mr-3 flex items-center"
                >
                  <ActiveBadges activeBadges={activeBadges} />
                </button>
              )} */}

            </div>

          </div>

        </div>
        <div className="mx-2 my-auto">
          <ConnectButton />
        </div>
        <div className="mx-2 my-auto">
          <button
            className="flex items-center justify-center gap-2 rounded-lg border border-gray-200 p-2 text-sm font-semibold"
            onClick={() => window.open(PAIRWISE_REPORT_URL, '_blank')}
          >
            Report an issue
            <ThinExternalLinkIcon />
          </button>
        </div>
        {/* <div className='my-auto'> */}
        {/* <Dropdown customClass={category ? '2xl:hidden' : 'hidden'}>
              <div className="flex flex-col gap-2">
                {activeBadges.length > 0 && (
                  <>
                    <div className="flex items-center justify-between gap-2 py-2">
                      <p className="text-sm text-gray-600">Your budges</p>
                      <button
                        onClick={() => setIsBadgesModalOpen(true)}
                        className="mr-3 flex items-center"
                      >
                        <ActiveBadges activeBadges={activeBadges} />
                      </button>
                    </div>
                    <hr className="my-2 border-t border-gray-200" />
                  </>
                )}
                <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 p-2 font-semibold">
                  {loginAddress?.value && (
                    <p className="text-dark-500">
                      {shortenWalletAddress(loginAddress?.value)}
                    </p>
                  )}
                </div>
                <button
                  className="flex items-center justify-center gap-2 p-2 font-semibold"
                  onClick={() => window.open(PAIRWISE_REPORT_URL, '_blank')}
                >
                  Report an issue
                  <ThinExternalLinkIcon />
                </button>
                <hr className="my-2 border-t border-gray-200" />
                <button
                  onClick={logout}
                  className="flex w-full items-center justify-center gap-2 py-2"
                >
                  <PowerIcon />
                  <span className="font-semibold text-primary"> Log out </span>
                </button>
              </div>
            </Dropdown> */}
        {/* </div> */}

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
