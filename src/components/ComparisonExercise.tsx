import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './ui/button';

interface ComparisonExerciseProps {
  onComplete: (score: number) => void;
}

type Phase = 'tutorial' | 'exercise' | 'completion';

interface Question {
  id: number;
  shape1: { coords: [number, number][]; color: string; name: string };
  shape2: { coords: [number, number][]; color: string; name: string };
  correctAnswer: 'area' | 'perimeter' | 'nothing';
  area1: number;
  area2: number;
  perimeter1: number;
  perimeter2: number;
}

interface ClickedSquares {
  shape1: Set<string>;
  shape2: Set<string>;
}

interface ClickedEdges {
  shape1: Set<string>;
  shape2: Set<string>;
}

const ComparisonExercise: React.FC<ComparisonExerciseProps> = ({ onComplete }) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('tutorial');
  const [tutorialStep, setTutorialStep] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showProof, setShowProof] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [shakeError, setShakeError] = useState(false);
  const [clickedSquares, setClickedSquares] = useState<ClickedSquares>({ shape1: new Set(), shape2: new Set() });
  const [clickedEdges, setClickedEdges] = useState<ClickedEdges>({ shape1: new Set(), shape2: new Set() });

  const questions: Question[] = [
    // Area Questions (1-5)
    {
      id: 1,
      shape1: { coords: [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2],[1,3],[2,3],[3,3],[1,4],[2,4],[3,4]], color: 'bg-blue-500', name: 'Rectangle' },
      shape2: { coords: [[1,1],[2,1],[3,1],[1,2],[1,3],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4],[7,4]], color: 'bg-orange-500', name: 'L-Shape' },
      correctAnswer: 'area',
      area1: 12, area2: 12, perimeter1: 14, perimeter2: 18
    },
    {
      id: 2,
      shape1: { coords: [[1,1],[2,1],[1,2],[2,2]], color: 'bg-purple-500', name: 'Square' },
      shape2: { coords: [[1,1],[2,1],[3,1],[4,1]], color: 'bg-green-500', name: 'Line' },
      correctAnswer: 'area',
      area1: 4, area2: 4, perimeter1: 8, perimeter2: 10
    },
    {
      id: 3,
      shape1: { coords: [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2],[1,3],[2,3],[3,3]], color: 'bg-indigo-500', name: 'Square' },
      shape2: { coords: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[7,1],[8,1],[9,1]], color: 'bg-amber-500', name: 'Line' },
      correctAnswer: 'area',
      area1: 9, area2: 9, perimeter1: 12, perimeter2: 20
    },
    {
      id: 4,
      shape1: { coords: [[1,1],[2,1],[1,2],[2,2],[1,3],[2,3]], color: 'bg-red-500', name: 'Rectangle' },
      shape2: { coords: [[1,1],[2,1],[3,1],[1,2],[3,2],[1,3]], color: 'bg-cyan-500', name: 'L-Shape' },
      correctAnswer: 'area',
      area1: 6, area2: 6, perimeter1: 10, perimeter2: 12
    },
    {
      id: 5,
      shape1: { coords: [[1,1],[2,1],[3,1],[1,2],[1,3]], color: 'bg-fuchsia-500', name: 'L-Shape' },
      shape2: { coords: [[1,1],[1,2],[1,3],[1,4],[1,5]], color: 'bg-emerald-500', name: 'Line' },
      correctAnswer: 'area',
      area1: 5, area2: 5, perimeter1: 10, perimeter2: 12
    },
    // Perimeter Questions (6-10)
    {
      id: 6,
      shape1: { coords: [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2]], color: 'bg-pink-500', name: 'Rectangle' },
      shape2: { coords: [[2,1],[1,2],[2,2],[3,2],[2,3]], color: 'bg-teal-500', name: 'Plus' },
      correctAnswer: 'perimeter',
      area1: 6, area2: 5, perimeter1: 10, perimeter2: 10
    },
    {
      id: 7,
      shape1: { coords: [[1,1],[2,1],[1,2],[2,2],[3,2],[4,2]], color: 'bg-violet-500', name: 'L-Shape' },
      shape2: { coords: [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2]], color: 'bg-lime-500', name: 'Rectangle' },
      correctAnswer: 'perimeter',
      area1: 6, area2: 6, perimeter1: 10, perimeter2: 10
    },
    {
      id: 8,
      shape1: { coords: [[1,1],[2,1],[1,2],[2,2],[1,3],[2,3],[1,4],[2,4]], color: 'bg-blue-400', name: 'Rectangle' },
      shape2: { coords: [[1,1],[2,1],[3,1],[1,2],[3,2],[1,3],[2,3],[3,3]], color: 'bg-orange-400', name: 'U-Shape' },
      correctAnswer: 'perimeter',
      area1: 8, area2: 8, perimeter1: 12, perimeter2: 12
    },
    {
      id: 9,
      shape1: { coords: [[1,1],[2,1],[3,1],[4,1],[5,1],[6,1]], color: 'bg-purple-400', name: 'Line' },
      shape2: { coords: [[1,1],[2,1],[3,1],[1,2],[2,2],[3,2],[1,3],[2,3],[3,3]], color: 'bg-green-400', name: 'Square' },
      correctAnswer: 'perimeter',
      area1: 6, area2: 9, perimeter1: 14, perimeter2: 12
    },
    {
      id: 10,
      shape1: { coords: [[1,1],[2,1],[1,2],[2,2],[1,3]], color: 'bg-red-400', name: 'L-Shape' },
      shape2: { coords: [[1,1],[2,1],[1,2],[1,3]], color: 'bg-cyan-400', name: 'L-Shape' },
      correctAnswer: 'nothing',
      area1: 5, area2: 4, perimeter1: 10, perimeter2: 8
    }
  ];

  useEffect(() => {
    if (phase === 'tutorial') {
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: 'Welcome to Shape Lab! Let\'s discover area vs perimeter together.',
        data: {}
      }, '*');
    }
  }, [phase]);

  const handleTutorialNext = () => {
    if (tutorialStep < 2) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setPhase('exercise');
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (hasSubmitted) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer || hasSubmitted) return;
    
    setHasSubmitted(true);
    const question = questions[currentQuestion];
    const isCorrect = selectedAnswer === question.correctAnswer;

    if (isCorrect) {
      setShowProof(true);
      setShowConfetti(true);
      setScore(score + 5);
      
      setTimeout(() => setShowConfetti(false), 2000);
      
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'success',
        content: selectedAnswer === 'area' 
          ? `Great job! Both shapes have ${question.area1} squares!`
          : selectedAnswer === 'perimeter'
          ? `Perfect! Both shapes have perimeter ${question.perimeter1} units!`
          : 'Correct! These shapes are different in both ways!',
        data: { correct: true }
      }, '*');

      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setHasSubmitted(false);
          setShowProof(false);
          setClickedSquares({ shape1: new Set(), shape2: new Set() });
          setClickedEdges({ shape1: new Set(), shape2: new Set() });
        } else {
          setPhase('completion');
        }
      }, 3000);
    } else {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 500);
      
      window.parent.postMessage({
        type: 'tutorMessage',
        messageType: 'instruction',
        content: 'Not quite! Look carefully at the areas and perimeters. Try again!',
        data: { correct: false }
      }, '*');

      setTimeout(() => {
        setHasSubmitted(false);
        setSelectedAnswer(null);
      }, 2000);
    }
  };

  const renderTutorial = () => {
    const tutorialContent = [
      {
        title: 'What is Area?',
        description: 'Area is the space INSIDE a shape. We count the squares!',
        visual: (
          <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-blue-500 border-2 border-white rounded" style={{ animation: `scale-in 0.3s ease-out ${i * 0.1}s both` }}>
                <span className="text-white text-xs font-bold flex items-center justify-center h-full">{i + 1}</span>
              </div>
            ))}
          </div>
        )
      },
      {
        title: 'What is Perimeter?',
        description: 'Perimeter is the distance AROUND a shape. We trace the edges!',
        visual: (
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-8 border-orange-500 rounded animate-pulse"></div>
            <div className="absolute inset-4 bg-orange-100"></div>
          </div>
        )
      },
      {
        title: 'Can They Be Different?',
        description: 'Yes! Different shapes can have the same area OR same perimeter. Let\'s explore!',
        visual: (
          <div className="flex gap-4 justify-center">
            <div className="w-16 h-16 bg-purple-500 rounded"></div>
            <div className="w-8 h-32 bg-green-500 rounded"></div>
          </div>
        )
      }
    ];

    const content = tutorialContent[tutorialStep];

    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-grade-purple max-w-2xl w-full shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-dm font-bold text-grade-purple mb-2">{content.title}</h2>
            <p className="text-xl text-grade-black">{content.description}</p>
          </div>
          
          <div className="my-8">
            {content.visual}
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div key={i} className={`w-3 h-3 rounded-full transition-all ${i === tutorialStep ? 'bg-grade-purple w-8' : 'bg-gray-300'}`} />
            ))}
          </div>

          <Button
            onClick={handleTutorialNext}
            className="w-full bg-grade-orange hover:bg-grade-orange/90 text-white text-xl py-6 rounded-2xl font-bold"
          >
            {tutorialStep < 2 ? 'Next →' : 'Start Exercises! 🚀'}
          </Button>
        </div>
      </div>
    );
  };

  const handleSquareClick = (shapeKey: 'shape1' | 'shape2', coordKey: string) => {
    if (hasSubmitted) return;
    
    setClickedSquares(prev => {
      const newSet = new Set(prev[shapeKey]);
      if (newSet.has(coordKey)) {
        newSet.delete(coordKey);
      } else {
        newSet.add(coordKey);
      }
      return { ...prev, [shapeKey]: newSet };
    });
  };

  const handleEdgeClick = (shapeKey: 'shape1' | 'shape2', edgeKey: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasSubmitted) return;
    
    setClickedEdges(prev => {
      const newSet = new Set(prev[shapeKey]);
      if (newSet.has(edgeKey)) {
        newSet.delete(edgeKey);
      } else {
        newSet.add(edgeKey);
      }
      return { ...prev, [shapeKey]: newSet };
    });
  };

  const renderShape = (coords: [number, number][], color: string, showNumbers: boolean, shapeKey: 'shape1' | 'shape2') => {
    const maxX = Math.max(...coords.map(c => c[0])) + 1;
    const maxY = Math.max(...coords.map(c => c[1])) + 1;
    const coordSet = new Set(coords.map(([x, y]) => `${x}-${y}`));

    return (
      <div className="relative">
        <div className={`grid gap-0.5 p-4 bg-grade-input-gray rounded-2xl border-3 border-grade-border-gray relative`} 
             style={{ gridTemplateColumns: `repeat(${maxX}, minmax(0, 1fr))` }}>
          {[...Array(maxY)].map((_, row) => (
            [...Array(maxX)].map((_, col) => {
              const cellX = col + 1;
              const cellY = row + 1;
              const isPartOfShape = coords.some(([x, y]) => x === cellX && y === cellY);
              const coordKey = `${cellX}-${cellY}`;
              const isClicked = clickedSquares[shapeKey].has(coordKey);
              const clickedIndex = Array.from(clickedSquares[shapeKey]).indexOf(coordKey) + 1;
              const index = coords.findIndex(([x, y]) => x === cellX && y === cellY);
              
              // Check which edges are on the perimeter
              const hasTopEdge = isPartOfShape && !coordSet.has(`${cellX}-${cellY - 1}`);
              const hasRightEdge = isPartOfShape && !coordSet.has(`${cellX + 1}-${cellY}`);
              const hasBottomEdge = isPartOfShape && !coordSet.has(`${cellX}-${cellY + 1}`);
              const hasLeftEdge = isPartOfShape && !coordSet.has(`${cellX - 1}-${cellY}`);
              
              const topEdgeKey = `${cellX}-${cellY}-top`;
              const rightEdgeKey = `${cellX}-${cellY}-right`;
              const bottomEdgeKey = `${cellX}-${cellY}-bottom`;
              const leftEdgeKey = `${cellX}-${cellY}-left`;
              
              const isTopClicked = clickedEdges[shapeKey].has(topEdgeKey);
              const isRightClicked = clickedEdges[shapeKey].has(rightEdgeKey);
              const isBottomClicked = clickedEdges[shapeKey].has(bottomEdgeKey);
              const isLeftClicked = clickedEdges[shapeKey].has(leftEdgeKey);
              
              return (
                <div
                  key={`${col}-${row}`}
                  onClick={() => isPartOfShape && handleSquareClick(shapeKey, coordKey)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 border-2 border-white rounded transition-all duration-300 flex items-center justify-center relative ${
                    isPartOfShape ? `${color} cursor-pointer hover:opacity-80 hover:scale-110` : 'bg-white'
                  } ${isClicked ? 'ring-4 ring-yellow-300' : ''}`}
                  style={showProof && showNumbers && isPartOfShape ? { animation: `scale-in 0.3s ease-out ${index * 0.1}s both` } : {}}
                >
                  {/* Perimeter edges as overlays */}
                  {hasTopEdge && (
                    <div 
                      className={`absolute -top-1 left-0 right-0 h-2 cursor-pointer z-10 ${isTopClicked ? 'bg-yellow-400' : 'bg-black'} hover:bg-yellow-300 transition-all`}
                      onClick={(e) => handleEdgeClick(shapeKey, topEdgeKey, e)}
                    >
                      {isTopClicked && !hasSubmitted && (
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs drop-shadow-lg">
                          {Array.from(clickedEdges[shapeKey]).indexOf(topEdgeKey) + 1}
                        </span>
                      )}
                    </div>
                  )}
                  {hasRightEdge && (
                    <div 
                      className={`absolute top-0 -right-1 bottom-0 w-2 cursor-pointer z-10 ${isRightClicked ? 'bg-yellow-400' : 'bg-black'} hover:bg-yellow-300 transition-all`}
                      onClick={(e) => handleEdgeClick(shapeKey, rightEdgeKey, e)}
                    >
                      {isRightClicked && !hasSubmitted && (
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs drop-shadow-lg">
                          {Array.from(clickedEdges[shapeKey]).indexOf(rightEdgeKey) + 1}
                        </span>
                      )}
                    </div>
                  )}
                  {hasBottomEdge && (
                    <div 
                      className={`absolute -bottom-1 left-0 right-0 h-2 cursor-pointer z-10 ${isBottomClicked ? 'bg-yellow-400' : 'bg-black'} hover:bg-yellow-300 transition-all`}
                      onClick={(e) => handleEdgeClick(shapeKey, bottomEdgeKey, e)}
                    >
                      {isBottomClicked && !hasSubmitted && (
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs drop-shadow-lg">
                          {Array.from(clickedEdges[shapeKey]).indexOf(bottomEdgeKey) + 1}
                        </span>
                      )}
                    </div>
                  )}
                  {hasLeftEdge && (
                    <div 
                      className={`absolute top-0 -left-1 bottom-0 w-2 cursor-pointer z-10 ${isLeftClicked ? 'bg-yellow-400' : 'bg-black'} hover:bg-yellow-300 transition-all`}
                      onClick={(e) => handleEdgeClick(shapeKey, leftEdgeKey, e)}
                    >
                      {isLeftClicked && !hasSubmitted && (
                        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white font-bold text-xs drop-shadow-lg">
                          {Array.from(clickedEdges[shapeKey]).indexOf(leftEdgeKey) + 1}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {isClicked && !hasSubmitted && (
                    <span className="text-white font-bold text-sm drop-shadow-lg z-0">{clickedIndex}</span>
                  )}
                  {showProof && showNumbers && isPartOfShape && (
                    <span className="text-white font-bold text-sm z-0">{index + 1}</span>
                  )}
                </div>
              );
            })
          ))}
        </div>
      </div>
    );
  };

  const renderExercise = () => {
    const question = questions[currentQuestion];

    return (
      <div className="flex-1 flex items-center justify-center p-2 sm:p-4 overflow-auto">
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute text-2xl animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 0.5}s`
                }}
              >
                🎉
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-8 border-4 border-grade-purple max-w-6xl w-full shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-sm text-grade-purple font-bold mb-2">Question {currentQuestion + 1} of 10</div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-dm font-bold text-grade-black mb-4">
              Which property is the same for both shapes?
            </h2>
            <p className="text-sm text-grade-black">Click squares to count area, click edges to count perimeter</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6">
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-grade-black mb-3">{question.shape1.name}</h3>
              {renderShape(question.shape1.coords, question.shape1.color, selectedAnswer === 'area' || selectedAnswer === 'nothing', 'shape1')}
              <div className="mt-3 text-sm font-semibold text-grade-purple space-y-1">
                <div>{clickedSquares.shape1.size > 0 ? `Area: ${clickedSquares.shape1.size} squares` : 'Click squares for area'}</div>
                <div>{clickedEdges.shape1.size > 0 ? `Perimeter: ${clickedEdges.shape1.size} units` : 'Click edges for perimeter'}</div>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h3 className="text-lg font-bold text-grade-black mb-3">{question.shape2.name}</h3>
              {renderShape(question.shape2.coords, question.shape2.color, selectedAnswer === 'area' || selectedAnswer === 'nothing', 'shape2')}
              <div className="mt-3 text-sm font-semibold text-grade-purple space-y-1">
                <div>{clickedSquares.shape2.size > 0 ? `Area: ${clickedSquares.shape2.size} squares` : 'Click squares for area'}</div>
                <div>{clickedEdges.shape2.size > 0 ? `Perimeter: ${clickedEdges.shape2.size} units` : 'Click edges for perimeter'}</div>
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 ${shakeError ? 'animate-shake' : ''}`}>
            <button
              onClick={() => handleAnswerSelect('area')}
              disabled={hasSubmitted}
              className={`p-4 sm:p-6 rounded-2xl border-4 font-bold text-base sm:text-lg lg:text-xl transition-all touch-target ${
                selectedAnswer === 'area'
                  ? 'bg-grade-purple text-white border-grade-purple scale-105'
                  : 'bg-white text-grade-black border-grade-border-gray hover:border-grade-purple hover:scale-105'
              } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Same Area ✓
            </button>

            <button
              onClick={() => handleAnswerSelect('perimeter')}
              disabled={hasSubmitted}
              className={`p-4 sm:p-6 rounded-2xl border-4 font-bold text-base sm:text-lg lg:text-xl transition-all touch-target ${
                selectedAnswer === 'perimeter'
                  ? 'bg-grade-purple text-white border-grade-purple scale-105'
                  : 'bg-white text-grade-black border-grade-border-gray hover:border-grade-purple hover:scale-105'
              } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Same Perimeter ✓
            </button>

            <button
              onClick={() => handleAnswerSelect('nothing')}
              disabled={hasSubmitted}
              className={`p-4 sm:p-6 rounded-2xl border-4 font-bold text-base sm:text-lg lg:text-xl transition-all touch-target ${
                selectedAnswer === 'nothing'
                  ? 'bg-grade-purple text-white border-grade-purple scale-105'
                  : 'bg-white text-grade-black border-grade-border-gray hover:border-grade-purple hover:scale-105'
              } ${hasSubmitted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              Nothing Same ✗
            </button>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!selectedAnswer || hasSubmitted}
            className="w-full bg-grade-orange hover:bg-grade-orange/90 text-white text-xl py-6 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasSubmitted ? 'Checking...' : 'Submit Answer'}
          </Button>

          {hasSubmitted && selectedAnswer === question.correctAnswer && (
            <div className="mt-4 p-4 bg-green-100 border-3 border-green-500 rounded-2xl text-center" style={{ animation: 'scale-in 0.3s ease-out' }}>
              <p className="text-green-800 font-bold text-lg">🎉 Great job! See the proof above!</p>
            </div>
          )}

          {hasSubmitted && selectedAnswer !== question.correctAnswer && (
            <div className="mt-4 p-4 bg-amber-100 border-3 border-amber-500 rounded-2xl text-center animate-shake">
              <p className="text-amber-800 font-bold text-lg">Try again! Look at the numbers carefully!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCompletion = () => {
    const stars = Math.floor((score / 50) * 5);
    
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 border-4 border-grade-purple max-w-2xl w-full shadow-2xl text-center">
          <h2 className="text-4xl font-dm font-bold text-grade-purple mb-4">Shape Comparison Complete! 🎉</h2>
          
          <div className="my-8">
            <div className="text-6xl mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < stars ? 'inline-block' : 'opacity-30'} style={i < stars ? { animation: `scale-in 0.3s ease-out ${i * 0.2}s both` } : {}}>
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-2xl font-bold text-grade-black mb-2">Score: {score} / 50</p>
            <p className="text-lg text-grade-black">You answered {score / 5} out of 10 questions correctly!</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => onComplete(score)}
              className="w-full bg-grade-purple hover:bg-grade-purple/90 text-white text-xl py-6 rounded-2xl font-bold"
            >
              Continue to Next Exercise →
            </Button>
            
            <Button
              onClick={() => {
                setPhase('tutorial');
                setTutorialStep(0);
                setCurrentQuestion(0);
                setScore(0);
                setSelectedAnswer(null);
                setHasSubmitted(false);
                setShowProof(false);
                setClickedSquares({ shape1: new Set(), shape2: new Set() });
                setClickedEdges({ shape1: new Set(), shape2: new Set() });
              }}
              className="w-full bg-grade-orange hover:bg-grade-orange/90 text-white text-xl py-6 rounded-2xl font-bold"
            >
              🔄 Practice Again
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (phase === 'tutorial') return renderTutorial();
  if (phase === 'exercise') return renderExercise();
  return renderCompletion();
};

export default ComparisonExercise;