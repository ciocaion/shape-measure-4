
import React, { useState, useCallback } from 'react';
import RobotHelper from '../components/RobotHelper';
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
  robotMessage: string;
  isRobotExcited: boolean;
}

const Index = () => {
  const [gameState, setGameState] = useState<GameState>({
    currentExercise: 1,
    exercise1: { completed: false, score: 0 },
    exercise2: { completed: false, score: 0 },
    exercise3: { completed: false, score: 0 },
    exercise4: { completed: false, score: 0 },
    exercise5: { completed: false, score: 0 },
    showSuccess: false,
    robotMessage: "Welcome to Shape Lab! Let's discover area and perimeter through hands-on building! 🏗️",
    isRobotExcited: false
  });

  const handleExerciseComplete = useCallback((exercise: Exercise, score: number) => {
    setGameState(prev => {
      const newState = { ...prev };
      newState[`exercise${exercise}`].completed = true;
      newState[`exercise${exercise}`].score = score;
      newState.showSuccess = true;
      newState.isRobotExcited = true;

      // Set appropriate message
      if (exercise === 5) {
        newState.robotMessage = "🎉 Amazing! You've mastered area and perimeter! You're a Shape Lab expert! 🏆";
      } else {
        const nextMessages = [
          "Great counting! Now let's build a shape with a specific area! 🔨",
          "Excellent building! Time to trace the perimeter! 🔍",
          "Perfect tracing! Can you compare two shapes? 🔍",
          "Awesome comparison! Final challenge - build with perimeter! 🏗️"
        ];
        newState.robotMessage = nextMessages[exercise - 1];
      }

      return newState;
    });

    // Auto-advance to next exercise after celebration
    if (exercise < 5) {
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentExercise: (exercise + 1) as Exercise,
          showSuccess: false,
          isRobotExcited: false
        }));
      }, 2500);
    }
  }, []);

  const renderCompletionScreen = () => (
    <div className="flex-1 flex items-center justify-center p-2">
      <div className="bg-grade-soft-white rounded-[15px] p-4 border-3 border-grade-purple max-w-sm w-full text-center">
        <h2 className="font-space font-bold text-lg sm:text-xl text-grade-black mb-3">
          🎉 Shape Lab Master! 🎉
        </h2>
        
        <div className="space-y-2 mb-4">
          <div className="bg-gradient-to-r from-grade-orange to-grade-purple text-white p-2 rounded-[12px] font-dm font-bold text-sm">
            📏 Area Expert
          </div>
          <div className="bg-gradient-to-r from-grade-blue to-grade-purple text-white p-2 rounded-[12px] font-dm font-bold text-sm">
            🔍 Perimeter Pro
          </div>
        </div>

        <div className="text-base font-dm font-bold text-grade-black mb-4">
          You've mastered measuring shapes! 🧠✨
        </div>

        <button
          onClick={() => setGameState(prev => ({ ...prev, currentExercise: 1, showSuccess: false }))}
          className="bg-grade-orange text-white px-4 py-2 rounded-[12px] font-dm font-bold text-base hover:scale-105 transition-transform touch-target"
        >
          🔄 Practice Again
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
    
    // All exercises completed
    return renderCompletionScreen();
  };

  const allCompleted = gameState.exercise1.completed && gameState.exercise2.completed && 
                      gameState.exercise3.completed && gameState.exercise4.completed && 
                      gameState.exercise5.completed;

  return (
    <div className="h-screen bg-gradient-to-br from-grade-soft-white via-purple-50 to-blue-50 font-dm overflow-hidden">
      <div className="max-w-5xl mx-auto h-full flex flex-col p-2 sm:p-3">
        <div className="text-center mb-3">
          <h1 className="font-space font-bold text-xl sm:text-2xl text-grade-black mb-1">
            📐 Shape Lab: Measure & Master!
          </h1>
          <p className="text-grade-black/70 font-dm text-base">Learn area & perimeter through discovery!</p>
        </div>

        <div className="mb-3">
          <RobotHelper message={gameState.robotMessage} isExcited={gameState.isRobotExcited} />
        </div>

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
