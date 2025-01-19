'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HeaderRF6 from '../comparison/card/Header-RF6';
import { ProjectRationaleData, useGetPairwisePairs } from '../comparison/utils/data-fetching/pair';
import DateRangePicker from '../components/DateRangePicker';
import { Search } from '@/public/assets/icon-components/Search';
import { XCloseIcon } from '@/public/assets/icon-components/XClose';
import { useGetProjectRationales, useGetProjects } from './useProjects';
import { RationaleBox } from '../comparison/[categoryId]/RationaleBox';
import Spinner from '../components/Spinner';

enum Tab {
  AllEvaluation,
  MyEvaluation,
}

const tabs = {
  [Tab.AllEvaluation]: 'All evaluations',
  [Tab.MyEvaluation]: 'My evaluations',
};

type ProjectRationale = ProjectRationaleData & {
  categoryName?: string
  categoryImage?: string
};
enum SortOption {
  Newest,
  Latest,
}
enum DateTypes {
  Day,
  Week,
  Month,
}
interface ISearchQuery {id: number, name: string}

interface FilterBoxProps {
  searchQueries: ISearchQuery[];
  setSearchQueries: (ids: ISearchQuery[]) => void;
  startDate: Date | null;
  setStartDate: (date: Date | null) => void;
  endDate: Date | null;
  setEndDate: (date: Date | null) => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
  searchQueries,
  setSearchQueries,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
  const [filterOption, setFilterOption] = useState<DateTypes | null>(null);
  const [filterQuery, setFilterQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{ id: number; name: string }>>([]);
  const { data: projectData } = useGetProjects();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const removeTag = (index: number) => {
    setSearchQueries(searchQueries.filter((_, i) => i !== index));
  };

  const addTag = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && filterQuery !== '') {
      const selectedProject = searchSuggestions[0];
      if (selectedProject) {
        setSearchQueries([...searchQueries, { id: selectedProject.id, name: selectedProject.name }]);
        setFilterQuery('');
        setSearchSuggestions([]);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setFilterQuery(value);
    
    if (value) {
      const suggestions = projectData
        ?.filter(project => project.name.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 3)
        .map(project => ({ id: project.id, name: project.name })) || [];
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
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
              onClick={() => setFilterOption(DateTypes.Month)}
            >
              30d
            </button>
            <button
              className={`border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                filterOption === DateTypes.Week ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => setFilterOption(DateTypes.Week)}
            >
              7d
            </button>
            <button
              className={`rounded-r-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${
                filterOption === DateTypes.Day ? 'bg-[#F9FAFB]' : 'bg-white'
              } px-4 py-2`}
              onClick={() => setFilterOption(DateTypes.Day)}
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

        <div className="mt-2 relative">
          <div className='absolute right-0'>

      {showDatePicker && (
        <div className="absolute right-0 mt-2 z-10">
          <DateRangePicker
            stDate={startDate}
            edDate={endDate}
            onApply={(start, end) => {
              setStartDate(start);
              setEndDate(end);
              setShowDatePicker(false);
            }}
            onCancel={()=>{
              setShowDatePicker(false);
            }}
          />
        </div>
      )}
          </div>
          <div className="text-sm text-[#344054]">Search by repo</div>
          <div className="relative mt-1 h-fit border border-[#D0D5DD] py-2.5 px-3.5 rounded-md">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
              <Search size={20} />
            </div>
            <input
              type="text"
              value={filterQuery}
              onChange={handleInputChange}
              onKeyDown={addTag}
              placeholder="Search"
              className="h-6 w-full rounded-md pl-8 pr-1 text-lg text-gray-600 transition-shadow placeholder:text-gray-500 focus:border-transparent focus:outline-none"
            />
            {searchSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                {searchSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
        <div className='h-6 py-4'>
          {searchQueries.map((tag, index) => (
            <div
              key={`${tag.id}-${index}`}
              className="inline-flex items-center w-max bg-[#F4F3FF] border-[#D9D6FE] text-[#5925DC] px-1 py-0.5 rounded-full text-sm"
            >
              <div className='mr-0.5'>
                {tag.name}
              </div>
              <button onClick={() => removeTag(index)}>
                <XCloseIcon size={16} color='#9B8AFB' />
              </button>
            </div>
          ))}
        </div>
        <div className='w-full flex justify-end'>
          <button
            className='text-[#344054] bg-white rounded-lg border border-[#D0D5DD] py-2 px-3'
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

const limit = 10;
const EvaluationPage: React.FC = () => {
  const [tab, setTab] = useState<keyof typeof tabs>(Tab.AllEvaluation);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<ProjectRationale[]>();
  const [searchQueries, setSearchQueries] = useState<ISearchQuery[]>([]);
  const [showFilterBox,setShowFilterBox] = useState(false);
  const [page,setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { data: rationaleData } = useGetProjectRationales(page, limit,startDate?.toISOString()??"",endDate?.toISOString()??"",searchQueries.map((search)=>search.id),tab==Tab.MyEvaluation);

  useEffect(()=>{
    if(rationaleData){
      setTotalPages(rationaleData.meta.totalPages);
    }
  },[rationaleData])
  if(!rationaleData){
    return <Spinner/>;
  }
  return (
    <div className="px-10 flex h-screen flex-col justify-around">
      <HeaderRF6 showBackButton={true} allEvaluation={true} />

      <div className="my-9 flex grow flex-row justify-around gap-10">
        <div className="relative flex min-w-[600px] flex-col gap-4 overflow-auto rounded-2xl border border-gray-border bg-[#F9FAFB] px-3 py-4">
          <div className="sticky top-0 flex h-9 flex-row gap-4">
            <div className="grow border-b border-gray-border">
              {tabs && (
                <div className="flex h-full flex-row items-center gap-3">
                  {Object.entries(tabs).map(([t, text]) => (
                    <button
                      key={t}
                      className={`h-full max-w-32 px-1 pb-3 text-sm ${
                        tab === parseInt(t) ? 'border-b border-primary font-bold text-main-title' : 'font-normal text-dark-600'
                      }`}
                      onClick={() => setTab(parseInt(t))}
                    >
                      {text}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="shadow-filter-shadow flex flex-row rounded-md border border-[#D0D5DD] bg-white px-3 py-2"
              onClick={() => {
                setShowFilterBox(!showFilterBox);
              }}
            >
              <span className={`gap-1 text-sm font-semibold ${searchQueries.length==0?"text-[#344054]":"text-[#6941C6]"}`}>Filter</span>
              {searchQueries.length?
              <div className='px-2 py-0.5 flex flex-row'>
                <Image width={8} height={8} src="/assets/images/dot.svg" alt="dot"/>
                <span className='text-xs text-[#5925DC]'>{searchQueries.length}</span>
              </div>
              :
              <Image width={20} height={20} src="/assets/images/filter-lines.svg" alt="Filter" />}
            </button>
          </div>
          {showFilterBox && <div className="relative">
            <div className="absolute -top-2 right-0">
              <FilterBox
                startDate={startDate}
                endDate={endDate}
                setEndDate={setEndDate}
                setStartDate={setStartDate}
                searchQueries={searchQueries}
                setSearchQueries={(searches:ISearchQuery[])=>{setSearchQueries(searches)}}
              />
            </div>
          </div>}
          <div>
            <div className="flex grow flex-col gap-4">
                                {rationaleData && rationaleData.data.map(({ pickedId, project1: p1, project2: p2, rationale, ratio: multiplier,parent  }
                                  , index) => {
                                  return (
                                    <div>
                                    <RationaleBox
                                      key={index}
                                      pickedId={pickedId}
                                      project1={p1}
                                      project2={p2}
                                      rationale={rationale}
                                      multiplier={multiplier}
                                      repoImage={parent.image}
                                      repoName={parent.name}
                                    />
                                    </div>
                                  );
                                })}
                              </div>
          </div>
        </div>
        <div className="grow rounded-2xl border border-gray-border px-3 py-4 min-w-[500px]">
          {/* <button
            onClick={()=>{}}
            className="mb-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Sort by Newest
          </button>
          <button
            onClick={()=>{}}
            className="mb-2 px-4 py-2 ml-2 bg-gray-500 text-white rounded-md"
          >
            Sort by Oldest
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;

