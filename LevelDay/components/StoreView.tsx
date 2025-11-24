import React, { useState } from 'react';
import PurchaseAnimation from './PurchaseAnimation';

interface StoreViewProps {
  userCoins: number;
  purchasedThemes: Set<string>;
  onPurchase?: (itemId: number, cost: number, itemName: string) => void;
}

interface StoreItem {
  id: number;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: 'theme' | 'icon' | 'avatar';
}

const StoreView: React.FC<StoreViewProps> = ({ userCoins, purchasedThemes, onPurchase }) => {
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState(false);
  const [purchasedItem, setPurchasedItem] = useState<{ name: string; icon: string; cost: number } | null>(null);
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
      name: 'Avatar VIP',
      description: 'Avatar especial VIP para seu perfil',
      cost: 1000,
      icon: '👑',
      category: 'avatar'
    },
    {
      id: 7,
      name: 'Avatar Estrela',
      description: 'Avatar especial com estrela',
      cost: 600,
      icon: '⭐',
      category: 'avatar'
    },
    {
      id: 8,
      name: 'Avatar Robô',
      description: 'Avatar futurista de robô',
      cost: 450,
      icon: '🤖',
      category: 'avatar'
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
    // Verificar se o tema já foi comprado
    if (item.category === 'theme') {
      const themeKey = item.name === 'Tema Azul' ? 'blue' : item.name === 'Tema Escuro' ? 'dark' : '';
      if (themeKey && purchasedThemes.has(themeKey)) {
        alert('Você já possui este tema!');
        return;
      }
    }

    if (userCoins >= item.cost) {
      // Show purchase animation
      setPurchasedItem({
        name: item.name,
        icon: item.icon,
        cost: item.cost
      });
      setShowPurchaseAnimation(true);
      
      // Call onPurchase callback after a short delay to allow animation to start
      setTimeout(() => {
        if (onPurchase) {
          onPurchase(item.id, item.cost, item.name);
        }
      }, 100);
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
      case 'avatar':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getSectionTitle = (category: string) => {
    switch (category) {
      case 'theme':
        return 'Temas';
      case 'icon':
        return 'Ícones';
      case 'avatar':
        return 'Customização de Avatar';
      default:
        return '';
    }
  };

  const getSectionIcon = (category: string) => {
    switch (category) {
      case 'theme':
        return '🎨';
      case 'icon':
        return '⭐';
      case 'avatar':
        return '👤';
      default:
        return '';
    }
  };

  // Separar itens por categoria
  const themes = storeItems.filter(item => item.category === 'theme');
  const icons = storeItems.filter(item => item.category === 'icon');
  const avatars = storeItems.filter(item => item.category === 'avatar');

  const renderItemCard = (item: StoreItem) => {
    const canAfford = userCoins >= item.cost;
    const isTheme = item.category === 'theme';
    const themeKey = item.name === 'Tema Azul' ? 'blue' : item.name === 'Tema Escuro' ? 'dark' : '';
    const isPurchased = isTheme && themeKey && purchasedThemes.has(themeKey);

    return (
      <div
        key={item.id}
        className={`theme-bg-card rounded-lg shadow-md overflow-hidden border-2 ${getCategoryColor(item.category)} ${
          !canAfford ? 'opacity-60' : ''
        } ${isPurchased ? 'ring-2 ring-green-500' : ''}`}
      >
        <div className="p-4">
          <div className="text-4xl text-center mb-2">{item.icon}</div>
          <h3 className="text-lg font-bold theme-text-primary text-center mb-1">{item.name}</h3>
          <p className="text-xs theme-text-secondary text-center mb-3 min-h-[32px]">{item.description}</p>
          
          <div className="flex items-center justify-center mb-3">
            <div className="flex items-center theme-secondary border theme-border-dark rounded-full px-3 py-1">
              <div className="w-4 h-4 rounded-full flex items-center justify-center mr-1" style={{ backgroundColor: 'var(--coin-bg)', border: '2px solid var(--coin-border)', color: 'var(--coin-text)' }}>
                <span className="font-bold text-[10px]">S</span>
              </div>
              <span className={`font-bold text-sm ${canAfford ? 'theme-text-primary' : 'theme-text-secondary'}`}>
                {item.cost}
              </span>
            </div>
          </div>

          <button
            onClick={() => handlePurchase(item)}
            disabled={!canAfford || isPurchased}
            className={`w-full py-2 rounded-lg font-semibold text-sm transition-colors ${
              isPurchased
                ? 'bg-green-500 text-white cursor-default'
                : canAfford
                ? 'theme-success hover:opacity-90 theme-text-light'
                : 'theme-bg-container theme-text-secondary cursor-not-allowed'
            }`}
          >
            {isPurchased ? 'Comprado' : canAfford ? 'Comprar' : 'Insuficiente'}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="theme-bg-main w-full h-full overflow-y-auto no-scrollbar">
      <div className="p-6 space-y-6 pb-20">
        {/* Store Header */}
        <div className="theme-bg-card rounded-lg shadow-md p-6 text-center">
          <h2 className="text-2xl font-bold theme-text-primary mb-2">Loja</h2>
          <p className="theme-text-secondary text-sm">Personalize sua experiência</p>
          <div className="mt-4 flex items-center justify-center">
            <div className="flex items-center theme-secondary border-2 theme-border-dark rounded-full px-4 py-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 border-2" style={{ backgroundColor: 'var(--coin-bg)', borderColor: 'var(--coin-border)', color: 'var(--coin-text)' }}>
                <span className="font-bold text-xs">S</span>
              </div>
              <span className="font-bold text-lg theme-text-primary">{userCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Temas Section */}
        {themes.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSectionIcon('theme')}</span>
              <h3 className="text-xl font-bold theme-text-primary">{getSectionTitle('theme')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {themes.map(item => renderItemCard(item))}
            </div>
          </div>
        )}

        {/* Ícones Section */}
        {icons.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSectionIcon('icon')}</span>
              <h3 className="text-xl font-bold theme-text-primary">{getSectionTitle('icon')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {icons.map(item => renderItemCard(item))}
            </div>
          </div>
        )}

        {/* Customização de Avatar Section */}
        {avatars.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getSectionIcon('avatar')}</span>
              <h3 className="text-xl font-bold theme-text-primary">{getSectionTitle('avatar')}</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {avatars.map(item => renderItemCard(item))}
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="theme-bg-card rounded-lg shadow-md p-4">
          <div className="flex items-start">
            <div className="w-8 h-8 theme-primary rounded-full flex items-center justify-center mr-3 flex-shrink-0">
              <svg className="w-5 h-5 theme-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h4 className="font-semibold theme-text-primary mb-1">Como ganhar moedas?</h4>
              <p className="text-sm theme-text-secondary">
                Complete tarefas na sua agenda para ganhar moedas! Cada tarefa concluída te dá 50 moedas.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Animation */}
      {purchasedItem && (
        <PurchaseAnimation
          isVisible={showPurchaseAnimation}
          onComplete={() => {
            setShowPurchaseAnimation(false);
            setPurchasedItem(null);
          }}
          itemName={purchasedItem.name}
          itemIcon={purchasedItem.icon}
          cost={purchasedItem.cost}
        />
      )}
    </div>
  );
};

export default StoreView;


