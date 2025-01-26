import React from 'react';
import { RefreshIcon } from '@/public/assets/icon-components/Refresh';

interface RefreshButtonProps {
  disabled?: boolean
  onClick: () => void
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`shadow-custom-shadow flex w-36 flex-row items-center justify-center
        gap-x-1.5 rounded-md border border-[#D0D5DD] px-4 py-2.5 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <RefreshIcon />
      <span className="text-dark-400 mt-1 text-lg font-semibold">Refresh</span>
    </button>
  );
};

export default RefreshButton;
