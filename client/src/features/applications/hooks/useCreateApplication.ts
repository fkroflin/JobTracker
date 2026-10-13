import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../lib/axios'
import { JobCategory } from '../../../types'

export interface CreateApplicationPayload {
  companyName: string
  positionTitle: string
  jobCategory: JobCategory
  workModel?: string
  hourlyRateOrSalary?: number | null
  currency?: string
  appliedDate?: string
  jobUrl?: string
  taskRepoUrl?: string
  notes?: string
  techTagNames?: string[]
}

const createApplication = async (payload: CreateApplicationPayload): Promise<string> => {
  const { data } = await apiClient.post<string>('/applications', payload)
  return data
}

export const useCreateApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] }) // automatically invalidate the applications query to refetch the updated list of applications
    },
  })
}