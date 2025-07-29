
import React, { useEffect } from 'react';

interface SuccessAnimationProps {
  show: boolean;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ show, onComplete }) => {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="relative">
        {/* Confetti particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-grade-orange rounded-full animate-confetti"
            style={{
              left: `${Math.cos(i * 30 * Math.PI / 180) * 80}px`,
              top: `${Math.sin(i * 30 * Math.PI / 180) * 80}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        
        {/* Success message */}
        <div className="bg-gradient-to-r from-grade-purple to-grade-blue text-white px-6 py-3 rounded-[15px] font-space font-bold text-lg sm:text-xl animate-bounce-gentle border-b-[4px] border-purple-800">
          🎉 Great Job! 🎉
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
