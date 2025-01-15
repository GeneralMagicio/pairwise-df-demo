'use client';
import { useState } from 'react';
import HeaderRF6 from '../comparison/card/Header-RF6';
import Image from 'next/image';
import { ProjectRationaleData } from '../comparison/utils/data-fetching/pair';
enum Tab {
  AllEvaluation,
  MyEvaluation,
}
const tabs = {
  [Tab.AllEvaluation]: 'All evaluations',
  [Tab.MyEvaluation]: 'My evaluations',
};
type ProjectRationale = ProjectRationaleData & {categoryName: string,categoryImage: string}
const EvaluationPage:React.FC<{rationaleData: ProjectRationaleData[]}> = ({rationaleData}) => {
  const [tab, setTab] = useState<keyof typeof tabs>(Tab.AllEvaluation);
  const filterOptions = {
    date: (startDate: Date, endDate: Date)=>{
        if(endDate.getTime()<startDate.getTime()){
            throw new Error("End Date is greater than the start Date");
        }
    },
    filterDepenedencies: (depsList: string[])=>{
        
    },

  }
  const sortOption = {
    date: ()=>{

    }
  }
  return (
    <div className="flex h-screen w-full flex-col">
      <HeaderRF6 showBackButton={true} allEvaluation={true} />
      <div className="my-9 flex grow flex-row justify-around">
        <div className="w-2/5 flex flex-col gap-4 rounded-2xl border border-gray-border bg-[#F9FAFB] px-3 py-4">
            <div className="sticky top-0 flex h-9 flex-row gap-4">
              <div className="grow border-b border-gray-border">
                {tabs && (
                  <div className="flex h-full flex-row items-center gap-3">
                    {Object.entries(tabs).map(([t, text]) => {
                      return <button key={t} className={`h-full max-w-32 text-wrap break-words px-1 pb-3 text-sm ${tab === parseInt(t) ? 'border-b border-primary font-bold text-main-title' : 'font-normal text-dark-600'}`} onClick={() => setTab(parseInt(t))}>{text}</button>;
                    })}
                  </div>
                )}
              </div>
              <button className="flex flex-row bg-white px-3 py-2 shadow-filter-shadow rounded-md border border-[#D0D5DD]">
                <span className='text-sm font-semibold text-[#344054] gap-1'>Filter</span>
                <Image width={20} height={20} src="/assets/images/filter-lines.svg" alt="Filter Image"/>
              </button>
            </div>
        </div>
        <div className="w-1/2 rounded-2xl border border-gray-border px-3 py-4">
        </div>
      </div>
    </div>

  );
}
