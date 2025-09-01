import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    // Send initial instruction and question
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: 'instruction',
      content: t('instructions.mental_math.instruction'),
      data: { 
        round: currentChallenge + 1, 
        total: challenges.length,
        question: challenge.question
      }
    }, '*');
  }, [currentChallenge, t, challenge.question]);

  const handleAnswer = (answer: number) => {
    setSelectedAnswer(answer);
    const correct = answer === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'success',
        content: t('instructions.mental_math.success', { explanation: challenge.explanation }),
        data: { 
          score: score + 1, 
          total: challenges.length,
          answer
        }
      }, '*');
    } else {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: t('instructions.mental_math.error'),
        data: { 
          score, 
          total: challenges.length,
          answer,
          correctAnswer: challenge.correctAnswer
        }
      }, '*');
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
        <div className="text-center mb-6">
          <div className="flex justify-center gap-4 mb-8">
            {challenge.options.map((option, index) => renderOption(option, index))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalEstimation;