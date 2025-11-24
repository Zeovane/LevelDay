import React from 'react';

interface ProfileViewProps {
  userCoins: number;
  userXP: number;
  userFriends: number;
  onAddFriend: () => void;
  onInventory?: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userCoins, userXP, userFriends, onAddFriend, onInventory }) => {
  const formatXP = (xp: number) => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  };

  return (
    <div className="theme-bg-main h-full overflow-y-auto no-scrollbar flex flex-col">
      {/* Avatar Section - Ocupa a maior parte da tela */}
      <div className="flex-1 flex items-center justify-center p-6 min-h-[60vh]">
        <div className="w-full max-w-md h-full flex items-center justify-center">
          {/* Avatar estilizado - grande e bonito */}
          <svg viewBox="0 0 240 280" className="w-full h-full max-w-[400px] max-h-[400px]">
            {/* Fundo/Círculo de fundo */}
            <circle cx="120" cy="120" r="115" fill="#E8E8E8" opacity="0.3" />
            
            {/* Cabelo - mais estilizado */}
            <path d="M120 20 Q80 25 60 50 Q50 70 55 90 Q60 110 65 125 Q70 140 75 150 Q80 155 85 158 Q90 160 95 161 Q100 162 105 161 Q110 160 115 158 Q120 155 125 150 Q130 140 135 125 Q140 110 145 90 Q150 70 140 50 Q120 25 120 20 Z" fill="#5D4037" />
            <path d="M120 20 Q100 22 85 35 Q75 45 70 60 Q68 70 70 80 Q72 90 75 100 Q78 110 82 118 Q85 125 90 130 Q95 135 100 137 Q105 139 110 137 Q115 135 120 130 Q125 125 128 118 Q132 110 135 100 Q138 90 140 80 Q142 70 140 60 Q135 45 125 35 Q110 22 120 20 Z" fill="#6D4C41" />
            
            {/* Rosto - mais suave */}
            <ellipse cx="120" cy="130" rx="55" ry="65" fill="#FFE0B2" />
            <ellipse cx="120" cy="125" rx="50" ry="60" fill="#FFCCBC" />
            
            {/* Bochechas rosadas */}
            <ellipse cx="90" cy="140" rx="12" ry="15" fill="#FFAB91" opacity="0.4" />
            <ellipse cx="150" cy="140" rx="12" ry="15" fill="#FFAB91" opacity="0.4" />
            
            {/* Sobrancelhas */}
            <path d="M75 95 Q85 90 95 92" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M145 92 Q155 90 165 95" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
            
            {/* Olhos - mais expressivos */}
            <ellipse cx="100" cy="115" rx="10" ry="14" fill="#FFFFFF" />
            <ellipse cx="140" cy="115" rx="10" ry="14" fill="#FFFFFF" />
            <ellipse cx="100" cy="118" rx="6" ry="8" fill="#4A4A4A" />
            <ellipse cx="140" cy="118" rx="6" ry="8" fill="#4A4A4A" />
            <circle cx="100" cy="119" r="3" fill="#000000" />
            <circle cx="140" cy="119" r="3" fill="#000000" />
            <ellipse cx="101" cy="118" rx="1.5" ry="2" fill="#FFFFFF" />
            <ellipse cx="141" cy="118" rx="1.5" ry="2" fill="#FFFFFF" />
            
            {/* Nariz */}
            <ellipse cx="120" cy="135" rx="4" ry="6" fill="#E0B29A" opacity="0.5" />
            <path d="M118 130 Q120 135 122 130" stroke="#D4A574" strokeWidth="1.5" fill="none" />
            
            {/* Boca - sorriso */}
            <path d="M105 150 Q115 158 120 158 Q125 158 135 150" stroke="#8D6E63" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M110 152 Q115 156 120 156 Q125 156 130 152" stroke="#FF8A80" strokeWidth="1.5" fill="none" />
            
            {/* Barba - mais definida */}
            <path d="M120 155 Q85 160 70 175 Q65 185 68 195 Q72 200 78 200 Q85 200 90 197 Q95 195 100 195 Q105 195 110 197 Q115 200 120 200 Q125 200 130 197 Q135 195 140 195 Q145 195 150 197 Q155 200 162 200 Q168 200 172 195 Q175 185 170 175 Q155 160 120 155 Z" fill="#4E342E" />
            <path d="M120 155 Q100 157 85 165 Q80 170 82 180 Q84 185 88 187 Q92 189 96 188 Q100 188 104 188 Q108 188 112 188 Q116 189 120 188 Q124 189 128 188 Q132 188 136 188 Q140 189 144 187 Q148 185 150 180 Q152 170 147 165 Q132 157 120 155 Z" fill="#5D4037" />
            
            {/* Bigode */}
            <path d="M105 150 Q110 145 120 145 Q130 145 135 150 Q130 152 120 152 Q110 152 105 150 Z" fill="#3E2723" />
            <path d="M108 148 Q112 146 120 146 Q128 146 132 148 Q128 150 120 150 Q112 150 108 148 Z" fill="#4E342E" />
            
            {/* Camisa/Torso - mais estilizado */}
            <path d="M75 195 Q75 210 85 225 Q95 240 105 245 Q110 247 115 248 Q120 249 125 248 Q130 247 135 245 Q145 240 155 225 Q165 210 165 195 L165 210 Q165 220 155 235 Q145 245 135 250 Q130 252 125 252 Q120 252 115 250 Q105 245 95 235 Q85 220 85 210 Z" fill="#37474F" />
            <path d="M80 200 Q80 215 88 228 Q96 238 105 242 Q110 244 115 245 Q120 246 125 245 Q130 244 135 242 Q144 238 152 228 Q160 215 160 200 L160 212 Q160 220 152 232 Q144 240 135 243 Q130 245 125 245 Q120 245 115 243 Q106 240 98 232 Q90 220 90 212 Z" fill="#455A64" />
            
            {/* Gola da camisa */}
            <path d="M100 195 Q110 190 120 190 Q130 190 140 195 Q135 198 120 198 Q105 198 100 195 Z" fill="#263238" />
            
            {/* Detalhes adicionais - brilho no cabelo */}
            <ellipse cx="95" cy="60" rx="8" ry="12" fill="#8D6E63" opacity="0.3" />
            <ellipse cx="145" cy="60" rx="8" ry="12" fill="#8D6E63" opacity="0.3" />
          </svg>
        </div>
      </div>

      {/* User Info Section */}
      <div className="p-6 space-y-6">
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold theme-text-primary text-center mb-2">Usuário</h2>
          <p className="text-center theme-text-secondary mb-4">
            {userFriends === 0 
              ? 'Nenhum amigo' 
              : userFriends === 1 
              ? '1 amigo' 
              : `${userFriends} amigos`}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onAddFriend}
              className="py-2 px-4 theme-primary theme-text-light rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Adicionar Amigo
            </button>
            <button
              onClick={onInventory}
              className="py-2 px-4 theme-secondary theme-text-primary rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              Inventário
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Coins Card */}
          <div className="theme-bg-card rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 rounded-full flex items-center justify-center border-2" style={{ backgroundColor: 'var(--coin-bg)', borderColor: 'var(--coin-border)', color: 'var(--coin-text)' }}>
                <span className="font-bold text-lg">S</span>
              </div>
            </div>
            <p className="text-center text-sm theme-text-secondary mb-1">Moedas</p>
            <p className="text-center text-2xl font-bold theme-text-primary">{userCoins.toLocaleString()}</p>
          </div>

          {/* XP Card */}
          <div className="theme-bg-card rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 theme-success rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 theme-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <p className="text-center text-sm theme-text-secondary mb-1">XP</p>
            <p className="text-center text-2xl font-bold theme-text-primary">{formatXP(userXP)}</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold theme-text-primary mb-4">Conquistas</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 theme-bg-container rounded-lg">
              <div className="w-12 h-12 theme-primary rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold theme-text-primary">Primeira Tarefa</p>
                <p className="text-sm theme-text-secondary">Complete sua primeira tarefa</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold theme-text-secondary">Maratonista</p>
                <p className="text-sm theme-text-secondary opacity-70">Complete 10 tarefas em um dia</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold theme-text-secondary">Perfeccionista</p>
                <p className="text-sm theme-text-secondary opacity-70">Complete 100 tarefas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold theme-text-primary mb-4">Progresso Semanal</h3>
          <div className="space-y-3">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
              <div key={day} className="flex items-center">
                <div className="w-20 text-sm theme-text-secondary">{day}</div>
                <div className="flex-1 h-4 theme-bg-container rounded-full mx-3 overflow-hidden">
                  <div 
                    className="h-full theme-success rounded-full transition-all"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm font-semibold theme-text-primary">
                  {Math.floor(Math.random() * 10)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;


