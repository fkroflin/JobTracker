import { useApplications } from '../hooks/useApplications'
import { StatusBadge } from './StatusBadge'
import { JobCategory } from '../../../types'
import { Briefcase, Code2, ExternalLink } from 'lucide-react'

export const ApplicationsList = () => {
  const { data: applications, isLoading, isError } = useApplications()

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Greška pri dohvaćanju prijava. Provjeri je li backend pokrenut.
      </div>
    )
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        Nema prijava za prikaz. Dodaj svoju prvu prijavu!
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
                  <span className="flex items-center gap-1 text-indigo-600 text-sm">
                    <Code2 size={14} /> IT
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-gray-500 text-sm">
                    <Briefcase size={14} /> Opći
                  </span>
                )}
              </td>
              <td className="px-6 py-4">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {new Date(app.appliedDate).toLocaleDateString('hr-HR')}
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {app.techTags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}