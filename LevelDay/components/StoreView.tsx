import React from 'react';

interface StoreViewProps {
  userCoins: number;
  onPurchase?: (itemId: number, cost: number) => void;
}

interface StoreItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'theme' | 'icon' | 'badge';
}

const StoreView: React.FC<StoreViewProps> = ({ userCoins, onPurchase }) => {
  const storeItems: StoreItem[] = [
    {
      id: 1,
      name: 'Tema Escuro',
      description: 'Desbloqueie o tema escuro para uma experiência noturna',
      cost: 500,
      icon: '🌙',
      category: 'theme'
    },
    {
      id: 2,
      name: 'Tema Azul',
      description: 'Personalize seu app com um tema azul elegante',
      cost: 300,
      icon: '💙',
      category: 'theme'
    },
    {
      id: 3,
      name: 'Ícone Dourado',
      description: 'Ícone especial dourado para seu perfil',
      cost: 750,
      icon: '⭐',
      category: 'icon'
    },
    {
      id: 4,
      name: 'Badge VIP',
      description: 'Mostre que você é um membro VIP',
      cost: 1000,
      icon: '👑',
      category: 'badge'
    },
    {
      id: 5,
      name: 'Ícone Estrela',
      description: 'Ícone de estrela brilhante',
      cost: 400,
      icon: '✨',
      category: 'icon'
    },
    {
      id: 6,
      name: 'Tema Verde',
      description: 'Um tema verde refrescante',
      cost: 350,
      icon: '🌿',
      category: 'theme'
    }
  ];

  const handlePurchase = (item: StoreItem) => {
    if (userCoins >= item.cost) {
      if (onPurchase) {
        onPurchase(item.id, item.cost);
      } else {
        alert(`Você comprou ${item.name} por ${item.cost} moedas!`);
      }
    } else {
      alert(`Você precisa de ${item.cost} moedas para comprar este item. Você tem ${userCoins} moedas.`);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'theme':
        return 'bg-blue-100 border-blue-300';
      case 'icon':
        return 'bg-yellow-100 border-yellow-300';
      case 'badge':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="bg-[#f9c751] w-full h-full overflow-y-auto no-scrollbar">
      <div className="p-6 space-y-6 pb-20">
        {/* Store Header */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loja</h2>
          <p className="text-gray-600 text-sm">Personalize sua experiência</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center bg-[#f9c751] border-2 border-[#e4a82e] rounded-full px-4 py-2">
              <div className="w-6 h-6 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center mr-2">
                <span className="text-black font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-lg text-gray-800">{userCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Store Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {storeItems.map((item) => {
            const canAfford = userCoins >= item.cost;
            return (
              <div
                key={item.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 ${getCategoryColor(item.category)} ${
                  !canAfford ? 'opacity-60' : ''
                }`}
              >
                <div className="p-4">
                  <div className="text-4xl text-center mb-2">{item.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 text-center mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 text-center mb-3 min-h-[32px]">{item.description}</p>
                  
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex items-center bg-[#f9c751] border border-[#e4a82e] rounded-full px-3 py-1">
                      <div className="w-4 h-4 bg-[#f9c751] border border-[#e4a82e] rounded-full flex items-center justify-center mr-1">
                        <span className="text-black font-bold text-[10px]">S</span>
                      </div>
                      <span className={`font-bold text-sm ${canAfford ? 'text-gray-800' : 'text-gray-500'}`}>
                        {item.cost}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={!canAfford}
                    className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
                      canAfford
                        ? 'bg-[#1eae89] hover:bg-[#189a79] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canAfford ? 'Comprar' : 'Insuficiente'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-start">
            <div className="w-8 h-8 bg-[#f08436] rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">Como ganhar moedas?</h4>
              <p className="text-sm text-gray-600">
                Complete tarefas na sua agenda para ganhar moedas! Cada tarefa concluída te dá 50 moedas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreView;


