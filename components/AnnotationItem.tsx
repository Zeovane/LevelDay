import React from 'react';
import { Annotation } from '../types';

interface AnnotationItemProps {
  annotation: Annotation;
  onClick: () => void;
}

const AnnotationItem: React.FC<AnnotationItemProps> = ({ annotation, onClick }) => {
  const CalendarIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    </svg>
  );

  return (
    <div
      onClick={onClick}
      className={`annotation-item flex items-center theme-bg-card rounded-md shadow-sm mb-4 overflow-hidden h-12 ${
        annotation.isScheduled 
          ? 'opacity-60 cursor-default' 
          : 'cursor-pointer hover:opacity-90 transition-colors'
      }`}
    >
      <div className="theme-success theme-text-light text-sm py-3 px-4 w-24 flex items-center justify-center">
        <span>{annotation.time}</span>
      </div>
      <div className="flex-grow py-3 px-4 theme-text-primary text-lg">
        <span>{annotation.text}</span>
      </div>
      {annotation.isScheduled && (
        <div className="pr-3 text-gray-400">
          {CalendarIcon}
        </div>
      )}
    </div>
  );
};

export default AnnotationItem;