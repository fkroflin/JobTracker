import { ApplicationStatus } from '../../../types'

const statusConfig: Record<ApplicationStatus, { label: string; className: string }> = {
  [ApplicationStatus.Applied]:     { label: 'Prijavljeno',  className: 'bg-blue-100 text-blue-800' },
  [ApplicationStatus.InReview]:    { label: 'U pregledu',   className: 'bg-yellow-100 text-yellow-800' },
  [ApplicationStatus.Interviewing]:{ label: 'Intervju',     className: 'bg-purple-100 text-purple-800' },
  [ApplicationStatus.Offered]:     { label: 'Ponuda',       className: 'bg-green-100 text-green-800' },
  [ApplicationStatus.Rejected]:    { label: 'Odbijeno',     className: 'bg-red-100 text-red-800' },
  [ApplicationStatus.Withdrawn]:   { label: 'Povučeno',     className: 'bg-gray-100 text-gray-800' },
}

interface StatusBadgeProps {
  status: ApplicationStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  )
}