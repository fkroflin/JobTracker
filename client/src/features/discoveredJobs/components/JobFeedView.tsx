import { useState } from 'react'
import { useDiscoveredJobs } from '../hooks/useDiscoveredJobs'
import { JobCategory } from '../../../types'
import { ExternalLink, Check, Trash2, RefreshCw, Briefcase, Code2, MapPin } from 'lucide-react'

export const JobFeedView = () => {
  const { jobs, isLoading, sync, convert, dismiss } = useDiscoveredJobs()
  const [keyword, setKeyword] = useState('developer')

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault()
    if (keyword.trim()) {
      sync.mutate(keyword.trim())
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Pronađi nove poslove s weba</h3>
          <p className="text-xs text-gray-500">Pokreni pretragu po ključnoj riječi (npr. developer, .net, student, osijek)</p>
        </div>

        <form onSubmit={handleSync} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Pojam za pretragu..."
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:w-48"
          />
          <button
            type="submit"
            disabled={sync.isPending}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={14} className={sync.isPending ? 'animate-spin' : ''} />
            {sync.isPending ? 'Pretražujem...' : 'Pretraži web'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Nema novih poslova u feedu. Upiši pojam gore i klikni "Pretraži web"!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900 text-base leading-snug">
                    {job.title}
                  </h4>
                  {job.jobCategory === JobCategory.IT ? (
                    <span className="flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      <Code2 size={12} /> IT
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                      <Briefcase size={12} /> Opći
                    </span>
                  )}
                </div>

                <p className="text-xs font-medium text-gray-700 mb-2">{job.companyName}</p>

                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <MapPin size={13} className="text-gray-400" />
                  <span>{job.location}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-[11px] text-gray-400">Izvor: {job.source}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 gap-2">
                <a
                  href={job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  <ExternalLink size={13} />
                  Otvori oglas
                </a>

                <div className="flex gap-2">
                  <button
                    onClick={() => dismiss.mutate(job.id)}
                    disabled={dismiss.isPending}
                    title="Ignoriraj ovaj oglas"
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>

                  <button
                    onClick={() => convert.mutate(job.id)}
                    disabled={convert.isPending}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    <Check size={14} />
                    {convert.isPending ? 'Dodajem...' : 'Dodaj u Kanban'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}