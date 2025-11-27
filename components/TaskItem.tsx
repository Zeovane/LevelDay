import React from 'react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  style: React.CSSProperties;
  onClick: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, style, onClick }) => {
  const tagColors: { [key: string]: string } = {
    'A': 'bg-red-500',
    'B': 'bg-[#f9c751]',
    'C': 'bg-[#1eae89]',
  };

  const tagColor = tagColors[task.tag] || 'bg-gray-400';
  const isCompleted = task.completed;
  const bgClass = isCompleted ? 'bg-gray-400' : 'theme-accent';
  const opacityClass = isCompleted ? 'opacity-75' : '';
  const titleStyle = isCompleted ? { textDecoration: 'line-through' } : {};

  return (
    <div
      className={`task-item absolute ${bgClass} ${opacityClass} rounded-md p-2 flex justify-between items-start text-white shadow-md cursor-pointer hover:shadow-lg transition-all`}
      style={style}
      onClick={onClick}
    >
      <div className="w-full">
        <p className="text-sm font-bold" style={titleStyle}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-green-100 mt-1">
            <span className="inline-block mr-1">•</span>
            {task.description}
          </p>
        )}
      </div>
      <div className="relative h-full flex items-center justify-center w-8 text-white font-bold text-lg -mr-2">
        <div className={`absolute inset-0 ${tagColor} task-tag-shape`}></div>
        <span className={`relative z-10 ${isCompleted ? 'opacity-50' : ''}`}>
          {isCompleted ? '✓' : task.tag}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;