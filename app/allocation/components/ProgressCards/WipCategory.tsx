import { RoundSize } from '@/app/comparison/card/Header-RF6';

type TPendingCategoryProps = {
  onScore: () => void
  votedPairs: number
  totalPairs: number
};

const WipCategory = ({
  onScore,
  votedPairs,
  totalPairs,
}: TPendingCategoryProps) => {
  const roundNumber = (votes: number) => Math.min(6, Math.floor(votes / RoundSize) + 1);
  const totalRounds = Math.ceil(totalPairs / RoundSize);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <button
        onClick={onScore}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white py-3  font-semibold text-[#344054]"
      >
        {`Round ${roundNumber(votedPairs)} of ${totalRounds}`}
      </button>
    </div>
  );
};

export default WipCategory;
