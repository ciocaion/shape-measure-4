
import React, { useState } from 'react';

interface PredictTheOutcomeProps {
  onComplete: (score: number) => void;
}

interface DotData {
  id: string;
  label: string;
  value: number;
  color: string;
  icon: string;
}

const challenges = [
  {
    id: 1,
    question: "Predict: Who will have the most if 2 more dots are added to bananas?",
    data: [
      { id: 'apples', label: 'Apples', value: 6, color: '#ef4444', icon: '🍎' },
      { id: 'bananas', label: 'Bananas', value: 4, color: '#eab308', icon: '🍌' },
      { id: 'oranges', label: 'Oranges', value: 5, color: '#f97316', icon: '🍊' }
    ],
    addTo: 'bananas',
    addAmount: 2,
    correctPrediction: 'bananas'
  },
  {
    id: 2,
    question: "Predict: Who will have the most if 3 more dots are added to cats?",
    data: [
      { id: 'cats', label: 'Cats', value: 3, color: '#f97316', icon: '🐱' },
      { id: 'dogs', label: 'Dogs', value: 7, color: '#3b82f6', icon: '🐶' },
      { id: 'birds', label: 'Birds', value: 5, color: '#10b981', icon: '🐦' }
    ],
    addTo: 'cats',
    addAmount: 3,
    correctPrediction: 'dogs'
  }
];

const PredictTheOutcome: React.FC<PredictTheOutcomeProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [gamePhase, setGamePhase] = useState<'predict' | 'simulate' | 'answer'>('predict');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [simulatedData, setSimulatedData] = useState<DotData[]>([]);
  const [finalAnswer, setFinalAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handlePrediction = (predictionId: string) => {
    if (gamePhase !== 'predict') return;
    
    setPrediction(predictionId);
    setGamePhase('simulate');
    
    // Simulate adding dots
    const newData = challenge.data.map(item => 
      item.id === challenge.addTo 
        ? { ...item, value: item.value + challenge.addAmount }
        : item
    );
    
    setSimulatedData(newData);
    
    setTimeout(() => {
      setGamePhase('answer');
    }, 2000);
  };

  const handleFinalAnswer = (answerId: string) => {
    if (gamePhase !== 'answer') return;
    
    setFinalAnswer(answerId);
    
    // Find who actually has the most after simulation
    const maxValue = Math.max(...simulatedData.map(item => item.value));
    const actualWinner = simulatedData.find(item => item.value === maxValue);
    
    const correct = answerId === actualWinner?.id;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setGamePhase('predict');
        setPrediction(null);
        setSimulatedData([]);
        setFinalAnswer(null);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderDotPlot = (data: DotData[], showAnimation = false) => {
    return (
      <div className="flex flex-col gap-4">
        {data.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <span className="text-2xl w-12">{item.icon}</span>
            <div className="flex gap-1">
              {Array.from({ length: item.value }).map((_, dotIndex) => {
                const isNewDot = item.id === challenge.addTo && 
                               dotIndex >= challenge.data.find(d => d.id === challenge.addTo)!.value;
                
                return (
                  <div
                    key={dotIndex}
                    className={`w-4 h-4 rounded-full ${
                      showAnimation && isNewDot ? 'animate-bounce' : ''
                    }`}
                    style={{ 
                      backgroundColor: item.color,
                      animationDelay: showAnimation && isNewDot ? `${dotIndex * 0.2}s` : '0s'
                    }}
                  />
                );
              })}
            </div>
            <span className="font-dm font-bold text-lg ml-2">{item.value}</span>
          </div>
        ))}
      </div>
    );
  };

  const getButtonStyle = (itemId: string, phase: 'predict' | 'answer') => {
    const isSelected = phase === 'predict' ? prediction === itemId : finalAnswer === itemId;
    
    let className = 'flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition-all duration-300 min-h-[44px] border-4';
    
    if (isSelected) {
      if (showFeedback && phase === 'answer') {
        className += isCorrect ? ' bg-green-100 border-green-500' : ' bg-red-100 border-red-500 animate-shake';
      } else {
        className += ' bg-grade-purple text-white border-grade-purple scale-98';
      }
    } else {
      className += ' bg-white border-grade-border-gray hover:scale-105';
    }
    
    return className;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-purple flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🔮 Predict the Outcome
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          {gamePhase === 'predict' && (
            <>
              <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
                {challenge.question}
              </h3>
              
              <div className="mb-8">
                <div className="bg-white rounded-[15px] p-6 border-2 border-grade-border-gray inline-block">
                  {renderDotPlot(challenge.data)}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {challenge.data.map((item) => (
                  <div
                    key={item.id}
                    className={getButtonStyle(item.id, 'predict')}
                    onClick={() => handlePrediction(item.id)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-dm font-bold text-lg flex-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {gamePhase === 'simulate' && (
            <>
              <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
                Adding {challenge.addAmount} dots to {challenge.data.find(d => d.id === challenge.addTo)?.label}...
              </h3>
              
              <div className="mb-8">
                <div className="bg-white rounded-[15px] p-6 border-2 border-grade-border-gray inline-block">
                  {renderDotPlot(simulatedData, true)}
                </div>
              </div>
              
              <div className="text-lg font-dm font-bold text-grade-black">
                Your prediction: {challenge.data.find(d => d.id === prediction)?.label} 
                <span className="ml-2">{challenge.data.find(d => d.id === prediction)?.icon}</span>
              </div>
            </>
          )}
          
          {gamePhase === 'answer' && (
            <>
              <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
                Who has the most now?
              </h3>
              
              <div className="mb-8">
                <div className="bg-white rounded-[15px] p-6 border-2 border-grade-border-gray inline-block">
                  {renderDotPlot(simulatedData)}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                {simulatedData.map((item) => (
                  <div
                    key={item.id}
                    className={getButtonStyle(item.id, 'answer')}
                    onClick={() => handleFinalAnswer(item.id)}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-dm font-bold text-lg flex-1">{item.label}</span>
                    <span className="font-dm font-bold text-lg">{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Smart prediction!' : '❌ Better luck next time!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictTheOutcome;
