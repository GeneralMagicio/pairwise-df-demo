import { RoundSize } from '@/app/comparison/card/Header-RF6';

type TPendingCategoryProps = {
  id: number
  onScore: () => void
  votedPairs: number
  totalPairs: number
};

const WipCategory = ({
  id,
  onScore,
  votedPairs,
  totalPairs,
}: TPendingCategoryProps) => {
  const roundNumber = (votes: number) => Math.min(6, Math.floor(votes / RoundSize) + 1);
  const totalRounds = Math.ceil(totalPairs / RoundSize);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <button
        onClick={onScore}
        className="focus:shadow-wite-focus-shadow flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white py-3 font-semibold text-[#344054]  hover:bg-wite-hover focus:bg-white"
      >
        {`Round ${roundNumber(votedPairs)} of ${totalRounds}`}
      </button>

      <a className="text-sm font-semibold text-main-title hover:text-main-hover" href={`/evaluation?projectIds=${id}`}>
        My Evaluations
      </a>
    </div>
  );
};

export default WipCategory;
