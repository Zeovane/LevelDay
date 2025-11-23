import React, { useState, useRef } from 'react';
import { Task } from '../types';
import TaskItem from './TaskItem';
import TaskCompletionAnimation from './TaskCompletionAnimation';

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
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Minimum swipe distance (in pixels)
  const minSwipeDistance = 50;
  
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
      setShowCompletionAnimation(true);
      onTaskComplete(selectedTask.id);
      setSelectedTask(null);
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    onDateChange(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    onDateChange(newDate);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNextDay();
    }
    if (isRightSwipe) {
      handlePreviousDay();
    }
  };

  const totalHeight = (DAY_END_HOUR - DAY_START_HOUR + 1) * 60;

  const timeColumnHTML = (
    <div className="w-20 text-right pr-2 border-r theme-border-dark relative" style={{ height: `${totalHeight}px` }}>
      {hours.map((hour, index) => (
        <div 
          key={hour} 
          className="absolute flex justify-end items-center pr-2" 
          style={{ 
            top: `${index * 60 + 30}px`,
            transform: 'translateY(-50%)',
            width: '100%',
            height: '0px'
          }}
        >
            <span className="text-xs theme-text-primary font-medium">
            {String(hour).padStart(2, '0')}:00
          </span>
        </div>
      ))}
    </div>
  );
  
  const scheduleGrid = (
    <div className="flex-1 relative" style={{ height: `${totalHeight}px`, minHeight: `${totalHeight}px` }}>
      {/* Horizontal lines - renderizadas como elementos separados para garantir que todas se estendam completamente */}
      {[...hours, DAY_END_HOUR].map((hour, index) => (
        <div 
          key={`line-${hour}-${index}`} 
          className="absolute left-0 right-0 border-b theme-border-dark z-0"
          style={{ 
            top: `${index * 60}px`,
            height: '1px',
            width: '100%'
          }}
        ></div>
      ))}
      
      {/* Tasks */}
      <div className="absolute top-0 left-0 right-0 z-10" style={{ height: `${totalHeight}px` }}>
        {laidOutTasks.map(task => {
          const startOffsetMinutes = (task.startHour - DAY_START_HOUR) * 60 + task.startMinute;
          const durationMinutes = (task.endHour * 60 + task.endMinute) - (task.startHour * 60 + task.startMinute);
          const topPixels = (startOffsetMinutes / 60) * 60;
          const heightPixels = (durationMinutes / 60) * 60;
          
          const widthPercent = 100 / task.totalColumns;
          const leftPercent = task.column * widthPercent;

          return (
            <TaskItem
              key={task.id}
              task={task}
              style={{
                top: `${topPixels}px`,
                height: `${heightPixels}px`,
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

  const today = new Date();
  const isToday = currentDate.toDateString() === today.toDateString();

  return (
    <div 
      className="h-full overflow-y-auto no-scrollbar theme-bg-main relative"
      ref={containerRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {!isToday && (
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 theme-primary theme-text-light px-4 py-1 rounded-full text-xs font-semibold shadow-lg">
          {currentDate < today ? 'Dia anterior' : 'Dia futuro'}
        </div>
      )}
      <div className="flex" style={{ minHeight: `${(DAY_END_HOUR - DAY_START_HOUR + 1) * 60}px` }}>
        {timeColumnHTML}
        {scheduleGrid}
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (() => {
        const tagColorMap: { [key: string]: string } = {
          'A': 'bg-red-500',
          'B': 'bg-[#f9c751]',
          'C': 'bg-[#1eae89]',
        };
        const tagTextColorMap: { [key: string]: string } = {
          'A': 'text-white',
          'B': 'text-black',
          'C': 'text-white',
        };
        const tagColor = tagColorMap[selectedTask.tag] || 'bg-gray-500';
        const tagTextColor = tagTextColorMap[selectedTask.tag] || 'text-white';
        
        return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
          <div className="theme-bg-card theme-text-primary rounded-lg shadow-xl w-full max-w-sm flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="relative theme-primary theme-text-light rounded-t-lg p-4 h-16 flex items-center">
              <h2 className="text-lg font-semibold w-2/3 truncate">{selectedTask.title}</h2>
              <div className={`absolute right-0 top-0 h-full w-20 ${tagColor} flex items-center justify-center task-priority-shape`}>
                <span className={`${tagTextColor} text-3xl font-bold`}>{selectedTask.tag}</span>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs uppercase tracking-wider theme-text-secondary">Horário</label>
                <p className="text-lg mt-1 theme-text-primary">
                  {String(selectedTask.startHour).padStart(2, '0')}:{String(selectedTask.startMinute).padStart(2, '0')} - {String(selectedTask.endHour).padStart(2, '0')}:{String(selectedTask.endMinute).padStart(2, '0')}
                </p>
              </div>
              {selectedTask.description && (
                <div>
                  <label className="text-xs uppercase tracking-wider theme-text-secondary">Descrição</label>
                  <p className="text-base mt-1 theme-bg-container p-2 rounded-md border theme-border theme-text-primary">{selectedTask.description}</p>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 mt-4 border-t theme-border">
                <div className="flex items-center text-sm theme-text-secondary">
                  <span>Recompensa:</span>
                  <div className="flex items-center ml-2 text-[#f08436] font-bold">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs mr-1" style={{ backgroundColor: 'var(--coin-bg)', border: '2px solid var(--coin-border)', color: 'var(--coin-text)' }}>S</div>
                    +50
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCloseModal} className="px-4 py-2 rounded-md theme-text-secondary hover:theme-bg-container transition-colors">
                    Fechar
                  </button>
                  {!selectedTask.completed ? (
                    <button onClick={handleCompleteTask} className="px-4 py-2 rounded-md theme-success hover:opacity-90 theme-text-light font-bold transition-colors shadow-sm">
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
        );
      })()}

      {/* Task Completion Animation */}
      <TaskCompletionAnimation
        isVisible={showCompletionAnimation}
        onComplete={() => setShowCompletionAnimation(false)}
        coins={50}
        xp={100}
      />
    </div>
  );
};

export default AgendaView;