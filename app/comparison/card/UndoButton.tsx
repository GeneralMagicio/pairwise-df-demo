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
      className={`gap border-primary shadow-custom-shadow flex flex-row
        items-center justify-center gap-1.5 rounded-md border px-4 py-2.5 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      disabled={disabled}
    >
      <UndoIcon />
      <span className="text-dark-400 mt-1 text-lg font-semibold">Undo</span>
    </button>
  );
};

export default UndoButton;
