
import { axiosInstance } from '@/app/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { IProject } from '../comparison/utils/types';
export const getProjects = async (): Promise<IProject[]> => {
    const { data } = await axiosInstance.get('/mock/projects');
    return data;
  };
  
  export const useGetProjects = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: () => getProjects(),
    });
  };