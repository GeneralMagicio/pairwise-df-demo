import React from 'react';
import { UndoIcon } from '@/public/assets/icon-components/Undo';

interface UndoButtonProps {
  disabled?: boolean
  onClick: () => void
}

const UndoButton: React.FC<UndoButtonProps> = ({ disabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`shadow-custom-shadow focus:shadow-wite-focus-shadow m-0 flex h-fit w-36 flex-row items-center
        justify-center gap-x-1.5 rounded-md border border-[#D0D5DD] bg-white px-4 py-2.5 hover:bg-wite-hover focus:bg-white disabled:text-gray-500 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <UndoIcon color={disabled ? '#98A2B3' : '#344054'} />
      <span className="text-base font-semibold text-[#344054]">Undo</span>
    </button>
  );
};

export default UndoButton;
