import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../lib/axios'
import { ApplicationStatus } from '../../../types'

interface UpdateStatusPayload {
  id: string
  newStatus: ApplicationStatus
}

const updateStatus = async ({ id, newStatus }: UpdateStatusPayload): Promise<void> => {
  await apiClient.patch(`/applications/${id}/status`, newStatus)
}

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
  })
}