import React from 'react';
import { TabType, PageType, Note } from '../types';

interface HeaderProps {
  activeTab: TabType;
  currentPage: PageType;
  currentDate: Date;
  selectedNote: Note | null;
  userCoins: number;
  onSettingsOpen: () => void;
  onSettingsClose: () => void;
  onCalendarOpen: () => void;
  onDateChange?: (date: Date) => void;
}

const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentPage,
  currentDate,
  selectedNote,
  userCoins,
  onSettingsOpen,
  onSettingsClose,
  onCalendarOpen,
  onDateChange
}) => {
  const monthNames = ["JANEIRO", "FEVEREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO", 
                     "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"];
  const dayNames = ["DOMINGO", "SEGUNDA", "TERÇA", "QUARTA", "QUINTA", "SEXTA", "SÁBADO"];

  const formatDate = (date: Date) => {
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const dayOfWeek = dayNames[date.getDay()];
    return { day, month, dayOfWeek };
  };

  const baseHeaderClasses = "p-4 flex items-center justify-between h-[68px] border-b theme-border-dark theme-primary";

  const renderHeaderContent = () => {
    if (activeTab === 'Perfil') {
      if (currentPage === 'settings') {
        return (
          <div className={baseHeaderClasses}>
            <button onClick={onSettingsClose} className="text-gray-300 hover:text-white">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold theme-text-light">CONFIGURAÇÕES</h1>
            <div className="w-8"></div>
          </div>
        );
      } else {
        return (
          <div className={baseHeaderClasses}>
            <h1 className="text-3xl font-light tracking-wider theme-text-light">PERFIL</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1 border border-orange-500">
                <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs mr-1" style={{ backgroundColor: 'var(--coin-bg)', border: '2px solid var(--coin-border)', color: 'var(--coin-text)' }}>S</div>
                <span className="font-semibold ml-1 theme-text-light">{userCoins}</span>
              </div>
              <button onClick={onSettingsOpen}>
                <svg className="w-8 h-8 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      }
    } else if (activeTab === 'Loja') {
      return (
        <div className={baseHeaderClasses}>
          <h1 className="text-3xl font-light tracking-wider theme-text-light">LOJA</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-black bg-opacity-20 rounded-full px-3 py-1 border border-orange-500">
              <div className="w-5 h-5 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center text-black font-bold text-xs mr-1">S</div>
              <span className="font-semibold ml-1 text-gray-100">{userCoins}</span>
            </div>
            <button className="text-gray-300">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>
        </div>
      );
    } else { // Agenda
      if (currentPage === 'noteDetail' && selectedNote) {
        return (
          <div className={baseHeaderClasses}>
            <h1 className="text-2xl font-normal theme-text-light tracking-wide capitalize">{selectedNote.title}</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      } else if (currentPage === 'notes') {
        return (
          <div className={baseHeaderClasses}>
            <h1 className="text-lg font-semibold theme-text-light tracking-wider">BLOCO DE NOTAS</h1>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              <button className="text-gray-300 hover:text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      } else { // Agenda
        const { day, month, dayOfWeek } = formatDate(currentDate);
        const today = new Date();
        const isToday = currentDate.toDateString() === today.toDateString();
        
        const handlePreviousDay = () => {
          if (onDateChange) {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() - 1);
            onDateChange(newDate);
          }
        };

        const handleNextDay = () => {
          if (onDateChange) {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            onDateChange(newDate);
          }
        };

        const handleToday = () => {
          if (onDateChange) {
            onDateChange(new Date());
          }
        };

        return (
          <div className={baseHeaderClasses}>
            <div className="flex items-center flex-1">
              <button 
                onClick={handlePreviousDay}
                className="text-gray-200 hover:text-white mr-2 p-1 transition-colors"
                aria-label="Dia anterior"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <div className="flex items-center cursor-pointer" onClick={handleToday}>
                <span className="text-5xl font-light theme-text-light">{String(day).padStart(2, '0')}</span>
                <div className="ml-3">
                  <p className="text-sm font-semibold theme-text-secondary tracking-wider">{month}, {dayOfWeek}</p>
                  {!isToday && (
                    <p className="text-xs theme-text-secondary mt-0.5">Toque para hoje</p>
                  )}
                </div>
              </div>
              <button 
                onClick={handleNextDay}
                className="text-gray-200 hover:text-white ml-2 p-1 transition-colors"
                aria-label="Próximo dia"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
              <button onClick={onCalendarOpen} className="text-gray-300 hover:text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        );
      }
    }
  };

  return (
    <header className="h-[68px] shrink-0">
      {renderHeaderContent()}
    </header>
  );
};

export default Header;