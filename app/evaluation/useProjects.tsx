import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/app/utils/axiosInstance';
import { ICategory, IProject } from '../comparison/utils/types';
export interface IRationaleQuery {
  page: number
  limit: number
  createdAtGte: string
  createdAtLte: string
  projectIds: number[]
  myEvaluation: boolean
  orderBy: string
}
export interface IProjectRationale {
  id: number
  name: string
  image: string
}
export interface IParentRationale {
  id: number
  name: string
  image: string
}
export interface IReturnRationaleQuery {
  data: {
    id: number
    userId: number
    pickedId: number | null
    project1Id: number
    project2Id: number
    ratio: string
    rationale: string
    createdAt: string
    updatedAt: string
    project1: IProjectRationale
    project2: IProjectRationale
    parent: IParentRationale
  }[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface IReturnAdminRationaleQuery {
  data: {
    id: number
    userId: number
    pickedId: number | null
    project1Id: number
    project2Id: number
    ratio: string
    user: { ghUsername: string }
    rationale: string
    createdAt: string
    updatedAt: string
    project1: IProjectRationale
    project2: IProjectRationale
    parent: IParentRationale
  }[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

const getProjectRationales = async (rationaleQuery: IRationaleQuery): Promise<IReturnRationaleQuery> => {
  const formattedQuery = Object.entries(rationaleQuery).reduce((acc, [key, value]) => {
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      return acc;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        acc[`${key}[]`] = String(item);
      });
    }
    else {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
  const params = new URLSearchParams(formattedQuery).toString();
  const response = await axiosInstance.get(`/project/rationales?${params}`, { data: rationaleQuery });

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

const getProjectRationalesAdmin = async (rationaleQuery: IRationaleQuery): Promise<IReturnAdminRationaleQuery> => {
  const formattedQuery = Object.entries(rationaleQuery).reduce((acc, [key, value]) => {
    if (value === '' || (Array.isArray(value) && value.length === 0)) {
      return acc;
    }
    if (Array.isArray(value)) {
      value.forEach((item) => {
        acc[`${key}[]`] = String(item);
      });
    }
    else {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
  const params = new URLSearchParams(formattedQuery).toString();
  const response = await axiosInstance.get(`/project/rationales/admin?${params}`, { data: rationaleQuery });

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

const getProjects = async (): Promise<IProject[]> => {
  const response = await axiosInstance.get('/mock/projects');

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

const getProject = async (id: number): Promise<IProject> => {
  const response = await axiosInstance.get(`/project/${id}`);

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};

const getCategory = async (id: number): Promise<ICategory> => {
  const response = await axiosInstance.get(`/collection/${id}`);

  if (response.data.error) {
    throw new Error(response.data.error);
  }
  return response.data;
};
const getProjectPairCategory = async (id1: number, id2: number): Promise<ICategory> => {
  const project1 = await getProject(id1);
  const project2 = await getProject(id2);
  if (!project1.parentId || !project2.parentId) {
    throw new Error('Parent Repository not found.');
  }
  if (project1.parentId !== project2.parentId) {
    throw new Error('Parent Repository of the two Projects do not match');
  }
  return getCategory(project1.parentId);
};
export const useGetProject = (id: number) => {
  return useQuery({
    queryKey: ['project', id],
    queryFn: () => getProject(id),
  });
};
export const useGetProjects = () => {
  return useQuery({
    queryKey: ['all-projects'],
    queryFn: () => getProjects(),
  });
};

export const useGetProjectPairCategory = (id1: number, id2: number) => {
  return useQuery({
    queryKey: ['project-pair', id1, id2],
    queryFn: () => getProjectPairCategory(id1, id2),
  });
};
export const useGetProjectRationales = (page: number,
  limit: number,
  createdAtGte: string,
  createdAtLte: string,
  projectIds: number[],
  myEvaluation: boolean,
  orderBy: string) => {
  return useQuery({
    queryKey: ['project-rationale-evaluation', page, limit, createdAtGte, createdAtLte, projectIds, myEvaluation, orderBy],
    queryFn: () => getProjectRationales({
      page,
      limit,
      createdAtGte,
      createdAtLte,
      projectIds,
      myEvaluation,
      orderBy,
    }),
  });
};

export const useGetProjectRationalesAdmin = (page: number,
  limit: number,
  createdAtGte: string,
  createdAtLte: string,
  projectIds: number[],
  myEvaluation: boolean,
  orderBy: string) => {
  return useQuery({
    queryKey: ['project-rationale-evaluation-admin', page, limit, createdAtGte, createdAtLte, projectIds, myEvaluation, orderBy],
    queryFn: () => getProjectRationalesAdmin({
      page,
      limit,
      createdAtGte,
      createdAtLte,
      projectIds,
      myEvaluation,
      orderBy,
    }),
  });
};
