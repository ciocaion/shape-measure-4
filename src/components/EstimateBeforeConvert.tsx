
import React, { useState } from 'react';

interface EstimateBeforeConvertProps {
  onComplete: (score: number) => void;
}

interface EstimateChallenge {
  id: number;
  question: string;
  visual: string;
  options: { value: number; unit: string; display: string }[];
  correctAnswer: number;
}

const challenges: EstimateChallenge[] = [
  {
    id: 1,
    question: 'How much liquid is in this glass?',
    visual: '🥤',
    options: [
      { value: 1, unit: 'L', display: '1 L' },
      { value: 500, unit: 'mL', display: '500 mL' },
      { value: 200, unit: 'mL', display: '200 mL' }
    ],
    correctAnswer: 200
  },
  {
    id: 2,
    question: 'How much does this backpack weigh?',
    visual: '🎒',
    options: [
      { value: 50, unit: 'g', display: '50 g' },
      { value: 2, unit: 'kg', display: '2 kg' },
      { value: 20, unit: 'kg', display: '20 kg' }
    ],
    correctAnswer: 2
  },
  {
    id: 3,
    question: 'How long is this pencil?',
    visual: '✏️',
    options: [
      { value: 5, unit: 'cm', display: '5 cm' },
      { value: 18, unit: 'cm', display: '18 cm' },
      { value: 50, unit: 'cm', display: '50 cm' }
    ],
    correctAnswer: 18
  }
];

const EstimateBeforeConvert: React.FC<EstimateBeforeConvertProps> = ({ onComplete }) => {
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

  return (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-8 border-l-[10px] border-grade-orange">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🎯 Estimate Before You Convert
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-6">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-8">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            {challenge.question}
          </h3>
          
          <div className="text-8xl mb-8">
            {challenge.visual}
          </div>
          
          <div className="flex justify-center gap-4">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option.value)}
                className={`px-6 py-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${
                  selectedAnswer === option.value
                    ? isCorrect
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-red-500 border-red-600 text-white'
                    : 'bg-white border-grade-orange hover:scale-105'
                }`}
                disabled={showFeedback}
              >
                {option.display}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Great estimate!' : '❌ Try again next time!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateBeforeConvert;
