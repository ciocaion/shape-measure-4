
import React, { useState, useEffect } from 'react';

interface FillTheTankProps {
  onComplete: (score: number) => void;
}

interface Challenge {
  id: number;
  type: 'basic' | 'partial' | 'combination';
  question: string;
  tankCapacity: number;
  currentAmount: number;
  bottleSize: number;
  options?: number[];
  correctAnswer: number;
}

const challenges: Challenge[] = [
  {
    id: 1,
    type: 'basic',
    question: 'How many bottles to fill the tank?',
    tankCapacity: 1000,
    currentAmount: 0,
    bottleSize: 250,
    options: [2, 3, 4],
    correctAnswer: 4
  },
  {
    id: 2,
    type: 'partial',
    question: 'How many more bottles to fill?',
    tankCapacity: 1000,
    currentAmount: 500,
    bottleSize: 250,
    options: [1, 2, 3],
    correctAnswer: 2
  },
  {
    id: 3,
    type: 'combination',
    question: 'Which combo fills 1500 mL?',
    tankCapacity: 1500,
    currentAmount: 0,
    bottleSize: 0,
    correctAnswer: 1
  }
];

const FillTheTank: React.FC<FillTheTankProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderTank = () => {
    const fillPercentage = (challenge.currentAmount / challenge.tankCapacity) * 100;
    
    return (
      <div className="relative w-48 h-64 mx-auto">
        {/* Tank container */}
        <div className="absolute inset-0 border-4 border-grade-blue rounded-b-[20px] bg-blue-50">
          {/* Tank label */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-grade-blue font-dm font-bold text-sm">
            {challenge.tankCapacity} mL
          </div>
          
          {/* Water fill */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-400 to-blue-300 rounded-b-[16px] transition-all duration-1000"
            style={{ height: `${fillPercentage}%` }}
          />
          
          {/* Current amount indicator */}
          {challenge.currentAmount > 0 && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 bg-white px-2 py-1 rounded-full text-xs font-bold">
              {challenge.currentAmount} mL
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderBottle = () => {
    if (challenge.bottleSize === 0) return null;
    
    return (
      <div className="flex justify-center mb-6">
        <div className="relative w-16 h-24 bg-gradient-to-b from-blue-200 to-blue-300 rounded-t-[8px] rounded-b-[12px] border-2 border-blue-400">
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded-full border-2 border-grade-blue font-dm font-bold text-xs">
            {challenge.bottleSize} mL
          </div>
        </div>
      </div>
    );
  };

  const renderCombinationOptions = () => {
    if (challenge.type !== 'combination') return null;
    
    const options = [
      { label: '1L + 500mL', value: 1 },
      { label: '2L + 500mL', value: 2 },
      { label: '1L + 1L', value: 3 }
    ];
    
    return (
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(option.value)}
            className={`px-6 py-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${
              selectedAnswer === option.value
                ? isCorrect
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-red-500 border-red-600 text-white'
                : 'bg-white border-grade-blue hover:scale-105'
            }`}
            disabled={showFeedback}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-8 border-l-[10px] border-grade-orange">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧃 Fill the Tank — L ↔ mL
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-6">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-8">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            {challenge.question}
          </h3>
          
          {renderTank()}
          {renderBottle()}
          
          {challenge.type === 'combination' ? renderCombinationOptions() : (
            <div className="flex justify-center gap-4">
              {challenge.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-16 h-16 rounded-full font-dm font-bold text-xl transition-all duration-200 border-4 ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-red-500 border-red-600 text-white'
                      : 'bg-white border-grade-orange hover:scale-105'
                  }`}
                  disabled={showFeedback}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Correct! Great job!' : '❌ Try again next time!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillTheTank;
