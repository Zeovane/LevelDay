import React from 'react';

interface SettingsViewProps {
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [notifications, setNotifications] = React.useState(true);
  const [soundEnabled, setSoundEnabled] = React.useState(true);

  return (
    <div className="theme-bg-main h-full overflow-y-auto no-scrollbar">
      <div className="p-6 space-y-4">
        {/* Notification Settings */}
        <div className="theme-bg-card rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#f08436] rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold theme-text-primary">Notificações</h3>
                <p className="text-sm theme-text-secondary">Receber alertas de tarefas</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications ? 'bg-[#1eae89]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  notifications ? 'transform translate-x-6' : ''
                }`}
              ></div>
            </button>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="theme-bg-card rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-[#1eae89] rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold theme-text-primary">Som</h3>
                <p className="text-sm theme-text-secondary">Ativar sons do aplicativo</p>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-[#1eae89]' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'transform translate-x-6' : ''
                }`}
              ></div>
            </button>
          </div>
        </div>


        {/* About Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-4">
          <h3 className="font-semibold theme-text-primary mb-3">Sobre</h3>
          <div className="space-y-2 text-sm theme-text-secondary">
            <p>LevelDay v1.0.0</p>
            <p>Gerencie suas tarefas e organize seu dia!</p>
          </div>
        </div>

        {/* Support Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-4">
          <h3 className="font-semibold theme-text-primary mb-3">Suporte</h3>
          <div className="space-y-2">
            <button className="w-full text-left py-2 theme-text-primary hover:opacity-80 transition-colors">
              Ajuda e FAQ
            </button>
            <button className="w-full text-left py-2 text-gray-700 hover:text-[#f08436] transition-colors">
              Reportar Problema
            </button>
            <button className="w-full text-left py-2 text-gray-700 hover:text-[#f08436] transition-colors">
              Avaliar App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;


