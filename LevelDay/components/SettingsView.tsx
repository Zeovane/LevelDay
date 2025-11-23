import React from 'react';

interface SettingsViewProps {
  onBack: () => void;
  purchasedThemes: Set<string>;
  currentTheme: 'default' | 'blue' | 'dark';
  onThemeChange: (theme: 'default' | 'blue' | 'dark') => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack, purchasedThemes, currentTheme, onThemeChange }) => {
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

        {/* Theme Settings */}
        {purchasedThemes.size > 0 && (
          <div className="theme-bg-card rounded-lg shadow-md p-4">
            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold theme-text-primary">Tema</h3>
                  <p className="text-sm theme-text-secondary">Escolha o tema do aplicativo</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Default Theme - sempre disponível */}
                <button
                  onClick={() => onThemeChange('default')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    currentTheme === 'default'
                      ? 'border-[#f08436] bg-orange-50'
                      : 'theme-border theme-bg-card hover:opacity-80'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#f08436] via-[#f9c751] to-[#85cd39] mb-2"></div>
                    <span className="text-xs font-semibold theme-text-primary">Padrão</span>
                    {currentTheme === 'default' && (
                      <div className="mt-1 w-2 h-2 bg-[#f08436] rounded-full"></div>
                    )}
                  </div>
                </button>

                {/* Blue Theme - apenas se comprado */}
                {purchasedThemes.has('blue') && (
                  <button
                    onClick={() => onThemeChange('blue')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTheme === 'blue'
                        ? 'border-blue-500 bg-blue-50'
                        : 'theme-border theme-bg-card hover:opacity-80'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 mb-2"></div>
                      <span className="text-xs font-semibold theme-text-primary">Azul</span>
                      {currentTheme === 'blue' && (
                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                )}

                {/* Dark Theme - apenas se comprado */}
                {purchasedThemes.has('dark') && (
                  <button
                    onClick={() => onThemeChange('dark')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      currentTheme === 'dark'
                        ? 'border-gray-700 bg-gray-100'
                        : 'theme-border theme-bg-card hover:opacity-80'
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 mb-2"></div>
                      <span className={`text-xs font-semibold ${currentTheme === 'dark' ? 'text-gray-900' : 'theme-text-primary'}`}>Escuro</span>
                      {currentTheme === 'dark' && (
                        <div className="mt-1 w-2 h-2 bg-gray-700 rounded-full"></div>
                      )}
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

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


