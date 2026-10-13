import { Draggable } from '@hello-pangea/dnd'
import { type ApplicationDto, JobCategory } from '../../../types'
import { Briefcase, Code2, ExternalLink } from 'lucide-react'

interface Props {
  application: ApplicationDto
  index: number
}

export const KanbanCard = ({ application, index }: Props) => {
  return (
    <Draggable draggableId={application.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-3 bg-white rounded-lg border transition-shadow cursor-grab active:cursor-grabbing ${
            snapshot.isDragging
              ? 'shadow-xl ring-2 ring-blue-500 ring-opacity-50'
              : 'shadow-sm hover:shadow-md border-gray-200'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-gray-900 text-sm">{application.companyName}</h4>
            {application.jobCategory === JobCategory.IT ? (
              <span className="text-xs text-indigo-600 flex items-center gap-0.5" title="IT Pozicija">
                <Code2 size={13} />
              </span>
            ) : (
              <span className="text-xs text-gray-500 flex items-center gap-0.5" title="Opći posao">
                <Briefcase size={13} />
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 mb-3">{application.positionTitle}</p>

          {/* Tech Tags (if they exist) */}
          {application.techTags && application.techTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {application.techTags.slice(0, 3).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 text-[10px] bg-indigo-50 text-indigo-700 rounded font-medium">
                  {tag}
                </span>
              ))}
              {application.techTags.length > 3 && (
                <span className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 rounded">
                  +{application.techTags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex justify-between items-center text-[11px] text-gray-400 pt-2 border-t border-gray-100">
            <span>{new Date(application.appliedDate).toLocaleDateString('hr-HR')}</span>
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()} // prevents drag activation on link click
                className="text-blue-500 hover:text-blue-700"
              >
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      )}
    </Draggable>
  )
}