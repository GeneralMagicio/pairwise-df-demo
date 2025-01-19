'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import HeaderRF6 from '../comparison/card/Header-RF6';
import { ProjectRationaleData, useGetPairwisePairs } from '../comparison/utils/data-fetching/pair';
import DateRangePicker from '../components/DateRangePicker';
import { Search } from '@/public/assets/icon-components/Search';
import { XCloseIcon } from '@/public/assets/icon-components/XClose';
import { useGetProjects } from './useProjects';

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
const FilterBox: React.FC<{searchQueries: number[],setSearchQueries: (ids: number[])=>void}> = ({searchQueries,setSearchQueries}) => {
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Newest);
  const [filterOption, setFilterOption] = useState<DateTypes | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [filterQuery,setFilterQuery] = useState('');
  const {data: projectData} = useGetProjects();
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  const addTag = (event: React.KeyboardEvent) => {
    if(event.key==="Enter" && filterQuery!==''){
      if(projectData?.some((projectDat)=>{
        if(projectDat.name === filterQuery){
          setSearchQueries([...searchQueries,projectDat.id]);
        }
        return projectDat.name === filterQuery;
      }
    ))
      setFilterQuery('');
    }
    else {
      console.log("No project found");
    }
  }
  return (
    <div className="rounded-md border border-[#D0D5DD] bg-white p-4">
      <div className="text-sm text-[#344054]">Sort by</div>
      <div className="mt-1">
        <div>
          <div className="flex h-full flex-row items-center gap-1">
            <div className="flex flex-row">
              <button className={`rounded-l-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${(sortOption === SortOption.Newest) ? 'bg-[#F9FAFB]' : 'bg-white'} px-4 py-2`} onClick={() => setSortOption(SortOption.Newest)}>
                Newest
              </button>
              <button className={`rounded-r-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${(sortOption === SortOption.Latest) ? 'bg-[#F9FAFB]' : 'bg-white'} px-4 py-2`} onClick={() => setSortOption(SortOption.Latest)}>Latest</button>
            </div>
            <div className="flex flex-row">

              <button className={`rounded-l-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${(filterOption === DateTypes.Month) ? 'bg-[#F9FAFB]' : 'bg-white'} px-4 py-2`} onClick={() => setFilterOption(DateTypes.Month)}>
                30d
              </button>
              <button className={`border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${(filterOption === DateTypes.Week) ? 'bg-[#F9FAFB]' : 'bg-white'} px-4 py-2`} onClick={() => setFilterOption(DateTypes.Week)}>7d</button>
              <button className={`rounded-r-md border border-[#D0D5DD] text-sm font-semibold text-[#344054] ${(filterOption === DateTypes.Day) ? 'bg-[#F9FAFB]' : 'bg-white'} px-4 py-2`} onClick={() => setFilterOption(DateTypes.Day)}>24h</button>
            </div>
            <button className="flex w-max flex-row flex-nowrap justify-between gap-2 rounded-md border border-[#D0D5DD] px-3.5 py-2.5">
              <Image src="/assets/images/calendar-icon.svg" width={20} height={20} alt="Calendar" />
              <div className="w-fit">
                <div className="block w-fit whitespace-nowrap text-nowrap px-0.5 text-sm font-semibold text-gray-placeholder">
                  Select Dates
                </div>
              </div>
            </button>
          </div>

          <div className="mt-2">
            <div className="text-sm text-[#344054]">Search by repo</div>
            <div className="relative mt-1 h-fit border border-[#D0D5DD] py-2.5 px-3.5 rounded-md">
              <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={filterQuery}
                onChange={(event:React.ChangeEvent<HTMLInputElement>)=>{
                  setFilterQuery(event.target.value);
                }}
                onKeyDown={addTag}
                placeholder="Search"
                className="h-6 w-full rounded-md pl-8 pr-1 text-lg text-gray-600 transition-shadow placeholder:text-gray-500 focus:border-transparent focus:outline-none"
              />
            </div>
          </div>
          <div className='h-6 py-4'>{tags.map((tag, index) => (
            <div
              key={`${tag}-${index}`}
              className="inline-flex items-center w-max bg-[#F4F3FF] border-[#D9D6FE] text-[#5925DC] px-1 py-0.5 rounded-full text-sm"
            >
              <div className='mr-0.5'>
              {tag}
              </div>
              <button
                onClick={() => removeTag(index)}
              >
                <XCloseIcon size={16} color='#9B8AFB'/>
              </button>
            </div>
          ))}
          </div>
          <div className='w-full flex justify-end'>
            <button className='text-[#344054] bg-white rounded-lg border border-[#D0D5DD] py-2 px-3' onClick={()=>{
              setTags([]);
              (0);
            }}>
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EvaluationPage: React.FC = () => {
  const [tab, setTab] = useState<keyof typeof tabs>(Tab.AllEvaluation);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<ProjectRationale[]>();
  const [searchQueries, setSearchQueries] = useState<number[]>([]);
  const { data: rationaleData } = useGetPairwisePairs(30);
  const [numFilters,setNumberFilters] = useState<number>(0);

  console.log(numFilters)
  return (
    <div className="px-10 flex h-screen w-full flex-col justify-around">
      <HeaderRF6 showBackButton={true} allEvaluation={true} />

      <div className="my-9 flex grow flex-row justify-around gap-10">
        <div className="relative flex w-[600px] flex-col gap-4 overflow-auto rounded-2xl border border-gray-border bg-[#F9FAFB] px-3 py-4">
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

              }}
            >
              <span className={`gap-1 text-sm font-semibold ${numFilters==0?"text-[#344054]":"text-[#6941C6]"}`}>Filter</span>
              {numFilters?
              <div className='px-2 py-0.5 flex flex-row'>
                <Image width={8} height={8} src="/assets/images/dot.svg" alt="dot"/>
                <span className='text-xs text-[#5925DC]'>{numFilters}</span>
              </div>
              :
              <Image width={20} height={20} src="/assets/images/filter-lines.svg" alt="Filter" />}
            </button>
          </div>
          <div className="relative">

            <div className="absolute -top-2 right-0">
              <FilterBox searchQueries={searchQueries} setSearchQueries={(searches:number[])=>{setSearchQueries(searches)}}/>
            </div>
            <DateRangePicker stDate={null} edDate={null} />
          </div>
        </div>
        <div className="grow rounded-2xl border border-gray-border px-3 py-4">
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
