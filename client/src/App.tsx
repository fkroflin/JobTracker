import { useState } from 'react'
import { ApplicationsList } from './features/applications/components/ApplicationsList'
import { CreateApplicationModal } from './features/applications/components/CreateApplicationModal'
import { KanbanBoard } from './features/kanban/components/KanbanBoard'
import { useApplications } from './features/applications/hooks/useApplications'
import { Plus, LayoutGrid, List } from 'lucide-react'

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban')
  const { data: applications, isLoading, isError } = useApplications()

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
        <div className="bg-white rounded-lg shadow min-h-[400px]">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-700">Moje prijave</h2>
            {applications && (
              <span className="text-xs text-gray-500">
                Ukupno prijava: <span className="font-bold text-gray-700">{applications.length}</span>
              </span>
            )}
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
            <KanbanBoard applications={applications || []} />
          ) : (
            <ApplicationsList />
          )}
        </div>
      </main>

      <CreateApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default App