import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ProjectRationaleData } from '../utils/data-fetching/pair';
import { shortenText } from '../utils/helpers';

type RationaleReturnType = Pick<ProjectRationaleData, 'pickedId' | 'project1' | 'project2' | 'multiplier' | 'rationale'> & { repoName?: string, repoImage?: string, selected?: boolean }
export const RationaleBox = ({
  pickedId,
  project1: p1,
  project2: p2,
  multiplier,
  rationale,
  repoImage,
  repoName,
  selected,
}: RationaleReturnType) => {
  const [viewMore, setViewMore] = useState(false);
  const [isOverflow, setOverflow] = useState(false);
  const rationaleRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    setViewMore(false);
  }, [p1, p2]);
  useEffect(() => {
    const detectOverflow = () => {
      if (rationaleRef.current && rationaleRef.current.scrollHeight > rationaleRef.current.clientHeight) {
        setOverflow(true);
      }
      else {
        setOverflow(false);
      }
    };

    detectOverflow();
    window.addEventListener('resize', detectOverflow);
    return () => window.removeEventListener('resize', detectOverflow);
  }, []);
  return (
    (
      <div className={`flex flex-col gap-1.5 text-ellipsis rounded-md border ${selected ? 'border-primary' : 'border-[#D0D5DD]'} bg-white px-3.5 py-3`}>

        <div className="flex flex-row text-xs font-normal text-dark-600">
          {repoImage && repoName && (
            <div className="mr-2 flex h-4 flex-row items-center justify-center gap-1.5">
              <Image src={repoImage} alt={repoName} width={16} height={16} />
              <div className="text-xs font-semibold text-dark-600">{repoName}</div>
            </div>
          )}
          {pickedId === p1.id
            ? (
                <div>
                  {shortenText(p1.name, 15)}
                  {' '}
                  deserves
                  {' '}
                  <span className="font-semibold">
                    {multiplier}
                    x more credit
                  </span>
                  {' '}
                  than
                  {' '}
                  {shortenText(p2.name, 15)}
                </div>
              )
            : pickedId === p2.id
              ? (
                  <div>
                    {shortenText(p2.name, 15)}
                    {' '}
                    deserves
                    {' '}
                    <span className="font-semibold">
                      {multiplier}
                      x more credit
                    </span>
                    {' '}
                    than
                    {' '}
                    {shortenText(p1.name, 15)}
                  </div>
                )
              : (
                  <div>
                    {shortenText(p1.name, 15)}
                    {' '}
                    and
                    {' '}
                    {shortenText(p2.name, 15)}
                    <span className="ml-1 font-semibold">
                      deserve equal credit
                    </span>
                  </div>
                )}
        </div>
        <div ref={rationaleRef} className={`text-sm font-normal text-[#344054] ${viewMore ? '' : 'line-clamp-2'} text-ellipsis`}>{rationale}</div>
        {isOverflow && !viewMore && <button onClick={() => setViewMore(true)} className="w-full text-start text-sm font-semibold text-[#344054]">Read More..</button>}
      </div>
    )
  );
};
