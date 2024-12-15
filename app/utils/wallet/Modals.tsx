'use client';

import React from 'react';
import { useAccount } from 'wagmi';
import Modal from '../Modal';
import ConnectLoading from './modals/ConnectLoading';
import SignInWithWallet from './modals/SignInModal';
import { LogginToPwBackendState, useAuth } from './AuthProvider';
import NewWalletModal from './modals/NewWalletModal';

export default function Modals() {
  const { address } = useAccount();
  const {
    loggedToPw,
    loginInProgress,
    loginAddress,
    setLoginAddress,
    doLoginFlow,
    signOut,
  } = useAuth();

  const signInModalOpen
    = !!address && loggedToPw === LogginToPwBackendState.Error;

  const handleNewWalletCancel = () => {
    setLoginAddress({ ...loginAddress, confirmed: true });
  };

  const handleNewWalletSignIn = async () => {
    await signOut();
    setLoginAddress({
      value: address as `0x${string}` | undefined,
      confirmed: true,
    });
    doLoginFlow();
  };

  return (

    <>
      <Modal
        isOpen={
          loginAddress.value !== address || loginAddress.confirmed === false
        }
        onClose={() => {}}
      >
        <NewWalletModal
          onSignIn={handleNewWalletSignIn}
          onCancel={handleNewWalletCancel}
        />
      </Modal>

      <Modal isOpen={signInModalOpen} onClose={() => {}}>
        {signInModalOpen && <SignInWithWallet />}
      </Modal>
      <Modal isOpen={loginInProgress || false} onClose={() => {}}>
        {loginInProgress && <ConnectLoading />}
      </Modal>
    </>
  );
}
