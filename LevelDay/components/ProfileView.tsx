import React from 'react';

interface ProfileViewProps {
  userCoins: number;
  userXP: number;
  userFriends: number;
  userFollowers: number;
  userFollowing: number;
  onAddFriend: () => void;
  onInventory?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  userCoins, 
  userXP, 
  userFriends, 
  userFollowers,
  userFollowing,
  onAddFriend, 
  onInventory 
}) => {
  // Calcular progresso (exemplo: 75% do próximo nível)
  const progressPercentage = 75;

  return (
    <div className="theme-bg-main h-full overflow-y-auto no-scrollbar flex flex-col">
      {/* Seção superior com foto de perfil */}
      <div className="relative w-full flex items-center justify-center -mt-2">
        {/* Foto de perfil com tamanho específico */}
        <img 
          src="/Imagens/foto de usuario.png" 
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
          
          {/* Seguidores e Seguindo */}
          <div className="flex items-center gap-4 mb-4 mt-2">
            <div className="text-center">
              <p className="text-lg font-semibold theme-text-primary">{userFollowers}</p>
              <p className="text-sm theme-text-secondary">Seguidores</p>
            </div>
            <div className="w-px h-8 theme-border"></div>
            <div className="text-center">
              <p className="text-lg font-semibold theme-text-primary">{userFollowing}</p>
              <p className="text-sm theme-text-secondary">Seguindo</p>
            </div>
          </div>

          {/* Botão ADD AMIGOS */}
          <button
            onClick={onAddFriend}
            className="px-10 py-2.5 theme-bg-container theme-text-primary rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm mb-5 text-sm"
          >
            ADD AMIGOS
          </button>

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
            {/* Primeiras 4 medalhas (douradas com fita) */}
            {[1, 2, 3, 4].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center shadow-md">
                    <svg className="w-10 h-10 text-yellow-800" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  {/* Fita rosa/roxo */}
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-12 h-4 rounded-t-full" style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                  }}></div>
                </div>
              </div>
            ))}
            {/* Últimas 4 medalhas (acinzentadas) */}
            {[5, 6, 7, 8].map((index) => (
              <div key={index} className="flex flex-col items-center opacity-50">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
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
                    stroke="var(--theme-primary)"
                    strokeWidth="2"
                  />
                </svg>
                {/* Barras verticais */}
                {[64, 48, 56, 32, 52, 24, 40].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 theme-primary rounded-t opacity-60"
                    style={{ height: `${height}%`, zIndex: 2 }}
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
                    stroke="var(--theme-primary)"
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
                    stroke="var(--theme-success)"
                    strokeWidth="20"
                    strokeDasharray={`${251.2 * 0.3} ${251.2 * 0.7}`}
                    strokeDashoffset={`-${251.2 * 0.7}`}
                  />
                </svg>
              </div>
              {/* Legenda */}
              <div className="ml-3 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
                  <span className="text-xs theme-text-secondary">XP</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'var(--theme-success)' }}></div>
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
