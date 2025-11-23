import React, { useEffect, useState } from 'react';

interface TaskCompletionAnimationProps {
  isVisible: boolean;
  onComplete: () => void;
  coins: number;
  xp: number;
}

const TaskCompletionAnimation: React.FC<TaskCompletionAnimationProps> = ({
  isVisible,
  onComplete,
  coins,
  xp
}) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

  useEffect(() => {
    if (isVisible) {
      // Generate confetti particles
      const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: ['#f08436', '#f9c751', '#1eae89', '#85cd39', '#ed6b2d'][Math.floor(Math.random() * 5)]
      }));
      setConfetti(particles);

      // Auto-close after animation
      const timer = setTimeout(() => {
        onComplete();
      }, 2500);

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 transform animate-scale-in">
        {/* Checkmark circle */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-20 h-20 bg-[#1eae89] rounded-full flex items-center justify-center animate-checkmark-scale">
              <svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                style={{ 
                  strokeDasharray: 50, 
                  strokeDashoffset: 50,
                  animation: 'checkmark-draw 0.8s ease-out 0.3s forwards'
                }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="3" 
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            {/* Ripple effect */}
            <div className="absolute inset-0 bg-[#1eae89] rounded-full animate-ripple opacity-0"></div>
            <div className="absolute inset-0 bg-[#1eae89] rounded-full animate-ripple opacity-0" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Success text */}
        <h3 
          className="text-2xl font-bold text-gray-800 text-center mb-2"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.4s forwards',
            opacity: 0
          }}
        >
          Tarefa Concluída!
        </h3>
        <p 
          className="text-gray-600 text-center mb-6"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.5s forwards',
            opacity: 0
          }}
        >
          Parabéns! Você completou mais uma tarefa.
        </p>

        {/* Rewards */}
        <div 
          className="space-y-3"
          style={{ 
            animation: 'fade-in-up 0.5s ease-out 0.6s forwards',
            opacity: 0
          }}
        >
          <div className="flex items-center justify-center bg-[#f9c751] bg-opacity-20 rounded-lg p-3">
            <div className="w-8 h-8 bg-[#f9c751] border-2 border-[#e4a82e] rounded-full flex items-center justify-center mr-3">
              <span className="text-black font-bold text-sm">S</span>
            </div>
            <div>
              <p className="text-xs text-gray-600">Moedas ganhas</p>
              <p className="text-lg font-bold text-gray-800">+{coins}</p>
            </div>
          </div>
          <div className="flex items-center justify-center bg-[#1eae89] bg-opacity-20 rounded-lg p-3">
            <svg className="w-8 h-8 text-[#1eae89] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <div>
              <p className="text-xs text-gray-600">XP ganho</p>
              <p className="text-lg font-bold text-gray-800">+{xp}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionAnimation;

