import React, { useState, useEffect } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '../../../lib/axios'
import { type ApplicationDto, JobCategory } from '../../../types'
import { StatusBadge } from './StatusBadge'
import { X, ExternalLink, Calendar, DollarSign, Building2, FileText, Code2, Briefcase, Save } from 'lucide-react'

interface Props {
  application: ApplicationDto | null
  onClose: () => void
}

export const ApplicationDetailsModal = ({ application, onClose }: Props) => {
  const queryClient = useQueryClient()

  const [notes, setNotes] = useState('')
  const [workModel, setWorkModel] = useState('Remote')
  const [salary, setSalary] = useState('')

  useEffect(() => {
    if (application) {
      setNotes(application.notes || '')
      setWorkModel(application.workModel || 'Remote')
      setSalary(application.hourlyRateOrSalary ? String(application.hourlyRateOrSalary) : '')
    }
  }, [application])

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!application) return
      await apiClient.put(`/applications/${application.id}/details`, {
        id: application.id,
        notes: notes.trim() || null,
        workModel,
        hourlyRateOrSalary: salary ? parseFloat(salary) : null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      onClose()
    },
  })

  if (!application) return null

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building2 size={16} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{application.companyName}</span>
              <StatusBadge id={application.id} status={application.status} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">{application.positionTitle}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Metadata chips */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl text-xs">
            <div>
              <span className="text-gray-400 block mb-0.5">Kategorija</span>
              <span className="font-medium text-gray-700 flex items-center gap-1">
                {application.jobCategory === JobCategory.IT ? <Code2 size={12} className="text-indigo-600" /> : <Briefcase size={12} />}
                {application.jobCategory === JobCategory.IT ? 'IT Pozicija' : 'Opći posao'}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Datum prijave</span>
              <span className="font-medium text-gray-700 flex items-center gap-1">
                <Calendar size={12} className="text-gray-400" />
                {new Date(application.appliedDate).toLocaleDateString('hr-HR')}
              </span>
            </div>
            <div>
              <span className="text-gray-400 block mb-0.5">Poveznica</span>
              {application.jobUrl ? (
                <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-0.5 font-medium">
                  <ExternalLink size={12} /> Otvori oglas
                </a>
              ) : (
                <span className="text-gray-400 italic">Nema linka</span>
              )}
            </div>
          </div>

          {/* Tech stack */}
          {application.techTags && application.techTags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">Tehnologije / Vještine</label>
              <div className="flex flex-wrap gap-1.5">
                {application.techTags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 text-xs bg-indigo-50 text-indigo-700 rounded-lg font-medium border border-indigo-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Uređivanje: Model rada i Plaća */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Model rada</label>
              <select
                value={workModel}
                onChange={e => setWorkModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Remote">Remote (Od kuće)</option>
                <option value="Hybrid">Hibridno</option>
                <option value="OnSite">U uredu (On-site)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Plaća / Satnica (EUR)</label>
              <div className="relative">
                <DollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={salary}
                  onChange={e => setSalary(e.target.value)}
                  placeholder="npr. 1200 ili 6.50"
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Bilješke za intervjue */}
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <FileText size={14} className="text-gray-500" />
              <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Bilješke sa selekcijskih krugova / Pitanja s intervjua
              </label>
            </div>
            <textarea
              rows={5}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ovdje zapiši: kontakt osobu, pitanja s tehničkog razgovora, povratne informacije, link na GitHub zadatak..."
              className="w-full p-3 border border-gray-300 rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-800 cursor-pointer"
            >
              Zatvori
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 shadow-sm"
            >
              <Save size={13} />
              {updateMutation.isPending ? 'Spremam...' : 'Spremi promjene'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
