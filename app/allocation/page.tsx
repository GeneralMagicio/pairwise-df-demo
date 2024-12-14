'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useActiveWallet } from 'thirdweb/react';
import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { usePostHog } from 'posthog-js/react';
import HeaderRF6 from '../comparison/card/Header-RF6';
import Modal from '../utils/Modal';
import EmailLoginModal from './components/EOA/EmailLoginModal';

import CategoryAllocation from './components/CategoryAllocation';
import ConnectBox from './components/ConnectBox';
import { modifyPercentage, RankItem, roundFractions } from './utils';
import {
  categoryIdSlugMap,
  categorySlugIdMap,
  convertCategoryToLabel,
} from '../comparison/utils/helpers';
import { useCategories } from '../comparison/utils/data-fetching/categories';
import WorldIdSignInSuccessModal from './components/WorldIdSignInSuccessModal';
import FarcasterModal from './components/FarcasterModal';
import DelegateModal from '../delegation/DelegationModal';
import { FarcasterLookup } from '../delegation/farcaster/FarcasterLookup';
import FarcasterSuccess from '../delegation/farcaster/FarcasterSuccess';
import { axiosInstance } from '../utils/axiosInstance';
import { TargetDelegate } from '../delegation/farcaster/types';
import { useGetDelegationStatus } from '@/app/utils/getConnectionStatus';
import {
  ICategory,
  CollectionProgressStatusEnum,
} from '../comparison/utils/types';
import SmallSpinner from '../components/SmallSpinner';
import {
  useCategoryRankings,
  useUpdateCategoriesRanking,
} from '@/app/comparison/utils/data-fetching/ranking';
import { getJWTData } from '../utils/wallet/agora-login';
import { attest, AttestationState, VotingHasEnded } from './[category]/attestation';
import AttestationError from './[category]/attestation/AttestationError';
import AttestationLoading from './[category]/attestation/AttestationLoading';
import AttestationSuccessModal from './[category]/attestation/AttestationSuccessModal';
import { useSigner } from './[category]/utils';
import BadgeholderModal from './components/BadgeholderModal';
import StorageLabel from '../lib/localStorage';
// import { UpdateBallotButton } from './[category]/components/UpdateBallotButton';
import AskDelegations from '../delegation/farcaster/AskDelegations';
import XModal from './components/XModal';

enum DelegationState {
  Initial,
  DelegationMethod,
  Lookup,
  Success,
}

const AllocationPage = () => {
  const wallet = useActiveWallet();
  const router = useRouter();
  const signer = useSigner();
  const { chainId, address } = useAccount();
  const { isBadgeholder, category } = getJWTData();
  const posthog = usePostHog();

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: delegations, isLoading: delegationsLoading }
    = useGetDelegationStatus();
  const { data: categoryRankings } = useCategoryRankings();

  const queryClient = useQueryClient();

  const colDelegationToYou = delegations?.toYou?.collections;
  const colDelegationFromYou = delegations?.fromYou?.collections;

  const [attestationState, setAttestationState] = useState(AttestationState.Initial);
  const [attestationLink, setAttestationLink] = useState<string>();
  const [closingDesibled, setClosingDesibled] = useState(false);

  const [totalValue, setTotalValue] = useState(categoryRankings?.budget || 0);
  const [isOpenFarcasterModal, setIsOpenFarcasterModal] = useState(false);
  const [isOpenXModal, setIsOpenXModal] = useState(false);
  const [isWorldIdSignSuccessModal, setIsWorldIdSignSuccessModal]
    = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  // const [allocatingBudget, setAllocatingBudget] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [isWorldIdSignErrorModal, setIsWorldIdSignErrorModal] = useState(false);
  const [categoriesRanking, setCategoriesRanking] = useState<RankItem[]>();
  const [dbudgetProgress, setDbudgetProgress]
    = useState<CollectionProgressStatusEnum>(
      CollectionProgressStatusEnum.Pending
    );

  const [showBHGuideModal, setShowBHGuideModal] = useState(false);

  const [delegationState, setDelegationState] = useState(
    DelegationState.Initial
  );
  const [categoryToDelegate, setCategoryToDelegate]
    = useState<Pick<ICategory, 'id' | 'name'>>();
  const [targetDelegate, setTargetDelegate] = useState<TargetDelegate>();

  const [rankingProgress, setRankingProgress]
    = useState<CollectionProgressStatusEnum>(
      CollectionProgressStatusEnum.Pending
    );

  const { mutateAsync: updateCategoriesRanking } = useUpdateCategoriesRanking({
    budget: totalValue,
    allocationPercentages:
      categoriesRanking?.map(el => el.percentage / 100) || [],
  });

  const handleSubmitVote = async () => {
    await updateCategoriesRanking();

    if (!wallet || !signer || !categoriesRanking) {
      console.error('Requirements not met for attestations', wallet, signer, categoriesRanking);
      return;
    }

    if (!VotingHasEnded) {
      await attest({ ranking: { id: -1, name: 'Budget', ranking: categoriesRanking.map(el => ({ RF6Id: el.RF6Id, share: el.percentage / 100 })) },
        setAttestationLink, setAttestationState, signer, wallet, isBudget: true });
    }

    queryClient.refetchQueries({
      queryKey: ['category-ranking'],
    });
  };

  const handleDelegate = async (username: string, target: TargetDelegate) => {
    if (!categoryToDelegate) return;

    posthog.capture('Delegating vote power');
    await axiosInstance.post('flow/delegate/farcaster', {
      collectionId: categoryToDelegate.id,
      targetUsername: username,
    });

    queryClient.refetchQueries({
      queryKey: ['fetch-delegates'],
    });
    queryClient.refetchQueries({
      queryKey: ['category-ranking'],
    });
    queryClient.refetchQueries({
      queryKey: ['categories'],
    });
    setTargetDelegate(target);
    setDelegationState(DelegationState.Success);
  };

  const handleAttestationModalClose = () => {
    if (attestationState === AttestationState.Success) {
      setAttestationState(AttestationState.Initial);
    }
    if (attestationState === AttestationState.Error) {
      setAttestationState(AttestationState.Initial);
    }
  };

  // const handleVoteBudget = () => {
  //   if (!wallet) {
  //     setShowLoginModal(true);
  //     return;
  //   }
  // };

  const handleLock = (id: RankItem['id']) => () => {
    try {
      if (!categoriesRanking) return;

      const currValue = categoriesRanking.find(el => el.id === id)!;
      const newRanking = modifyPercentage(categoriesRanking, {
        ...currValue,
        locked: !currValue.locked,
      });
      setCategoriesRanking(newRanking);
    }
    catch (e: any) {
      console.error(e);
    }
  };

  const handleNewValue = (id: RankItem['id']) => (percentage: number) => {
    try {
      if (!categoriesRanking) return;

      const currValue = categoriesRanking?.find(el => el.id === id)!;
      const newRanking = modifyPercentage(categoriesRanking, {
        ...currValue,
        percentage,
        budget: currValue.budget * (percentage / currValue.percentage),
      });
      setCategoriesRanking(newRanking);
    }
    catch (e: any) {
      console.log(e);
    }
  };

  const resetDelegateState = () => {
    setCategoryToDelegate(undefined);
    setDelegationState(DelegationState.Initial);
    setTargetDelegate(undefined);
  };

  const handleScoreProjects = (id: RankItem['id']) => () => {
    posthog.capture('Start voting', {
      category: categoryIdSlugMap.get(id),
    });
    if (!wallet) {
      setShowLoginModal(true);
      return;
    }

    setSelectedCategoryId(id);
    router.push(`/comparison/${categoryIdSlugMap.get(id)}`);
  };

  const handleEdit = (id: RankItem['id']) => {
    if (!wallet) {
      setShowLoginModal(true);
      return;
    }

    setSelectedCategoryId(id);
    router.push(`/allocation/${categoryIdSlugMap.get(id)}`);
  };

  const getColNumOfDelegations = (id: number) => {
    const colDelegation = colDelegationToYou?.filter(
      el => el.collectionId === id
    );
    return colDelegation?.length || 0;
  };

  const isBGCategoryVoted = () => {
    const bhCategoryProgress = categories?.find(
      el => el.id === categorySlugIdMap.get(category)
    )?.progress;

    return (
      bhCategoryProgress === CollectionProgressStatusEnum.Finished
      || bhCategoryProgress === CollectionProgressStatusEnum.Attested
    );
  };

  const isBHCategoryAtessted = () => {
    const bhCategoryProgress = categories?.find(
      el => el.id === categorySlugIdMap.get(category)
    )?.progress;

    return bhCategoryProgress === CollectionProgressStatusEnum.Attested;
  };

  useEffect(() => {
    if (categoryRankings) {
      setRankingProgress(categoryRankings.progress);
    }
  }, [categoryRankings]);

  useEffect(() => {
    if (delegations) {
      const budgetDelegateFromYou = delegations?.fromYou?.budget;

      if (budgetDelegateFromYou?.metadata?.username) {
        setDbudgetProgress(CollectionProgressStatusEnum.Delegated);
      }
    }
  }, [delegations]);

  useEffect(() => {
    if (
      rankingProgress === CollectionProgressStatusEnum.Attested
      && dbudgetProgress === CollectionProgressStatusEnum.Pending
    ) {
      setDbudgetProgress(CollectionProgressStatusEnum.Attested);
    }
    else setDbudgetProgress(CollectionProgressStatusEnum.Pending);
  }, [rankingProgress]);

  useEffect(() => {
    if (categoryRankings) {
      setCategoriesRanking(
        categoryRankings.ranking.map(el => ({
          RF6Id: el.project.RF6Id,
          id: el.projectId,
          percentage: roundFractions(el.share * 100, 6),
          locked: false,
          budget: categoryRankings.budget * el.share,
        }))
      );
      setTotalValue(categoryRankings.budget);
    }
  }, [categoryRankings]);

  useEffect(() => {
    if (!address || !chainId || !isBadgeholder || isBGCategoryVoted()) return;

    const currentUserKey = `${chainId}_${address}`;

    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.BADGEHOLDER_GUIDE_MODAL) || '{}'
    );

    const isAlreadyShown = storedData[currentUserKey];

    if (isAlreadyShown) return;

    setShowBHGuideModal(true);

    localStorage.setItem(
      StorageLabel.BADGEHOLDER_GUIDE_MODAL,
      JSON.stringify({
        ...storedData,
        [currentUserKey]: true,
      })
    );
  }, [chainId, address]);

  return (
    <div>
      <Modal
        isOpen={
          attestationState !== AttestationState.Initial
        }
        onClose={handleAttestationModalClose}
        showCloseButton={true}
      >
        {attestationState === AttestationState.FarcasterDelegate && attestationLink && (
          <AskDelegations
            categoryName={category}
            link={attestationLink}
            onClose={() => {
              if (isBadgeholder) {
                setAttestationState(AttestationState.Success);
              }
              else {
                setAttestationState(AttestationState.Initial);
              }
            }}
            isBadgeHolder={isBadgeholder}
          />
        )}
        {attestationState === AttestationState.Success && attestationLink && (
          <AttestationSuccessModal
            link={attestationLink}
            onClose={() => {
              setAttestationState(AttestationState.Initial);
            }}
          />
        )}
        {attestationState === AttestationState.Loading && <AttestationLoading />}
        {attestationState === AttestationState.Error && <AttestationError onClick={handleSubmitVote} />}
      </Modal>
      <Modal
        isOpen={
          delegationState !== DelegationState.Initial && !!categoryToDelegate
        }
        onClose={resetDelegateState}
        showCloseButton={true}
      >
        {delegationState === DelegationState.DelegationMethod && (
          <DelegateModal
            categoryName={categoryToDelegate!.name}
            onFindDelegatesFarcaster={() => {
              posthog.capture('Find delegate on Farcaster', {
                category: categoryToDelegate!.name,
              });
              setDelegationState(DelegationState.Lookup);
            }}
            onFindDelegatesTwitter={() => {}}
          />
        )}

        {delegationState === DelegationState.Lookup && (
          <FarcasterLookup
            handleDelegate={handleDelegate}
            categoryName={categoryToDelegate!.name}
          />
        )}
        {delegationState === DelegationState.Success && targetDelegate && (
          <FarcasterSuccess
            categoryName={categoryToDelegate!.name}
            displayName={targetDelegate.displayName}
            username={targetDelegate.username}
            profilePicture={targetDelegate.profilePicture}
            onClose={resetDelegateState}
          />
        )}
      </Modal>

      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        showCloseButton={!closingDesibled}
      >
        <EmailLoginModal
          closeModal={() => setShowLoginModal(false)}
          setCloseModalDisabled={setClosingDesibled}
          selectedCategoryId={selectedCategoryId}
        />
      </Modal>

      <Modal
        isOpen={showBHGuideModal}
        onClose={() => {
          setShowBHGuideModal(false);
        }}
        showCloseButton
      >
        <BadgeholderModal
          categoryName={category ? convertCategoryToLabel(category) : ''}
          categorySlug={category}
          onClose={() => {
            setShowBHGuideModal(false);
          }}
        />
      </Modal>
      <HeaderRF6 />
      <WorldIdSignInSuccessModal
        isOpen={isWorldIdSignSuccessModal}
        onClose={() => {
          setIsWorldIdSignSuccessModal(false);
        }}
      />
      <WorldIdSignInSuccessModal
        isOpen={isWorldIdSignErrorModal}
        onClose={() => {
          setIsWorldIdSignErrorModal(false);
        }}
        isError
      />

      <FarcasterModal
        isOpen={isOpenFarcasterModal}
        onClose={() => {
          setIsOpenFarcasterModal(false);
        }}
      />

      <XModal
        isOpen={isOpenXModal}
        onClose={() => {
          setIsOpenXModal(false);
        }}
      />
      <div className="flex flex-col gap-6 p-16">
        <div className="flex max-w-[72%] flex-col gap-3">
          <h2 className="text-3xl font-bold"> Deep Funding </h2>
          <p className="text-gray-400">
            In Deep Funding, most of the work gets done by a public market of allocators,
            that suggest proposed weights of edges in a graph,
            which answer the question “what percent of the credit for A belongs to B?”.
          </p>
        </div>
        <div className="flex justify-between gap-4">
          <div className="flex w-[72%] flex-col gap-6 rounded-xl border p-6">
            <div>
              <h3 className="mb-4 w-full border-b pb-6 text-2xl font-bold">
                Voting
              </h3>
            </div>
            {categoriesLoading
              ? (
                  <div className="h-96 w-full">
                    <SmallSpinner />
                  </div>
                )
              : (
                  categories
                  && categories.length > 0 && (
                    <div className="flex flex-col gap-4">

                      {categories.map((cat) => {
                        const rank = categoriesRanking?.find(
                          el => el.id === cat.id
                        );
                        return (
                          <CategoryAllocation
                            {...cat}
                            key={cat.name}
                            locked={rank?.locked || false}
                            delegations={getColNumOfDelegations(cat.id)}
                            allocationPercentage={rank?.percentage || 0}
                            loading={delegationsLoading}
                            isBadgeholder={isBadgeholder}
                            bhCategory={category}
                            isBHCategoryAtessted={isBHCategoryAtessted()}
                            categorySlug={categoryIdSlugMap.get(cat.id)!}
                            onDelegate={() => {
                              posthog.capture('Start delegating', {
                                category: cat.name,
                              });
                              setCategoryToDelegate(cat);
                              setDelegationState(DelegationState.DelegationMethod);
                            }}
                            onLockClick={handleLock(cat.id)}
                            onScore={handleScoreProjects(cat.id)}
                            onEdit={() => handleEdit(cat.id)}
                            onPercentageChange={handleNewValue(cat.id)}
                            username={
                              colDelegationFromYou?.find(
                                el => el.collectionId === cat.id
                              )?.metadata?.username
                            }
                          />
                        );
                      })}
                    </div>
                  )
                )}
          </div>

          <div className="w-[25%]">
            <ConnectBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationPage;
