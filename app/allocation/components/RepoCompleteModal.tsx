import React from 'react';

interface Props {
  isOpen: boolean
  onFinishVoting: () => void
}

const RepoComplete: React.FC<Props> = ({ isOpen, onFinishVoting }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="animate-fade-in mx-auto w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
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
        </div>

        {/* Title */}
        <h2 className="mb-2 text-center text-xl font-bold" id="modal-title">
          Good job!
        </h2>

        {/* Message */}
        <p className="mb-6 text-center text-gray-600">
          You voted on all 30 comparisons of this repo. Get back to the repositories page and start voting for others.
        </p>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onFinishVoting}
            className="rounded-lg border-2 bg-primary px-4 py-2 text-gray-50 hover:bg-purple-600 focus:outline-none"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default RepoComplete;
