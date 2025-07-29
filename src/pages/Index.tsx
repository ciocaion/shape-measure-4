
import React, { useState, useCallback } from 'react';
import RobotHelper from '../components/RobotHelper';
import SuccessAnimation from '../components/SuccessAnimation';
import PatternBuilder from '../components/PatternBuilder';
import NumberSequenceLogic from '../components/NumberSequenceLogic';
import LogicGrid from '../components/LogicGrid';
import MathReasoning from '../components/MathReasoning';
import MentalEstimation from '../components/MentalEstimation';

type Level = 1 | 2 | 3 | 4 | 5;

interface GameState {
  currentLevel: Level;
  level1: {
    completed: boolean;
    score: number;
  };
  level2: {
    completed: boolean;
    score: number;
  };
  level3: {
    completed: boolean;
    score: number;
  };
  level4: {
    completed: boolean;
    score: number;
  };
  level5: {
    completed: boolean;
    score: number;
  };
  showSuccess: boolean;
  robotMessage: string;
  isRobotExcited: boolean;
  badgesEarned: string[];
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentLevel: 1,
    level1: { completed: false, score: 0 },
    level2: { completed: false, score: 0 },
    level3: { completed: false, score: 0 },
    level4: { completed: false, score: 0 },
    level5: { completed: false, score: 0 },
    showSuccess: false,
    robotMessage: "Welcome to Logic Lab! Let's build patterns and solve puzzles like a genius! 🧠",
    isRobotExcited: false,
    badgesEarned: []
  });

  const handleLevelComplete = useCallback((level: Level, score: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      newState[`level${level}`].completed = true;
      newState[`level${level}`].score = score;
      newState.showSuccess = true;
      newState.isRobotExcited = true;

      // Award badges based on level
      const badges = [...prev.badgesEarned];
      if (level === 1) badges.push('🟠 Pattern Pro');
      if (level === 2) badges.push('🔵 Number Ninja');
      if (level === 3) badges.push('🟢 Reasoning Rocket');
      if (level === 4) badges.push('🧮 Math Master');
      if (level === 5) badges.push('⚡ Quick Thinker');

      newState.badgesEarned = badges;

      // Set appropriate message
      if (level === 5) {
        newState.robotMessage = "🎉 Incredible! You're a certified Logic Genius! Your brain is amazing! 🧠✨";
      } else {
        const nextMessages = [
          "Excellent pattern work! Now let's solve number sequences! 🔢",
          "Amazing logic! Time for some grid puzzles! 🧩",
          "Perfect reasoning! Let's try math operations! 🧮",
          "Fantastic! Final challenge - quick thinking time! ⚡"
        ];
        newState.robotMessage = nextMessages[level - 1];
      }

      return newState;
    });

    // Auto-advance to next level after celebration
    if (level < 5) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentLevel: (level + 1) as Level,
          showSuccess: false,
          isRobotExcited: false
        }));
      }, 3000);
    }
  }, []);

  const renderCompletionScreen = () => (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-purple text-center">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-4">
          🎉 Logic Genius Certified! 🎉
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {gameState.badgesEarned.map((badge, index) => (
            <div key={index} className="bg-gradient-to-r from-grade-blue to-grade-purple text-white p-3 rounded-[15px] font-dm font-bold text-base">
              {badge}
            </div>
          ))}
        </div>

        <div className="text-xl font-space font-bold text-grade-black mb-4">
          Your brain is incredibly powerful! 🧠✨
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setGameState(prev => ({ ...prev, currentLevel: 1, showSuccess: false }))}
            className="bg-grade-orange text-white px-6 py-3 rounded-[15px] font-dm font-bold text-base hover:scale-105 transition-transform"
          >
            🔄 Challenge Again
          </button>
        </div>
      </div>
    </div>
  );

  const renderCurrentLevel = () => {
    if (gameState.currentLevel === 1) {
      return <PatternBuilder onComplete={(score) => handleLevelComplete(1, score)} />;
    }
    if (gameState.currentLevel === 2) {
      return <NumberSequenceLogic onComplete={(score) => handleLevelComplete(2, score)} />;
    }
    if (gameState.currentLevel === 3) {
      return <LogicGrid onComplete={(score) => handleLevelComplete(3, score)} />;
    }
    if (gameState.currentLevel === 4) {
      return <MathReasoning onComplete={(score) => handleLevelComplete(4, score)} />;
    }
    if (gameState.currentLevel === 5) {
      return <MentalEstimation onComplete={(score) => handleLevelComplete(5, score)} />;
    }
    
    // All levels completed
    return renderCompletionScreen();
  };

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-br from-grade-soft-white via-purple-50 to-blue-50 p-4 font-dm overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-3">
          <h1 className="font-space font-bold text-2xl text-grade-black mb-1">
            🧠 Logic Lab: Think Like a Genius!
          </h1>
          <p className="text-grade-black/70 font-dm text-base">Solve patterns, sequences, and puzzles!</p>
        </div>

        <div className="mb-3">
          <RobotHelper message={gameState.robotMessage} isExcited={gameState.isRobotExcited} />
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((level) => (
              <div
                key={level}
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  level <= gameState.currentLevel 
                    ? 'bg-grade-purple text-white' 
                    : 'bg-grade-border-gray text-grade-black/50'
                }`}
              >
                {level}
              </div>
            ))}
          </div>
        </div>

        {/* Badges earned */}
        {gameState.badgesEarned.length > 0 && (
          <div className="flex justify-center mb-3">
            <div className="flex gap-2 flex-wrap">
              {gameState.badgesEarned.map((badge, index) => (
                <div key={index} className="bg-white px-2 py-1 rounded-full text-sm font-dm font-bold border-2 border-grade-purple">
                  {badge}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden">
          {renderCurrentLevel()}
        </div>

        <SuccessAnimation 
          show={gameState.showSuccess} 
          onComplete={() => setGameState(prev => ({ ...prev, showSuccess: false }))}
        />
      </div>
    </div>
  );
};

export default Index;
