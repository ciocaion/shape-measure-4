import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AreaBuildingExerciseProps {
  onComplete: (score: number) => void;
}

const AreaBuildingExercise: React.FC<AreaBuildingExerciseProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [placedSquares, setPlacedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: 'instruction',
      content: t('instructions.area.instruction'),
      data: {}
    }, '*');
  }, [t]);

  const handleSquareClick = (squareId: string) => {
    if (hasSubmitted) return;
    
    const newPlacedSquares = new Set(placedSquares);
    if (newPlacedSquares.has(squareId)) {
      newPlacedSquares.delete(squareId);
    } else {
      newPlacedSquares.add(squareId);
    }
    setPlacedSquares(newPlacedSquares);
  };

  const handleCheck = () => {
    const currentArea = placedSquares.size;
    setHasSubmitted(true);
    
    if (currentArea === 10) {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'success',
        content: t('common.correct'),
        data: { area: currentArea }
      }, '*');
      setTimeout(() => onComplete(100), 1500);
    } else {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: t('common.incorrect') + ` ${t('instructions.area.tip')}`,
        data: { 
          currentArea,
          target: 10,
          difference: Math.abs(currentArea - 10)
        }
      }, '*');
      setTimeout(() => setHasSubmitted(false), 2000);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 5; col++) {
        const squareId = `${col},${row}`;
        const isPlaced = placedSquares.has(squareId);
        
        grid.push(
          <div
            key={squareId}
            className={`w-8 h-8 sm:w-10 sm:h-10 border-3 border-grade-border-gray cursor-pointer transition-all duration-200 touch-target ${
              isPlaced 
                ? 'bg-grade-purple hover:bg-grade-purple/80'
                : 'bg-white hover:bg-grade-input-gray'
            }`}
            onClick={() => handleSquareClick(squareId)}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2">
      <div className="bg-grade-soft-white rounded-[15px] p-4 border-3 border-grade-black max-w-3xl w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="grid grid-cols-5 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>
          <div className="text-lg font-dm font-bold text-grade-purple">
            {placedSquares.size} / 10
          </div>
          <button
            onClick={handleCheck}
            className="bg-grade-orange text-white px-6 py-3 rounded-[12px] font-dm font-bold text-base hover:scale-105 transition-transform touch-target"
          >
            {t('common.submit')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AreaBuildingExercise;