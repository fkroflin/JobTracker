import { useState, useMemo } from 'react'
import { ApplicationsList } from './features/applications/components/ApplicationsList'
import { CreateApplicationModal } from './features/applications/components/CreateApplicationModal'
import { ApplicationDetailsModal } from './features/applications/components/ApplicationDetailsModal'
import { KanbanBoard } from './features/kanban/components/KanbanBoard'
import { useApplications } from './features/applications/hooks/useApplications'
import { Plus, LayoutGrid, List, Search, Filter, Download } from 'lucide-react'
import { StatsOverview } from './features/applications/components/StatsOverview'
import { type ApplicationDto, JobCategory, ApplicationStatus } from './types'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<ApplicationDto | null>(null)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const { data: applications, isLoading, isError } = useApplications()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'it' | 'general'>('all')

  const filteredApplications = useMemo(() => {
    if (!applications) return []

    return applications.filter(app => {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch = !q || 
        app.companyName.toLowerCase().includes(q) ||
        app.positionTitle.toLowerCase().includes(q) ||
        app.techTags.some(t => t.toLowerCase().includes(q))

      const matchesCategory = 
        categoryFilter === 'all' ||
        (categoryFilter === 'it' && app.jobCategory === JobCategory.IT) ||
        (categoryFilter === 'general' && app.jobCategory === JobCategory.General)

      return matchesSearch && matchesCategory
    })
  }, [applications, searchQuery, categoryFilter])

  const exportToCsv = () => {
    if (!applications || applications.length === 0) return

    const statusMap: Record<number, string> = {
      [ApplicationStatus.Applied]: 'Prijavljeno',
      [ApplicationStatus.InReview]: 'U pregledu',
      [ApplicationStatus.Interviewing]: 'Intervju',
      [ApplicationStatus.Offered]: 'Ponuda',
      [ApplicationStatus.Rejected]: 'Odbijeno',
      [ApplicationStatus.Withdrawn]: 'Povučeno',
    }

    const headers = ['Tvrtka', 'Pozicija', 'Kategorija', 'Status', 'Model rada', 'Placa/Satnica', 'Valuta', 'Datum prijave', 'Tech Tagovi', 'Oglas Link', 'Biljeske']
    const rows = applications.map(app => [
      `"${app.companyName.replace(/"/g, '""')}"`,
      `"${app.positionTitle.replace(/"/g, '""')}"`,
      app.jobCategory === JobCategory.IT ? 'IT' : 'Opci',
      statusMap[app.status] || 'Nepoznato',
      app.workModel || '',
      app.hourlyRateOrSalary || '',
      app.currency || 'EUR',
      new Date(app.appliedDate).toLocaleDateString('hr-HR'),
      `"${app.techTags.join(', ')}"`,
      `"${app.jobUrl || ''}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`,
    ])

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Moje_Prijave_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Job Application Tracker
            </h1>
            <p className="text-sm text-gray-500">Praćenje mojih prijava za poslove i prakse</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Toggle za prikaz (Kanban / Tablica) */}
            <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <LayoutGrid size={14} />
                Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'table'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List size={14} />
                Tablica
              </button>
            </div>

            <button
              onClick={exportToCsv}
              disabled={!applications || applications.length === 0}
              className="flex items-center gap-1.5 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
              title="Preuzmi sve prijave u Excel/CSV formatu"
            >
              <Download size={14} />
              Izvezi CSV
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm cursor-pointer"
            >
              <Plus size={16} />
              Nova prijava
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsOverview applications={applications || []} />

        <div className="bg-white rounded-lg shadow min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-semibold text-gray-700">Moje prijave</h2>
              {applications && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">
                  {filteredApplications.length} od {applications.length}
                </span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Traži tvrtku, poziciju, tag..."
                  className="pl-8 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-lg border border-gray-200 text-xs">
                <Filter size={12} className="text-gray-400 ml-1.5 mr-0.5" />
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    categoryFilter === 'all' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Sve
                </button>
                <button
                  onClick={() => setCategoryFilter('it')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    categoryFilter === 'it' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Samo IT
                </button>
                <button
                  onClick={() => setCategoryFilter('general')}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                    categoryFilter === 'general' ? 'bg-white text-gray-900 shadow-xs font-semibold' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  Opći
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
            </div>
          ) : isError ? (
            <div className="text-center py-16 text-red-500 text-sm">
              Greška pri dohvaćanju prijava. Provjeri je li backend pokrenut.
            </div>
          ) : viewMode === 'kanban' ? (
            <KanbanBoard 
              applications={filteredApplications} 
              onCardClick={(app) => setSelectedApplication(app)}
            />
          ) : (
            <ApplicationsList 
              applications={filteredApplications} 
              onRowClick={(app) => setSelectedApplication(app)}
            />
          )}
        </div>
      </main>

      <CreateApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ApplicationDetailsModal
        application={selectedApplication}
        onClose={() => setSelectedApplication(null)}
      />
    </div>
  )
}

export default App
