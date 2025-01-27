type TPendingCategoryProps = {
  onScore: () => void
};

const PendingCategory = ({
  onScore,
}: TPendingCategoryProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-2">
      <button
        onClick={onScore}
        className="flex w-full items-center justify-center gap-2 rounded-md border bg-primary py-3 font-semibold text-white  hover:bg-main-title focus:bg-primary"
      >
        Vote
      </button>
    </div>
  );
};

export default PendingCategory;
