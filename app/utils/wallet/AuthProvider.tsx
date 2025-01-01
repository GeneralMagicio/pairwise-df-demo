import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import StorageLabel from '@/app/lib/localStorage';
import { isLoggedIn } from './pw-login';

export enum LogginToPwBackendState {
  Initial,
  Error,
  LoggedIn,
}

interface AuthContextType {
  loginInProgress: boolean | null
  setLoginInProgress: (bool: boolean | null) => void
  loggedToPw: LogginToPwBackendState
  setLoggedToPw: (state: LogginToPwBackendState) => void
  githubHandle: string | undefined
  setGithubHandle: (value: string | undefined) => void
}

const AuthContext = createContext<AuthContextType>({
  loginInProgress: null,
  setLoginInProgress: () => {},
  loggedToPw: LogginToPwBackendState.Initial,
  setLoggedToPw: () => {},
  githubHandle: undefined,
  setGithubHandle: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loginInProgress, setLoginInProgress] = useState<boolean | null>(null);
  const [loggedToPw, setLoggedToPw] = useState(LogginToPwBackendState.Initial);
  const [githubHandle, setGithubHandle] = useState<string | undefined>();

  useAuth();

  return (
    <AuthContext.Provider
      value={{
        loginInProgress,
        setLoginInProgress,
        loggedToPw,
        setLoggedToPw,
        githubHandle,
        setGithubHandle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const {
    loggedToPw,
    setLoggedToPw,
    githubHandle,
    setGithubHandle,
    loginInProgress,
  } = useContext(AuthContext);

  const router = useRouter();

  const clearLocalStorage = () => {
    localStorage.removeItem(StorageLabel.AUTH);
    localStorage.removeItem(StorageLabel.LOGGED_IN_GITHUB_HANDLE);
  };

  const signOut = useCallback(() => {
    clearLocalStorage();
    setGithubHandle(undefined);
    setLoggedToPw(LogginToPwBackendState.Initial);
    router.push('/');
  }, [router, setGithubHandle, setLoggedToPw]);

  const checkLoggedInToPw = useCallback(async () => {
    if (!githubHandle) return;
    const validToken = await isLoggedIn();
    setLoggedToPw(validToken ? LogginToPwBackendState.LoggedIn : LogginToPwBackendState.Error);
  }, [githubHandle]);

  useEffect(() => {
    const storedHandle = localStorage.getItem(StorageLabel.LOGGED_IN_GITHUB_HANDLE);
    if (storedHandle) setGithubHandle(storedHandle);
  }, []);

  useEffect(() => {
    checkLoggedInToPw();
  }, [checkLoggedInToPw]);

  return {
    loggedToPw,
    githubHandle,
    setGithubHandle,
    loginInProgress,
    signOut,
  };
};
