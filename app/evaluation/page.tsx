'use client';
import { useState, useEffect } from 'react';
import HeaderRF6 from '../comparison/card/Header-RF6';
import Image from 'next/image';
import { ProjectRationaleData, useGetPairwisePairs } from '../comparison/utils/data-fetching/pair';
import DateRangePicker from '../components/DateRangePicker';

enum Tab {
  AllEvaluation,
  MyEvaluation,
}

const tabs = {
  [Tab.AllEvaluation]: 'All evaluations',
  [Tab.MyEvaluation]: 'My evaluations',
};

type ProjectRationale = ProjectRationaleData & {
  categoryName?: string;
  categoryImage?: string;
};

const EvaluationPage: React.FC = () => {
  
  const [tab, setTab] = useState<keyof typeof tabs>(Tab.AllEvaluation);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [filteredData, setFilteredData] = useState<ProjectRationale[]>();
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const {data: rationaleData} = useGetPairwisePairs(30);
  // const [sortOptions,setSortOptions] = useState<

  // useEffect(()=>{
  //   if(endDate!==startDate){

  //   }
  //   if (end.getTime() < start.getTime()) {
  //     throw new Error('End Date cannot be earlier than the Start Date');
  //   }
  //   const filtered = rationaleData.filter((item) => {
  //     const itemDate = new Date(item.createdAt);
  //     return itemDate >= start && itemDate <= end;
  //   });
  //   setFilteredData(filtered);
  // },[searchQueries])
  // const filterOptions = {
  //   date: (start: Date, end: Date) => {
  //     if (end.getTime() < start.getTime()) {
  //       throw new Error('End Date cannot be earlier than the Start Date');
  //     }
  //     const filtered = rationaleData.filter((item) => {
  //       const itemDate = new Date(item.createdAt);
  //       return itemDate >= start && itemDate <= end;
  //     });
  //     setFilteredData(filtered);
  //   },
  //   search: (queries: string[]) => {
  //     if (queries.length === 0) {
  //       setFilteredData(rationaleData);
  //     } else {
  //       const filtered = rationaleData.filter((item) =>
  //         queries.some(
  //           (query) =>
  //             item.project1.name.toLowerCase().includes(query.toLowerCase()) ||
  //             item.project2.name.toLowerCase().includes(query.toLowerCase()) ||
  //             item.project1.id.toString() === query ||
  //             item.project2.id.toString() === query
  //         )
  //       );
  //       setFilteredData(filtered);
  //     }
  //   },
  // };

  // const sortOptions = {
  //   dateNewest: () => {
  //     const sorted = [...filteredData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  //     setFilteredData(sorted);
  //   },
  //   dateOldest: () => {
  //     const sorted = [...filteredData].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  //     setFilteredData(sorted);
  //   },
  // };

  // useEffect(() => {
  //   filterOptions.search(searchQueries);
  // }, [searchQueries]);

  return (
    <div className="flex h-screen w-full flex-col">
      <HeaderRF6 showBackButton={true} allEvaluation={true} />
      <div className="my-9 flex grow flex-row justify-around">
        <div className="w-2/5 flex flex-col gap-4 rounded-2xl border border-gray-border bg-[#F9FAFB] px-3 py-4">
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
              className="flex flex-row bg-white px-3 py-2 shadow-filter-shadow rounded-md border border-[#D0D5DD]"
              onClick={() => {}}
            >
              <span className="text-sm font-semibold text-[#344054] gap-1">Filter</span>
              <Image width={20} height={20} src="/assets/images/filter-lines.svg" alt="Filter" />
            </button>
          </div>
          {/* <input
            type="text"
            placeholder="Search by project name or ID"
            className="mt-3 p-2 border rounded-md"
            onChange={(e) => {
              const queries = e.target.value.split(',').map((q) => q.trim());
              setSearchQueries(queries);
            }}
          /> */}
          {/* {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div key={index} className="p-4 border rounded-md bg-white shadow-sm">
                <h3 className="font-semibold">{item.project1.name} vs {item.project2.name}</h3>
                <p>{item.rationale}</p>
                <p className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No evaluations found.</p>
          )} */}
          <DateRangePicker/>
        </div>
        <div className="w-1/2 rounded-2xl border border-gray-border px-3 py-4">
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
