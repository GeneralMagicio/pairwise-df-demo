'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderRF6, { MaximumRepoComparisons } from '../comparison/card/Header-RF6';
// import Modal from '../utils/Modal';
import CategoryAllocation from './components/CategoryAllocation';
import ConnectBox from './components/ConnectBox';
import { modifyPercentage, RankItem, roundFractions } from './utils';
// import {
//   categoryIdSlugMap,
// } from '../comparison/utils/helpers';
import { useCategories } from '../comparison/utils/data-fetching/categories';
import {
  CollectionProgressStatusEnum,
} from '../comparison/utils/types';
import SmallSpinner from '../components/SmallSpinner';
import {
  useCategoryRankings,
} from '@/app/comparison/utils/data-fetching/ranking';

const AllocationPage = () => {
  const router = useRouter();

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const { data: categoryRankings } = useCategoryRankings();

  // const [closingDesibled, setClosingDesibled] = useState(false);

  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
  //   null
  // );
  const [categoriesRanking, setCategoriesRanking] = useState<RankItem[]>();
  const [dbudgetProgress, setDbudgetProgress]
    = useState<CollectionProgressStatusEnum>(
      CollectionProgressStatusEnum.Pending
    );

  const [rankingProgress, setRankingProgress]
    = useState<CollectionProgressStatusEnum>(
      CollectionProgressStatusEnum.Pending
    );

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

  const handleScoreProjects = (id: RankItem['id']) => () => {
    // console.log(id);
    // setSelectedCategoryId(id);
    router.push(`/comparison/${id}`);
  };

  // const handleEdit = (id: RankItem['id']) => {
  //   // setSelectedCategoryId(id);
  //   router.push(`/allocation/${id}`);
  // };

  useEffect(() => {
    if (categoryRankings) {
      setRankingProgress(categoryRankings.progress);
    }
  }, [categoryRankings]);

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
    }
  }, [categoryRankings]);

  return (
    <div>

      <HeaderRF6 />

      <div className="flex flex-col gap-6 p-16">
        <div className="flex max-w-[72%] flex-col gap-3">
          <h2 className="text-3xl font-bold"> Deep Funding </h2>
          <p className="text-gray-400">
            Select the Github repo whose codebase you are most familiar with.
            Your job is voting on how important its package dependencies are relative to one another.
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
                    <div className="grid grid-cols-3 grid-rows-3 gap-4">

                      {categories.sort((c1, c2) => c1.name.localeCompare(c2.name)).map((cat) => {
                        const rank = categoriesRanking?.find(
                          el => el.id === cat.id
                        );
                        return (
                          <CategoryAllocation
                            {...cat}
                            progress={cat.votedPairs >= MaximumRepoComparisons ? 'Finished' : cat.progress}
                            key={cat.name}
                            image={cat.image}
                            locked={rank?.locked || false}
                            allocationPercentage={rank?.percentage || 0}
                            loading={false}
                            onDelegate={() => {}}
                            onLockClick={handleLock(cat.id)}
                            onScore={handleScoreProjects(cat.id)}
                            onView={() => { router.push(`/evaluation/${cat.id}`); }}
                            onPercentageChange={handleNewValue(cat.id)}
                            username=""
                          />
                        );
                      })}
                    </div>
                  )
                )}
          </div>

          <div className="w-1/4">
            <ConnectBox />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllocationPage;
