'use client';

import React, { useEffect, useState } from 'react';
import { redirect, useParams } from 'next/navigation';
// import { useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { usePostHog } from 'posthog-js/react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/material/styles';
import { ProjectCard } from '../card/ProjectCard';
import HeaderRF6 from '../card/Header-RF6';
import UndoButton from '../card/UndoButton';
import Modals from '@/app/utils/wallet/Modals';
import {
  useGetPairwisePairs,
} from '../utils/data-fetching/pair';
import {
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
import PostVotingModal from '../ballot/modals/PostVotingModal';
import NotFoundComponent from '@/app/components/404';
import { NumberBox } from './NumberBox';

const SliderMax = 3;
const SliderBase = 10;

const sliderScaleFunction = (x: number, base: number) => Math.floor(Math.pow(base, Math.abs(x)));

const CustomSlider = styled(Slider, {
  shouldForwardProp: prop => prop !== 'val',
})<{ val: number }>(({ val }) => {
  const max = SliderMax;
  return ({
    'color': '#EAECF0',
    '& .MuiSlider-valueLabel': {
      color: '#000000',
      backgroundColor: '#EAECF0',
      border: '1px solid #EAECF0',
    },
    '& .MuiSlider-thumb': {
      backgroundColor: '#7F56D9',
    },
    '& .MuiSlider-track': {
      background: (val > 0) ? `linear-gradient(to right, #EAECF0 0%, #EAECF0 ${max / (max + val) * 100}%, #7F56D9 ${max / (max + val) * 100}%, #7F56D9 100%)` : '#FFFFFF`',
      border: 'transparent',
    },
    '& .MuiSlider-rail': {
      background: (val > 0) ? '#EAECF0' : `linear-gradient(to right, #EAECF0 0%, #EAECF0 ${(max + val) / max * 50}%, #7F56D9 ${(max + val) / max * 50}%, #7F56D9 50%, #EAECF0 50%, #EAECF0 100%)`,
      opacity: 1,
    },
  });
});

export default function Home() {
  const { categoryId } = useParams() ?? {};
  // const queryClient = useQueryClient();
  const { address, chainId } = useAccount();
  // const wallet = useActiveWallet();

  const [ratio, setRatio] = React.useState<{ value: number, type: 'slider' | 'input' }>({ value: 0, type: 'slider' });
  const [rating1, setRating1] = useState<number | null>(null);
  const [rating2, setRating2] = useState<number | null>(null);
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

  // const { mutateAsync: markProjectCoI } = useMarkCoi();
  const { mutateAsync: vote } = useUpdateProjectVote({ categoryId: cid });
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
    if (bypassPrevProgress && data) {
      setProgress(data.progress);
      setBypassPrevProgress(false);
    }
    else {
      setProgress(getBiggerNumber(prevProgress, data?.progress));
    }
  }, [data]);

  useEffect(() => {
    if (!data || !data.pairs?.length) return;
    setRating1(data.pairs[0][0].rating ?? null);
    setRating2(data.pairs[0][1].rating ?? null);
  }, [data]);

  useEffect(() => {
    if (!data || !address) return;
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
    if (ratio.type === 'slider') return ratio.value;
    else return Math.sign(ratio.value) * Math.log(Math.abs(ratio.value)) / Math.log(SliderBase);
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
  const handleVote = async (chosenId: number) => {
    try {
      await vote({
        data: {
          project1Id: project1!.id,
          project2Id: project2!.id,
          project1Val: rating1 ?? 0,
          project2Val: rating2 ?? 0,
          pickedId: chosenId,
        },
      });
      setRatio({ type: 'slider', value: 0 });
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

  function updateGetStarted({
    goodRating,
    lowRate,
    postRating,
  }: {
    goodRating?: boolean
    lowRate?: boolean
    postRating?: boolean
  }) {
    if (!address || !chainId) return;

    const currentUserKey = `${chainId}_${address}`;
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
    if (!address || !chainId) return {};

    const storedData = JSON.parse(
      localStorage.getItem(StorageLabel.GET_STARTED_DATA) || '{}'
    );

    return storedData[`${chainId}_${address}`] || {};
  }

  const handleChange = (_event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setRatio({ type: 'slider', value: newValue });
      setRating1(-newValue);
      setRating2(newValue);
    }
  };

  const handleNumberBoxChange = (newValue: number) => {
    if (typeof newValue === 'number') {
      setRatio({ type: 'input', value: newValue });
      setRating1(-newValue);
      setRating2(newValue);
    }
  };

  if (isLoading) return <Spinner />;

  if (!cid) return <NotFoundComponent />;

  if (!address || !chainId) return redirect('/');

  if (!project1 || !project2 || !data) return <div>No data</div>;

  const shownValue = ratio.type === 'slider'
    ? Math.sign(ratio.value) * sliderScaleFunction(ratio.value, SliderBase)
    : ratio.value;

  return (
    <div className="relative min-h-screen">
      <Modals />
      <Modal
        isOpen={
          revertingBack
          || showFinishModal
        }
        onClose={() => {}}
      >
        {revertingBack && <RevertLoadingModal />}
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

      <HeaderRF6
        progress={progress * 100}
        category={data.name}
        isFirstSelection={false}
      />

      <div className="relative flex w-full items-center justify-between gap-8 px-8 pt-2">
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

      <footer className="absolute bottom-0 z-50 flex w-full flex-col items-center justify-around gap-4 bg-white py-8 shadow-inner sl:py-2">
        <div className="flex w-3/4 flex-col items-center justify-center gap-4 lg:flex-row xl:gap-8">
          {/* <Rating
              value={rating1 || 0}
              onChange={(value) => {
                !wallet ? setShowLoginModal(true) : setRating1(value);
              }}
              disabled={coiLoading1 || isAnyModalOpen()}
            />
            <VoteButton
              onClick={() =>
                !checkLowRatedProjectSelected(project1.id)
                && handleVote(project1.id)}
              disabled={coiLoading1 || isAnyModalOpen()}
            />
            <ConflictButton
              onClick={showCoI1}
              disabled={coiLoading1 || isAnyModalOpen()}
            /> */}
          <div className="w-1/5 text-ellipsis">{project1.name}</div>
          <div>{sliderScaleFunction(SliderMax, SliderBase)}</div>
          <div className="relative mt-5 flex gap-4 w-1/2 flex-col items-center justify-center">
            <CustomSlider
              val={convertInputValueToSlider()}
              value={convertInputValueToSlider()}
              scale={x => sliderScaleFunction(x, SliderBase)}
              min={-1 * SliderMax}
              step={1}
              max={SliderMax}
              getAriaValueText={(value: number) => `${Math.abs(value)}`}
              valueLabelFormat={(value: number) => `${Math.abs(value)}`}
              onChange={handleChange}
              valueLabelDisplay="auto"
              aria-labelledby="non-linear-slider"
            />
            <div className="absolute left-[calc(50%-1px)] top-0 h-9 w-0 border-2 border-dashed border-primary" />
            <NumberBox
              value={shownValue}
              onChange={handleNumberBoxChange}
              min={-1 * sliderScaleFunction(SliderMax, SliderBase)}
              max={sliderScaleFunction(SliderMax, SliderBase)}
            />
          </div>
          <div>{sliderScaleFunction(SliderMax, SliderBase)}</div>
          <div className="w-1/5 text-ellipsis">{project2.name}</div>
        </div>
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
                </p>
              )}
        <div className="flex flex-row gap-x-11">
          <UndoButton
            disabled={data?.votedPairs === 0 || isAnyModalOpen()}
            onClick={handleUndo}
          />
          {/* Next Button */}
          <button
            className="w-36 rounded-lg bg-primary px-4 py-2.5 text-white"
            onClick={() => { handleVote(((rating1 ?? 0) > (rating2 ?? 0)) ? project1.id : project2.id); }}
          >
            {ratio.value === 0 ? 'Skip' : 'Next'}
          </button>
        </div>
      </footer>

    </div>
  );
}
