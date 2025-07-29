
import React from 'react';

interface RobotHelperProps {
  message: string;
  isExcited?: boolean;
}

const RobotHelper: React.FC<RobotHelperProps> = ({ message, isExcited = false }) => {
  return (
    <div className="flex items-center gap-4 bg-white rounded-[20px] p-4 border-l-[10px] border-grade-purple shadow-lg">
      <div className={`w-16 h-16 bg-gradient-to-br from-grade-blue to-grade-purple rounded-full flex items-center justify-center text-2xl ${isExcited ? 'animate-bounce-gentle' : ''}`}>
        🤖
      </div>
      <div className="flex-1">
        <p className="text-grade-black font-dm font-bold text-lg leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  );
};

export default RobotHelper;
