
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
            className={`w-12 h-12 border border-grade-border-gray cursor-pointer transition-all duration-200 relative ${
              isShape 
                ? isTraced 
                  ? 'bg-grade-orange text-white font-bold text-sm flex items-center justify-center' 
                  : 'bg-grade-blue/30 hover:bg-grade-blue/50'
                : 'bg-grade-input-gray'
            }`}
            onClick={() => isShape && handleSquareClick(squareId)}
          >
            {isShape && isTraced && (
              <div className="absolute inset-0 border-4 border-grade-orange rounded-sm" />
            )}
            {isShape && isPerimeter && (
              <div className="absolute inset-1 border-2 border-grade-purple/50 rounded-sm animate-pulse" />
            )}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-2 border-grade-black max-w-4xl w-full">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-4 text-center">
          Exercise 3: What's the Perimeter?
        </h2>
        
        <p className="text-grade-black font-dm text-lg mb-6 text-center">
          Click on the outer edge squares to trace the perimeter!
        </p>

        <div className="flex flex-col items-center space-y-6">
          {/* Grid */}
          <div className="grid grid-cols-6 gap-1 p-4 bg-grade-input-gray rounded-[15px] border-2 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Traced Count */}
          <div className="text-center">
            <div className="text-2xl font-dm font-bold text-grade-orange mb-2">
              You traced: {tracedSquares.size} units
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex gap-4">
            {[8, 10, 12].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`px-6 py-3 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 ${
                  selectedAnswer === option
                    ? 'bg-grade-purple text-white'
                    : 'bg-white border-2 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={selectedAnswer === null}
            className={`px-8 py-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 ${
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
                <div className="text-2xl font-dm font-bold text-green-600">
                  ✅ Perfect! Perimeter is 10 units!
                </div>
              ) : (
                <div className="text-2xl font-dm font-bold text-red-600">
                  ❌ Try again! Trace the outer edge carefully.
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
