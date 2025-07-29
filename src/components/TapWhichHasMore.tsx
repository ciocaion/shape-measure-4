
import React, { useState } from 'react';

interface TapWhichHasMoreProps {
  onComplete: (score: number) => void;
}

interface BarChartData {
  label: string;
  value: number;
  color: string;
  icon: string;
}

const challenges = [
  {
    id: 1,
    question: "Tap the fruit with the most votes",
    data: [
      { label: 'Apples', value: 8, color: 'bg-red-500', icon: '🍎' },
      { label: 'Bananas', value: 5, color: 'bg-yellow-500', icon: '🍌' },
      { label: 'Cherries', value: 3, color: 'bg-red-600', icon: '🍒' }
    ],
    correctAnswer: 'Apples'
  },
  {
    id: 2,
    question: "Now tap the fruit with the fewest",
    data: [
      { label: 'Oranges', value: 6, color: 'bg-orange-500', icon: '🍊' },
      { label: 'Grapes', value: 2, color: 'bg-purple-500', icon: '🍇' },
      { label: 'Strawberries', value: 9, color: 'bg-red-400', icon: '🍓' }
    ],
    correctAnswer: 'Grapes'
  },
  {
    id: 3,
    question: "Are two bars equal? Tap them both!",
    data: [
      { label: 'Pizza', value: 7, color: 'bg-yellow-600', icon: '🍕' },
      { label: 'Burgers', value: 4, color: 'bg-orange-600', icon: '🍔' },
      { label: 'Tacos', value: 4, color: 'bg-green-600', icon: '🌮' }
    ],
    correctAnswer: ['Burgers', 'Tacos']
  }
];

const TapWhichHasMore: React.FC<TapWhichHasMoreProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedBars, setSelectedBars] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];
  const maxValue = Math.max(...challenge.data.map(d => d.value));

  const handleBarClick = (label: string) => {
    if (showFeedback) return;

    const isMultiSelect = Array.isArray(challenge.correctAnswer);
    
    if (isMultiSelect) {
      const newSelection = selectedBars.includes(label)
        ? selectedBars.filter(s => s !== label)
        : [...selectedBars, label];
      
      setSelectedBars(newSelection);
      
      if (newSelection.length === 2) {
        checkAnswer(newSelection);
      }
    } else {
      setSelectedBars([label]);
      checkAnswer([label]);
    }
  };

  const checkAnswer = (selection: string[]) => {
    const correct = Array.isArray(challenge.correctAnswer)
      ? challenge.correctAnswer.every(answer => selection.includes(answer)) && selection.length === challenge.correctAnswer.length
      : selection[0] === challenge.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedBars([]);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const getBarStyle = (bar: BarChartData) => {
    const isSelected = selectedBars.includes(bar.label);
    const height = (bar.value / maxValue) * 200;
    
    let className = `${bar.color} transition-all duration-300 cursor-pointer min-h-[44px] flex flex-col items-center justify-end text-white font-bold rounded-t-lg`;
    
    if (isSelected) {
      if (showFeedback) {
        className += isCorrect ? ' ring-4 ring-green-400 animate-pulse' : ' ring-4 ring-red-400 animate-shake';
      } else {
        className += ' ring-4 ring-grade-blue scale-98 glow';
      }
    } else {
      className += ' hover:scale-105';
    }
    
    return { className, height };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-blue flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          📊 Tap Which Has More
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-8">
            {challenge.question}
          </h3>
          
          <div className="flex justify-center items-end gap-8 mb-6" style={{ height: '280px' }}>
            {challenge.data.map((bar) => {
              const { className, height } = getBarStyle(bar);
              return (
                <div key={bar.label} className="flex flex-col items-center">
                  <div
                    className={className}
                    style={{ height: `${height}px`, width: '80px' }}
                    onClick={() => handleBarClick(bar.label)}
                  >
                    <div className="text-3xl mb-2">{bar.icon}</div>
                    <div className="font-bold text-lg">{bar.value}</div>
                  </div>
                  <div className="mt-2 font-dm font-bold text-grade-black text-center">
                    {bar.label}
                  </div>
                </div>
              );
            })}
          </div>
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

export default TapWhichHasMore;
