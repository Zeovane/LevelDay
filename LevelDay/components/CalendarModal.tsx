import React, { useState } from 'react';
import { Task } from '../types';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDate: Date;
  tasks: Task[];
  onDateSelect: (date: Date) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  currentDate,
  tasks,
  onDateSelect
}) => {
  const [viewDate, setViewDate] = useState<Date>(new Date(currentDate));

  const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  if (!isOpen) return null;

  const today = new Date();
  const currentMonth = viewDate.getMonth();
  const currentYear = viewDate.getFullYear();

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // Get tasks for each day
  const getTasksForDay = (day: number, month: number, year: number): Task[] => {
    return tasks.filter(task =>
      task.year === year &&
      task.month === month + 1 &&
      task.day === day
    );
  };

  // Check if day has tasks
  const hasTasks = (day: number, month: number, year: number): boolean => {
    return getTasksForDay(day, month, year).length > 0;
  };

  // Check if day is today
  const isToday = (day: number, month: number, year: number): boolean => {
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  // Check if day is selected
  const isSelected = (day: number, month: number, year: number): boolean => {
    return day === currentDate.getDate() &&
           month === currentDate.getMonth() &&
           year === currentDate.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    onDateSelect(selectedDate);
    onClose();
  };

  const handlePreviousMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const handleToday = () => {
    const todayDate = new Date();
    setViewDate(todayDate);
    onDateSelect(todayDate);
    onClose();
  };

  // Generate calendar days
  const calendarDays = [];
  
  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }
  
  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="theme-primary theme-text-light p-4 flex items-center justify-between">
          <button
            onClick={handlePreviousMonth}
            className="text-white hover:text-orange-200 transition-colors p-1"
            aria-label="Mês anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth]} {currentYear}
          </h2>
          <button
            onClick={handleNextMonth}
            className="text-white hover:text-orange-200 transition-colors p-1"
            aria-label="Próximo mês"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 p-2 bg-gray-50">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 p-2">
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square"></div>;
            }

            const dayHasTasks = hasTasks(day, currentMonth, currentYear);
            const dayIsToday = isToday(day, currentMonth, currentYear);
            const dayIsSelected = isSelected(day, currentMonth, currentYear);

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all ${
                  dayIsSelected
                    ? 'bg-[#f08436] text-white font-bold'
                    : dayIsToday
                    ? 'bg-[#f9c751] text-gray-800 font-semibold'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <span className="text-sm">{day}</span>
                {dayHasTasks && (
                  <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                    <div className="w-1 h-1 bg-[#1eae89] rounded-full"></div>
                    {getTasksForDay(day, currentMonth, currentYear).length > 1 && (
                      <div className="w-1 h-1 bg-[#1eae89] rounded-full"></div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={handleToday}
            className="px-4 py-2 theme-success hover:theme-success-dark theme-text-light rounded-lg font-semibold transition-colors"
          >
            Hoje
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarModal;

