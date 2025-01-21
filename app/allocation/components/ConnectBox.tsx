import React from 'react';

const ConnectBox: React.FC = () => {
  return (
    <div className="max-w-md rounded-xl border bg-white p-6">
      <h2 className="mb-4 w-full border-b pb-2 text-2xl font-semibold text-gray-700">
        How it works
      </h2>

      <p className="mb-4 text-base text-gray-600">
        A bunch of models give suggestions on donations.
        Then, you are shown a random selection of "quiz questions" where you see two projects A and B and have to answer,
        "which deserves more?". At the end, you get scores of how well each model complies with your preferences.
        You can fund based on a weighted average of the results of the models,
        giving higher weights to models that comply with your preferences more.
        <br />
        <br />
        One way to view this is that public submissions give you a large,
        eventually multi-million-dimensional, sea of possible answers,
        and your job is to provide a small number of inputs to “steer” into the region with the best answers.
        <br />
        <br />
        Because each spot-check is “local”, you never have to answer difficult grand questions
        like “what is the dollar value of how valuable project X is to humanity?”
        - instead, you answer much more concrete questions like “compare the direct impact of A and B on C”.

      </p>

    </div>
  );
};

export default ConnectBox;
