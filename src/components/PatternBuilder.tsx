
import React, { useState } from 'react';

interface PatternBuilderProps {
  onComplete: (score: number) => void;
}

interface PatternChallenge {
  id: number;
  type: 'shape' | 'color' | 'both';
  pattern: string[];
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const challenges: PatternChallenge[] = [
  {
    id: 1,
    type: 'shape',
    pattern: ['◼︎', '◼︎', '◻︎', '◼︎', '◼︎', '◻︎', '?'],
    options: ['◼︎', '◻︎', '◇'],
    correctAnswer: '◼︎',
    explanation: 'Two black, one white pattern!'
  },
  {
    id: 2,
    type: 'color',
    pattern: ['🔴', '🟠', '🟡', '🔴', '🟠', '?'],
    options: ['🟡', '🟢', '🔵'],
    correctAnswer: '🟡',
    explanation: 'Red, orange, yellow repeating!'
  },
  {
    id: 3,
    type: 'both',
    pattern: ['🔴▲', '🟠▲', '🟡◼︎', '🔴▲', '🟠▲', '?'],
    options: ['🟡◼︎', '🔵◼︎', '🟢▲'],
    correctAnswer: '🟡◼︎',
    explanation: 'Color and shape pattern!'
  }
];

const PatternBuilder: React.FC<PatternBuilderProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const challenge = challenges[currentChallenge];

  const handleDragStart = (e: React.DragEvent, item: string) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    handleAnswer(draggedItem);
    setDraggedItem(null);
  };

  const handleAnswer = (answer: string) => {
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

  const renderPattern = () => {
    return (
      <div className="flex justify-center items-center gap-3 mb-6">
        {challenge.pattern.map((item, index) => (
          <div
            key={index}
            className={`w-16 h-16 rounded-[10px] flex items-center justify-center text-2xl font-bold border-4 ${
              item === '?' 
                ? 'border-dashed border-grade-orange bg-orange-50' 
                : 'border-grade-border-gray bg-white'
            }`}
            onDragOver={item === '?' ? handleDragOver : undefined}
            onDrop={item === '?' ? handleDrop : undefined}
          >
            {item === '?' ? (
              selectedAnswer ? (
                <span className={showFeedback ? (isCorrect ? 'animate-pulse' : 'animate-shake') : ''}>
                  {selectedAnswer}
                </span>
              ) : (
                <span className="text-grade-orange animate-bounce">?</span>
              )
            ) : (
              item
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-orange flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧩 Pattern Builder
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            Drag the missing piece to complete the pattern!
          </h3>
          
          {renderPattern()}
          
          <div className="flex justify-center gap-4">
            {challenge.options.map((option, index) => (
              <div
                key={index}
                className={`w-16 h-16 rounded-[10px] flex items-center justify-center text-2xl font-bold border-4 cursor-move hover:scale-105 transition-all duration-200 ${
                  selectedAnswer === option
                    ? isCorrect
                      ? 'bg-green-500 border-green-600 text-white'
                      : 'bg-red-500 border-red-600 text-white'
                    : 'bg-white border-grade-orange hover:border-grade-purple'
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, option)}
                onClick={() => !showFeedback && handleAnswer(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? `✅ Pattern Complete! ${challenge.explanation}` : '❌ Try again! Look for the pattern!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PatternBuilder;
