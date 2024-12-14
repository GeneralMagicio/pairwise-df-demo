type TPendingCategoryProps = {
  onScore: () => void
  progress: string
  isAutoConnecting: boolean
  isBadgeholder: boolean
  bhCategory: string
  categorySlug: string
  isBHCategoryAtessted: boolean
};

const PendingCategory = ({
  onScore,
  isAutoConnecting,
  progress,
  isBadgeholder,
  bhCategory,
  categorySlug,
  isBHCategoryAtessted,
}: TPendingCategoryProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <div className="flex w-full items-center justify-between">
        <button
          onClick={onScore}
          className={`flex w-full items-center justify-center gap-2 rounded-md border py-3 font-semibold ${
            isAutoConnecting || (isBadgeholder && bhCategory !== categorySlug && !isBHCategoryAtessted)
              ? 'border bg-gray-300 text-gray-600'
              : 'bg-primary text-white'
          } ${
            isBadgeholder && bhCategory === categorySlug ? 'w-full' : 'w-[48%]'
          }`}
          disabled={
            isAutoConnecting || (isBadgeholder && bhCategory !== categorySlug && !isBHCategoryAtessted)
          }
        >
          Vote
        </button>
      </div>
      {(progress === 'WIP' || progress === 'Finished')
      && !(isBadgeholder && bhCategory !== categorySlug && !isBHCategoryAtessted) && (
        <div className="flex w-full justify-center gap-2 rounded-xl border border-[#FFA15A] bg-[#FFF7ED] py-1">
          <p className="text-xs font-medium text-[#FFA15A]">Voting</p>
        </div>
      )}
    </div>
  );
};

export default PendingCategory;
