
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
            className={`w-12 h-12 border-2 border-grade-border-gray cursor-pointer transition-all duration-200 ${
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

  const currentPerimeter = calculatePerimeter(placedSquares);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-2 border-grade-black max-w-4xl w-full">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-4 text-center">
          Exercise 5: Build a Shape with Perimeter = 14
        </h2>
        
        <p className="text-grade-black font-dm text-lg mb-6 text-center">
          Click squares to build any shape with a perimeter of exactly 14 units!
        </p>

        <div className="flex flex-col items-center space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-6 gap-1 p-4 bg-grade-input-gray rounded-[15px] border-2 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Perimeter Counter */}
          <div className="text-center">
            <div className="text-3xl font-dm font-bold text-grade-purple mb-2">
              Current Perimeter: {currentPerimeter} units
            </div>
            <div className="text-lg font-dm text-grade-black">
              Target: 14 units
            </div>
          </div>

          {/* Hint */}
          <div className="text-center bg-grade-input-gray p-3 rounded-[15px] max-w-md">
            <div className="text-sm font-dm text-grade-black">
              💡 Tip: Perimeter is the distance around the outside of your shape!
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

export default PerimeterBuildingExercise;
