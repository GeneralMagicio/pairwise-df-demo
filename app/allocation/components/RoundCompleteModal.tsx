'use client';

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
        <div className="mb-4 flex items-center justify-between">
          <div className="rounded-full bg-green-100 p-3">
            <svg
              className="size-6 text-green-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div onClick={onClose}>
            <XCloseIcon />
          </div>
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-xl font-bold" id="modal-title">
          Voting Round Completed!
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-gray-600">
          Thanks for putting time and efforts into this, your evaluations are needed to train AI Models
          and the quality is important for us. Take a break to start a new round or try ranking other
          repositories.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onFinishVoting}
            className="rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 hover:bg-gray-300 focus:outline-none"
          >
            Finish Voting
          </button>
          <button
            onClick={onNextRound}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-purple-700 focus:outline-none"
          >
            Next Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoundComplete;
