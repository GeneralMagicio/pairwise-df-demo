'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { useQueryClient } from '@tanstack/react-query';
// import { useAccount } from 'wagmi';
import { usePostHog } from 'posthog-js/react';
import { ProjectCard } from '../card/ProjectCard';
import HeaderRF6, { MaximumRepoComparisons, RoundSize } from '../card/Header-RF6';
import UndoButton from '../card/UndoButton';
// import Modals from '@/app/utils/wallet/Modals';
import {
  IPairwisePairsResponse,
  ProjectRationaleData,
  useGetPairwisePairs,
} from '../utils/data-fetching/pair';
import {
  useCreatePairExclusion,
  useUpdateProjectUndo,
  useUpdateProjectVote,
} from '../utils/data-fetching/vote';
import { getBiggerNumber, usePrevious } from '@/app/utils/methods';
// import { useMarkCoi } from '../utils/data-fetching/coi';
import Modal from '@/app/utils/Modal';
import { IProject } from '../utils/types';
// import { mockProject1, mockProject2 } from '../card/mockData';
import Spinner from '../../components/Spinner';
import RevertLoadingModal from '../card/modals/RevertLoadingModal';
import StorageLabel from '@/app/lib/localStorage';
import NotFoundComponent from '@/app/components/404';
import { NumberBox } from './NumberBox';
import { useAuth } from '@/app/utils/wallet/AuthProvider';
import { RationaleBox } from './RationaleBox';
import { useCategory } from '../utils/data-fetching/category';
import PostVotingModal from '../ballot/modals/PostVotingModal';
import { shortenText } from '../utils/helpers';
import { SliderBase, SliderMax } from './constant';
import { CustomSlider, sliderScaleFunction } from './SliderComponent';
import RoundComplete from '@/app/allocation/components/RoundCompleteModal';
import RepoComplete from '@/app/allocation/components/RepoCompleteModal';
import RefreshButton from '../card/RefreshButton';
import { ArrowDownIcon } from '@/public/assets/icon-components/ArrowDown';
enum Types {
  Both,
  Project1,
  Project2,
}

const InitRatioValue = { value: 0, type: 'slider' } as { value: number, type: 'slider' | 'input' };

const rationaleFilterByProject = (rationales: ProjectRationaleData[], projectIds: number[]) => {
  if (projectIds.length === 1) {
    const result = rationales.filter(({ project1Id, project2Id }) => {
      return projectIds[0] === project1Id
        || projectIds[0] === project2Id;
    });
    return result;
  }
  else if (projectIds.length === 2) {
    const result = rationales.filter(({ project1Id, project2Id }) => {
      return projectIds.every(id => id === project1Id || id === project2Id);
    });
    return result;
  }
  else throw new Error ('Max projectIds length is 2');
};

export default function Home() {
  const { categoryId } = useParams() ?? {};
  // const queryClient = useQueryClient();
  const router = useRouter();
  const { githubHandle } = useAuth();
  // const wallet = useActiveWallet();

  const [comments, setComments] = useState<IPairwisePairsResponse['rationales']>();
  const [ratio, setRatio] = React.useState(InitRatioValue);
  // const [rating1, setRating1] = useState<number | null>(null);
  // const [rating2, setRating2] = useState<number | null>(null);
  const [project1, setProject1] = useState<IProject>();
  const [project2, setProject2] = useState<IProject>();
  // const [coiLoading1, setCoiLoading1] = useState(false);
  // const [coiLoading2, setCoiLoading2] = useState(false);
  const [bypassPrevProgress, setBypassPrevProgress] = useState(false);
  const [progress, setProgress] = useState(0);
  // const [lastAction, setLastAction] = useState<AutoScrollAction>();

  const [revertingBack, setRevertingBack] = useState(false);
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [roundComplete, setRoundComplete] = useState(false);
  const [repoComplete, setRepoComplete] = useState(false);
  const [roundCompleteModalCanBeSet, setRoundCompleteModalCanBeSet] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [rationale, setRationale] = useState<string | null>(null);
  const [rationaleError, setRationaleError] = useState<string | null>(null);
  // const [sectionExpanded1, setSectionExpanded1] = useState({
  //   repos: true,
  //   pricing: true,
  //   impact: true,
  //   testimonials: true,
  // });
  // const [sectionExpanded2, setSectionExpanded2] = useState({
  //   repos: true,
  //   pricing: true,
  //   impact: true,
  //   testimonials: true,
  // });

  const [temp, setTemp] = useState(0);
  // const [coi1, setCoi1] = useState(false);
  // const [coi2, setCoi2] = useState(false);
  const [aiMode1, setAiMode1] = useState(false);
  const [aiMode2, setAiMode2] = useState(false);

  const posthog = usePostHog();

  const cid = Number(categoryId);
  const { data, isLoading } = useGetPairwisePairs(cid);
  const prevProgress = usePrevious(progress);

  const { data: categoryResp } = useCategory(cid);
  // const { mutateAsync: markProjectCoI } = useMarkCoi();
  const { mutateAsync: vote } = useUpdateProjectVote({ categoryId: cid });
  const { mutateAsync: excludePair } = useCreatePairExclusion({ categoryId: cid });
  const { mutateAsync: undo } = useUpdateProjectUndo({
    categoryId: cid,
    onSuccess: () => {
      // if this temp state is omitted
      // then when you CoI one project and
      // then you call "undo", the app breaks
      // we probably need to combine "/pairs" and "/pairs-for-project"
      setTemp(temp + 1);
      setBypassPrevProgress(true);
    },
  });

  // const handleSkip = async () => {
  //   try {
  //     await vote({
  //       data: {
  //         project1Id: project1!.id,
  //         project2Id: project2!.id,
  //         project1Val: 0,
  //         project2Val: 0,
  //         pickedId: null,
  //       },
  //     });
  //     setRatio({ type: 'slider', value: 0 });
  //     setRating1(0);
  //     setRating2(0);
  //   }
  //   catch (e) {
  //     console.error(e);
  //   }
  // };

  useEffect(() => {
    if (roundCompleteModalCanBeSet && data?.votedPairs
      && data.votedPairs < Math.min(MaximumRepoComparisons, data.totalPairsBeforeThreshold)
      && data.votedPairs % RoundSize === 0) {
      setRoundComplete(true);
    }
  }, [data]);

  useEffect(() => {
    if (data?.votedPairs
      && data.votedPairs >= Math.min(data.totalPairsBeforeThreshold, MaximumRepoComparisons)) {
      setRepoComplete(true);
    }
  }, [data]);

  useEffect(() => {
    if (bypassPrevProgress && data) {
      setProgress(data.progress);
      setBypassPrevProgress(false);
    }
    else {
      setProgress(getBiggerNumber(prevProgress, data?.progress));
    }
  }, [data]);

  // useEffect(() => {
  //   setComments([{
  //     title: 'A is 1000 times better than B',
  //     rationale: 'A has more impact',
  //   }, {
  //     title: 'A is 1000 times better than B',
  //     rationale: 'A has more impact',
  //   },
  //   ]);
  // }, []);

  const [tabs, setTabs] = useState<{ [key: number]: string } | undefined>(undefined);
  const [tab, setTab] = useState<Types>(Types.Both);
  useEffect(() => {
    if (project1 && project2) {
      const tabstext = {
        [Types.Both]: 'Both',
        [Types.Project1]: project1.name,
        [Types.Project2]: project2.name,
      };
      setTabs(tabstext);
    }
  }, [project1, project2]);

  useEffect(() => {
    if (!data || !data.pairs?.length) return;
    // setRating1(data.pairs[0][0].rating ?? null);
    // setRating2(data.pairs[0][1].rating ?? null);
    setRatio(InitRatioValue);
    setRationale(null);
    setComments(data.rationales);
    setRationaleError(null);
  }, [data]);

  // useEffect(() => {
  //   if (!data || !data.pairs?.length) return;

  // }, [data]);

  useEffect(() => {
    if (!data || !githubHandle) return;
    if (data.pairs.length === 0) {
      setShowFinishModal(true);

      // if (!project1 || !project2) {
      //   setProject1(mockProject1);
      //   setProject2(mockProject2);
      // }
      return;
    }
    setProject1(data.pairs[0][0]);
    setProject2(data.pairs[0][1]);
  }, [data, temp]);

  const toggleAiMode = () => {
    if (!aiMode1) {
      posthog.capture('AI Summary', {
        project1: project1?.name,
        project2: project2?.name,
      });
    }
    setAiMode1(!aiMode1);
    setAiMode2(!aiMode2);
  };

  const isAnyModalOpen = () =>
    revertingBack;

  const convertInputValueToSlider = () => {
    if (Number.isNaN(ratio.value)) return 0;
    if (ratio.type === 'slider') return ratio.value;
    else return Math.sign(ratio.value) * Math.log(Math.abs(ratio.value)) / Math.log(SliderBase);
  };

  const roundCompleteClose = () => {
    setRoundComplete(false);
  };

  const onFinishVoting = () => {
    router.push('/allocation');
  };

  // const showCoI1 = () => {
  //   if (!wallet) {
  //     setShowLoginModal(true);
  //     return;
  //   }
  //   setCoi1(true);
  // };

  // const showCoI2 = () => {
  //   if (!wallet) {
  //     setShowLoginModal(true);
  //     return;
  //   }
  //   setCoi2(true);
  // };

  // const checkLowRatedProjectSelected = (chosenId: number): boolean => {
  //   const isLowRatedProjectSelected = (
  //     selectedId: number,
  //     ratingA: number | null | undefined,
  //     ratingB: number | null | undefined
  //   ) =>
  //     chosenId === selectedId && (!ratingA || (ratingB && ratingA < ratingB));
  //   if (!rating1 || !rating2) return false;
  //   if (
  //     isLowRatedProjectSelected(project1!.id, rating1, rating2)
  //     || isLowRatedProjectSelected(project2!.id, rating2, rating1)
  //   ) {
  //     setSelectedProjectId(chosenId);
  //     setShowLowRateModal(true);
  //     return true;
  //   }
  //   return false;
  // };
  const handleVote = async (chosenId: number | null) => {
    if (rationale === null || rationale.trim().length < 70) {
      setRationaleError('Min 70 characters required.');
      return;
    }
    try {
      await vote({
        data: {
          project1Id: project1!.id,
          project2Id: project2!.id,
          project1Val: chosenId === project1!.id ? Math.abs(shownValue) : -1 * Math.abs(shownValue),
          project2Val: chosenId === project2!.id ? Math.abs(shownValue) : -1 * Math.abs(shownValue),
          pickedId: chosenId,
          rationale: rationale,
        },
      });
      setRoundCompleteModalCanBeSet(true);
      setRatio(InitRatioValue);
      setTab(Types.Both);
      setRationaleError(null);
      if (getGetStarted().goodRating && !getGetStarted().postRating) {
        updateGetStarted({ postRating: true });
      }
    }
    catch (e) {
      console.error(e);
    }
  };

  const handleUndo = async () => {
    if (data?.votedPairs === 0) return;
    setRevertingBack(true);
    await undo();
    setRevertingBack(false);
  };

  const handleRefresh = (p1Id: number, p2Id: number) => async () => {
    setRoundCompleteModalCanBeSet(false);
    await excludePair({ p1Id, p2Id });
  };

  function updateGetStarted({
    goodRating,
    lowRate,
    postRating,
  }: {
    goodRating?: boolean
    lowRate?: boolean
    postRating?: boolean
  }) {
    if (!githubHandle) return;

    const currentUserKey = `${githubHandle}`;
    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.GET_STARTED_DATA) || '{}'
    );

    const userData = storedData[currentUserKey] || {};

    const updatedUserData = {
      ...userData,
      goodRating: goodRating || userData.goodRating,
      lowRate: lowRate || userData.lowRate,
      postRating: postRating || userData.postRating,
    };

    // Update the main data object
    storedData[currentUserKey] = updatedUserData;

    localStorage.setItem(
      StorageLabel.GET_STARTED_DATA,
      JSON.stringify(storedData)
    );
  }

  function getGetStarted() {
    if (!githubHandle) return {};

    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.GET_STARTED_DATA) || '{}'
    );

    return storedData[`${githubHandle}`] || {};
  }

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setRatio({ type: 'slider', value: newValue });
      // setRating1(-newValue);
      // setRating2(newValue);
    }
  };

  const handleNumberBoxChange = (newValue: number) => {
    if (typeof newValue === 'number') {
      setRatio({ type: 'input', value: newValue });
      // setRating1(-newValue);
      // setRating2(newValue);
    }
  };

  if (isLoading) return <Spinner />;

  if (!cid) return <NotFoundComponent />;

  // if (!githubHandle) return redirect('/');

  if (!project1 || !project2 || !data) return <div>No data</div>;

  const shownValue = ratio.type === 'slider'
    ? Math.sign(ratio.value) * sliderScaleFunction(ratio.value, SliderBase)
    : ratio.value;

  const getRationales = () => {
    if (!comments) return [];

    switch (tab) {
      case Types.Project1:
        return rationaleFilterByProject(comments, [project1.id]);
      case Types.Project2:
        return rationaleFilterByProject(comments, [project2.id]);
      case Types.Both:
        return rationaleFilterByProject(comments, [project1.id, project2.id]);
      default:
        return comments;
    }
  };

  return (
    <div className="flex h-screen flex-col">

      <Modal
        isOpen={
          revertingBack
          || showFinishModal
          || roundComplete
          || repoComplete
        }
        onClose={() => {}}
      >
        {revertingBack && <RevertLoadingModal />}
        {roundComplete && (
          <RoundComplete
            isOpen={roundComplete}
            onClose={roundCompleteClose}
            onNextRound={roundCompleteClose}
            onFinishVoting={onFinishVoting}
          />
        )}
        {repoComplete && (
          <RepoComplete
            totalComparisons={Math.min(data.totalPairsBeforeThreshold, MaximumRepoComparisons)}
            isOpen={repoComplete}
            onFinishVoting={onFinishVoting}
          />
        )}
        {/* {showLowRateModal && (
          <LowRateModal
            proceedWithSelection={async () => {
              await handleVote(selectedProjectId!);
              setShowLowRateModal(false);
            }}
            cancelSelection={() => setShowLowRateModal(false)}
          />
        )} */}
        {showFinishModal && (
          <PostVotingModal
            cid={data.id}
            categoryLabel={data.name}
          />
        )}
      </Modal>

      <div>
        <HeaderRF6
          progress={progress * 100}
          total={data.totalPairs}
          votes={data.votedPairs}
          category={data.name}
          showRoundData={!repoComplete}
          projImage={categoryResp?.collection.image}
          isFirstSelection={false}
          showBackButton
        />
      </div>
      <div className="mt-6 text-center text-2xl font-semibold xsl:mt-4 xsl:text-lg">
        Which dependency gets more credit for
        {' '}
        <span className="font-bold">
          {categoryResp?.collection.name}
        </span>
        {' '}
        success?
      </div>
      <div className="relative flex h-full grow">

        <div className="relative grow">
          <div className="glex flex w-full flex-col">

            <div className="relative flex grow items-center justify-between gap-8 px-8">
              <div className="relative w-[49%]">
                <ProjectCard
                  key={project1.RF6Id}
                  aiMode={aiMode1}
                  setAi={toggleAiMode}
                  name="card1"
                  metadata={{ ...project1.metadata, ...project1 } as any}
                />
              </div>
              <div className="relative w-[49%]">
                <ProjectCard
                  key={project2.RF6Id}
                  aiMode={aiMode2}
                  setAi={toggleAiMode}
                  name="card2"
                  metadata={{ ...project2.metadata, ...project2 } as any}
                />
              </div>
            </div>
          </div>
          <footer className="w-full gap-8 rounded-xl px-8">
            <div className="relative bottom-0 z-50 flex grow flex-col items-center justify-around gap-4 bg-white py-8 shadow-inner xxsl:gap-1 sl:py-2">
              <div className="flex w-3/4 flex-col items-center justify-center gap-4 rounded-xl lg:flex-row xl:gap-8 xxsl:gap-1">
                <div className="mr-3 w-1/5 text-ellipsis text-base font-semibold text-black">{project1.name}</div>
                {/* <div>{sliderScaleFunction(SliderMax, SliderBase)}</div> */}
                <div className="gap- relative mt-5 flex w-1/2 flex-col items-center justify-center xxsl:mt-2">
                  <div className="absolute left-[(calc50%-1px)] top-0 h-9 w-0 border-2 border-dashed border-primary" />
                  <CustomSlider
                    val={convertInputValueToSlider()}
                    value={convertInputValueToSlider()}
                    scale={(x: number) => sliderScaleFunction(x, SliderBase)}
                    min={-1 * SliderMax}
                    step={1}
                    max={SliderMax}
                    getAriaValueText={(value: number) => `${Math.abs(value)}`}
                    valueLabelFormat={(value: number) => `${Math.abs(value)}`}
                    onChange={handleChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="non-linear-slider"
                  />

                </div>
                {/* <div>{sliderScaleFunction(SliderMax, SliderBase)}</div> */}
                <div className="ml-3 w-1/5 text-ellipsis text-base font-semibold text-black">{project2.name}</div>
              </div>
              <NumberBox
                value={shownValue === 0 ? 1 : shownValue}
                onChange={handleNumberBoxChange}
                min={-1 * sliderScaleFunction(SliderMax, SliderBase)}
                max={sliderScaleFunction(SliderMax, SliderBase)}
              />
              <div className="flex translate-x-2 flex-row gap-3">
                {shownValue < 0
                  ? (
                      <p className="h-6">
                        <span style={{ color: 'green' }}>
                          {project1.name}
                        </span>
                        {` deserves ${-1 * shownValue}x more credit than `}
                        <span style={{ color: 'green' }}>
                          {project2.name}
                        </span>
                      </p>
                    )
                  : shownValue > 0
                    ? (
                        <p className="h-6">
                          <span style={{ color: 'green' }}>
                            {project2.name}
                          </span>
                          {` deserves ${shownValue}x more credit than `}
                          <span style={{ color: 'green' }}>
                            {project1.name}
                          </span>
                        </p>
                      )
                    : (
                        <p className="h-6">
                          <span style={{ color: 'green' }}>
                            {project1.name}
                          </span>
                          {' deserves 1x more credit than '}
                          <span style={{ color: 'green' }}>
                            {project2.name}
                          </span>
                        </p>
                      )}
              </div>
              <div className={`flex w-full flex-row ${shownValue ? 'justify-end' : 'justify-center'} px-10`}>
                <div className="w-full">
                  <div className="relative flex grow justify-start">
                    <div className="flex w-[90%] flex-col justify-around gap-1.5 pl-10">
                      <div className="text-xs font-semibold text-[#344054]">Rationale</div>
                      <textarea
                        value={rationale ?? ''}
                        // onClick={() => setRationaleError(null)}
                        onChange={e => setRationale(e.target.value)}
                        rows={2}
                        className={`w-full resize-none rounded-md border ${rationaleError && (rationale?.length ?? 0) < 70 ? 'border-red-500' : 'border-[#D0D5DD]'} p-2 shadow-sm focus:outline-none`}
                        placeholder={shownValue === 0 ? 'Why do you think these 2 are equally important?' : `Why did you select ${shownValue > 0 ? project2.name : project1.name}?`}
                      />
                      <span className={`absolute bottom-0 translate-y-full py-1 text-sm ${((rationale?.length ?? 0) < 70) ? 'text-red-500' : 'text-deep-250'}`}>
                        {' '}
                        {rationaleError ? rationaleError : ''}
                        {' '}
                      </span>
                    </div>

                  </div>

                  <div className="h-6"></div>
                </div>
                <div className="mb-2 flex">
                  <div className="m-auto flex w-full justify-center gap-x-4 align-bottom">
                    <UndoButton
                      disabled={data?.votedPairs === 0 || isAnyModalOpen()}
                      onClick={handleUndo}
                    />
                    <RefreshButton
                      onClick={handleRefresh(project1.id, project2.id)}
                    />
                    <button
                      className="h-fit w-36 rounded-lg bg-primary px-4 py-2.5 text-base font-semibold text-white hover:bg-main-title focus:bg-primary"
                      onClick={() => { handleVote(shownValue === 0 ? null : shownValue > 0 ? project2.id : project1.id); }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
        {comments && (
          <div className={`mt-4 flex ${showComments ? 'h-full' : 'h-fit'} w-96 flex-col gap-4 overflow-auto rounded-xl border border-gray-border bg-[#F9FAFB] px-3 py-4`}>
            <button onClick={() => { setShowComments(!showComments); }} className="flex w-full items-center justify-center gap-0.5 rounded-md px-3.5 py-2.5 text-sm font-semibold text-deep-250 focus:outline-none">
              <span>Evaluations</span>
              <div className={showComments ? 'rotate-180' : 'rotate-0'}><ArrowDownIcon width={20} height={20} color="#475467" /></div>
            </button>

            {showComments && (
              <>
                <div
                  className="border-b border-gray-border"
                >
                  {tabs && (
                    <div className="flex h-full flex-row items-center gap-3">
                      {Object.entries(tabs).map(([t, text]) => {
                        return (
                          <div key={t} className="group relative h-full">
                            <button className={`h-full max-w-32 text-wrap break-words px-1 pb-3 text-base ${tab === parseInt(t) ? 'border-b border-primary font-bold text-main-title' : 'font-normal text-dark-600'}`} onClick={() => setTab(parseInt(t))}>{shortenText(text, 14)}</button>
                            <span className="absolute left-0 top-10 scale-0 rounded bg-gray-50 p-2 text-xs text-[#344054] group-hover:scale-100">{text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="flex grow flex-col gap-4">
                  <div>
                    {getRationales()
                      .map(({ project1: p1, project2: p2, pickedId, rationale, multiplier, updatedAt }) => (
                        <RationaleBox
                          key={`${p1.id}${p2.id}${updatedAt}`}
                          pickedId={pickedId}
                          project1={p1}
                          project2={p2}
                          rationale={rationale}
                          multiplier={multiplier}
                        />
                      ))}

                  </div>
                </div>
                <div className="flex flex-col justify-start gap-2 text-xs font-semibold text-[#475467]">
                  <button
                    onClick={() => {
                      router.push(`/evaluation?projectIds=${cid}`);
                    }}
                    className="w-full rounded-md border border-[#D0D5DD] bg-white px-3.5 py-2.5 text-sm font-semibold
                    text-[#344054] hover:bg-wite-hover focus:bg-white"
                  >
                    My evaluations
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
