import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SuccessAnimation from '../components/SuccessAnimation';
import AreaCountingExercise from '../components/AreaCountingExercise';
import AreaBuildingExercise from '../components/AreaBuildingExercise';
import PerimeterTracingExercise from '../components/PerimeterTracingExercise';
import ComparisonExercise from '../components/ComparisonExercise';
import PerimeterBuildingExercise from '../components/PerimeterBuildingExercise';

type Exercise = 1 | 2 | 3 | 4 | 5;

interface GameState {
  currentExercise: Exercise;
  exercise1: {
    completed: boolean;
    score: number;
  };
  exercise2: {
    completed: boolean;
    score: number;
  };
  exercise3: {
    completed: boolean;
    score: number;
  };
  exercise4: {
    completed: boolean;
    score: number;
  };
  exercise5: {
    completed: boolean;
    score: number;
  };
  showSuccess: boolean;
}

const Index = () => {
  const { t } = useTranslation();
  const [gameState, setGameState] = useState<GameState>({
    currentExercise: 1,
    exercise1: { completed: false, score: 0 },
    exercise2: { completed: false, score: 0 },
    exercise3: { completed: false, score: 0 },
    exercise4: { completed: false, score: 0 },
    exercise5: { completed: false, score: 0 },
    showSuccess: false
  });

  useEffect(() => {
    // Send initial welcome message
    window.parent.postMessage({
      type: 'tutorMessage',
      messageType: 'instruction',
      content: t('instructions.welcome'),
      data: {}
    }, '*');
  }, [t]);

  const handleExerciseComplete = useCallback((exercise: Exercise, score: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      newState[`exercise${exercise}`].completed = true;
      newState[`exercise${exercise}`].score = score;
      newState.showSuccess = true;

      // Send completion message
      if (exercise === 5) {
        const totalScore = newState.exercise1.score + newState.exercise2.score + 
                          newState.exercise3.score + newState.exercise4.score + 
                          newState.exercise5.score;
        window.parent.postMessage({
          type: 'tutorMessage',
          messageType: 'success',
          content: t('instructions.completion'),
          data: { totalScore }
        }, '*');
      }

      return newState;
    });

    // Auto-advance to next exercise after celebration
    if (exercise < 5) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentExercise: (exercise + 1) as Exercise,
          showSuccess: false
        }));
      }, 2500);
    }
  }, [t]);

  const renderCompletionScreen = () => (
    <div className="flex-1 flex items-center justify-center p-2">
      <div className="bg-grade-soft-white rounded-[15px] p-4 border-3 border-grade-purple max-w-sm w-full text-center">
        <button
          onClick={() => setGameState(prev => ({ ...prev, currentExercise: 1, showSuccess: false }))}
          className="bg-grade-orange text-white px-4 py-2 rounded-[12px] font-dm font-bold text-base hover:scale-105 transition-transform touch-target"
        >
          🔄
        </button>
      </div>
    </div>
  );

  const renderCurrentExercise = () => {
    if (gameState.currentExercise === 1) {
      return <AreaCountingExercise onComplete={(score) => handleExerciseComplete(1, score)} />;
    }
    if (gameState.currentExercise === 2) {
      return <AreaBuildingExercise onComplete={(score) => handleExerciseComplete(2, score)} />;
    }
    if (gameState.currentExercise === 3) {
      return <PerimeterTracingExercise onComplete={(score) => handleExerciseComplete(3, score)} />;
    }
    if (gameState.currentExercise === 4) {
      return <ComparisonExercise onComplete={(score) => handleExerciseComplete(4, score)} />;
    }
    if (gameState.currentExercise === 5) {
      return <PerimeterBuildingExercise onComplete={(score) => handleExerciseComplete(5, score)} />;
    }
    
    return renderCompletionScreen();
  };

  const allCompleted = gameState.exercise1.completed && gameState.exercise2.completed && 
                      gameState.exercise3.completed && gameState.exercise4.completed && 
                      gameState.exercise5.completed;

  return (
    <div className="h-screen bg-gradient-to-br from-grade-soft-white via-purple-50 to-blue-50 font-dm overflow-hidden">
      <div className="max-w-5xl mx-auto h-full flex flex-col p-2 sm:p-3">
        {/* Progress indicator */}
        <div className="flex justify-center mb-3">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((exercise) => (
              <div
                key={exercise}
                className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all duration-300 ${
                  exercise <= gameState.currentExercise 
                    ? 'bg-grade-purple text-white' 
                    : 'bg-grade-border-gray text-grade-black/50'
                }`}
              >
                {exercise}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-auto">
          {allCompleted && !gameState.showSuccess ? renderCompletionScreen() : renderCurrentExercise()}
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