import { ConnectButton } from '../utils/wallet/Connect';
export const LandingPart0 = () => {
  return (
    <div className="flex h-auto flex-col items-center justify-between gap-[88px] py-28">

      <div className="flex flex-col justify-center text-center text-6xl font-bold">
        Welcome to Deep Funding
      </div>
      <div className="flex max-w-4xl flex-row items-center justify-center text-wrap text-center text-2xl">
        Deep Funding rewards open source contributors without them even having to apply for funding,
        based solely on the usefulness of their contributions.
      </div>
      <div className="flex flex-row items-center justify-center text-center text-2xl">
        <b>Pairwise</b>
&nbsp;is a tool for allocators to suggest proposed weights of funding.
      </div>
      <div className="w-auto">
        <ConnectButton />
      </div>
    </div>
  );
};
