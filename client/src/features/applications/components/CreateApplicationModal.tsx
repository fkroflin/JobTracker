import React, { useState } from 'react'
import  { useCreateApplication, type CreateApplicationPayload } from '../hooks/useCreateApplication'
import { JobCategory } from '../../../types'
import { X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export const CreateApplicationModal = ({ isOpen, onClose }: Props) => {
  const createMutation = useCreateApplication()

  const [companyName, setCompanyName] = useState('')
  const [positionTitle, setPositionTitle] = useState('')
  const [jobCategory, setJobCategory] = useState<JobCategory>(JobCategory.IT)
  const [workModel, setWorkModel] = useState('Remote')
  const [salary, setSalary] = useState<string>('')
  const [jobUrl, setJobUrl] = useState('')
  const [taskRepoUrl, setTaskRepoUrl] = useState('')
  const [notes, setNotes] = useState('')
  const [tagsInput, setTagsInput] = useState('') // i.e. "C#, React, Docker"

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload: CreateApplicationPayload = {
      companyName,
      positionTitle,
      jobCategory,
      workModel,
      hourlyRateOrSalary: salary ? parseFloat(salary) : null,
      currency: 'EUR',
      jobUrl: jobUrl || undefined,
      taskRepoUrl: taskRepoUrl || undefined,
      notes: notes || undefined,
      techTagNames: jobCategory === JobCategory.IT 
        ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        : undefined,
    }

    try {
      await createMutation.mutateAsync(payload)
      // Reset forme i zatvaranje modala
      setCompanyName('')
      setPositionTitle('')
      setSalary('')
      setJobUrl('')
      setTaskRepoUrl('')
      setNotes('')
      setTagsInput('')
      onClose()
    } catch (error) {
      console.error('Greška pri unosu prijave:', error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Nova prijava za posao</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Naziv tvrtke & Pozicija */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Naziv tvrtke *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="npr. Infinum, Span..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Pozicija *</label>
              <input
                type="text"
                required
                value={positionTitle}
                onChange={e => setPositionTitle(e.target.value)}
                placeholder="npr. .NET Developer..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tip posla (Radio buttons) */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Kategorija posla</label>
            <div className="flex gap-4">
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="jobCategory"
                  checked={jobCategory === JobCategory.IT}
                  onChange={() => setJobCategory(JobCategory.IT)}
                  className="mr-2 text-blue-600"
                />
                IT / Programiranje
              </label>
              <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="jobCategory"
                  checked={jobCategory === JobCategory.General}
                  onChange={() => setJobCategory(JobCategory.General)}
                  className="mr-2 text-blue-600"
                />
                Opći / Studentski posao
              </label>
            </div>
          </div>

          {/* Model rada i Satnica */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Model rada</label>
              <select
                value={workModel}
                onChange={e => setWorkModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="OnSite">U uredu (On-site)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Plaća / Satnica (EUR)</label>
              <input
                type="number"
                value={salary}
                onChange={e => setSalary(e.target.value)}
                placeholder="npr. 1200 ili 7.50"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Specifična polja za IT pozicije */}
          {jobCategory === JobCategory.IT && (
            <div className="space-y-4 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">
                  Tech Stack (odvojiti zarezom)
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={e => setTagsInput(e.target.value)}
                  placeholder="C#, React, Docker, PostgreSQL"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-900 mb-1">
                  GitHub Repo sa zadatkom (opcionalno)
                </label>
                <input
                  type="url"
                  value={taskRepoUrl}
                  onChange={e => setTaskRepoUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Link na oglas */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Poveznica na oglas</label>
            <input
              type="url"
              value={jobUrl}
              onChange={e => setJobUrl(e.target.value)}
              placeholder="https://posao.hr/..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Bilješke */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Bilješke</label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Kontakt osoba, datum povratne informacije..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Spremanje...' : 'Spremi prijavu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}