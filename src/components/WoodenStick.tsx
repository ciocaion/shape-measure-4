
import React from 'react';

interface WoodenStickProps {
  id: string;
  length: number;
  width: number;
  showMeasurement?: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  onMeasure?: () => void;
}

const WoodenStick: React.FC<WoodenStickProps> = ({ 
  id, 
  length, 
  width, 
  showMeasurement = false, 
  isSelected = false, 
  onSelect,
  onMeasure 
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'measuring-tool' && onMeasure) {
      onMeasure();
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div
        className={`bg-gradient-to-b from-amber-600 to-amber-800 rounded-[8px] border-[3px] border-amber-900 shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 ${
          isSelected ? 'ring-4 ring-grade-purple' : ''
        }`}
        style={{ width: `${width}px`, height: '40px' }}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div className="w-full h-full bg-gradient-to-r from-amber-500/20 to-transparent rounded-[5px]" />
      </div>
      {showMeasurement && (
        <div className="mt-2 bg-white px-3 py-1 rounded-[10px] border-2 border-grade-black font-dm font-bold text-lg">
          {length} cm
        </div>
      )}
    </div>
  );
};

export default WoodenStick;
