
import React from 'react';

interface LengthSegmentProps {
  length: number;
  color?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  className?: string;
}

const LengthSegment: React.FC<LengthSegmentProps> = ({ 
  length, 
  color = 'blue',
  onDragStart,
  onDragEnd,
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'blue': return 'from-blue-400 to-blue-600 border-blue-800';
      case 'green': return 'from-green-400 to-green-600 border-green-800';
      case 'red': return 'from-red-400 to-red-600 border-red-800';
      case 'purple': return 'from-purple-400 to-purple-600 border-purple-800';
      default: return 'from-blue-400 to-blue-600 border-blue-800';
    }
  };

  return (
    <div
      className={`bg-gradient-to-b ${getColorClasses()} rounded-[10px] border-[3px] cursor-grab transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg ${className}`}
      style={{ width: `${Math.max(80, length * 2)}px`, height: '50px' }}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      role="button"
      aria-label={`${length} centimeter building segment`}
      tabIndex={0}
    >
      <span className="text-white font-dm font-bold text-base drop-shadow-lg">
        {length} cm
      </span>
    </div>
  );
};

export default LengthSegment;
