import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface PerimeterBuildingExerciseProps {
  onComplete: (score: number) => void;
}

const PerimeterBuildingExercise: React.FC<PerimeterBuildingExerciseProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [placedSquares, setPlacedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: 'instruction',
      content: t('instructions.perimeter.instruction'),
      data: {}
    }, '*');
  }, [t]);

  const calculatePerimeter = (squares: Set<string>) => {
    if (squares.size === 0) return 0;
    
    let perimeter = 0;
    squares.forEach(square => {
      const [col, row] = square.split(',').map(Number);
      const sides = [
        [col, row - 1],
        [col, row + 1],
        [col - 1, row],
        [col + 1, row]
      ];
      
      sides.forEach(([adjCol, adjRow]) => {
        const adjSquare = `${adjCol},${adjRow}`;
        if (!squares.has(adjSquare)) {
          perimeter++;
        }
      });
    });
    
    return perimeter;
  };

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
    const currentPerimeter = calculatePerimeter(placedSquares);
    setHasSubmitted(true);
    
    if (currentPerimeter === 14) {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'success',
        content: t('common.correct'),
        data: { perimeter: currentPerimeter }
      }, '*');
      setTimeout(() => onComplete(100), 1500);
    } else {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: t('common.incorrect') + ` ${t('instructions.perimeter.tip')}`,
        data: { 
          currentPerimeter,
          target: 14,
          difference: Math.abs(currentPerimeter - 14)
        }
      }, '*');
      setTimeout(() => setHasSubmitted(false), 2500);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 1; row <= 6; row++) {
      for (let col = 1; col <= 6; col++) {
        const squareId = `${col},${row}`;
        const isPlaced = placedSquares.has(squareId);
        
        grid.push(
          <div
            key={squareId}
            className={`w-6 h-6 sm:w-8 sm:h-8 border-3 border-grade-border-gray cursor-pointer transition-all duration-200 touch-target ${
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
          <div className="grid grid-cols-6 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>
          <div className="text-lg font-dm font-bold text-grade-purple">
            {calculatePerimeter(placedSquares)} / 14
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

export default PerimeterBuildingExercise;