
import React, { useState } from 'react';

interface AreaCountingExerciseProps {
  onComplete: (score: number) => void;
}

const AreaCountingExercise: React.FC<AreaCountingExerciseProps> = ({ onComplete }) => {
  const [clickedSquares, setClickedSquares] = useState<Set<string>>(new Set());
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  // 4x3 rectangle shape
  const shapeSquares = [
    '1,1', '2,1', '3,1', '4,1',
    '1,2', '2,2', '3,2', '4,2',
    '1,3', '2,3', '3,3', '4,3'
  ];

  const handleSquareClick = (squareId: string) => {
    if (hasSubmitted) return;
    
    const newClickedSquares = new Set(clickedSquares);
    if (newClickedSquares.has(squareId)) {
      newClickedSquares.delete(squareId);
    } else {
      newClickedSquares.add(squareId);
    }
    setClickedSquares(newClickedSquares);
  };

  const handleAnswerSelect = (answer: number) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setHasSubmitted(true);
    
    if (selectedAnswer === 12) {
      setTimeout(() => {
        onComplete(100);
      }, 1500);
    } else {
      setTimeout(() => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
        setClickedSquares(new Set());
      }, 2000);
    }
  };

  const renderGrid = () => {
    const grid = [];
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 6; col++) {
        const squareId = `${col},${row}`;
        const isShape = shapeSquares.includes(squareId);
        const isClicked = clickedSquares.has(squareId);
        
        grid.push(
          <div
            key={squareId}
            className={`w-8 h-8 sm:w-10 sm:h-10 border border-grade-border-gray cursor-pointer transition-all duration-200 ${
              isShape 
                ? isClicked 
                  ? 'bg-grade-purple text-white font-bold text-sm flex items-center justify-center' 
                  : 'bg-grade-orange/30 hover:bg-grade-orange/50'
                : 'bg-grade-input-gray'
            }`}
            onClick={() => isShape && handleSquareClick(squareId)}
          >
            {isShape && isClicked && clickedSquares.has(squareId) && 
              Array.from(clickedSquares).indexOf(squareId) + 1
            }
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
          Exercise 1: What's the Area?
        </h2>
        
        <p className="text-grade-black font-dm text-base mb-4 text-center">
          How many squares fit inside this orange shape? Click each square to count!
        </p>

        <div className="flex flex-col items-center space-y-4">
          {/* Grid */}
          <div className="grid grid-cols-6 gap-0.5 p-3 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
            {renderGrid()}
          </div>

          {/* Count Display */}
          <div className="text-center">
            <div className="text-lg sm:text-xl font-dm font-bold text-grade-purple mb-2">
              Counted: {clickedSquares.size} squares
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex gap-2 sm:gap-3">
            {[9, 10, 12].map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                className={`px-4 py-2 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
                  selectedAnswer === option
                    ? 'bg-grade-purple text-white'
                    : 'bg-white border-3 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
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
              {selectedAnswer === 12 ? (
                <div className="text-lg sm:text-xl font-dm font-bold text-green-600">
                  ✅ Correct! 12 squares = 12 cm²!
                </div>
              ) : (
                <div className="text-lg sm:text-xl font-dm font-bold text-red-600">
                  ❌ Try again! Count each square carefully.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AreaCountingExercise;
