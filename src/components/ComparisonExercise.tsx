
import React, { useState } from 'react';

interface ComparisonExerciseProps {
  onComplete: (score: number) => void;
}

const ComparisonExercise: React.FC<ComparisonExerciseProps> = ({ onComplete }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showProof, setShowProof] = useState(false);

  // Shape 1: 3x4 rectangle (area = 12)
  const shape1Squares = [
    '1,1', '2,1', '3,1',
    '1,2', '2,2', '3,2',
    '1,3', '2,3', '3,3',
    '1,4', '2,4', '3,4'
  ];

  // Shape 2: L-shape (area = 12)
  const shape2Squares = [
    '1,1', '2,1', '3,1', '4,1',
    '1,2', '2,2',
    '1,3', '2,3',
    '1,4', '2,4', '3,4', '4,4'
  ];

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setHasSubmitted(true);
    
    if (selectedAnswer === 'area') {
      setShowProof(true);
      setTimeout(() => {
        onComplete(100);
      }, 3000);
    } else {
      setTimeout(() => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  const renderShape1 = () => {
    const grid = [];
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 4; col++) {
        const squareId = `${col},${row}`;
        const isShape = shape1Squares.includes(squareId);
        
        grid.push(
          <div
            key={squareId}
            className={`w-6 h-6 sm:w-8 sm:h-8 border border-grade-border-gray ${
              isShape 
                ? 'bg-grade-blue text-white font-bold text-xs flex items-center justify-center' 
                : 'bg-grade-input-gray'
            }`}
          >
            {isShape && showProof && shape1Squares.indexOf(squareId) + 1}
          </div>
        );
      }
    }
    return grid;
  };

  const renderShape2 = () => {
    const grid = [];
    for (let row = 1; row <= 5; row++) {
      for (let col = 1; col <= 5; col++) {
        const squareId = `${col},${row}`;
        const isShape = shape2Squares.includes(squareId);
        
        grid.push(
          <div
            key={squareId}
            className={`w-6 h-6 sm:w-8 sm:h-8 border border-grade-border-gray ${
              isShape 
                ? 'bg-grade-orange text-white font-bold text-xs flex items-center justify-center' 
                : 'bg-grade-input-gray'
            }`}
          >
            {isShape && showProof && shape2Squares.indexOf(squareId) + 1}
          </div>
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2">
      <div className="bg-grade-soft-white rounded-[15px] p-4 border-3 border-grade-black max-w-4xl w-full">
        <h2 className="font-space font-bold text-lg sm:text-xl text-grade-black mb-3 text-center">
          Exercise 4: Compare the Shapes
        </h2>
        
        <p className="text-grade-black font-dm text-base mb-4 text-center">
          Which property is the same for both shapes?
        </p>

        <div className="flex flex-col items-center compact-spacing">
          {/* Shapes Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
            {/* Shape 1 */}
            <div className="text-center">
              <h3 className="font-dm font-bold text-base text-grade-black mb-2">Shape A</h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-4 gap-0.5 p-2 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
                  {renderShape1()}
                </div>
              </div>
            </div>

            {/* Shape 2 */}
            <div className="text-center">
              <h3 className="font-dm font-bold text-base text-grade-black mb-2">Shape B</h3>
              <div className="flex justify-center">
                <div className="grid grid-cols-5 gap-0.5 p-2 bg-grade-input-gray rounded-[12px] border-3 border-grade-border-gray">
                  {renderShape2()}
                </div>
              </div>
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full max-w-lg">
            <button
              onClick={() => handleAnswerSelect('area')}
              className={`px-4 py-2 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
                selectedAnswer === 'area'
                  ? 'bg-grade-purple text-white'
                  : 'bg-white border-3 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
              }`}
            >
              Same Area
            </button>
            <button
              onClick={() => handleAnswerSelect('perimeter')}
              className={`px-4 py-2 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
                selectedAnswer === 'perimeter'
                  ? 'bg-grade-purple text-white'
                  : 'bg-white border-3 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
              }`}
            >
              Same Perimeter
            </button>
            <button
              onClick={() => handleAnswerSelect('neither')}
              className={`px-4 py-2 rounded-[12px] font-dm font-bold text-base transition-all duration-200 touch-target ${
                selectedAnswer === 'neither'
                  ? 'bg-grade-purple text-white'
                  : 'bg-white border-3 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
              }`}
            >
              Nothing Same
            </button>
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
              {selectedAnswer === 'area' ? (
                <div className="text-lg sm:text-xl font-dm font-bold text-green-600">
                  ✅ Correct! Both shapes have the same area (12 squares)!
                  {showProof && (
                    <div className="text-sm text-grade-black mt-2">
                      Count the numbered squares to verify! 🔢
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-lg sm:text-xl font-dm font-bold text-red-600">
                  ❌ Try again! Think about area vs perimeter.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComparisonExercise;
