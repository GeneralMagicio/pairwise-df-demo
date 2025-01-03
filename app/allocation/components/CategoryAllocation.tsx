import { FC } from 'react';
import debounce from 'lodash.debounce';
import Link from 'next/link';
import Image from 'next/image';
import { NumericFormat } from 'react-number-format';
import { usePostHog } from 'posthog-js/react';
import { roundFractions } from '../utils';
import { CollectionProgressStatusEnum } from '@/app/comparison/utils/types';
import { TCategory } from '@/app/comparison/utils/data-fetching/categories';
import { ArrowRightIcon } from '@/public/assets/icon-components/ArrowRightIcon';
import { UnlockIcon } from '@/public/assets/icon-components/Unlock';
import { LockIcon } from '@/public/assets/icon-components/Lock';
import Loading from '@/app/components/Loading';
import VotedCategory from './ProgressCards/VotedCategory';
import PendingCategory from './ProgressCards/PendingCategory';

// Image source map for collections
// const collectionsImageSrc = new Map<number, string>([
//   [1, '/assets/images/category-it.svg'],
//   [2, '/assets/images/category-gra.svg'],
//   [3, '/assets/images/category-gl.svg'],
// ]);

interface CategoryAllocationProps extends TCategory {
  allocationPercentage: number
  locked: boolean
  delegations: number
  loading: boolean
  username?: string
  isBadgeholder: boolean
  bhCategory: string
  image: string
  isBHCategoryAtessted: boolean
  categorySlug: string
  onDelegate: () => void
  onScore: () => void
  onEdit: () => void
  onLockClick: () => void
  onPercentageChange: (value: number) => void
}

const CategoryAllocation: FC<CategoryAllocationProps> = ({
  id,
  name,
  description,
  projectCount,
  image,
  progress,
  allocationPercentage,
  locked,
  attestationLink,
  delegations,
  loading,
  isBadgeholder,
  bhCategory,
  categorySlug,
  isBHCategoryAtessted,
  onScore,
  onEdit,
  onLockClick,
  onPercentageChange,
}) => {
  const hrefLink
    = progress === CollectionProgressStatusEnum.Finished
    || progress === CollectionProgressStatusEnum.Attested
      ? `/allocation/${id}`
      : `/comparison/${id}`;

  const handleAllowedValue = (values: any) => {
    const { floatValue } = values;
    return floatValue === undefined || (floatValue >= 0 && floatValue <= 100);
  };
  const allocatingBudget = false;

  const handleInputChange = debounce((value: number) => {
    onPercentageChange(roundFractions(value, 2));
  }, 150);

  const handlePlus = () => {
    onPercentageChange(Math.min(allocationPercentage + 1, 100));
  };

  const handleMinus = () => {
    onPercentageChange(Math.max(allocationPercentage - 1, 0));
  };

  const renderProgressState = () => {
    if (loading) return <Loading />;
    switch (progress) {
      case CollectionProgressStatusEnum.Finished:
      case CollectionProgressStatusEnum.Attested:
        return (
          <VotedCategory
            id={id}
            attestationLink={attestationLink || ''}
            delegations={delegations}
            budgetEditHandle={onEdit}
          />
        );
      case CollectionProgressStatusEnum.Pending:
      default:
        return (
          <PendingCategory
            onScore={onScore}
            progress={progress}
            isBadgeholder={isBadgeholder}
            bhCategory={bhCategory}
            categorySlug={categorySlug}
            isBHCategoryAtessted={isBHCategoryAtessted}
          />
        );
    }
  };

  return (
    <div className="flex justify-between rounded-lg border bg-gray-50 p-4">
      <div className="flex w-[64%] space-x-4 2xl:w-[74%]">
        <ImageContainer src={image} alt={name} />
        <ProjectInfo
          name={name}
          description={description}
          projectCount={projectCount}
          hrefLink={hrefLink}
          isDelegated={false}
        />
      </div>

      <div className="flex w-[36%] items-center justify-center gap-2 2xl:w-[26%]">
        <div className="flex w-4/5 items-start justify-center">
          {allocatingBudget
            ? (
                <div className="flex w-full items-start justify-center gap-6 p-2">
                  <div className="flex flex-col gap-2 text-gray-500">
                    <div className="flex gap-2 rounded-md border px-6 py-1">
                      <button
                        onClick={handleMinus}
                        className="font-bold text-gray-600"
                      >
                        -
                      </button>
                      <div className="flex rounded bg-white text-dark-500">
                        <NumericFormat
                          value={allocationPercentage}
                          suffix="%"
                          decimalScale={2}
                          fixedDecimalScale
                          allowNegative={false}
                          isAllowed={handleAllowedValue}
                          onValueChange={({ floatValue }) => {
                            handleInputChange(floatValue ?? 0);
                          }}
                          className="w-20 bg-gray-50 text-center font-semibold focus:outline-none"
                          placeholder="0.00%"
                        />
                      </div>
                      <button
                        onClick={handlePlus}
                        className="font-bold text-gray-600"
                      >
                        +
                      </button>
                    </div>

                  </div>
                  <button
                    onClick={onLockClick}
                    className={`rounded-md p-1.5 ${
                      locked ? 'bg-gray-700' : 'bg-transparent'
                    }`}
                  >
                    {locked ? <LockIcon color="#fff" /> : <UnlockIcon />}
                  </button>
                </div>
              )
            : (
                renderProgressState()
              )}
        </div>
      </div>
    </div>
  );
};

const ImageContainer: FC<{ src: string, alt: string }> = ({ src, alt }) => (
  <div className="rounded-lg">
    <Image src={src} alt={alt} width={64} height={64} />
  </div>
);

const ProjectInfo: FC<{
  name: string
  description: string
  projectCount?: number
  hrefLink: string
  isDelegated?: boolean
}> = ({ name, description, projectCount, hrefLink, isDelegated }) => {
  const posthog = usePostHog();
  return (
    <div
      className={`flex max-w-[70%] flex-col gap-2 ${isDelegated && 'opacity-40'}`}
    >
      {isDelegated
        ? (
            <p
              className="flex items-center gap-2 font-medium"
              onClick={() => {
                posthog.capture('Explore project', { category: name });
              }}
            >
              {name}
              <ArrowRightIcon color="#05060B" size={24} />
            </p>
          )
        : (
            <Link
              className="flex items-center gap-2 font-medium"
              href={hrefLink}
              onClick={() => {
                posthog.capture('Explore project', { category: name });
              }}
            >
              {name}
              <ArrowRightIcon color="#05060B" size={24} />
            </Link>
          )}
      <p className="text-sm text-gray-400">{description}</p>
      {projectCount && (
        <p className="mt-2 w-fit rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
          {`${projectCount} project${projectCount > 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
};

export default CategoryAllocation;
