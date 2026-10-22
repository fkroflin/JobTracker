import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd'
import { type ApplicationDto, ApplicationStatus } from '../../../types'
import { KanbanCard } from './KanbanCard'
import { useUpdateApplicationStatus } from '../../applications/hooks/useUpdateApplicationStatus'

const COLUMNS: { id: ApplicationStatus; title: string; color: string }[] = [
  { id: ApplicationStatus.Applied, title: 'Prijavljeno', color: 'border-t-blue-500' },
  { id: ApplicationStatus.InReview, title: 'U pregledu', color: 'border-t-yellow-500' },
  { id: ApplicationStatus.Interviewing, title: 'Intervju', color: 'border-t-purple-500' },
  { id: ApplicationStatus.Offered, title: 'Ponuda', color: 'border-t-green-500' },
  { id: ApplicationStatus.Rejected, title: 'Odbijeno', color: 'border-t-red-500' },
]

interface Props {
  applications: ApplicationDto[]
  onCardClick?: (app: ApplicationDto) => void
}

export const KanbanBoard = ({ applications, onCardClick }: Props) => {
  const updateStatusMutation = useUpdateApplicationStatus()

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const newStatus = Number(destination.droppableId) as ApplicationStatus

    updateStatusMutation.mutate({
      id: draggableId,
      newStatus,
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 overflow-x-auto min-h-[500px]">
        {COLUMNS.map(col => {
          const colApps = applications.filter(a => a.status === col.id)

          return (
            <div key={col.id} className={`bg-gray-50 rounded-xl p-3 border-t-4 ${col.color} border-gray-200 flex flex-col`}>
              <div className="flex justify-between items-center mb-3 px-1">
                <h3 className="font-semibold text-xs text-gray-700 uppercase tracking-wider">{col.title}</h3>
                <span className="text-xs bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 font-bold">
                  {colApps.length}
                </span>
              </div>

              <Droppable droppableId={String(col.id)}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 min-h-[150px] rounded-lg transition-colors p-1 ${
                      snapshot.isDraggingOver ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    {colApps.map((app, index) => (
                      <KanbanCard 
                        key={app.id} 
                        application={app} 
                        index={index} 
                        onClick={() => onCardClick?.(app)}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}
