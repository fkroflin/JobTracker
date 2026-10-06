import { ApplicationsList } from './features/applications/components/ApplicationsList'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Job Application Tracker
          </h1>
          <p className="text-sm text-gray-500">Praćenje mojih prijava za poslove i prakse</p>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700">Moje prijave</h2>
          </div>
          <ApplicationsList />
        </div>
      </main>
    </div>
  )
}

export default App