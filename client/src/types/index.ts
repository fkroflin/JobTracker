export const JobCategory = {
  General: 1,
  IT: 2,
} as const

export type JobCategory = typeof JobCategory[keyof typeof JobCategory]

export const ApplicationStatus = {
  Applied: 1,
  InReview: 2,
  Interviewing: 3,
  Offered: 4,
  Rejected: 5,
  Withdrawn: 6,
} as const

export type ApplicationStatus = typeof ApplicationStatus[keyof typeof ApplicationStatus]

export interface ApplicationDto {
  id: string
  companyId: string
  companyName: string
  positionTitle: string
  jobCategory: JobCategory
  status: ApplicationStatus
  workModel: string | null
  hourlyRateOrSalary: number | null
  currency: string | null
  appliedDate: string
  jobUrl: string | null
  taskRepoUrl: string | null
  notes: string | null
  techTags: string[]
}