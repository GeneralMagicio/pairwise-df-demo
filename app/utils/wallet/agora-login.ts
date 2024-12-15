import { SIWEConfig } from 'connectkit';
import { SiweMessage } from 'siwe';

// TODO: this should probably be an environment variable
// const BASE_URL = `https://vote.optimism.io`
export const AGORA_SIGN_IN = 'Sign in to Agora with Ethereum';

/* There's currently nothing stored on the backend to maintain session state.
// All session state is stateless and stored in the JWT issued by the server.
// Address, nonce, and chainId are all stored in the JWT, along with a particular
// time to live/expiry.
//
// For signOut, the client should remove JWT from storage as applicable, and is otherwise
// a no-op (pending AGORA-2015, or potential JWT-token tracking on our backend DB).
//
// JWT tokens for SIWE should therefore be issued with a short expiry time.
*/

// const isSiweEnabled = () => {
//   return process.env.NEXT_PUBLIC_SIWE_ENABLED === 'true'
// }

export const getMessageAndSignature = async (address: `0x${string}`, chainId: number, signFunc: ({ message }: { message: string }) => Promise<`0x${string}`>) => {
  const message = await createMessage({
    address,
    chainId,
    nonce: '',
  });

  const signature = await signFunc({ message });

  return { message, signature };
};

const createMessage: SIWEConfig['createMessage'] = ({ address, chainId }) =>
  new SiweMessage({
    version: '1',
    domain: window.location.host,
    uri: window.location.origin,
    statement: AGORA_SIGN_IN,
    address,
    chainId,
  }).prepareMessage();
