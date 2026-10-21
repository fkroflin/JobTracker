import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../lib/axios'
import { type DiscoveredJobDto } from '../../../types'

export const useDiscoveredJobs = () => {
  const queryClient = useQueryClient()

  const jobsQuery = useQuery({
    queryKey: ['discoveredJobs'],
    queryFn: async (): Promise<DiscoveredJobDto[]> => {
      const { data } = await apiClient.get<DiscoveredJobDto[]>('/discoveredjobs')
      return data
    },
  })

  const syncMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const { data } = await apiClient.post(`/discoveredjobs/sync?keyword=${encodeURIComponent(keyword)}`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discoveredJobs'] })
    },
  })

  const convertMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.post(`/discoveredjobs/${id}/convert`)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discoveredJobs'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })

  const dismissMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.post(`/discoveredjobs/${id}/dismiss`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discoveredJobs'] })
    },
  })

  return {
    jobs: jobsQuery.data || [],
    isLoading: jobsQuery.isLoading,
    isError: jobsQuery.isError,
    sync: syncMutation,
    convert: convertMutation,
    dismiss: dismissMutation,
  }
}