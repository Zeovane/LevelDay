import React, { useEffect, useState } from 'react';

interface PurchaseAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  itemName: string;
  itemIcon: string;
  cost: number;
}

const PurchaseAnimation: React.FC<PurchaseAnimationProps> = ({
  isVisible,
  onComplete,
  itemName,
  itemIcon,
  cost
}) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const particles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#f08436', '#f9c751', '#1eae89', '#85cd39', '#ed6b2d', '#3b82f6'][Math.floor(Math.random() * 6)]
      }));
      setConfetti(particles);

      // Auto-close after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      {/* Confetti particles */}
      {confetti.map(particle => (
        <div
          key={particle.id}
          className="absolute w-3 h-3 rounded-full"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animation: `confetti-fall 2.5s ease-out ${particle.delay}s forwards`,
            top: '-10vh'
          }}
        />
      ))}

      {/* Success message card */}
      <div className="theme-bg-card rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform animate-scale-in">
        {/* Icon circle with bounce */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 theme-success rounded-full flex items-center justify-center animate-checkmark-scale">
              <span className="text-5xl" style={{ 
                animation: 'bounce-icon 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                transform: 'scale(0)'
              }}>
                {itemIcon}
              </span>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 theme-success rounded-full animate-ripple opacity-0"></div>
            <div className="absolute inset-0 theme-success rounded-full animate-ripple opacity-0" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Success text */}
        <h3 
          className="text-2xl font-bold theme-text-primary text-center mb-2"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.4s forwards',
            opacity: 0
          }}
        >
          Compra Realizada!
        </h3>
        <p 
          className="theme-text-secondary text-center mb-4"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.5s forwards',
            opacity: 0
          }}
        >
          {itemName} foi adicionado à sua coleção!
        </p>

        {/* Cost display */}
        <div 
          className="flex items-center justify-center theme-secondary bg-opacity-20 rounded-lg p-3"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.6s forwards',
            opacity: 0
          }}
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center mr-3 border-2" style={{ backgroundColor: 'var(--coin-bg)', borderColor: 'var(--coin-border)', color: 'var(--coin-text)' }}>
              <span className="font-bold text-sm">S</span>
            </div>
            <div>
              <p className="text-xs theme-text-secondary">Custo</p>
              <p className="text-lg font-bold theme-text-primary">-{cost}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseAnimation;

