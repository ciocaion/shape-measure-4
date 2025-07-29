
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';

interface RoadStretchProps {
  onComplete: (score: number) => void;
}

const RoadStretch: React.FC<RoadStretchProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [sliderValue, setSliderValue] = useState([0]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenges = [
    {
      question: 'How many meters in 1 km?',
      type: 'multiple-choice',
      options: [10, 100, 1000],
      correctAnswer: 1000
    },
    {
      question: 'Car drove 1500 m. How many km?',
      type: 'slider',
      min: 0,
      max: 3,
      step: 0.1,
      correctAnswer: 1.5
    },
    {
      question: 'Drag roads to match 2 km',
      type: 'drag-roads',
      correctAnswer: 2000
    }
  ];

  const challenge = challenges[currentChallenge];

  const handleMultipleChoice = (answer: number) => {
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

  const handleSliderSubmit = () => {
    const answer = sliderValue[0];
    const correct = Math.abs(answer - challenge.correctAnswer!) < 0.1;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSliderValue([0]);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderRoadBlocks = () => {
    if (challenge.type !== 'multiple-choice') return null;
    
    return (
      <div className="flex justify-center mb-6">
        <div className="relative">
          {/* Road blocks representing 1 km */}
          <div className="flex">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="w-12 h-8 bg-gradient-to-r from-gray-400 to-gray-500 border-r-2 border-gray-600 flex items-center justify-center"
              >
                <div className="text-white text-xs font-bold">100m</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-2 font-dm font-bold text-lg">1 km</div>
        </div>
      </div>
    );
  };

  const renderSlider = () => {
    if (challenge.type !== 'slider') return null;
    
    return (
      <div className="max-w-md mx-auto mb-6">
        <div className="mb-4">
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            max={challenge.max}
            min={challenge.min}
            step={challenge.step}
            className="w-full"
          />
        </div>
        <div className="text-center font-dm font-bold text-lg mb-4">
          {sliderValue[0].toFixed(1)} km
        </div>
        <div className="text-center">
          <button
            onClick={handleSliderSubmit}
            className="bg-grade-blue text-white px-6 py-3 rounded-[15px] font-dm font-bold text-lg hover:scale-105 transition-transform"
            disabled={showFeedback}
          >
            Submit Answer
          </button>
        </div>
      </div>
    );
  };

  const renderDragRoads = () => {
    if (challenge.type !== 'drag-roads') return null;
    
    const roadOptions = [
      { label: '1 × 2km', value: 2000 },
      { label: '2 × 1km', value: 2000 },
      { label: '4 × 500m', value: 2000 },
      { label: '1 × 1km', value: 1000 }
    ];
    
    return (
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        {roadOptions.map((option, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedAnswer(option.value);
              const correct = option.value === challenge.correctAnswer;
              setIsCorrect(correct);
              setShowFeedback(true);
              
              if (correct) {
                setScore(prev => prev + 1);
              }

              setTimeout(() => {
                onComplete(score + (correct ? 1 : 0));
              }, 2000);
            }}
            className={`p-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${
              selectedAnswer === option.value
                ? isCorrect
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-red-500 border-red-600 text-white'
                : 'bg-white border-grade-blue hover:scale-105'
            }`}
            disabled={showFeedback}
          >
            <div className="text-2xl mb-2">🛣️</div>
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-8 border-l-[10px] border-grade-blue">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🚗 Road Stretch — km ↔ m
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-6">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-8">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            {challenge.question}
          </h3>
          
          {renderRoadBlocks()}
          {renderSlider()}
          {renderDragRoads()}
          
          {challenge.type === 'multiple-choice' && (
            <div className="flex justify-center gap-4">
              {challenge.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleMultipleChoice(option)}
                  className={`px-6 py-4 rounded-[15px] font-dm font-bold text-xl transition-all duration-200 border-4 ${
                    selectedAnswer === option
                      ? isCorrect
                        ? 'bg-green-500 border-green-600 text-white'
                        : 'bg-red-500 border-red-600 text-white'
                      : 'bg-white border-grade-blue hover:scale-105'
                  }`}
                  disabled={showFeedback}
                >
                  {option} m
                </button>
              ))}
            </div>
          )}
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

export default RoadStretch;
