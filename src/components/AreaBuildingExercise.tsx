
import React, { useState } from 'react';

interface AreaBuildingExerciseProps {
  onComplete: (score: number) => void;
}

const AreaBuildingExercise: React.FC<AreaBuildingExerciseProps> = ({ onComplete }) => {
  const [placedSquares, setPlacedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

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
      setFeedback('✅ Perfect! You built 10 cm²!');
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    } else if (currentArea < 10) {
      setFeedback(`❌ Too small! You need ${10 - currentArea} more squares.`);
      setTimeout(() => {
        setHasSubmitted(false);
        setFeedback('');
      }, 2000);
    } else {
      setFeedback(`❌ Too big! Remove ${currentArea - 10} squares.`);
      setTimeout(() => {
        setHasSubmitted(false);
        setFeedback('');
      }, 2000);
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
        <h2 className="font-space font-bold text-lg sm:text-xl text-grade-black mb-3 text-center">
          Exercise 2: Build a Shape with Area = 10 cm²
        </h2>
        
        <p className="text-grade-black font-dm text-base mb-4 text-center">
          Click squares to place blocks. Build any shape with exactly 10 squares!
        </p>

        <div className="flex flex-col items-center compact-spacing">
          {/* Grid */}
          <div className="grid grid-cols-5 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Current Area Display */}
          <div className="text-center">
            <div className="text-lg sm:text-xl font-dm font-bold text-grade-purple mb-2">
              Current Area: {placedSquares.size} cm²
            </div>
            <div className="text-sm text-grade-black/70">
              Target: 10 cm²
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            className="bg-grade-orange text-white px-6 py-3 rounded-[12px] font-dm font-bold text-base hover:scale-105 transition-transform touch-target"
          >
            Check Area
          </button>

          {/* Feedback */}
          {feedback && (
            <div className="text-center">
              <div className="text-lg sm:text-xl font-dm font-bold text-grade-black">
                {feedback}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaBuildingExercise;
