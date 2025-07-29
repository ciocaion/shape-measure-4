
import React, { useState } from 'react';

interface NumberSequenceLogicProps {
  onComplete: (score: number) => void;
}

interface SequenceChallenge {
  id: number;
  sequence: (number | string)[];
  options: number[];
  correctAnswer: number;
  rule: string;
}

const challenges: SequenceChallenge[] = [
  {
    id: 1,
    sequence: [2, 4, 6, '?'],
    options: [7, 8, 10],
    correctAnswer: 8,
    rule: '+2 Rule'
  },
  {
    id: 2,
    sequence: [5, 10, '?', 20],
    options: [12, 15, 18],
    correctAnswer: 15,
    rule: '+5 Rule'
  },
  {
    id: 3,
    sequence: [81, 27, 9, '?'],
    options: [3, 6, 9],
    correctAnswer: 3,
    rule: '÷3 Rule'
  }
];

const NumberSequenceLogic: React.FC<NumberSequenceLogicProps> = ({ onComplete }) => {
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

  const renderSequence = () => {
    return (
      <div className="flex justify-center items-center gap-4 mb-8">
        {challenge.sequence.map((item, index) => (
          <React.Fragment key={index}>
            <div
              className={`w-20 h-20 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 ${
                item === '?' 
                  ? 'border-dashed border-grade-blue bg-blue-50' 
                  : 'border-grade-border-gray bg-white'
              }`}
            >
              {item === '?' ? (
                selectedAnswer ? (
                  <span className={showFeedback ? (isCorrect ? 'animate-pulse text-green-600' : 'animate-shake text-red-600') : ''}>
                    {selectedAnswer}
                  </span>
                ) : (
                  <span className="text-grade-blue animate-bounce">?</span>
                )
              ) : (
                <span className="text-grade-black">{item}</span>
              )}
            </div>
            {index < challenge.sequence.length - 1 && (
              <div className="text-grade-black/50 text-xl">→</div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-blue flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🔢 Number Sequence Logic
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            Find the missing number in the sequence!
          </h3>
          
          {renderSequence()}
          
          <div className="flex justify-center gap-4">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`w-20 h-20 rounded-[15px] flex items-center justify-center text-2xl font-bold border-4 cursor-pointer hover:scale-105 transition-all duration-200 ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-red-500 border-red-600 text-white'
                    : 'bg-white border-grade-blue hover:border-grade-purple'
                }`}
                disabled={showFeedback}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? `✅ Perfect! You found the ${challenge.rule}!` : '❌ Try again! Look for the pattern!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default NumberSequenceLogic;
