import React from 'react';

const ConnectBox: React.FC = () => {
  return (
    <div className="max-w-md rounded-xl border bg-white p-6">
      <h2 className="mb-4 w-full border-b pb-2 text-2xl font-semibold text-gray-700">
        How to Vote
      </h2>

      <p className="mb-4 flex flex-col gap-2 text-base text-gray-600">
        <span>
          After selecting a repo, you will be shown 2 of its dependencies side by side.
          Your job is to pick the one that is more important and also tell us how much more important you think it is.
        </span>
        <span>
          We encourage you to take up to 3-5 minutes per comparison,
          especially on quantifying the weights between dependencies.
          Quality is more important than quantity! In Deep Funding,
          votes are used to identify AI or metrics based models best aligned with your preferences,
          which then get its weights applied across all dependencies.
        </span>
        <span>
          You can click “Next” if you want to skip a comparison.
          We encourage at least 30 comparisons.
          Reach out to
          <span className="mx-1 text-primary">
            @TheDevanshMehta
          </span>
          on telegram if you have any questions
          and join a group with all jurors here:
          <a target="__blank" className="block text-primary" href="https://t.me/+9ACnzpZJ91k4ZjNl">
            https://t.me/+9ACnzpZJ91k4ZjNl
          </a>
        </span>

      </p>

    </div>
  );
};

export default ConnectBox;
