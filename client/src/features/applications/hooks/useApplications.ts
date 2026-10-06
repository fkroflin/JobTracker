import { useQuery } from '@tanstack/react-query'
import apiClient from '../../../lib/axios'
import type { ApplicationDto } from '../../../types'

const fetchApplications = async (): Promise<ApplicationDto[]> => {
  const { data } = await apiClient.get<ApplicationDto[]>('/applications')
  return data
}

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],  
    queryFn: fetchApplications,
  })
}