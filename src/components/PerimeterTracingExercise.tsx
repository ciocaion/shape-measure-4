
import React, { useState } from 'react';

interface PerimeterTracingExerciseProps {
  onComplete: (score: number) => void;
}

const PerimeterTracingExercise: React.FC<PerimeterTracingExerciseProps> = ({ onComplete }) => {
  const [tracedSquares, setTracedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // 3x2 rectangle shape
  const shapeSquares = [
    '2,2', '3,2', '4,2',
    '2,3', '3,3', '4,3'
  ];

  // Perimeter squares (border)
  const perimeterSquares = [
    '2,2', '3,2', '4,2', // top row
    '2,3', '4,3',        // sides
    '2,3', '3,3', '4,3'  // bottom row
  ];

  const correctPerimeter = 10;

  const handleSquareClick = (squareId: string) => {
    if (hasSubmitted) return;
    
    const newTracedSquares = new Set(tracedSquares);
    if (newTracedSquares.has(squareId)) {
      newTracedSquares.delete(squareId);
    } else {
      newTracedSquares.add(squareId);
    }
    setTracedSquares(newTracedSquares);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setHasSubmitted(true);
    
    if (selectedAnswer === correctPerimeter) {
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    } else {
      setTimeout(() => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
        setTracedSquares(new Set());
      }, 2500);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 6; col++) {
        const squareId = `${col},${row}`;
        const isShape = shapeSquares.includes(squareId);
        const isTraced = tracedSquares.has(squareId);
        const isPerimeter = isShape && (
          col === 2 || col === 4 || row === 2 || row === 3
        );
        
        grid.push(
          <div
            key={squareId}
            className={`w-8 h-8 sm:w-10 sm:h-10 border border-grade-border-gray cursor-pointer transition-all duration-200 relative ${
              isShape 
                ? isTraced 
                  ? 'bg-grade-orange text-white font-bold text-xs flex items-center justify-center' 
                  : 'bg-grade-blue/30 hover:bg-grade-blue/50'
                : 'bg-grade-input-gray'
            }`}
            onClick={() => isShape && handleSquareClick(squareId)}
          >
            {isShape && isTraced && tracedSquares.has(squareId) && 
              Array.from(tracedSquares).indexOf(squareId) + 1
            }
            {/* Visual indicator for perimeter edges */}
            {isShape && (
              <>
                {(row === 2) && <div className="absolute -top-0.5 left-0 right-0 h-0.5 bg-grade-orange"></div>}
                {(row === 3) && <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-grade-orange"></div>}
                {(col === 2) && <div className="absolute -left-0.5 top-0 bottom-0 w-0.5 bg-grade-orange"></div>}
                {(col === 4) && <div className="absolute -right-0.5 top-0 bottom-0 w-0.5 bg-grade-orange"></div>}
              </>
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2">
      <div className="bg-grade-soft-white rounded-[15px] p-4 border-3 border-grade-black max-w-3xl w-full">
        <h2 className="font-space font-bold text-lg sm:text-xl text-grade-black mb-3 text-center">
          Exercise 3: Trace the Perimeter
        </h2>
        
        <p className="text-grade-black font-dm text-base mb-4 text-center">
          Click the squares along the edge (perimeter) of the blue shape!
        </p>

        <div className="flex flex-col items-center compact-spacing">
          {/* Grid */}
          <div className="grid grid-cols-6 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Count Display */}
          <div className="text-center">
            <div className="text-lg sm:text-xl font-dm font-bold text-grade-purple mb-2">
              Traced: {tracedSquares.size} edge units
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex gap-2 sm:gap-3">
            {[8, 10, 12].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`px-4 py-2 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
                  selectedAnswer === option
                    ? 'bg-grade-purple text-white'
                    : 'bg-white border-3 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
                }`}
              >
                {option} units
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-6 py-3 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
              selectedAnswer !== null
                ? 'bg-grade-orange text-white hover:scale-105'
                : 'bg-grade-border-gray text-grade-black/50 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>

          {/* Feedback */}
          {hasSubmitted && (
            <div className="text-center">
              {selectedAnswer === correctPerimeter ? (
                <div className="text-lg sm:text-xl font-dm font-bold text-green-600">
                  ✅ Correct! Perimeter = {correctPerimeter} units!
                </div>
              ) : (
                <div className="text-lg sm:text-xl font-dm font-bold text-red-600">
                  ❌ Try again! Trace the edges carefully.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerimeterTracingExercise;
