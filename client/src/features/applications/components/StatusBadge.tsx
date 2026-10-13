import { useState } from 'react'
import { ApplicationStatus } from '../../../types'
import { useUpdateApplicationStatus } from '../hooks/useUpdateApplicationStatus'

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  [ApplicationStatus.Applied]:      { label: 'Prijavljeno',  className: 'bg-blue-100 text-blue-800 border-blue-200' },
  [ApplicationStatus.InReview]:     { label: 'U pregledu',   className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  [ApplicationStatus.Interviewing]: { label: 'Intervju',     className: 'bg-purple-100 text-purple-800 border-purple-200' },
  [ApplicationStatus.Offered]:      { label: 'Ponuda',       className: 'bg-green-100 text-green-800 border-green-200' },
  [ApplicationStatus.Rejected]:     { label: 'Odbijeno',     className: 'bg-red-100 text-red-800 border-red-200' },
  [ApplicationStatus.Withdrawn]:    { label: 'Povučeno',     className: 'bg-gray-100 text-gray-800 border-gray-200' },
}

interface StatusBadgeProps {
  id: string
  status: ApplicationStatus
}

export const StatusBadge = ({ id, status }: StatusBadgeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const updateStatusMutation = useUpdateApplicationStatus()

  const config = statusConfig[status]

  const handleSelectStatus = async (newStatus: ApplicationStatus) => {
    setIsOpen(false)
    if (newStatus !== status) {
      await updateStatusMutation.mutateAsync({ id, newStatus })
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={updateStatusMutation.isPending}
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-all ${config.className} ${updateStatusMutation.isPending ? 'opacity-50' : ''}`}
        title="Klikni za promjenu statusa"
      >
        {updateStatusMutation.isPending ? 'Spremanje...' : config.label}
        <span className="ml-1 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

          <div className="absolute left-0 mt-1 w-36 rounded-md shadow-lg bg-white ring-1 ring-black/5 z-20 py-1">
            {Object.entries(statusConfig).map(([key, item]) => {
              const statusValue = Number(key) as ApplicationStatus
              const isSelected = statusValue === status

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectStatus(statusValue)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${
                    isSelected ? 'font-bold text-gray-900 bg-gray-50' : 'text-gray-700'
                  }`}
                >
                  <span>{item.label}</span>
                  {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}