'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Spinner from '@/app/components/Spinner';
import StorageLabel from '@/app/lib/localStorage';
import { useAuth } from '@/app/utils/wallet/AuthProvider';

export default function LoginGithub() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setGithubHandle } = useAuth();
  useEffect(() => {
    const handleAuth = async () => {
      const token = searchParams.get('token');
      const username = searchParams.get('un');
      if (!token || !username) {
        console.error('Invalid params, redirecting to home...');
        router.push('/');
        return;
      }
      setGithubHandle(username);
      window.localStorage.setItem(StorageLabel.AUTH, token);
      window.localStorage.setItem(StorageLabel.LOGGED_IN_GITHUB_HANDLE, username);
      router.push('/allocation');
    };
    handleAuth();
  }, [router, searchParams, setGithubHandle]);

  return <Spinner />;
}
