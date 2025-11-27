import React from 'react';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="note-card rounded-2xl shadow-lg p-4 flex items-center justify-center aspect-square transition-transform hover:scale-105 w-full text-left theme-accent"
    >
      <p className="text-white text-lg capitalize text-center">
        {note.title}
      </p>
    </button>
  );
};

export default NoteCard;