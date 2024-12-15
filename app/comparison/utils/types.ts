export type ProjectMetadata = { '': number // Represents an unnamed key
  'artifact_id': string
  'artifact_namespace': string
  'artifact_name': string
  'is_fork': string // Consider changing to a boolean if applicable
  'fork_count': number
  'star_count': number
  'watcher_count': number
  'language': string
  'license_spdx_id': string
  'created_at': string // Consider using Date if you plan to parse it as a date object
  'updated_at': string // Same as above
  'first_commit_time': string // Same as above
  'last_commit_time': string // Same as above
  'days_with_commits_count': string | number // Seems ambiguous, clarify its type if possible
  'contributors_to_repo_count': string | number // Same as above
  'commit_count': string | number // Same as above
  'github_url': string
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
