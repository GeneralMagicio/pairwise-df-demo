import React, { FC } from 'react';
import { GithubIcon } from '@/public/assets/icon-components/Github';
import { DevIcon } from '@/public/assets/icon-components/Dev';
import { ForkIcon } from '@/public/assets/icon-components/Fork';
import { StarIcon } from '@/public/assets/icon-components/Star';
import { OpenSourceIcon } from '@/public/assets/icon-components/OpenSource';
import { QuestionMarkIcon } from '@/public/assets/icon-components/QuestionMark';
import { ProjectMetadata } from '../utils/types';
import { formatAmount } from './GrantBox';
import { USDIcon } from '@/public/assets/icon-components/Usd';

type Props = Pick<ProjectMetadata, 'forkCount' | 'starCount' | 'id' | 'totalFundingUsd' | 'language' > & { name: string }

function calculateAge(createdAt: string): number {
  // Parse the input string to a Date object
  const createdDate = new Date(createdAt);

  // Get current date
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const diffInMs = currentDate.getTime() - createdDate.getTime();

  // Convert milliseconds to years
  const years = diffInMs / (1000 * 60 * 60 * 24 * 365.25);

  // Return rounded down number of years
  return Math.floor(years);
}

const GithubBox: FC<Props> = ({ forkCount, starCount, id, name, totalFundingUsd, language,
}) => {
  // const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();

  return (
    <div
      className="max-w-full rounded-lg border border-gray-200 bg-gray-50 p-2 py-[12px]"
    >
      <div
        className="mb-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <GithubIcon />
          <a
            href={id}
            className="break-all text-gray-700 hover:underline"
            target="_blank"
            onClick={e => e.stopPropagation()}
          >
            {name}
          </a>
          <div
            className="flex items-center gap-1 rounded-2xl border bg-blue-background px-2
          py-0.5 text-xs text-blue-foreground"
          >
            <OpenSourceIcon color="#3374DB" />
            <span> Open source </span>
          </div>
        </div>

      </div>
      <section>

        <>
          <div className="font-inter mb-2 grid grid-cols-3 gap-2 text-sm font-normal leading-5">
            <div title="Total Funding Received" className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <USDIcon />
              {totalFundingUsd
                ? (
                    <span className="text-sm">
                      {`$${
                        formatAmount(`${totalFundingUsd}`)
                      }`}
                    </span>
                  )
                : <span> N/A </span>}
            </div>

            {/* <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <DevIcon />
              <span className="text-sm">
                {`${
                  Number(repo.metrics.num_contributors_last_6_months).toFixed(
                    0
                  ) || 0
                } contributers last 6 months`}
              </span>
            </div> */}
            {/* <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <CommitIcon />
              <span className="text-sm"> 5 commits last 1mo</span>
            </div> */}
            <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <ForkIcon />
              <span className="text-sm">
                {`${forkCount || 0} forks`}
              </span>
            </div>
            {/* <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <ForkIcon />
              <span className="text-sm">
                {`${repo.metrics.num_trusted_forks || 0} forks from top devs`}
              </span>
            </div> */}
            <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <StarIcon />
              <span className="text-sm">
                {`${starCount || 0} stars`}
              </span>
            </div>
            {/* <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <StarIcon />
              <span className="text-sm">
                {`${repo.metrics.num_trusted_stars || 0} stars from top devs`}
              </span>
            </div> */}
            <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <DevIcon />
              {language
                ? (
                    <span className="text-sm">
                      {`Lang: ${language}`}
                    </span>
                  )
                : 'N/A'}
            </div>
            <div className="flex items-center gap-2 rounded-md bg-gray-100 p-2">
              <OpenSourceIcon />
              <span className="text-sm">Open source</span>
            </div>
          </div>
          <div className="flex items-center gap-2" title="Data is provided by OSO">
            <QuestionMarkIcon />
            <p className="text-sm text-gray-600">About GitHub metrics</p>
          </div>
        </>

      </section>
    </div>
  );
};

export default GithubBox;
