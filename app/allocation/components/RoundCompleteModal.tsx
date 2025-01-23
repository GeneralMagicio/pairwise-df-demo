import React from 'react';
import { XCloseIcon } from '@/public/assets/icon-components/XClose';

interface RoundCompleteProps {
  isOpen: boolean
  onClose: () => void
  onNextRound: () => void
  onFinishVoting: () => void
}

const RoundComplete: React.FC<RoundCompleteProps> = ({ isOpen, onClose, onNextRound, onFinishVoting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-fade-in mx-auto w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Close Icon */}
        {/* <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Close modal"
        >
          <svg
            className="size-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button> */}

        {/* Icon */}
        <div className="mb-4 flex items-start justify-between">
          <div className="rounded-full bg-green-100 p-3">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 24C0 10.7452 10.7452 0 24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24Z" fill="#DCFAE6" />
              <path d="M12 24C12 17.3726 17.3726 12 24 12C30.6274 12 36 17.3726 36 24C36 30.6274 30.6274 36 24 36C17.3726 36 12 30.6274 12 24Z" fill="#079455" />
              <path fill-rule="evenodd" clip-rule="evenodd" d="M29.0964 19.39L21.9364 26.3L20.0364 24.27C19.6864 23.94 19.1364 23.92 18.7364 24.2C18.3464 24.49 18.2364 25 18.4764 25.41L20.7264 29.07C20.9464 29.41 21.3264 29.62 21.7564 29.62C22.1664 29.62 22.5564 29.41 22.7764 29.07C23.1364 28.6 30.0064 20.41 30.0064 20.41C30.9064 19.49 29.8164 18.68 29.0964 19.38V19.39Z" fill="white" />
            </svg>
          </div>
          <div className="flex items-start justify-center p-2.5" onClick={onClose}>
            <XCloseIcon size={24} color="#98A2B3" />
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <h2 className="text-start text-lg font-semibold text-dark-600" id="modal-title">
            Well done on completing 5<br/>comparisons!
          </h2>

          {/* Message */}
          <p className="mb-8 text-start text-sm font-normal text-deep-250">
            Do you  want to start another round or take a break?
            <br />
            <br />
            Your answers are used to test & train AI model allocations. Quality is more important than quantity!
          </p>
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-center space-x-4">
          <button
            onClick={onFinishVoting}
            className="grow rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
          >
            Finish Voting
          </button>
          <button
            onClick={onNextRound}
            className="grow rounded-lg bg-primary px-4 py-2 text-white hover:bg-purple-700 focus:outline-none"
          >
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundComplete;
