import React from 'react';

interface InventoryViewProps {
  onBack: () => void;
  purchasedThemes: Set<string>;
  currentTheme: 'default' | 'blue' | 'dark';
  onThemeChange: (theme: 'default' | 'blue' | 'dark') => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ onBack, purchasedThemes, currentTheme, onThemeChange }) => {
  return (
    <div className="theme-bg-main h-full overflow-y-auto no-scrollbar">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center mb-4">
          <button onClick={onBack} className="mr-4">
            <svg className="w-6 h-6 theme-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 className="text-2xl font-bold theme-text-primary">Inventário</h1>
        </div>

        {/* Temas Comprados */}
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold theme-text-primary">Temas</h3>
                <p className="text-sm theme-text-secondary">Seus temas comprados</p>
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

            {purchasedThemes.size === 0 && (
              <p className="text-center text-sm theme-text-secondary mt-4">
                Você ainda não comprou nenhum tema. Visite a loja para comprar temas!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;

