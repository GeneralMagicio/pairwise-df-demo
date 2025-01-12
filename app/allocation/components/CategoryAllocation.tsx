import { FC } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePostHog } from 'posthog-js/react';
import { CollectionProgressStatusEnum } from '@/app/comparison/utils/types';
import { TCategory } from '@/app/comparison/utils/data-fetching/categories';
import Loading from '@/app/components/Loading';
import VotedCategory from './ProgressCards/VotedCategory';
import PendingCategory from './ProgressCards/PendingCategory';
import { shortenText } from '@/app/comparison/utils/helpers';

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
  attestationLink,
  delegations,
  loading,
  isBadgeholder,
  bhCategory,
  categorySlug,
  isBHCategoryAtessted,
  onScore,
  onEdit,
}) => {
  const hrefLink
    = progress === CollectionProgressStatusEnum.Finished
    || progress === CollectionProgressStatusEnum.Attested
      ? `/allocation/${id}`
      : `/comparison/${id}`;

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
    <div className="flex flex-col justify-between rounded-lg border bg-gray-50 p-4">
      <div className="flex w-full space-x-4">
        {/* <ImageContainer src={image} alt={name} /> */}
        <ProjectInfo
          name={name}
          description={description}
          projectCount={projectCount}
          hrefLink={hrefLink}
          src={image}
          alt={name}
        />
      </div>

      <div className="flex w-[36%] items-center justify-center gap-2 2xl:w-[26%]">
        <div className="flex w-4/5 items-start justify-center">
          { renderProgressState()}
        </div>
      </div>
    </div>
  );
};

// const ImageContainer: FC<{ src: string, alt: string }> = ({ src, alt }) => (
//   <div className="rounded-lg">
//     <Image src={src} alt={alt} width={64} height={64} />
//   </div>
// );

const ProjectInfo: FC<{
  name: string
  description: string
  projectCount?: number
  hrefLink: string
  src: string
  alt: string
}> = ({ name, description, projectCount, hrefLink, src, alt }) => {
  const posthog = usePostHog();
  return (
    <div
      className="flex w-full flex-col gap-2"
    >
      <div className="flex gap-2">
        <Image className="rounded-full border" src={src} alt={alt} width={48} height={48} />

        <Link
          className="flex items-center gap-2 font-medium"
          href={hrefLink}
          onClick={() => {
            posthog.capture('Explore project', { category: name });
          }}
        >
          {name}
          {/* <ArrowRightIcon color="#05060B" size={24} /> */}
        </Link>
      </div>
      <p className="text-sm text-gray-400">{shortenText(description, 30)}</p>
      {projectCount && (
        <p className="mt-2 w-fit rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
          {`${projectCount} project${projectCount > 1 ? 's' : ''}`}
        </p>
      )}
    </div>
  );
};

export default CategoryAllocation;
