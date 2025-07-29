
import React from 'react';

interface RobotHelperProps {
  message: string;
  isExcited?: boolean;
}

const RobotHelper: React.FC<RobotHelperProps> = ({ message, isExcited = false }) => {
  return (
    <div className="flex items-center gap-3 bg-white rounded-[15px] p-3 border-l-[6px] border-grade-purple shadow-lg">
      <div className={`w-12 h-12 bg-gradient-to-br from-grade-blue to-grade-purple rounded-full flex items-center justify-center text-lg ${isExcited ? 'animate-bounce-gentle' : ''}`}>
        🤖
      </div>
      <div className="flex-1">
        <p className="text-grade-black font-dm font-bold text-base leading-snug">
          {message}
        </p>
      </div>
    </div>
  );
};

export default RobotHelper;
