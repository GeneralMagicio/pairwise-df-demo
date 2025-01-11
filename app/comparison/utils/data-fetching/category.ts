import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/app/utils/axiosInstance';
import { TCategory } from './categories';

export const getCategory = async (id: number): Promise<{ collection: TCategory, progress: string }> => {
  const res = await axiosInstance.get(`/collection/${id}`);
  return res.data;
};

export const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['categories', id],
    queryFn: () => getCategory(id),
  });
};
