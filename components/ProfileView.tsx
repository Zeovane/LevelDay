import React from 'react';

interface ProfileViewProps {
  userCoins: number;
  userXP: number;
  userFriends: number;
  userFollowers: number;
  userFollowing: number;
  onAddFriend: () => void;
  onInventory?: () => void;
  currentTheme?: 'default' | 'blue' | 'dark';
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  userCoins, 
  userXP, 
  userFriends, 
  userFollowers,
  userFollowing,
  onAddFriend, 
  onInventory,
  currentTheme = 'default'
}) => {
  // Calcular progresso (exemplo: 75% do próximo nível)
  const progressPercentage = 75;

  return (
    <div className="theme-bg-main h-full overflow-y-auto no-scrollbar flex flex-col">
      {/* Seção superior com foto de perfil */}
      <div className="relative w-full flex items-center justify-center -mt-2">
        {/* Foto de perfil com tamanho específico */}
        <img 
          src="./assets/foto de usuario.png" 
          alt="Foto de perfil" 
          className="object-cover"
          style={{ 
            width: '393px',
            height: '229px',
            display: 'block',
            objectFit: 'cover'
          }}
        />
      </div>

      {/* Seção inferior com informações */}
      <div className="flex-1 theme-bg-main p-6 space-y-6 -mt-8 rounded-t-3xl relative z-10">
        {/* Nome e informações */}
        <div className="flex flex-col items-center pt-8">
          <h2 className="text-2xl font-bold theme-text-primary mb-1">nome</h2>
          
          {/* Amigos */}
          <div className="flex items-center justify-center mb-4 mt-2">
            <div className="text-center">
              <p className="text-lg font-semibold theme-text-primary">{userFollowers}</p>
              <p className="text-sm theme-text-secondary">Amigos</p>
            </div>
          </div>

          {/* Botões ADD AMIGOS e Inventário */}
          <div className="flex gap-3 mb-5">
            <button
              onClick={onAddFriend}
              className="px-6 py-2.5 theme-accent theme-text-light rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm text-sm"
            >
              ADD AMIGOS
            </button>
            <button
              onClick={onInventory}
              className="px-6 py-2.5 theme-accent theme-text-light rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Inventário
            </button>
          </div>

          {/* Badge/Rank com Diamante */}
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-lg flex items-center justify-center shadow-lg" style={{
              background: 'linear-gradient(135deg, #8b5a3c 0%, #6b4423 50%, #8b5a3c 100%)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4), inset 0 2px 5px rgba(255,255,255,0.2)'
            }}>
              <div className="w-14 h-14 bg-white bg-opacity-30 rounded-md flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8))' }}>
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full max-w-xs mb-2">
            <div className="h-3 theme-bg-container rounded-full overflow-hidden">
              <div 
                className="h-full theme-success rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* XP Total */}
          <div className="text-center mb-6">
            <p className="text-2xl font-bold theme-text-primary">{userXP.toLocaleString()} XP</p>
          </div>
        </div>

        {/* Conquistas Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold theme-text-primary mb-4">Conquistas</h3>
          <div className="grid grid-cols-4 gap-4">
            {/* Primeiras 4 troféus (dourados com fita) */}
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md">
                    <svg className="w-10 h-10 text-yellow-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                    </svg>
                  </div>
                  {/* Fita rosa/roxo */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-4 rounded-t-full" style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                  }}></div>
                </div>
              </div>
            ))}
            {/* Últimas 4 troféus (acinzentados) */}
            {[5, 6, 7, 8].map((index) => (
              <div key={index} className="flex flex-col items-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EXP da semana Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold theme-text-primary mb-4">EXP da semana</h3>
          <div className="grid grid-cols-2 gap-6 items-center">
            {/* Gráfico de Linha */}
            <div className="flex flex-col h-32">
              <div className="h-full flex items-end justify-between gap-1 relative">
                {/* Linha conectando os pontos */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
                  <polyline
                    points="14,64 28,48 42,56 56,32 70,52 84,24 98,40"
                    fill="none"
                    stroke={currentTheme === 'dark' ? '#ffffff' : 'var(--theme-primary)'}
                    strokeWidth="2"
                  />
                </svg>
                {/* Barras verticais */}
                {[64, 48, 56, 32, 52, 24, 40].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 rounded-t opacity-60"
                    style={{ 
                      height: `${height}%`, 
                      zIndex: 2,
                      backgroundColor: currentTheme === 'dark' ? '#ffffff' : 'var(--theme-primary)'
                    }}
                  ></div>
                ))}
              </div>
            </div>

            {/* Gráfico de Pizza */}
            <div className="flex items-center justify-center">
              <div className="relative w-28 h-28">
                <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                  {/* Segmento laranja (maior - ~70%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={currentTheme === 'dark' ? '#ffffff' : currentTheme === 'blue' ? '#93c5fd' : 'var(--theme-primary)'}
                    strokeWidth="20"
                    strokeDasharray={`${251.2 * 0.7} ${251.2 * 0.3}`}
                    strokeDashoffset="0"
                  />
                  {/* Segmento ciano (menor - ~30%) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke={currentTheme === 'dark' ? '#1eae89' : currentTheme === 'blue' ? '#3b82f6' : 'var(--theme-success)'}
                    strokeWidth="20"
                    strokeDasharray={`${251.2 * 0.3} ${251.2 * 0.7}`}
                    strokeDashoffset={`-${251.2 * 0.7}`}
                  />
                </svg>
              </div>
              {/* Legenda */}
              <div className="ml-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme === 'dark' ? '#ffffff' : currentTheme === 'blue' ? '#93c5fd' : 'var(--theme-primary)' }}></div>
                  <span className="text-xs theme-text-secondary">XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTheme === 'dark' ? '#1eae89' : currentTheme === 'blue' ? '#3b82f6' : 'var(--theme-success)' }}></div>
                  <span className="text-xs theme-text-secondary">XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
