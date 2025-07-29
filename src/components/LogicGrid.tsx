
import React, { useState } from 'react';

interface LogicGridProps {
  onComplete: (score: number) => void;
}

interface GridChallenge {
  id: number;
  clues: string[];
  items: string[];
  categories: string[];
  solution: { [key: string]: string };
}

const challenges: GridChallenge[] = [
  {
    id: 1,
    clues: ['🐕 doesn\'t like 🍎', '🐱 likes 🍌'],
    items: ['🐕', '🐱', '🐰'],
    categories: ['🍎', '🍌', '🥕'],
    solution: { '🐕': '🥕', '🐱': '🍌', '🐰': '🍎' }
  },
  {
    id: 2,
    clues: ['🚗 isn\'t 🔴', '🚲 is 🟡'],
    items: ['🚗', '🚲', '🚌'],
    categories: ['🔴', '🟡', '🔵'],
    solution: { '🚗': '🔵', '🚲': '🟡', '🚌': '🔴' }
  },
  {
    id: 3,
    clues: ['👦 plays ⚽', '👧 doesn\'t play 🏀'],
    items: ['👦', '👧', '👶'],
    categories: ['⚽', '🏀', '🎾'],
    solution: { '👦': '⚽', '👧': '🎾', '👶': '🏀' }
  }
];

const LogicGrid: React.FC<LogicGridProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<{ [key: string]: string }>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleCellClick = (item: string, category: string) => {
    if (showFeedback) return;
    
    setGrid(prev => {
      const newGrid = { ...prev };
      // Clear previous assignment for this item
      Object.keys(newGrid).forEach(key => {
        if (newGrid[key] === item) delete newGrid[key];
      });
      // Set new assignment
      newGrid[category] = item;
      return newGrid;
    });
  };

  const checkSolution = () => {
    const isComplete = challenge.categories.every(cat => grid[cat]);
    if (!isComplete) return;

    const correct = challenge.categories.every(cat => 
      grid[cat] === challenge.solution[grid[cat]]
    );
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setGrid({});
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderGrid = () => {
    return (
      <div className="inline-block bg-white rounded-[15px] p-4 border-2 border-grade-border-gray">
        <div className="grid grid-cols-4 gap-2">
          {/* Header */}
          <div className="w-12 h-12"></div>
          {challenge.categories.map((cat, index) => (
            <div key={index} className="w-12 h-12 flex items-center justify-center text-2xl">
              {cat}
            </div>
          ))}
          
          {/* Rows */}
          {challenge.items.map((item, rowIndex) => (
            <React.Fragment key={rowIndex}>
              <div className="w-12 h-12 flex items-center justify-center text-2xl">
                {item}
              </div>
              {challenge.categories.map((cat, colIndex) => (
                <button
                  key={colIndex}
                  onClick={() => handleCellClick(item, cat)}
                  className={`w-12 h-12 border-2 rounded-[8px] flex items-center justify-center text-xl font-bold hover:scale-105 transition-all duration-200 ${
                    grid[cat] === item
                      ? 'bg-grade-blue text-white border-grade-blue'
                      : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {grid[cat] === item ? '✓' : ''}
                </button>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-purple flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧩 Logic Grid
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-4">
            Use the clues to match items correctly!
          </h3>
          
          <div className="mb-6">
            {challenge.clues.map((clue, index) => (
              <div key={index} className="bg-blue-50 p-3 rounded-[10px] mb-2 font-dm text-lg">
                {clue}
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mb-6">
            {renderGrid()}
          </div>
          
          <button
            onClick={checkSolution}
            className="bg-grade-purple text-white px-6 py-3 rounded-[15px] font-dm font-bold text-lg hover:scale-105 transition-transform"
            disabled={showFeedback || !challenge.categories.every(cat => grid[cat])}
          >
            Check Solution
          </button>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Perfect logic! Grid solved!' : '❌ Check the clues again!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default LogicGrid;
