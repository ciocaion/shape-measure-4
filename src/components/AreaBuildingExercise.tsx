
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
            className={`w-14 h-14 border-2 border-grade-border-gray cursor-pointer transition-all duration-200 ${
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
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-2 border-grade-black max-w-4xl w-full">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-4 text-center">
          Exercise 2: Build a Shape with Area = 10 cm²
        </h2>
        
        <p className="text-grade-black font-dm text-lg mb-6 text-center">
          Click squares to place blocks. Build any shape with exactly 10 squares!
        </p>

        <div className="flex flex-col items-center space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-5 gap-1 p-4 bg-grade-input-gray rounded-[15px] border-2 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Area Counter */}
          <div className="text-center">
            <div className="text-3xl font-dm font-bold text-grade-purple mb-2">
              Current Area: {placedSquares.size} cm²
            </div>
            <div className="text-lg font-dm text-grade-black">
              Target: 10 cm²
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            disabled={placedSquares.size === 0}
            className={`px-8 py-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 ${
              placedSquares.size > 0
                ? 'bg-grade-orange text-white hover:scale-105'
                : 'bg-grade-border-gray text-grade-black/50 cursor-not-allowed'
            }`}
          >
            Check My Shape
          </button>

          {/* Feedback */}
          {feedback && (
            <div className="text-center">
              <div className="text-2xl font-dm font-bold">
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
