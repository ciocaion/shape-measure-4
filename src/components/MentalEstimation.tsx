
import React, { useState } from 'react';

interface MentalEstimationProps {
  onComplete: (score: number) => void;
}

interface EstimationChallenge {
  id: number;
  question: string;
  options: number[];
  correctAnswer: number;
  explanation: string;
}

const challenges: EstimationChallenge[] = [
  {
    id: 1,
    question: 'Which is closest to 300?',
    options: [289, 156, 420],
    correctAnswer: 289,
    explanation: '289 is only 11 away from 300!'
  },
  {
    id: 2,
    question: 'Which sum is bigger: 47 + 38 or 52 + 29?',
    options: [85, 81, 90],
    correctAnswer: 85,
    explanation: '47 + 38 = 85, which is bigger than 52 + 29 = 81!'
  },
  {
    id: 3,
    question: 'Which equals 81?',
    options: [9 * 9, 8 * 10, 7 * 12],
    correctAnswer: 9 * 9,
    explanation: '9 × 9 = 81 exactly!'
  }
];

const MentalEstimation: React.FC<MentalEstimationProps> = ({ onComplete }) => {
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

  const renderOption = (option: number, index: number) => {
    const isSelected = selectedAnswer === option;
    
    return (
      <button
        key={index}
        onClick={() => handleAnswer(option)}
        className={`px-6 py-4 rounded-[15px] font-dm font-bold text-lg border-4 cursor-pointer hover:scale-105 transition-all duration-200 ${
          isSelected
            ? isCorrect
              ? 'bg-green-500 border-green-600 text-white animate-bounce'
              : 'bg-red-500 border-red-600 text-white animate-shake'
            : 'bg-white border-grade-purple hover:border-grade-orange'
        }`}
        disabled={showFeedback}
      >
        {typeof option === 'number' && option > 100 ? option : 
         challenge.id === 3 ? (
           index === 0 ? '9 × 9' : 
           index === 1 ? '8 × 10' : '7 × 12'
         ) : option}
      </button>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-purple flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          ⚡ Mental Estimation
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-8">
            {challenge.question}
          </h3>
          
          <div className="flex justify-center gap-4 mb-8">
            {challenge.options.map((option, index) => renderOption(option, index))}
          </div>
          
          <div className="text-grade-black/70 font-dm text-base">
            Think quickly! Use your mental math skills!
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? `✅ Lightning fast! ${challenge.explanation}` : '❌ Keep practicing mental math!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentalEstimation;
