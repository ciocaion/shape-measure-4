
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
            className={`w-10 h-10 border border-grade-border-gray ${
              isShape 
                ? 'bg-grade-blue text-white font-bold text-sm flex items-center justify-center' 
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
            className={`w-10 h-10 border border-grade-border-gray ${
              isShape 
                ? 'bg-grade-orange text-white font-bold text-sm flex items-center justify-center' 
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
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-2 border-grade-black max-w-5xl w-full">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-4 text-center">
          Exercise 4: Compare Two Shapes
        </h2>
        
        <p className="text-grade-black font-dm text-lg mb-6 text-center">
          Do these shapes have the same area or the same perimeter?
        </p>

        <div className="flex flex-col items-center space-y-6">
          {/* Two Shapes Side by Side */}
          <div className="flex gap-8 justify-center">
            {/* Shape 1 */}
            <div className="text-center">
              <h3 className="font-dm font-bold text-lg text-grade-black mb-2">Shape 1</h3>
              <div className="grid grid-cols-4 gap-1 p-3 bg-grade-input-gray rounded-[15px] border-2 border-grade-border-gray">
                {renderShape1()}
              </div>
              {showProof && (
                <div className="mt-2 text-sm font-dm font-bold text-grade-blue">
                  Area: 12 squares
                </div>
              )}
            </div>

            {/* Shape 2 */}
            <div className="text-center">
              <h3 className="font-dm font-bold text-lg text-grade-black mb-2">Shape 2</h3>
              <div className="grid grid-cols-5 gap-1 p-3 bg-grade-input-gray rounded-[15px] border-2 border-grade-border-gray">
                {renderShape2()}
              </div>
              {showProof && (
                <div className="mt-2 text-sm font-dm font-bold text-grade-orange">
                  Area: 12 squares
                </div>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="flex gap-4">
            {[
              { key: 'area', label: '🟦 Same Area', color: 'bg-grade-blue' },
              { key: 'perimeter', label: '🟨 Same Perimeter', color: 'bg-grade-orange' },
              { key: 'both', label: '🟩 Both Same', color: 'bg-green-500' },
              { key: 'neither', label: '❌ Neither', color: 'bg-red-500' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => handleAnswerSelect(option.key)}
                className={`px-4 py-3 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 ${
                  selectedAnswer === option.key
                    ? `${option.color} text-white`
                    : 'bg-white border-2 border-grade-purple text-grade-purple hover:bg-grade-purple/10'
                }`}
              >
                {option.label}
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
              {selectedAnswer === 'area' ? (
                <div className="text-2xl font-dm font-bold text-green-600">
                  ✅ Correct! Both shapes have the same area!
                </div>
              ) : (
                <div className="text-2xl font-dm font-bold text-red-600">
                  ❌ Try again! Look at how many squares each shape contains.
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
