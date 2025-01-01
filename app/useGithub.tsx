import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/app/utils/axiosInstance';

export const getAuthURL = async (): Promise<string> => {
  const { data } = await axiosInstance.get('/auth/github/url');
  return data;
};

export const useGithubURL = () => {
  return useQuery({
    queryKey: ['github-oauth-url'],
    queryFn: () => getAuthURL(),
  });
};
