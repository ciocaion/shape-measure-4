
import React, { useState } from 'react';

interface SortTheDataProps {
  onComplete: (score: number) => void;
}

interface ChartData {
  id: string;
  label: string;
  value: number;
  color: string;
  icon: string;
}

const challenges = [
  {
    id: 1,
    question: "Sort from smallest to largest group (pie chart)",
    type: 'pie' as const,
    data: [
      { id: 'pizza', label: 'Pizza', value: 25, color: '#eab308', icon: '🍕' },
      { id: 'burgers', label: 'Burgers', value: 45, color: '#f97316', icon: '🍔' },
      { id: 'tacos', label: 'Tacos', value: 30, color: '#10b981', icon: '🌮' }
    ],
    correctOrder: ['pizza', 'tacos', 'burgers']
  },
  {
    id: 2,
    question: "Sort from smallest to largest group (bar chart)",
    type: 'bar' as const,
    data: [
      { id: 'cats', label: 'Cats', value: 12, color: '#f97316', icon: '🐱' },
      { id: 'dogs', label: 'Dogs', value: 8, color: '#3b82f6', icon: '🐶' },
      { id: 'birds', label: 'Birds', value: 15, color: '#10b981', icon: '🐦' }
    ],
    correctOrder: ['dogs', 'cats', 'birds']
  },
  {
    id: 3,
    question: "Sort from smallest to largest group (dot plot)",
    type: 'dot' as const,
    data: [
      { id: 'soccer', label: 'Soccer', value: 6, color: '#06b6d4', icon: '⚽' },
      { id: 'basketball', label: 'Basketball', value: 9, color: '#f97316', icon: '🏀' },
      { id: 'tennis', label: 'Tennis', value: 3, color: '#84cc16', icon: '🎾' }
    ],
    correctOrder: ['tennis', 'soccer', 'basketball']
  }
];

const SortTheData: React.FC<SortTheDataProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleItemClick = (itemId: string) => {
    if (showFeedback) return;

    if (selectedOrder.includes(itemId)) {
      // Remove from order
      setSelectedOrder(prev => prev.filter(id => id !== itemId));
    } else {
      // Add to order
      const newOrder = [...selectedOrder, itemId];
      setSelectedOrder(newOrder);
      
      // Check if order is complete
      if (newOrder.length === challenge.data.length) {
        checkAnswer(newOrder);
      }
    }
  };

  const checkAnswer = (order: string[]) => {
    const correct = order.every((id, index) => id === challenge.correctOrder[index]);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedOrder([]);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderPieChart = () => {
    const total = challenge.data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {challenge.data.map((item) => {
            const angle = (item.value / total) * 360;
            const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const result = (
              <path
                key={item.id}
                d={path}
                fill={item.color}
                stroke="white"
                strokeWidth="2"
              />
            );
            
            currentAngle += angle;
            return result;
          })}
        </svg>
      </div>
    );
  };

  const renderBarChart = () => {
    const maxValue = Math.max(...challenge.data.map(item => item.value));
    
    return (
      <div className="flex items-end justify-center gap-8 h-48">
        {challenge.data.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <div
              className="w-16 flex items-end justify-center text-white font-bold rounded-t text-lg"
              style={{ 
                height: `${(item.value / maxValue) * 120}px`,
                backgroundColor: item.color,
                minHeight: '30px'
              }}
            >
              {item.value}
            </div>
            <div className="mt-2 text-2xl">{item.icon}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDotPlot = () => {
    return (
      <div className="flex flex-col gap-4">
        {challenge.data.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            <span className="text-2xl w-12">{item.icon}</span>
            <div className="flex gap-1">
              {Array.from({ length: item.value }).map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderChart = () => {
    if (challenge.type === 'pie') return renderPieChart();
    if (challenge.type === 'bar') return renderBarChart();
    if (challenge.type === 'dot') return renderDotPlot();
    return null;
  };

  const getItemStyle = (item: ChartData) => {
    const position = selectedOrder.indexOf(item.id);
    const isSelected = position !== -1;
    
    let className = 'flex items-center gap-4 p-4 rounded-[15px] cursor-pointer transition-all duration-300 min-h-[44px] border-4';
    
    if (isSelected) {
      if (showFeedback) {
        className += isCorrect ? ' bg-green-100 border-green-500' : ' bg-red-100 border-red-500 animate-shake';
      } else {
        className += ' bg-grade-blue text-white border-grade-blue scale-98';
      }
    } else {
      className += ' bg-white border-grade-border-gray hover:scale-105';
    }
    
    return { className, position };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-orange flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          📈 Sort the Data
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-4">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-6">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            {challenge.question}
          </h3>
          
          <div className="mb-8">
            <div className="bg-white rounded-[15px] p-6 border-2 border-grade-border-gray inline-block">
              {renderChart()}
            </div>
          </div>
          
          <div className="flex flex-col gap-4 max-w-md mx-auto">
            {challenge.data.map((item) => {
              const { className, position } = getItemStyle(item);
              return (
                <div
                  key={item.id}
                  className={className}
                  onClick={() => handleItemClick(item.id)}
                >
                  <div className="flex items-center gap-4 w-full">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-dm font-bold text-lg flex-1">{item.label}</span>
                    <span className="font-dm font-bold text-lg">{item.value}</span>
                    {position !== -1 && (
                      <div className="w-8 h-8 bg-white text-grade-blue rounded-full flex items-center justify-center font-bold">
                        {position + 1}
                      </div>
                    )}
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
            {isCorrect ? '✅ Sorted perfectly!' : '❌ Try sorting again!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default SortTheData;
