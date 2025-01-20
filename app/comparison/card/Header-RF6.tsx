import React, { FC, useState, useEffect, useMemo } from 'react';
// import { useAccount } from 'wagmi';
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
  votes?: number
  total?: number
}

export const RoundSize = 5;

const PAIRWISE_REPORT_URL
  = 'https://github.com/GeneralMagicio/pairwise-df-demo/issues/new?assignees=MoeNick&labels=&projects=&template=report-an-issue.md&title=%5BFeedback%5D+';

const HeaderRF6: FC<HeaderProps> = ({
  votes,
  category,
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

  const roundNumber = (votes: number) => Math.min(6, Math.floor(votes / RoundSize) + 1);
  const comparisonsFromCompletion = (votes: number) => votes % RoundSize;

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

        {allEvaluation && (
          <span className="text-xl font-bold">
            All Evaluations
          </span>
        )}

        <div className="flex grow items-center justify-start">
          {votes && (
            <div className="flex flex-row items-center justify-center gap-8 text-dark-600">
              <span className="text-lg font-bold">
                Voting Round
                {` ${roundNumber(votes)}`}
              </span>
              <span>
                {`${comparisonsFromCompletion(votes)} `}
                out of
                {` ${RoundSize} `}
                comparisons
              </span>
            </div>
          )}
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
    </>
  );
};

export default HeaderRF6;
