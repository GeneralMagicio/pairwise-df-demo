import React from 'react';
import { usePostHog } from 'posthog-js/react';
interface SignInWithWalletProps {
}

const SignInWithWallet: React.FC<SignInWithWalletProps> = () => {
  // const { doLoginFlow } = useAuth();
  const posthog = usePostHog();
  return (
    <div className="mx-auto w-[300px] rounded-lg bg-white p-6 shadow-md md:w-[420px]">
      <h2 className="mb-4 text-center text-xl font-semibold">Sign in with Github</h2>
      <p className="mb-6 text-center text-gray-500">
        Please sign in message on your github account for authentication
      </p>
      <button
        onClick={() => {
          posthog.capture('Sign in wallet');
          // doLoginFlow();
        }}
        className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-white transition
         duration-300 ease-in-out hover:bg-purple-600"
      >
        Sign in
      </button>
    </div>
  );
};

export default SignInWithWallet;
