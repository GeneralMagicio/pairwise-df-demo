import { useEffect, useRef, useState } from 'react';
import { ProjectRationaleData } from '../utils/data-fetching/pair';

type RationaleReturnType = Pick<ProjectRationaleData, 'pickedId' | 'project1' | 'project2' | 'multiplier' | 'rationale'> & { repoName?: string, repoImage?: string }
export const RationaleBox = ({ pickedId, project1: p1, project2: p2, multiplier, rationale, repoImage, repoName }: RationaleReturnType) => {
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
      <div className="flex flex-col gap-1.5 text-ellipsis rounded-md border border-[#D0D5DD] bg-white px-3.5 py-3">
        <div className="text-xs font-normal text-dark-600">
          {pickedId === p1.id
            ? (
                <div>
                  {p1.name}
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
                  {p2.name}
                </div>
              )
            : pickedId === p2.id
              ? (
                  <div>
                    {p2.name}
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
                    {p1.name}
                  </div>
                )
              : (
                  <div>
                    {p1.name}
                    {' '}
                    deserves
                    {' '}
                    <span className="font-semibold">
                      1x more credit
                    </span>
                    {' '}
                    than
                    {' '}
                    {p2.name}
                  </div>
                )}
        </div>
        <div ref={rationaleRef} className={`text-sm font-normal text-[#344054] ${viewMore ? '' : 'line-clamp-2'} text-ellipsis`}>{rationale}</div>
        {isOverflow && !viewMore && <button onClick={() => setViewMore(true)} className="w-full text-start text-sm font-semibold text-[#344054]">Read More..</button>}
      </div>
    )
  );
};
