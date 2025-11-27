import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { Note, Annotation } from '../types';
import AnnotationItem from './AnnotationItem';

interface NoteDetailViewProps {
  note: Note | null;
  onBack: () => void;
  onAnnotationSchedule: (annotation: Annotation) => void;
  onAnnotationAdd: (text: string) => void;
}

export interface NoteDetailViewHandle {
  focusTextarea: () => void;
}

const NoteDetailView = forwardRef<NoteDetailViewHandle, NoteDetailViewProps>(({ 
  note, 
  onBack, 
  onAnnotationSchedule, 
  onAnnotationAdd 
}, ref) => {
  const [newAnnotationText, setNewAnnotationText] = useState('');
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    focusTextarea: () => {
      textareaRef.current?.focus();
    }
  }));

  if (!note) {
    return (
      <div className="bg-[#f9c751] h-full p-6 flex items-center justify-center">
        <p className="text-gray-500">Nota não encontrada.</p>
      </div>
    );
  }

  const handleAnnotationClick = (annotation: Annotation) => {
    if (!annotation.isScheduled) {
      setSelectedAnnotation({ ...annotation });
    }
  };

  const handleScheduleAnnotation = () => {
    if (selectedAnnotation) {
      // Set default values if not provided
      const annotationToSchedule = {
        ...selectedAnnotation,
        tag: selectedAnnotation.tag || 'A',
        startHour: selectedAnnotation.startHour || 9,
        startMinute: selectedAnnotation.startMinute || 0,
        endHour: selectedAnnotation.endHour || 10,
        endMinute: selectedAnnotation.endMinute || 0,
        day: selectedAnnotation.day || new Date().getDate(),
        month: selectedAnnotation.month || (new Date().getMonth() + 1),
        year: selectedAnnotation.year || new Date().getFullYear(),
      };
      
      onAnnotationSchedule(annotationToSchedule);
      setSelectedAnnotation(null);
    }
  };

  const handleAddAnnotation = () => {
    if (newAnnotationText.trim()) {
      onAnnotationAdd(newAnnotationText);
      setNewAnnotationText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddAnnotation();
    }
  };

  const annotationsHTML = note.annotations.length > 0 ? (
    note.annotations.map(ann => (
      <AnnotationItem
        key={ann.id}
        annotation={ann}
        onClick={() => handleAnnotationClick(ann)}
      />
    ))
  ) : (
    <div className="flex items-center justify-center h-full">
      <p className="text-gray-800 opacity-70">Nenhuma anotação ainda.</p>
    </div>
  );

  return (
    <div className="theme-bg-main h-full flex flex-col relative">
      <div className="flex-grow overflow-y-auto no-scrollbar p-6 pb-24">
        {annotationsHTML}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 theme-bg-card p-3 border-t theme-border">
        <div className="flex gap-2">
          <textarea
            ref={textareaRef}
            value={newAnnotationText}
            onChange={(e) => setNewAnnotationText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 text-lg theme-text-primary theme-bg-container border theme-border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1eae89] resize-none"
            placeholder="Escreva uma anotação..."
            rows={1}
          />
          {newAnnotationText.trim() && (
            <button
              onClick={handleAddAnnotation}
              className="px-4 py-2 bg-[#1eae89] text-white rounded-lg hover:bg-[#189a79] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Annotation Detail Modal */}
      {selectedAnnotation && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
          <div className="theme-bg-card theme-text-primary rounded-lg shadow-xl w-full max-w-sm p-5 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="relative theme-primary theme-text-light -m-5 mb-0 rounded-t-lg p-4 h-16 flex items-center">
              <input
                type="text"
                value={selectedAnnotation.text}
                onChange={(e) => setSelectedAnnotation({ ...selectedAnnotation, text: e.target.value })}
                className="bg-transparent text-lg font-semibold text-gray-100 placeholder-gray-400 focus:outline-none w-2/3"
                placeholder="Título da Tarefa"
              />
              <div className="absolute right-0 top-0 h-full w-20 theme-success flex items-center justify-center task-priority-shape">
                <span className="text-white text-3xl font-bold">{selectedAnnotation.tag || 'A'}</span>
              </div>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs uppercase tracking-wider theme-text-secondary">Data</label>
                <div className="flex gap-2 mt-1">
                  <input
                    type="text"
                    placeholder="DD"
                    value={selectedAnnotation.day || ''}
                    onChange={(e) => setSelectedAnnotation({ ...selectedAnnotation, day: parseInt(e.target.value) || undefined })}
                    maxLength={2}
                    className="w-full h-10 text-center theme-bg-container theme-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]"
                  />
                  <input
                    type="text"
                    placeholder="MM"
                    value={selectedAnnotation.month || ''}
                    onChange={(e) => setSelectedAnnotation({ ...selectedAnnotation, month: parseInt(e.target.value) || undefined })}
                    maxLength={2}
                    className="w-full h-10 text-center theme-bg-container theme-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]"
                  />
                  <input
                    type="text"
                    placeholder="AAAA"
                    value={selectedAnnotation.year || ''}
                    onChange={(e) => setSelectedAnnotation({ ...selectedAnnotation, year: parseInt(e.target.value) || undefined })}
                    maxLength={4}
                    className="w-full h-10 text-center theme-bg-container theme-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase tracking-wider theme-text-secondary">Horário</label>
                <div className="flex items-center gap-1 mt-1">
                  <input
                    type="time"
                    value={`${String(selectedAnnotation.startHour || 9).padStart(2, '0')}:${String(selectedAnnotation.startMinute || 0).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      setSelectedAnnotation({ ...selectedAnnotation, startHour: h, startMinute: m });
                    }}
                    className="w-full h-10 px-1 text-center theme-bg-container theme-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]"
                  />
                  <span className="text-xs text-gray-400">-</span>
                  <input
                    type="time"
                    value={`${String(selectedAnnotation.endHour || 10).padStart(2, '0')}:${String(selectedAnnotation.endMinute || 0).padStart(2, '0')}`}
                    onChange={(e) => {
                      const [h, m] = e.target.value.split(':').map(Number);
                      setSelectedAnnotation({ ...selectedAnnotation, endHour: h, endMinute: m });
                    }}
                    className="w-full h-10 px-1 text-center theme-bg-container theme-text-primary rounded-md focus:outline-none focus:ring-2 focus:ring-[#1eae89]"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
                <label className="text-xs uppercase tracking-wider theme-text-secondary">Descrição</label>
              <textarea
                value={selectedAnnotation.description || ''}
                onChange={(e) => setSelectedAnnotation({ ...selectedAnnotation, description: e.target.value })}
                className="w-full h-20 theme-bg-container theme-text-primary rounded-md mt-1 p-2 focus:outline-none focus:ring-2 focus:ring-[#1eae89] resize-none"
                placeholder="Adicione uma descrição..."
              />
            </div>

            {/* Priority */}
            <div>
              <label className="text-xs uppercase tracking-wider theme-text-secondary">Ranking de prioridade</label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {['A', 'B', 'C'].map(priority => (
                  <button
                    key={priority}
                    onClick={() => setSelectedAnnotation({ ...selectedAnnotation, tag: priority })}
                    className={`py-2 rounded-md text-lg font-bold transition-colors ${
                      selectedAnnotation.tag === priority
                        ? priority === 'A' ? 'bg-red-500 text-white' 
                          : priority === 'B' ? 'bg-[#f9c751] text-black'
                          : 'bg-[#1eae89] text-white'
                        : 'theme-bg-container hover:opacity-80 theme-text-primary'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedAnnotation(null)}
                className="px-4 py-2 rounded-md theme-bg-container hover:opacity-80 theme-text-primary transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleScheduleAnnotation}
                className="px-4 py-2 rounded-md theme-success hover:opacity-90 theme-text-light font-semibold transition-colors"
              >
                Enviar para Agenda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

NoteDetailView.displayName = 'NoteDetailView';

export default NoteDetailView;