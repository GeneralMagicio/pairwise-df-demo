import { CheckIcon } from '@/public/assets/icon-components/Check';

type TVotedCategoryProps = {
  id: number
  viewMyEvaluations: () => void
};

const VotedCategory = ({
  viewMyEvaluations,
}: TVotedCategoryProps) => {
  return (
    <div className="flex w-full items-center justify-center gap-4">
      <div
        className="flex w-full items-center justify-center gap-2 rounded-md border bg-[#dcfae6] py-3 font-semibold text-[#17B26A]"
      >
        Voted
        <CheckIcon size={15} />
      </div>
      <button
        className="focus:shadow-wite-focus-shadow flex w-full items-center justify-center gap-2 rounded-md border bg-white py-3 font-semibold hover:bg-wite-hover focus:bg-white"
        onClick={viewMyEvaluations}
      >
        View
      </button>

    </div>
  );
};

export default VotedCategory;
