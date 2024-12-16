'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import debounce from 'lodash.debounce';
// import { useActiveWallet } from 'thirdweb/react';
import { usePostHog } from 'posthog-js/react';
import RankingRow from './components/RankingRow';
import HeaderRF6 from '../../comparison/card/Header-RF6';
import Spinner from '@/app/components/Spinner';
// import SearchBar from "./components/SearchBar";
import {
  categorySlugIdMap,
  categoryIdTitleMap,
} from '../../comparison/utils/helpers';
import NotFoundComponent from '@/app/components/404';
import {
  useProjectsRankingByCategoryId,
  useUpdateProjectRanking,
  // useCategoryRankings,
} from '@/app/comparison/utils/data-fetching/ranking';
import {
  CollectionProgressStatusEnum,
  IProjectRanking,
} from '@/app/comparison/utils/types';
import { ArrowLeft2Icon } from '@/public/assets/icon-components/ArrowLeft2';
import { ArrowRightIcon } from '@/public/assets/icon-components/ArrowRight';
import { modifyPercentage, RankItem } from '../utils';
// import { useSigner } from './utils';
// import {
//   useMarkCoi,
//   useUnmarkCoi,
// } from '@/app/comparison/utils/data-fetching/coi';

const RankingPage = () => {
  const params = useParams();
  const router = useRouter();
  const posthog = usePostHog();

  // const signer = useSigner();
  const category = categorySlugIdMap.get((params?.category as string) || '');

  // const [search, setSearch] = useState<string>("");
  // const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [projects, setProjects] = useState<IProjectRanking[] | null>(null);
  const [totalShareError, setTotalShareError] = useState<string | null>(null);
  const [lockedItems, setLockedItems] = useState<number[]>([]);
  // const [allocationBudget, setAllocationBudget] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [nonCoIProjects, setNonCoIProjects] = useState<IProjectRanking[]>([]);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  // const [closingDesibled, setClosingDesibled] = useState(false);

  // const { data: categoryRankings, isLoading: rankingLoading }
  //   = useCategoryRankings();
  const { data: ranking, isLoading } = useProjectsRankingByCategoryId(category);
  const { mutateAsync: updateProjectRanking }
    = useUpdateProjectRanking(category);
  // const { mutateAsync: markProjectCoI } = useMarkCoi();
  // const { mutateAsync: unmarkProjectCoI } = useUnmarkCoi();

  // const handleBulkSelection = () => {
  //   if (!nonCoIProjects) return;

  //   setTotalShareError(null);

  //   if (checkedItems.length === nonCoIProjects.length) {
  //     setCheckedItems([]);
  //   }
  //   else {
  //     setCheckedItems(nonCoIProjects.map(project => project.projectId));
  //   }
  // };

  const handleVote = useCallback(
    debounce((id: number, share: number) => {
      setTotalShareError(null);

      if (!projects) return;

      try {
        const values: RankItem[] = projects.map(project => ({
          id: project.projectId,
          percentage: project.share * 100,
          locked: lockedItems.includes(project.projectId),
        })) as RankItem[];

        const newValue = values.find(el => el.id === id);

        if (!newValue) return;

        const newRanking = modifyPercentage(values, {
          ...newValue,
          percentage: share * 100,
        });

        const sum = newRanking.reduce(
          (acc, curr) => (acc += curr.percentage),
          0
        );

        setProjects(
          projects.map(project => ({
            ...project,
            share:
              (newRanking.find(el => el.id === project.projectId)
                ?.percentage || 0) / 100,
          }))
        );

        if (sum < 99.9) {
          const deficit = 100 - sum;
          setTotalShareError(
            `Percentages must add up to 100% (add ${
              Math.round(deficit * 100) / 100
            }% to your ballot)`
          );
          window.scrollTo(0, document.body.scrollHeight);
        }
      }
      catch (e: any) {
        if (e.msg === 'Bigger than 100 error') {
          setTotalShareError(
            `Percentages must add up to 100% (remove ${
              Math.round(e.excess * 100) / 100
            }% from your ballot)`
          );
        }
        else {
          setTotalShareError(e.msg);
        }
        window.scrollTo(0, document.body.scrollHeight);
      }
    }, 300),
    [projects, lockedItems]
  );

  const handleLocck = (id: number) => {
    if (!projects) return;

    if (lockedItems.includes(id)) {
      setLockedItems(lockedItems.filter(lockedId => lockedId !== id));
    }
    else {
      if (lockedItems.length >= projects?.length - 2) {
        setTotalShareError('At least two projects must be unlocked');
        window.scrollTo(0, document.body.scrollHeight);
        return;
      }
      setLockedItems([...lockedItems, id]);
    }
  };

  // const markCOI = async (id: number) => {
  //   if (!projects) return;

  //   const unmarkedProjects = projects.filter(
  //     project =>
  //       project.projectId !== id
  //       && !project.coi
  //       && !lockedItems.includes(project.projectId)
  //   );

  //   const currentProject = projects.find(project => project.projectId === id);

  //   if (!currentProject) return;

  //   const distributedShare = currentProject.share / unmarkedProjects.length;

  //   const newProjects = projects.map(project =>
  //     project.projectId === id
  //       ? { ...project, coi: true, share: 0 }
  //       : {
  //           ...project,
  //           share:
  //             project.coi || lockedItems.includes(project.projectId)
  //               ? project.share
  //               : project.share + distributedShare,
  //         }
  //   );

  //   if (checkedItems.includes(id)) {
  //     setCheckedItems(checkedItems.filter(checkedId => checkedId !== id));
  //   }

  //   if (lockedItems.includes(id)) {
  //     setLockedItems(lockedItems.filter(lockedId => lockedId !== id));
  //   }

  //   await markProjectCoI({ data: { pid: id } });

  //   const rankingArray = newProjects.map(project => ({
  //     id: project.projectId,
  //     share: project.share,
  //   }));

  //   await updateProjectRanking({
  //     cid: category,
  //     ranking: rankingArray,
  //   });

  //   setProjects(newProjects);
  // };

  // const unmarkCOI = async (id: number) => {
  //   if (!projects) return;

  //   await unmarkProjectCoI({ data: { pid: id } });

  //   setProjects(
  //     projects.map(project =>
  //       project.projectId === id ? { ...project, coi: false } : project
  //     )
  //   );
  // };

  // const lockSelection = () => {
  //   if (!nonCoIProjects) return;

  //   if (
  //     checkedItems.length > nonCoIProjects?.length - 2
  //     || lockedItems.length >= nonCoIProjects?.length - 2
  //   ) {
  //     setTotalShareError('At least two projects must be unlocked');
  //     window.scrollTo(0, document.body.scrollHeight);
  //     return;
  //   }

  //   const lockedProjects = checkedItems.filter(
  //     checkedId => !lockedItems.includes(checkedId)
  //   );
  //   posthog.capture('Lock selection');

  //   setLockedItems([...lockedItems, ...lockedProjects]);
  //   setCheckedItems([]);
  // };

  // const unlockSelection = () => {
  //   if (!projects) return;

  //   const unlockedProjects = checkedItems.filter(checkedId =>
  //     lockedItems.includes(checkedId)
  //   );

  //   setLockedItems(
  //     lockedItems.filter(lockedId => !unlockedProjects.includes(lockedId))
  //   );
  //   setCheckedItems([]);
  // };

  // const selectItem = (id: number) => {
  //   if (checkedItems.includes(id)) {
  //     setCheckedItems(checkedItems.filter(checkedId => checkedId !== id));
  //   }
  //   else {
  //     setCheckedItems([...checkedItems, id]);
  //   }
  // };

  const submitVotes = async () => {
    setIsSubmitting(true);

    if (!projects) return;

    const rankingArray = projects.map(project => ({
      id: project.projectId,
      share: project.share,
    }));

    await updateProjectRanking({
      cid: category,
      ranking: rankingArray,
    });

    // if (!wallet || !ranking || !signer) {
    //   console.error('Requirements not met for attestations', { wallet, ranking, signer });
    //   setIsSubmitting(false);
    //   return;
    // }

    setIsSubmitting(false);
  };

  // useEffect(() => {
  //   if (!projects || projects.length === 0) {
  // setIsLocked(false);
  // setIsUnlocked(true);
  //   return;
  // }

  // const allLocked = lockedItems.length === projects.length && projects.length;
  // const noneLocked = lockedItems.length === 0;
  // const checkedLocked = checkedItems.every(id => lockedItems.includes(id));
  // const checkedUnlocked = checkedItems.every(
  //   id => !lockedItems.includes(id)
  // );
  // const someLocked = checkedItems.some(id => lockedItems.includes(id));
  // const someUnlocked = checkedItems.some(id => !lockedItems.includes(id));

  // if (allLocked || checkedLocked) {
  // setIsLocked(true);
  // setIsUnlocked(false);
  // }
  // else if (noneLocked || checkedUnlocked) {
  // setIsLocked(false);
  // setIsUnlocked(true);
  // }
  // else if (someLocked || someUnlocked) {
  // setIsLocked(true);
  // setIsUnlocked(true);
  // }
  // else {
  // setIsLocked(false);
  // setIsUnlocked(false);
  // }
  // }, [projects, lockedItems, checkedItems]);

  useEffect(() => {
    if (ranking) setProjects(ranking?.ranking);
  }, [ranking]);

  useEffect(() => {
    if (!projects) return;

    if (!projects?.length) return;

    if (lockedItems.length > projects?.length - 2) {
      setTotalShareError('At least two projects must be unlocked');
      window.scrollTo(0, document.body.scrollHeight);
    }
    else {
      setTotalShareError(null);
    }
  }, [lockedItems]);

  // useEffect(() => {
  //   if (!projects || !projects.length) return;

  //   setNonCoIProjects(projects.filter(project => !project.coi));
  // }, [projects]);

  if (!category) return <NotFoundComponent />;

  return (
    <div>
      <HeaderRF6 />
      <div className="flex flex-col justify-between gap-4 px-6 py-16 lg:px-20 xl:px-52 2xl:px-72">
        <div className="flex flex-col gap-6 rounded-xl border border-gray-200 px-6 py-10">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-base text-gray-400">Edit your votes</p>
              <p className="text-2xl font-semibold text-gray-700">
                {categoryIdTitleMap.get(category)}
                {' '}
                results
              </p>
            </div>
          </div>
          {/* <SearchBar search={search} setSearch={setSearch} /> */}
          <div className="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3 lg:px-8">
            <div className="flex items-center justify-end gap-4">
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-gray-600">Node</p>
              </div>
            </div>
            <div className="flex gap-4">
              <p className="text-sm font-medium text-gray-400">Rank</p>

              <div className="h-6 w-0 border border-op-neutral-300" />
              <p className="text-sm font-medium text-gray-400">
                Edge weight
              </p>
            </div>
          </div>
          {isLoading
            ? (
                <Spinner />
              )
            : ranking
            && ranking.progress !== CollectionProgressStatusEnum.Finished
            && ranking.progress !== CollectionProgressStatusEnum.Attested
              ? (
                  <div className="flex h-64 items-center justify-center">
                    <p className="text-gray-400">
                      You need to finish with the comparison before you can vote
                    </p>
                  </div>
                )
              : projects?.length
                ? (
                    <div className="w-full overflow-x-auto">
                      <table className="w-full min-w-full">
                        <tbody className="flex flex-col gap-6">
                          {projects
                            .filter(project => !project.coi)
                            .map((project, index) => (
                              <RankingRow
                                key={project.projectId}
                                index={index}
                                // budget={allocationBudget * project.share}
                                project={project}
                                locked={lockedItems.includes(project.projectId)}
                                onLock={handleLocck}
                                // onSelect={selectItem}
                                onVote={handleVote}
                                coi={project.coi}
                                onToggleCOI={() => {}}
                              />
                            ))}
                          {projects.some(project => project.coi) && (
                            <>
                              <tr>
                                <th className="text-lg font-bold">
                                  Conflict Of Interest
                                </th>
                              </tr>
                              {projects
                                .filter(project => project.coi)
                                .map((project, index) => (
                                  <RankingRow
                                    key={project.projectId}
                                    index={index}
                                    // budget={allocationBudget * project.share}
                                    project={project}
                                    // selected={checkedItems.includes(project.projectId)}
                                    locked={lockedItems.includes(project.projectId)}
                                    onLock={handleLocck}
                                    // onSelect={selectItem}
                                    onVote={handleVote}
                                    coi={project.coi}
                                    onToggleCOI={() => {}}
                                  />
                                ))}
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )
                : (
                    <p className="text-center text-gray-400">No projects found</p>
                  )}

          {totalShareError && (
            <div className="flex justify-end gap-4">
              <p className="text-sm font-medium text-primary">
                {totalShareError}
              </p>
            </div>
          )}
          <div className="flex justify-between">
            <button
              className="flex items-center justify-center gap-3 rounded-lg border bg-gray-50 px-4 py-2 font-semibold text-gray-700"
              onClick={() => {
                posthog.capture('Back to categories');
                router.push('/allocation');
              }}
            >
              <ArrowLeft2Icon />
              Back to Categories
            </button>
            <button
              className={`font-semibold" flex items-center justify-center gap-3 rounded-lg px-10 py-2
              ${
    totalShareError
    || (ranking?.progress !== CollectionProgressStatusEnum.Finished
    && ranking?.progress !== CollectionProgressStatusEnum.Attested)
      ? 'bg-gray-200 text-gray-400'
      : 'bg-primary text-white'
    }`}
              onClick={submitVotes}
              disabled={
                !!totalShareError
                || isSubmitting
                || (ranking?.progress !== CollectionProgressStatusEnum.Finished
                && ranking?.progress !== CollectionProgressStatusEnum.Attested)
              }
            >
              {isSubmitting
                ? (
                    'Saving edits...'
                  )
                : (
                    <>
                      Save edits
                      <ArrowRightIcon
                        color={
                          !!totalShareError
                          || isSubmitting
                          || (ranking?.progress
                          !== CollectionProgressStatusEnum.Finished
                          && ranking?.progress
                          !== CollectionProgressStatusEnum.Attested)
                            ? 'gray'
                            : undefined
                        }
                      />
                    </>
                  )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
