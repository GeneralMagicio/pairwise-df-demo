export type ProjectMetadata = { '': number // Represents an unnamed key
  'id': string
  'status': string
  'language'?: 'TypeScript' | 'JavaScript' | 'C++' | 'Rust' | 'Go' | 'Nim' | 'Python'
  'isFork'?: boolean
  'createdAt'?: string
  'updatedAt'?: string
  'starCount'?: number
  'forkCount'?: number
  'numPackages'?: number
  'numDependentsInOso'?: number
  'listOfFunders'?: string[]
  'totalFundingUsd'?: number
  'totalFundingUsdSince2023'?: number
  'osoDependencyRank'?: number
  'numReposInSameLanguage'?: number
  'osoDependencyRankForLanguage'?: number
}

export interface ICategory {
  id: number
  name: string
  pollId: number
  url: string
  description: string
  impactDescription: string
  contributionDescription: null | string
  RF6Id: null | number
  parentId: null | number
  image: string | null
  metadata: ProjectMetadata
  created_at: string
  type: string
  progress: CollectionProgressStatus
}

export interface IProject {
  id: number
  rating: number | null
  name: string
  aiSummary: ProjectAiSummary
  pollId: number
  url: string | null
  description: string
  RF6Id: string
  parentId: number | null
  image: string | null
  metadata: ProjectMetadata
  createdAt: string
  type: 'collection' | 'project'
}

export interface IProjectRanking {
  project: IProject
  projectId: number
  rank: number
  star: number
  name: string
  share: number
  locked: boolean
  coi: boolean
}

export type ProjectAiSummary = {
  subHeader: string
  points: string[]
}[];

export type CollectionProgressStatus =
  | 'Attested'
  | 'Finished'
  | 'WIP - Threshold'
  | 'WIP'
  | 'Filtered'
  | 'Filtering'
  | 'Pending';

export enum CollectionProgressStatusEnum {
  Attested = 'Attested',
  Finished = 'Finished',
  WIPThreshold = 'WIP - Threshold',
  WIP = 'WIP',
  Filtered = 'Filtered',
  Filtering = 'Filtering',
  Pending = 'Pending',
}
