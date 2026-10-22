import { useState, useMemo } from 'react'
import { useDiscoveredJobs } from '../hooks/useDiscoveredJobs'
import { JobCategory } from '../../../types'
import { ExternalLink, Check, Trash2, RefreshCw, Briefcase, Code2, MapPin, ChevronLeft, ChevronRight } from 'lucide-react'

const ITEMS_PER_PAGE = 8

export const JobFeedView = () => {
  const { jobs, isLoading, sync, convert, dismiss } = useDiscoveredJobs()
  const [keyword, setKeyword] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault()
    sync.mutate(keyword.trim() || 'all')
    setCurrentPage(1)
  }

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE) || 1
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return jobs.slice(start, start + ITEMS_PER_PAGE)
  }, [jobs, currentPage])

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Studentski poslovi — Osijek</h3>
          <p className="text-xs text-gray-500">Preuzimanje najnovijih studentskih poslova s portala studentski-poslovi.hr</p>
        </div>

        <form onSubmit={handleSync} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            placeholder="Pojam (npr. skladište, konobar)..."
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1 sm:w-56"
          />
          <button
            type="submit"
            disabled={sync.isPending}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw size={13} className={sync.isPending ? 'animate-spin' : ''} />
            {sync.isPending ? 'Osvježavam...' : 'Osvježi feed'}
          </button>
        </form>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          Nema novih studentskih poslova u feedu. Klikni "Osvježi feed" za preuzimanje oglasa!
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedJobs.map(job => (
              <div
                key={job.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                      {job.title}
                    </h4>
                    {job.jobCategory === JobCategory.IT ? (
                      <span className="flex items-center gap-1 text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                        <Code2 size={12} /> IT
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[11px] bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                        <Briefcase size={12} /> Studentski
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-medium text-gray-600 mb-2">{job.companyName}</p>

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

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600">
              <span>
                Prikazano <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> do{' '}
                <span className="font-semibold">{Math.min(currentPage * ITEMS_PER_PAGE, jobs.length)}</span> od{' '}
                <span className="font-semibold">{jobs.length}</span> poslova
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={14} />
                  Prethodna
                </button>

                <span className="px-2 font-medium">
                  {currentPage} / {totalPages}
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Sljedeća
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}