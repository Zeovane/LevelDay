import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AgendaView from './components/AgendaView';
import NotesView from './components/NotesView';
import NoteDetailView from './components/NoteDetailView';
import ProfileView from './components/ProfileView';
import StoreView from './components/StoreView';
import SettingsView from './components/SettingsView';
import CalendarModal from './components/CalendarModal';
import LoginView from './components/LoginView';
import { Task, Note, Annotation } from './types';
import './style.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'Perfil' | 'Agenda' | 'Loja'>('Agenda');
  const [currentPage, setCurrentPage] = useState<'perfil' | 'settings' | 'agenda' | 'notes' | 'noteDetail' | 'loja'>('agenda');
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'notas 1', annotations: [ 
      { id: 101, time: '09:15', text: 'Primeira anotação.' }, 
      { id: 102, time: '10:30', text: 'Segunda anotação sobre a tarefa B.' } 
    ]},
    { id: 2, title: 'notas 2', annotations: [ 
      { id: 201, time: '11:05', text: 'Lembrar de verificar o email.' } 
    ]},
    { id: 3, title: 'notas 3', annotations: [] },
  ]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [userCoins, setUserCoins] = useState(1250);
  const [userXP, setUserXP] = useState(124821468);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleTabChange = (tab: 'Perfil' | 'Agenda' | 'Loja') => {
    setActiveTab(tab);
    if (tab === 'Perfil') {
      setCurrentPage('perfil');
    } else if (tab === 'Agenda') {
      setCurrentPage('agenda');
    } else if (tab === 'Loja') {
      setCurrentPage('loja');
    }
    setSelectedNote(null);
  };

  const handleNoteSelect = (noteId: number) => {
    const note = notes.find(n => n.id === noteId) || null;
    setSelectedNote(note);
    setCurrentPage('noteDetail');
  };

  const handleBackToNotes = () => {
    setCurrentPage('notes');
    setSelectedNote(null);
  };

  const handleBackToAgenda = () => {
    setCurrentPage('agenda');
    setSelectedNote(null);
  };

  const renderCurrentView = () => {
    switch (currentPage) {
      case 'agenda':
        return <AgendaView 
          tasks={tasks} 
          currentDate={currentDate} 
          onDateChange={setCurrentDate}
          onTaskComplete={(taskId) => {
            setTasks(prev => prev.map(t => 
              t.id === taskId ? { ...t, completed: true } : t
            ));
            setUserCoins(prev => prev + 50);
            setUserXP(prev => prev + 100);
          }}
        />;
      case 'notes':
        return <NotesView 
          notes={notes} 
          onNoteSelect={handleNoteSelect}
          onBackToAgenda={handleBackToAgenda}
        />;
      case 'noteDetail':
        return <NoteDetailView 
          note={selectedNote}
          onBack={handleBackToNotes}
          onAnnotationSchedule={(annotation) => {
            const newTask: Task = {
              id: Date.now(),
              title: annotation.text,
              tag: annotation.tag || 'A',
              startHour: annotation.startHour || 9,
              startMinute: annotation.startMinute || 0,
              endHour: annotation.endHour || 10,
              endMinute: annotation.endMinute || 0,
              description: annotation.description,
              day: annotation.day || currentDate.getDate(),
              month: annotation.month || (currentDate.getMonth() + 1),
              year: annotation.year || currentDate.getFullYear(),
              column: 0,
              totalColumns: 1,
              completed: false
            };
            setTasks(prev => [...prev, newTask]);
            
            // Mark annotation as scheduled
            setNotes(prev => prev.map(note => 
              note.id === selectedNote?.id 
                ? {
                    ...note,
                    annotations: note.annotations.map(ann => 
                      ann.id === annotation.id 
                        ? { ...ann, isScheduled: true }
                        : ann
                    )
                  }
                : note
            ));
            
            // Switch to agenda
            setActiveTab('Agenda');
            setCurrentPage('agenda');
          }}
          onAnnotationAdd={(text) => {
            if (selectedNote) {
              const newAnnotation: Annotation = {
                id: Date.now(),
                text: text.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              setNotes(prev => prev.map(note => 
                note.id === selectedNote.id 
                  ? { ...note, annotations: [newAnnotation, ...note.annotations] }
                  : note
              ));
            }
          }}
        />;
      case 'perfil':
        return <ProfileView 
          userCoins={userCoins}
          userXP={userXP}
        />;
      case 'loja':
        return <StoreView 
          userCoins={userCoins}
          onPurchase={(itemId, cost) => {
            if (userCoins >= cost) {
              setUserCoins(prev => prev - cost);
              alert('Compra realizada com sucesso!');
            }
          }}
        />;
      case 'settings':
        return <SettingsView 
          onBack={() => setCurrentPage('perfil')}
        />;
      default:
        return <div className="bg-[#f9c751] h-full flex items-center justify-center">
          <p className="text-gray-800 text-lg">Em desenvolvimento...</p>
        </div>;
    }
  };

  // Show login screen if not logged in
  if (!isLoggedIn) {
    return <LoginView onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app-container bg-gray-50 shadow-2xl rounded-3xl overflow-hidden flex flex-col relative mx-auto">
      <Header 
        activeTab={activeTab}
        currentPage={currentPage}
        currentDate={currentDate}
        selectedNote={selectedNote}
        userCoins={userCoins}
        onSettingsOpen={() => setCurrentPage('settings')}
        onSettingsClose={() => setCurrentPage('perfil')}
        onCalendarOpen={() => setIsCalendarOpen(true)}
        onDateChange={setCurrentDate}
      />
      
      <main className="flex-grow bg-gray-50 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {renderCurrentView()}
        </div>
      </main>
      
      <Footer 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Floating Action Button */}
      {activeTab === 'Agenda' && (
        <button 
          onClick={() => {
            if (currentPage === 'noteDetail') {
              handleBackToNotes();
            } else if (currentPage === 'agenda') {
              setCurrentPage('notes');
            } else if (currentPage === 'notes') {
              setCurrentPage('agenda');
            }
          }}
          className={`absolute w-14 h-14 bg-[#85cd39] rounded-full shadow-lg flex items-center justify-center text-white hover:bg-[#6aa82d] transition-colors z-10 ${
            currentPage === 'noteDetail' ? 'bottom-[142px]' : 'bottom-[70px]'
          } right-6`}
          aria-label="Toggle Notes"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h1.5a1 1 0 010 2H3a1 1 0 01-1-1zM2 6a1 1 0 011-1h1.5a1 1 0 110 2H3a1 1 0 01-1-1zM2 9a1 1 0 011-1h1.5a1 1 0 110 2H3a1 1 0 01-1-1zM5 2h10a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V3a1 1 0 011-1zm1 2v2h8V4H6zm0 4v2h8V8H6zm0 4v2h5v-2H6z"/>
          </svg>
        </button>
      )}

      {/* Calendar Modal */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentDate={currentDate}
        tasks={tasks}
        onDateSelect={(date) => {
          setCurrentDate(date);
          setIsCalendarOpen(false);
        }}
      />
    </div>
  );
};

export default App;