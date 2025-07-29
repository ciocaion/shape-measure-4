
import React, { useState } from 'react';

interface MathReasoningProps {
  onComplete: (score: number) => void;
}

interface MathChallenge {
  id: number;
  equation: string;
  num1: number;
  num2: number;
  result: number;
  operations: string[];
  correctOperation: string;
}

const challenges: MathChallenge[] = [
  {
    id: 1,
    equation: '5 ? 3 = 15',
    num1: 5,
    num2: 3,
    result: 15,
    operations: ['×', '+', '÷'],
    correctOperation: '×'
  },
  {
    id: 2,
    equation: '9 ? 2 = 7',
    num1: 9,
    num2: 2,
    result: 7,
    operations: ['×', '-', '+'],
    correctOperation: '-'
  },
  {
    id: 3,
    equation: '12 ? 4 = 3',
    num1: 12,
    num2: 4,
    result: 3,
    operations: ['÷', '+', '×'],
    correctOperation: '÷'
  }
];

const MathReasoning: React.FC<MathReasoningProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleOperationClick = (operation: string) => {
    if (showFeedback) return;
    
    setSelectedOperation(operation);
    const correct = operation === challenge.correctOperation;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedOperation(null);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderEquation = () => {
    return (
      <div className="flex justify-center items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 border-grade-border-gray bg-white">
          {challenge.num1}
        </div>
        
        <div className="w-16 h-16 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 border-dashed border-grade-orange bg-orange-50">
          {selectedOperation ? (
            <span className={showFeedback ? (isCorrect ? 'animate-pulse' : 'animate-shake') : ''}>
              {selectedOperation}
            </span>
          ) : (
            <span className="text-grade-orange animate-bounce">?</span>
          )}
        </div>
        
        <div className="w-16 h-16 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 border-grade-border-gray bg-white">
          {challenge.num2}
        </div>
        
        <div className="text-grade-black text-2xl font-bold">=</div>
        
        <div className="w-16 h-16 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 border-grade-border-gray bg-white">
          {challenge.result}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-orange flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧮 Math Reasoning
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            Find the missing operation!
          </h3>
          
          {renderEquation()}
          
          <div className="flex justify-center gap-4">
            {challenge.operations.map((operation, index) => (
              <button
                key={index}
                onClick={() => handleOperationClick(operation)}
                className={`w-16 h-16 rounded-[15px] flex items-center justify-center text-3xl font-bold border-4 cursor-pointer hover:scale-105 transition-all duration-200 ${
                  selectedOperation === operation
                    ? isCorrect
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-red-500 border-red-600 text-white'
                    : 'bg-white border-grade-orange hover:border-grade-purple'
                }`}
                disabled={showFeedback}
              >
                {operation}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? `✅ Perfect! ${challenge.num1} ${challenge.correctOperation} ${challenge.num2} = ${challenge.result}` : '❌ Try another operation!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MathReasoning;
