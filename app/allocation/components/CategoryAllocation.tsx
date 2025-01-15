import { FC } from 'react';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { CollectionProgressStatusEnum } from '@/app/comparison/utils/types';
import { TCategory } from '@/app/comparison/utils/data-fetching/categories';
import Loading from '@/app/components/Loading';
import VotedCategory from './ProgressCards/VotedCategory';
import PendingCategory from './ProgressCards/PendingCategory';
import { shortenText } from '@/app/comparison/utils/helpers';
import WipCategory from './ProgressCards/WipCategory';

// Image source map for collections
// const collectionsImageSrc = new Map<number, string>([
//   [1, '/assets/images/category-it.svg'],
//   [2, '/assets/images/category-gra.svg'],
//   [3, '/assets/images/category-gl.svg'],
// ]);

interface CategoryAllocationProps extends TCategory {
  allocationPercentage: number
  locked: boolean
  loading: boolean
  username?: string
  image: string
  onDelegate: () => void
  onScore: () => void
  onView: () => void
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
  loading,
  onScore,
  onView,
}) => {
  const renderProgressState = () => {
    if (loading) return <Loading />;
    switch (progress) {
      case CollectionProgressStatusEnum.Finished:
      case CollectionProgressStatusEnum.Attested:
        return (
          <VotedCategory
            id={id}
            budgetEditHandle={onView}
          />
        );
      case CollectionProgressStatusEnum.WIP:
      case CollectionProgressStatusEnum.WIPThreshold:
        return (
          <WipCategory
            onScore={onScore}
          />
        );
      case CollectionProgressStatusEnum.Pending:
      default:
        return (
          <PendingCategory
            onScore={onScore}
          />
        );
    }
  };

  return (
    <div className="flex flex-col justify-between gap-8 rounded-lg border bg-gray-50 p-4">
      <div className="flex w-full space-x-4">
        <ProjectInfo
          name={name}
          description={description}
          projectCount={projectCount}
          src={image}
          alt={name}
        />
      </div>

      <div className="flex w-full items-center justify-center gap-2">
        { renderProgressState()}
      </div>
    </div>
  );
};

const ProjectInfo: FC<{
  name: string
  description: string
  projectCount?: number
  src: string
  alt: string
}> = ({ name, description, projectCount, src, alt }) => {
  const posthog = usePostHog();
  return (
    <div
      className="flex w-full flex-col gap-2"
    >
      <div className="flex gap-2">
        <Image className="rounded-full border" src={src} alt={alt} width={36} height={36} />

        <span
          className="flex items-center gap-2 font-medium"
          onClick={() => {
            posthog.capture('Explore project', { category: name });
          }}
        >
          {name}
        </span>
      </div>
      <p className="text-sm text-gray-400">{shortenText(description, 30)}</p>
      {projectCount && (
        <p className="mt-2 w-fit rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
          {`${projectCount} dependencies`}
        </p>
      )}
    </div>
  );
};

export default CategoryAllocation;
