import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '@/app/utils/axiosInstance';

type ProjectVoteData = {
  data: {
    project1Id: number
    project2Id: number
    project2Val: number | null
    project1Val: number | null
    pickedId: number | null
    rationale: string | null
  }
};

export const updateProjectVote = async ({ data }: ProjectVoteData) => {
  return await axiosInstance.post('flow/projects/vote', data);
};

export const updateProjectUndo = (cid: Number | undefined) => {
  if (!cid) return Promise.reject('No collection id provided');

  return axiosInstance.post('flow/pairs/back', { collectionId: cid });
};

export const createPairExclusion = (project1Id: number, project2Id: number) => {
  return axiosInstance.post('flow/exclude', { project1Id, project2Id });
};

export const useCreatePairExclusion = ({
  categoryId,
}: {
  categoryId: number | undefined
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ p1Id, p2Id }: { p1Id: number, p2Id: number }) => createPairExclusion(p1Id, p2Id),
    onSuccess: () => {
      if (!categoryId) return;
      queryClient.refetchQueries({
        queryKey: ['pairwise-pairs', categoryId],
      });
      queryClient.refetchQueries({
        queryKey: ['project-rationale-evaluation'],
        exact: false,
      });
    },
  });
};

export const useUpdateProjectVote = ({
  categoryId,
}: {
  categoryId: number | undefined
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectVote,
    onSuccess: () => {
      if (!categoryId) return;
      queryClient.refetchQueries({
        queryKey: ['pairwise-pairs', categoryId],
      });
      queryClient.refetchQueries({
        queryKey: ['project-rationale-evaluation'],
        exact: false,
      });
    },
  });
};

export const useUpdateRationaleVote = ({
  createdAtGte, createdAtLte, projectIds, myEvaluation, orderBy,
}: {
  createdAtGte: string
  createdAtLte: string
  projectIds: number[]
  myEvaluation: boolean
  orderBy: string
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProjectVote,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['pairwise-pairs', undefined],
      });
      queryClient.refetchQueries({
        queryKey: ['project-rationale-evaluation', createdAtGte, createdAtLte, projectIds, myEvaluation, orderBy],
      });
    },
  });
};

export const useUpdateProjectUndo = ({
  categoryId,
  onSuccess,
}: {
  categoryId: number | undefined
  onSuccess: () => void
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => updateProjectUndo(categoryId),
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ['pairwise-pairs', categoryId],
      });
      onSuccess();
    },
  });
};
