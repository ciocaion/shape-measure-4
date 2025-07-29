
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
            className="absolute w-3 h-3 bg-grade-orange rounded-full animate-confetti"
            style={{
              left: `${Math.cos(i * 30 * Math.PI / 180) * 100}px`,
              top: `${Math.sin(i * 30 * Math.PI / 180) * 100}px`,
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
        
        {/* Success message */}
        <div className="bg-gradient-to-r from-grade-purple to-grade-blue text-white px-8 py-4 rounded-[20px] font-space font-bold text-2xl animate-bounce-gentle border-b-[6px] border-purple-800">
          🎉 Great Job! 🎉
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
