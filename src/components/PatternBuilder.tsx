import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const challenge = challenges[currentChallenge];

  useEffect(() => {
    // Send initial instruction
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: 'instruction',
      content: t('instructions.pattern.instruction'),
      data: { round: currentChallenge + 1, total: challenges.length }
    }, '*');
  }, [currentChallenge, t]);

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
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'success',
        content: t('instructions.pattern.success', { explanation: challenge.explanation }),
        data: { score: score + 1, total: challenges.length }
      }, '*');
    } else {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: t('instructions.pattern.error'),
        data: { score, total: challenges.length }
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
        <div className="text-center mb-6">
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
      </div>
    </div>
  );
};

export default PatternBuilder;