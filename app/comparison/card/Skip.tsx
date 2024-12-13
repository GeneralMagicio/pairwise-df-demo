import React from 'react';
import { SkipIcon } from '@/public/assets/icon-components/Skip';

interface SkipButtonProps {
  onClick: () => void
}

const SkipButton: React.FC<SkipButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`gap border-dark-300 shadow-custom-shadow flex flex-row
        items-center justify-center gap-1.5 rounded-md border px-4 py-2.5`}
    >
      <span className="text-dark-400 mt-1 text-lg font-semibold">Skip</span>
      <SkipIcon />
    </button>
  );
};

export default SkipButton;
