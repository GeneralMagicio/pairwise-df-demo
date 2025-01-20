type TPendingCategoryProps = {
  onScore: () => void
};

const WipCategory = ({
  onScore,
}: TPendingCategoryProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <button
        onClick={onScore}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 bg-white py-3  font-semibold text-[#344054]"
      >
        Continue
      </button>
    </div>
  );
};

export default WipCategory;
