import { type ApplicationDto, JobCategory } from '../../../types'
import { StatusBadge } from './StatusBadge'
import { Briefcase, Code2, ExternalLink, Trash2 } from 'lucide-react'
import { useDeleteApplication } from '../hooks/useDeleteApplication'

interface Props {
  applications: ApplicationDto[]
}

export const ApplicationsList = ({ applications }: Props) => {
  const deleteMutation = useDeleteApplication()

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        Nema prijava koje odgovaraju zadanim filterima.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tvrtka / Pozicija</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tip</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum prijave</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tech Stack</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Akcije</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{app.companyName}</div>
                <div className="text-sm text-gray-500">{app.positionTitle}</div>
              </td>
              <td className="px-6 py-4">
                {app.jobCategory === JobCategory.IT ? (
                  <span className="flex items-center gap-1 text-indigo-600 text-sm font-medium">
                    <Code2 size={14} /> IT
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-sm font-medium">
                    <Briefcase size={14} /> Opći
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <StatusBadge id={app.id} status={app.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(app.appliedDate).toLocaleDateString('hr-HR')}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {app.techTags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4">
                {app.jobUrl && (
                  <a href={app.jobUrl} target="_blank" rel="noopener noreferrer"
                     className="text-blue-500 hover:text-blue-700">
                    <ExternalLink size={16} />
                  </a>
                )}
              </td>
              <td className="px-6 py-4 text-right">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Želiš li sigurno obrisati prijavu za ${app.companyName}?`)) {
                      deleteMutation.mutate(app.id)
                    }
                  }}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-600 transition-colors p-1 cursor-pointer"
                  title="Obriši prijavu"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}