import { type ApplicationDto, ApplicationStatus } from '../../../types'
import { Send, Clock, Users, Trophy } from 'lucide-react'

interface Props {
  applications: ApplicationDto[]
}

export const StatsOverview = ({ applications }: Props) => {
  const total = applications.length

  const activeCount = applications.filter(
    a => a.status === ApplicationStatus.InReview || a.status === ApplicationStatus.Interviewing
  ).length

  const positiveOutcomeCount = applications.filter(
    a => a.status === ApplicationStatus.Interviewing || a.status === ApplicationStatus.Offered
  ).length

  const offersCount = applications.filter(
    a => a.status === ApplicationStatus.Offered
  ).length

  const interviewRate = total > 0 ? Math.round((positiveOutcomeCount / total) * 100) : 0

  const stats = [
    {
      title: 'Ukupno prijava',
      value: total,
      description: 'Sve zabilježene prijave',
      icon: Send,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Aktivni procesi',
      value: activeCount,
      description: 'U pregledu i intervjui',
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      title: 'Stopa intervjua',
      value: `${interviewRate}%`,
      description: 'Pozivi na razgovor / ponude',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Dobivene ponude',
      value: offersCount,
      description: 'Uspješno završeni procesi',
      icon: Trophy,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, idx) => {
        const Icon = stat.icon
        return (
          <div
            key={idx}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                {stat.title}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </h3>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {stat.description}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.color}`}>
              <Icon size={22} />
            </div>
          </div>
        )
      })}
    </div>
  )
}