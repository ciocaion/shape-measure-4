
import React, { useState } from 'react';

interface PerimeterBuildingExerciseProps {
  onComplete: (score: number) => void;
}

const PerimeterBuildingExercise: React.FC<PerimeterBuildingExerciseProps> = ({ onComplete }) => {
  const [placedSquares, setPlacedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<string>('');

  const calculatePerimeter = (squares: Set<string>) => {
    if (squares.size === 0) return 0;
    
    let perimeter = 0;
    squares.forEach(square => {
      const [col, row] = square.split(',').map(Number);
      
      // Check each side of the square
      const sides = [
        [col, row - 1], // top
        [col, row + 1], // bottom
        [col - 1, row], // left
        [col + 1, row]  // right
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
      setFeedback('✅ Perfect! Perimeter = 14 units!');
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    } else if (currentPerimeter < 14) {
      setFeedback(`❌ Too small! You have ${currentPerimeter} units. Need ${14 - currentPerimeter} more.`);
      setTimeout(() => {
        setHasSubmitted(false);
        setFeedback('');
      }, 2500);
    } else {
      setFeedback(`❌ Too big! You have ${currentPerimeter} units. Remove ${currentPerimeter - 14} units.`);
      setTimeout(() => {
        setHasSubmitted(false);
        setFeedback('');
      }, 2500);
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
        <h2 className="font-space font-bold text-lg sm:text-xl text-grade-black mb-3 text-center">
          Exercise 5: Build with Perimeter = 14 units
        </h2>
        
        <p className="text-grade-black font-dm text-base mb-4 text-center">
          Create any connected shape with exactly 14 units of perimeter!
        </p>

        <div className="flex flex-col items-center compact-spacing">
          {/* Grid */}
          <div className="grid grid-cols-6 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Current Perimeter Display */}
          <div className="text-center">
            <div className="text-lg sm:text-xl font-dm font-bold text-grade-purple mb-2">
              Current Perimeter: {calculatePerimeter(placedSquares)} units
            </div>
            <div className="text-sm text-grade-black/70">
              Target: 14 units
            </div>
          </div>

          {/* Check Button */}
          <button
            onClick={handleCheck}
            className="bg-grade-orange text-white px-6 py-3 rounded-[12px] font-dm font-bold text-base hover:scale-105 transition-transform touch-target"
          >
            Check Perimeter
          </button>

          {/* Feedback */}
          {feedback && (
            <div className="text-center">
              <div className="text-lg sm:text-xl font-dm font-bold text-grade-black">
                {feedback}
              </div>
            </div>
          )}

          {/* Help hint */}
          <div className="text-center max-w-md">
            <div className="text-xs text-grade-black/60 bg-grade-input-gray p-2 rounded-[10px]">
              💡 Tip: Perimeter = outer edge length. Try different shapes!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerimeterBuildingExercise;
