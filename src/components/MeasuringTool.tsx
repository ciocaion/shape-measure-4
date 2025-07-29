
import React from 'react';
import { Ruler } from 'lucide-react';

interface MeasuringToolProps {
  onDragStart: () => void;
  onDragEnd: () => void;
  isActive: boolean;
}

const MeasuringTool: React.FC<MeasuringToolProps> = ({ onDragStart, onDragEnd, isActive }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', 'measuring-tool');
    onDragStart();
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    onDragEnd();
  };

  return (
    <div
      className={`w-20 h-8 bg-grade-orange rounded-[10px] flex items-center justify-center cursor-grab border-b-[10px] border-[#E55A00] transition-all duration-200 hover:scale-105 active:scale-95 ${
        isActive ? 'animate-bounce-gentle' : ''
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      role="button"
      aria-label="Measuring tape tool"
      tabIndex={0}
    >
      <Ruler className="w-5 h-5 text-white" />
      <span className="text-white font-dm font-bold text-sm ml-1">TAPE</span>
    </div>
  );
};

export default MeasuringTool;
