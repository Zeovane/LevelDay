import React from 'react';

interface ProfileViewProps {
  userCoins: number;
  userXP: number;
}

const ProfileView: React.FC<ProfileViewProps> = ({ userCoins, userXP }) => {
  const formatXP = (xp: number) => {
    if (xp >= 1000000) {
      return `${(xp / 1000000).toFixed(1)}M`;
    } else if (xp >= 1000) {
      return `${(xp / 1000).toFixed(1)}K`;
    }
    return xp.toString();
  };

  return (
    <div className="bg-[#f9c751] h-full overflow-y-auto no-scrollbar">
      <div className="p-6 space-y-6">
        {/* User Stats Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-24 h-24 bg-[#f08436] rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Usuário</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Coins Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-lg">S</span>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-1">Moedas</p>
            <p className="text-center text-2xl font-bold text-gray-800">{userCoins.toLocaleString()}</p>
          </div>

          {/* XP Card */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-center mb-2">
              <div className="w-12 h-12 bg-[#1eae89] rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mb-1">XP</p>
            <p className="text-center text-2xl font-bold text-gray-800">{formatXP(userXP)}</p>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Conquistas</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-[#f08436] rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-800">Primeira Tarefa</p>
                <p className="text-sm text-gray-500">Complete sua primeira tarefa</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-600">Maratonista</p>
                <p className="text-sm text-gray-400">Complete 10 tarefas em um dia</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg opacity-50">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-600">Perfeccionista</p>
                <p className="text-sm text-gray-400">Complete 100 tarefas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Progresso Semanal</h3>
          <div className="space-y-3">
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
              <div key={day} className="flex items-center">
                <div className="w-20 text-sm text-gray-600">{day}</div>
                <div className="flex-1 h-4 bg-gray-200 rounded-full mx-3 overflow-hidden">
                  <div 
                    className="h-full bg-[#1eae89] rounded-full transition-all"
                    style={{ width: `${Math.random() * 100}%` }}
                  ></div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-800">
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

