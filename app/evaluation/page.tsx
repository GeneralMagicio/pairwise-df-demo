'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import HeaderRF6 from '../comparison/card/Header-RF6';
import DateRangePicker from '../components/DateRangePicker';
import { Search } from '@/public/assets/icon-components/Search';
import { XCloseIcon } from '@/public/assets/icon-components/XClose';
import { IRationaleQuery, useGetProjectRationales, useGetProjects } from './useProjects';
import { RationaleBox } from '../comparison/[categoryId]/RationaleBox';
import Spinner from '../components/Spinner';
import { ArrowRightIcon as ArrowRight } from '@/public/assets/icon-components/ArrowRight';
import { ArrowLeft2Icon } from '@/public/assets/icon-components/ArrowLeft2';
import { SliderBox } from './SliderRationaleBox';
import { useUpdateRationaleVote } from '../comparison/utils/data-fetching/vote';
import { getCategory } from '@/app/comparison/utils/data-fetching/category';
import type React from 'react';
enum Tab {
  AllEvaluation = 0,
  MyEvaluation = 1,
}

enum SortOption {
  Newest = 0,
  Latest = 1,
}
enum DateTypes {
  Day = 0,
  Week = 1,
  Month = 2,
}
interface ISearchQuery {
  id: number
  name: string
}

interface FilterBoxProps {
  searchQueries: ISearchQuery[]
  setSearchQueries: (ids: ISearchQuery[]) => void
  startDate: Date | null
  setStartDate: (date: Date | null) => void
  endDate: Date | null
  setEndDate: (date: Date | null) => void
  sortOption: SortOption
  setSortOption: (opt: SortOption) => void
}

const FilterBox: React.FC<FilterBoxProps> = ({
  searchQueries,
  setSearchQueries,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  sortOption,
  setSortOption,
}) => {
  const [filterOption, setFilterOption] = useState<DateTypes | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id: number, name: string }>>([]);
  const { data: projectData } = useGetProjects();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);

  const removeTag = (index: number) => {
    setSearchQueries(searchQueries.filter((_, i) => i !== index));
  };

  const setDays = (days: number) => {
    const edDate = new Date();
    setEndDate(edDate);
    setStartDate(new Date(edDate.getTime() - days * 24 * 60 * 60 * 1000));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterQuery(value);
    setSelectedSuggestionIndex(0);

    if (value) {
      const suggestions
        = projectData
          ?.filter(project => project.name.toLowerCase().includes(value.toLowerCase()))
          .slice(0, 3)
          .map(project => ({ id: project.id, name: project.name })) || [];
      setSearchSuggestions(suggestions);
    }
    else {
      setSearchSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setSelectedSuggestionIndex(prevIndex => (prevIndex + 1) % searchSuggestions.length);
    }
    else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setSelectedSuggestionIndex(prevIndex => (prevIndex - 1 + searchSuggestions.length) % searchSuggestions.length);
    }
    else if (event.key === 'Enter' && filterQuery !== '') {
      event.preventDefault();
      const selectedProject = searchSuggestions[selectedSuggestionIndex];
      if (selectedProject) {
        setSearchQueries([...searchQueries, { id: selectedProject.id, name: selectedProject.name }]);
        setFilterQuery('');
        setSearchSuggestions([]);
        setSelectedSuggestionIndex(0);
      }
    }
  };

  return (
    <div className="rounded-md border border-[#D0D5DD] bg-white p-4">
      <div className="text-sm text-[#344054]">Sort by</div>
      <div className="mt-1">
        <div className="flex h-full flex-row items-center gap-1">
          <div className="flex flex-row">
            <button
              className={`rounded-l-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                sortOption === SortOption.Newest ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => setSortOption(SortOption.Newest)}
            >
              Newest
            </button>
            <button
              className={`rounded-r-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                sortOption === SortOption.Latest ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => setSortOption(SortOption.Latest)}
            >
              Latest
            </button>
          </div>
          <div className="flex flex-row">
            <button
              className={`rounded-l-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                filterOption === DateTypes.Month ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => {
                setFilterOption(DateTypes.Month);
                setDays(30);
              }}
            >
              30d
            </button>
            <button
              className={`border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                filterOption === DateTypes.Week ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => {
                setFilterOption(DateTypes.Week);
                setDays(7);
              }}
            >
              7d
            </button>
            <button
              className={`rounded-r-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                filterOption === DateTypes.Day ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => {
                setFilterOption(DateTypes.Day);
                setDays(1);
              }}
            >
              24h
            </button>
          </div>
          <button
            className="flex w-max flex-row flex-nowrap justify-between gap-2 rounded-md border border-[#D0D5DD] px-3.5 py-2.5"
            onClick={() => setShowDatePicker(!showDatePicker)}
          >
            <Image src="/assets/images/calendar-icon.svg" width={20} height={20} alt="Calendar" />
            <div className="w-fit">
              <div className="block w-fit whitespace-nowrap text-nowrap px-0.5 text-sm font-semibold text-gray-placeholder">
                Select Dates
              </div>
            </div>
          </button>
        </div>

        <div className="relative mt-2">
          <div className="absolute right-0">
            {showDatePicker && (
              <div className="absolute right-0 z-10 mt-2">
                <DateRangePicker
                  stDate={startDate}
                  edDate={endDate}
                  onApply={(start, end) => {
                    setStartDate(start);
                    setEndDate(end);
                    setShowDatePicker(false);
                  }}
                  onCancel={() => {
                    setShowDatePicker(false);
                  }}
                />
              </div>
            )}
          </div>
          <div className="text-sm text-[#344054]">Search by repo</div>
          <div className="relative mt-1 h-fit rounded-md border border-[#D0D5DD] px-3.5 py-2.5">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={filterQuery}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className="h-6 w-full rounded-md pl-8 pr-1 text-lg text-gray-600 transition-shadow placeholder:text-gray-500 focus:border-transparent focus:outline-none"
            />
            {searchSuggestions.length > 0 && (
              <div className="absolute inset-x-0 z-10 mt-1 rounded-md border border-gray-300 bg-white shadow-lg">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={suggestion.id}
                    className={`cursor-pointer px-4 py-2 ${
                      index === selectedSuggestionIndex ? 'bg-gray-100' : 'hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      setSearchQueries([...searchQueries, { id: suggestion.id, name: suggestion.name }]);
                      setFilterQuery('');
                      setSearchSuggestions([]);
                    }}
                  >
                    {suggestion.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="h-6 py-4">
          {searchQueries.map((tag, index) => (
            <div
              key={`${tag.id}-${index}`}
              className="inline-flex w-max items-center rounded-full border-[#D9D6FE] bg-[#F4F3FF] px-1 py-0.5 text-sm text-[#5925DC]"
            >
              <div className="mr-0.5">{tag.name}</div>
              <button onClick={() => removeTag(index)}>
                <XCloseIcon size={16} color="#9B8AFB" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-end">
          <button
            className="border-[#D0D5DD focus:shadow-wite-focus-shadow rounded-lg border bg-white px-3 py-2 text-[#344054] hover:bg-wite-hover focus:bg-white"
            onClick={() => {
              setSearchQueries([]);
              setStartDate(null);
              setEndDate(null);
            }}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

const formatTime = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString();
};
const formattedQuery = (rationaleQuery: Partial<IRationaleQuery>): string => {
  const params = new URLSearchParams();

  Object.entries(rationaleQuery).forEach(([key, value]) => {
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(key, String(item));
      });
    }
    else {
      params.append(key, String(value));
    }
  });

  return params.toString();
};
const EvaluationPage: React.FC = () => {
  const params = useSearchParams();
  const tab = Tab.MyEvaluation;
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [searchQueries, setSearchQueries] = useState<ISearchQuery[]>([]);
  const [showFilterBox, setShowFilterBox] = useState(false);
  const boxRef = useRef(null as HTMLDivElement | null);
  const [selectedRationale, setSelectedRationale] = useState(1);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
  const router = useRouter();
  const { data: rationaleData, isLoading } = useGetProjectRationales(
    startDate?.toISOString() ?? '',
    endDate?.toISOString() ?? '',
    searchQueries.map(search => search.id),
    tab == Tab.MyEvaluation,
    sortOption === SortOption.Newest ? 'desc' : 'asc',
  );

  const queryClient = useQueryClient();
  const [isLoaded, setIsLoaded] = useState(false);

  const { mutateAsync: vote } = useUpdateRationaleVote({
    createdAtGte: formatTime(startDate),
    createdAtLte: formatTime(endDate),
    projectIds: searchQueries.map(search => search.id),
    myEvaluation: tab === Tab.MyEvaluation,
    orderBy: sortOption === SortOption.Newest ? 'desc' : 'asc',
  });

  const handleVote = async (rationale: string, project1Id: number, project2Id: number, shownValue: number) => {
    try {
      const chosenId = [0, 1].includes(shownValue) ? null : shownValue > 1 ? project2Id : project1Id;
      await vote({
        data: {
          project1Id,
          project2Id,
          project1Val: -Number(shownValue),
          project2Val: Number(shownValue),
          pickedId: chosenId,
          rationale: rationale,
        },
      });
      await queryClient.refetchQueries({ queryKey: ['project-rationale-evaluation'] });
    }
    catch (e) {
      console.error(e);
    }
  };
  useEffect(() => {
    if (isLoaded) {
      const query: Partial<IRationaleQuery> = {};
      if (searchQueries && searchQueries.length) {
        query.projectIds = searchQueries.map(proj => proj.id);
      }
      if (endDate) {
        query.createdAtLte = endDate.toISOString();
      }
      if (startDate) {
        query.createdAtGte = startDate.toISOString();
      }
      if (sortOption) {
        query.orderBy = ((sortOption === SortOption.Latest) ? 'asc' : 'desc');
      }
      router.push(`/evaluation?${formattedQuery(query)}`);
    }
  }, [searchQueries, startDate, endDate, sortOption]);
  useEffect(() => {
    setIsLoaded(false);
  }, []);
  const setInitSearchRepoParams = useCallback(async () => {
    const srcQuery = await Promise.all((params.getAll('projectIds') || []).map(async (projectId) => {
      return (await getCategory(Number(projectId))).collection;
    }));
    setSearchQueries(srcQuery);
    setIsLoaded(true);
  }, [params]);
  useEffect(() => {
    setSortOption((params.get('orderBy') === 'asc' ? SortOption.Latest : SortOption.Newest));
    const createdAtLte = params.get('createdAtLte');
    const createdAtGte = params.get('createdAtGte');
    setStartDate(createdAtGte ? new Date(createdAtGte) : null);
    setEndDate(createdAtLte ? new Date(createdAtLte) : null);
    setInitSearchRepoParams();
  }, [params]);
  const filterBoxRef = useRef<HTMLDivElement>(null);
  const fliterButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterBoxRef.current
        && !filterBoxRef.current.contains(event.target as Node)
        && fliterButtonRef.current && !fliterButtonRef.current.contains(event.target as Node)) {
        setShowFilterBox(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  if ((!rationaleData || isLoading || !isLoaded
  )) {
    return <Spinner />;
  }

  return (
    <div className="flex h-screen w-full min-w-fit flex-col justify-around pb-10">
      <HeaderRF6 showBackButton={true} myEvaluation={true} />
      <div className="my-9 ml-10 flex min-w-max grow flex-row justify-start gap-10 pr-10">
        <div className="w-[600px] rounded-2xl border border-gray-border bg-[#F9FAFB] px-3 py-4">
          <div ref={boxRef} className="relative flex h-full max-h-[680px] flex-col gap-4 overflow-auto pr-4">
            <div className="top-0 flex h-9 flex-row gap-4">
              <div className="grow border-gray-border">
                <div className="flex h-full flex-row items-center gap-3" />
              </div>
              <div ref={fliterButtonRef}>
                <button
                  className={`shadow-filter-shadow focus:shadow-wite-focus-shadow flex flex-row rounded-md border bg-white hover:bg-wite-hover focus:bg-white ${(searchQueries.length + ((startDate !== null || endDate !== null) ? 1 : 0)) ? 'border-[#D6BBFB]' : 'border-[#D0D5DD]'} gap-1 bg-white px-3 py-2`}
                  onClick={() => {
                    setShowFilterBox(!showFilterBox);
                  }}
                >
                  <span
                    className={`gap-1 text-sm font-semibold ${(searchQueries.length + ((startDate !== null || endDate !== null) ? 1 : 0)) ? 'text-[#6941C6]' : 'text-[#344054]'}`}
                  >
                    Filter
                  </span>
                  {searchQueries.length + ((startDate !== null || endDate !== null) ? 1 : 0)
                    ? (
                        <div className="flex w-8 flex-row rounded-full border border-[#D9D6FE] px-2 py-0.5">
                          <Image width={8} height={8} src="/assets/images/dot.svg" alt="dot" />
                          <span className="text-xs text-[#5925DC]">
                            {searchQueries.length + (startDate !== null || endDate !== null ? 1 : 0)}
                          </span>
                        </div>
                      )
                    : (
                        <Image width={20} height={20} src="/assets/images/filter-lines.svg" alt="Filter" />
                      )}
                </button>
              </div>
            </div>

            <div className="relative">
              {showFilterBox && (

                <div className="relative z-10" ref={filterBoxRef}>
                  <div className="absolute right-0">
                    <FilterBox
                      startDate={startDate}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      setStartDate={setStartDate}
                      searchQueries={searchQueries}
                      setSearchQueries={(searches: ISearchQuery[]) => {
                        setSearchQueries(searches);
                      }}
                      setSortOption={(opt: SortOption) => setSortOption(opt)}
                      sortOption={sortOption}
                    />
                  </div>
                </div>
              )}
              <div className="flex grow flex-col gap-4">
                {rationaleData && rationaleData.data.length > 0
                  ? rationaleData.data.map(
                      ({ id, pickedId, project1: p1, project2: p2, rationale, ratio: multiplier, parent }, index) => {
                        return (
                          <div key={id} onClick={() => setSelectedRationale(index + 1)} className="cursor-pointer">
                            <RationaleBox
                              pickedId={pickedId}
                              project1={p1}
                              project2={p2}
                              rationale={rationale}
                              multiplier={Number(multiplier)}
                              repoImage={parent.image}
                              repoName={parent.name}
                              selected={selectedRationale === index + 1}
                            />
                          </div>
                        );
                      },
                    )
                  : (
                      <div className="w-full text-center text-[#344054]">
                        No Evaluation found
                      </div>
                    )}
              </div>
            </div>
          </div>
        </div>
        {rationaleData && rationaleData.data.length > 0 && (
          <div className="flex min-w-[500px] grow flex-col gap-6 pr-10">
            <div className="grow rounded-2xl border border-gray-300 p-5">
              <div className="h-full overflow-auto pr-4">
                <div className="flex h-full flex-col justify-center gap-4">
                  <div className="flex flex-row justify-around">
                    <div className="flex w-fit flex-col justify-center gap-2">
                      <div className="flex w-full justify-center">
                        <Image
                          width={36}
                          height={36}
                          src={rationaleData.data[selectedRationale - 1].project1.image || '/placeholder.svg'}
                          alt={rationaleData.data[selectedRationale - 1].project1.name}
                        />
                      </div>
                      <div className="max-w-24">{rationaleData.data[selectedRationale - 1].project1.name}</div>
                    </div>
                    <div className="flex w-fit flex-col justify-center gap-2">
                      <div className="flex w-full justify-center">
                        <Image
                          width={36}
                          height={36}
                          src={rationaleData.data[selectedRationale - 1].project2.image || '/placeholder.svg'}
                          alt={rationaleData.data[selectedRationale - 1].project2.name}
                        />
                      </div>
                      <div className="max-w-24">{rationaleData.data[selectedRationale - 1].project2.name}</div>
                    </div>
                  </div>
                  <div className="h-max w-full">
                    <SliderBox
                      shownValue={
                        (rationaleData.data[selectedRationale - 1].ratio
                          ? Number(rationaleData.data[selectedRationale - 1].ratio)
                          : 1)
                        * (rationaleData.data[selectedRationale - 1].pickedId
                          === rationaleData.data[selectedRationale - 1].project1.id
                          ? -1
                          : 1)
                      }
                      handleVote={handleVote}
                      canBeEditable={tab === Tab.MyEvaluation}
                      rationale={rationaleData.data[selectedRationale - 1].rationale}
                      project1={rationaleData.data[selectedRationale - 1].project1}
                      project2={rationaleData.data[selectedRationale - 1].project2}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                disabled={selectedRationale === 1}
                className="focus:shadow-wite-focus-shadow flex flex-row justify-center rounded-md border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-medium text-[#344054] hover:bg-wite-hover focus:bg-white"
                onClick={() => setSelectedRationale(selectedRationale - 1)}
              >
                <ArrowLeft2Icon size={20} />
                Previous
              </button>
              <button
                disabled={selectedRationale === rationaleData.data.length}
                onClick={() => setSelectedRationale(selectedRationale + 1)}
                className="focus:shadow-wite-focus-shadow flex flex-row justify-center rounded-md border border-[#D0D5DD] bg-white px-4 py-2.5 text-sm font-medium text-[#344054] hover:bg-wite-hover focus:bg-white"
              >
                View Next
                <ArrowRight size={20} color="#344054" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationPage;
