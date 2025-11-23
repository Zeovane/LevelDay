import React from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';

interface NotesViewProps {
  notes: Note[];
  onNoteSelect: (noteId: number) => void;
  onBackToAgenda: () => void;
}

const NotesView: React.FC<NotesViewProps> = ({ notes, onNoteSelect, onBackToAgenda }) => {
  return (
    <div className="bg-[#f9c751] min-h-full p-6">
      <div className="grid grid-cols-2 gap-6">
        {notes.map(note => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => onNoteSelect(note.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default NotesView;