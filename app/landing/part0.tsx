
import { ConnectButton } from '../utils/wallet/Connect';
export const LandingPart0 = () => {
  return (
    <div className="flex h-auto flex-col items-center justify-between gap-[88px] py-28">

      <div className="flex flex-col justify-center text-center text-6xl font-bold">
        Welcome to Deep Funding
      </div>
      <div className="flex flex-row items-center justify-center text-2xl text-center text-wrap max-w-4xl">
      Deep Funding rewards open source contributors without them even having to apply for funding, based solely on the usefulness of their contributions.
      </div>
      <div className="flex flex-row items-center justify-center text-2xl text-center">
      <b>Pairwise</b>&nbsp;is a tool for allocators to suggest proposed weights of funding.
      </div>
      <div className="w-auto">
        <ConnectButton />
      </div>
    </div>
  );
};
