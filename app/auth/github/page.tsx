'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
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
      if (!token) {
        router.push('/');
        return;
      }
      let decoded;
      try {
        decoded = jwtDecode<{ username: string }>(token as string);
      }
      catch (error) {
        console.error(error);
        router.push('/');
      }
      if (!decoded || !decoded.username) {
        console.error('Invalid token , redirecting to home...');
        router.push('/');
        return;
      }
      setGithubHandle(decoded.username);
      window.localStorage.setItem(StorageLabel.AUTH, token as string);
      router.push('/allocation');
    };
    handleAuth();
  }, [router]);

  return <Spinner />;
}
