import React, { useState } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';

interface AgendaViewProps {
  tasks: Task[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onTaskComplete: (taskId: number) => void;
}

const AgendaView: React.FC<AgendaViewProps> = ({ 
  tasks, 
  currentDate, 
  onDateChange, 
  onTaskComplete 
}) => {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  
  const DAY_START_HOUR = 0;
  const DAY_END_HOUR = 24;
  const hours = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, i) => DAY_START_HOUR + i);
  const totalMinutes = (DAY_END_HOUR - DAY_START_HOUR) * 60;

  const tasksForDay = tasks.filter(task =>
    task.year === currentDate.getFullYear() &&
    task.month === (currentDate.getMonth() + 1) &&
    task.day === currentDate.getDate()
  );

  const calculateTaskLayout = (tasksForDay: Task[]): Task[] => {
    if (tasksForDay.length === 0) return [];
    
    // Sort tasks by start time, then by duration (longer tasks first)
    tasksForDay.sort((a, b) => {
      const aStart = a.startHour * 60 + a.startMinute;
      const bStart = b.startHour * 60 + b.startMinute;
      if (aStart !== bStart) return aStart - bStart;
      const aDuration = (a.endHour * 60 + a.endMinute) - aStart;
      const bDuration = (b.endHour * 60 + b.endMinute) - bStart;
      return bDuration - aDuration;
    });

    const processedTasks: Task[] = [];
    for (const task of tasksForDay) {
      let placed = false;
      let col = 0;
      while (!placed) {
        let hasOverlapInCol = false;
        for (const processed of processedTasks) {
          if (processed.column === col) {
            const taskStart = task.startHour * 60 + task.startMinute;
            const taskEnd = task.endHour * 60 + task.endMinute;
            const processedStart = processed.startHour * 60 + processed.startMinute;
            const processedEnd = processed.endHour * 60 + processed.endMinute;
            // Check for overlap (exclusive end time)
            if (taskStart < processedEnd && taskEnd > processedStart) {
              hasOverlapInCol = true;
              break;
            }
          }
        }
        if (!hasOverlapInCol) {
          task.column = col;
          placed = true;
        } else {
          col++;
        }
      }
      processedTasks.push(task);
    }
    
    // Determine total columns for each group of overlapping tasks
    for (let i = 0; i < processedTasks.length; i++) {
      const taskA = processedTasks[i];
      let maxColumns = 1;
      const overlappingTasks = [taskA];

      for (let j = 0; j < processedTasks.length; j++) {
        if (i === j) continue;
        const taskB = processedTasks[j];
        const aStart = taskA.startHour * 60 + taskA.startMinute;
        const aEnd = taskA.endHour * 60 + taskA.endMinute;
        const bStart = taskB.startHour * 60 + taskB.startMinute;
        const bEnd = taskB.endHour * 60 + taskB.endMinute;

        if (aStart < bEnd && aEnd > bStart) {
          overlappingTasks.push(taskB);
        }
      }
      maxColumns = Math.max(...overlappingTasks.map(t => t.column)) + 1;
      taskA.totalColumns = maxColumns;
    }
    
    return processedTasks;
  };

  const laidOutTasks = calculateTaskLayout([...tasksForDay]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
  };

  const handleCompleteTask = () => {
    if (selectedTask) {
      onTaskComplete(selectedTask.id);
      setSelectedTask(null);
    }
  };

  const timeColumnHTML = (
    <div className="w-20 text-right pr-2 pt-2 border-r border-yellow-600">
      <div className="flex flex-col h-full pt-4">
        {hours.map(hour => (
          <div key={hour} className="flex-1 -mt-px flex justify-end items-start" style={{ minHeight: '60px' }}>
            <span className="text-xs text-yellow-900 font-medium transform -translate-y-1.5">
              {String(hour).padStart(2, '0')}:00
            </span>
          </div>
        ))}
        <div className="flex-1 -mt-px flex justify-end items-start" style={{ minHeight: '60px' }}></div>
      </div>
    </div>
  );

  const scheduleGrid = (
    <div className="flex-1 relative">
      {/* Horizontal lines */}
      {[...hours, DAY_END_HOUR].map((hour, index) => (
        <div key={`line-${hour}-${index}`} className="h-[60px] border-b border-yellow-600"></div>
      ))}
      
      {/* Tasks */}
      <div className="absolute top-0 left-0 right-0 bottom-0">
        {laidOutTasks.map(task => {
          const startOffsetMinutes = (task.startHour - DAY_START_HOUR) * 60 + task.startMinute;
          const durationMinutes = (task.endHour * 60 + task.endMinute) - (task.startHour * 60 + task.startMinute);
          const topPercent = (startOffsetMinutes / totalMinutes) * 100;
          const heightPercent = (durationMinutes / totalMinutes) * 100;
          
          const widthPercent = 100 / task.totalColumns;
          const leftPercent = task.column * widthPercent;

          return (
            <TaskItem
              key={task.id}
              task={task}
              style={{
                top: `calc(${topPercent}% + 2px)`,
                height: `calc(${heightPercent}% - 4px)`,
                left: `calc(${leftPercent}% + 4px)`,
                width: `calc(${widthPercent}% - 8px)`,
                minHeight: '2rem'
              }}
              onClick={() => handleTaskClick(task)}
            />
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto no-scrollbar bg-[#f9c751]">
      <div className="flex h-full">
        {timeColumnHTML}
        {scheduleGrid}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="bg-white text-gray-800 rounded-lg shadow-xl w-full max-w-sm flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative bg-[#f08436] text-gray-100 rounded-t-lg p-4 h-16 flex items-center">
              <h2 className="text-lg font-semibold w-2/3 truncate">{selectedTask.title}</h2>
              <div className="absolute right-0 top-0 h-full w-20 bg-[#1eae89] flex items-center justify-center task-priority-shape">
                <span className="text-white text-3xl font-bold">{selectedTask.tag}</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider text-gray-500">Horário</label>
                <p className="text-lg mt-1">
                  {String(selectedTask.startHour).padStart(2, '0')}:{String(selectedTask.startMinute).padStart(2, '0')} - {String(selectedTask.endHour).padStart(2, '0')}:{String(selectedTask.endMinute).padStart(2, '0')}
                </p>
              </div>
              {selectedTask.description && (
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500">Descrição</label>
                  <p className="text-base mt-1 bg-gray-100 p-2 rounded-md border border-gray-200">{selectedTask.description}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Recompensa:</span>
                  <div className="flex items-center ml-2 text-[#f08436] font-bold">
                    <div className="w-5 h-5 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center text-black font-bold text-xs mr-1">S</div>
                    +50
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCloseModal} className="px-4 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
                    Fechar
                  </button>
                  {!selectedTask.completed ? (
                    <button onClick={handleCompleteTask} className="px-4 py-2 rounded-md bg-[#1eae89] hover:bg-[#189a79] text-white font-bold transition-colors shadow-sm">
                      CONCLUIR
                    </button>
                  ) : (
                    <button disabled className="px-4 py-2 rounded-md bg-gray-300 text-white font-bold cursor-not-allowed">
                      CONCLUÍDA
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgendaView;