
import React, { useState } from 'react';

interface MatchTheChartTypeProps {
  onComplete: (score: number) => void;
}

interface ChartOption {
  id: string;
  type: 'bar' | 'pie' | 'dot';
  data: number[];
  correct: boolean;
}

const challenges = [
  {
    id: 1,
    question: "Which bar chart shows the same data as the pie?",
    pieData: [30, 45, 25],
    pieLabels: ['🍎', '🍌', '🍊'],
    pieColors: ['#ef4444', '#eab308', '#f97316'],
    options: [
      { id: 'bar1', type: 'bar' as const, data: [30, 45, 25], correct: true },
      { id: 'bar2', type: 'bar' as const, data: [25, 30, 45], correct: false },
      { id: 'bar3', type: 'bar' as const, data: [45, 25, 30], correct: false }
    ]
  },
  {
    id: 2,
    question: "Which pie chart matches this bar chart?",
    barData: [20, 50, 30],
    barLabels: ['🚗', '🚌', '🚲'],
    barColors: ['#3b82f6', '#10b981', '#f59e0b'],
    options: [
      { id: 'pie1', type: 'pie' as const, data: [20, 50, 30], correct: true },
      { id: 'pie2', type: 'pie' as const, data: [50, 20, 30], correct: false },
      { id: 'pie3', type: 'pie' as const, data: [30, 20, 50], correct: false }
    ]
  },
  {
    id: 3,
    question: "Which dot plot shows the same data as the pie?",
    pieData: [4, 6, 2],
    pieLabels: ['⚽', '🏀', '🎾'],
    pieColors: ['#06b6d4', '#f97316', '#84cc16'],
    options: [
      { id: 'dot1', type: 'dot' as const, data: [4, 6, 2], correct: true },
      { id: 'dot2', type: 'dot' as const, data: [6, 4, 2], correct: false },
      { id: 'dot3', type: 'dot' as const, data: [2, 4, 6], correct: false }
    ]
  }
];

const MatchTheChartType: React.FC<MatchTheChartTypeProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleOptionClick = (optionId: string) => {
    if (showFeedback) return;

    const option = challenge.options.find(opt => opt.id === optionId);
    if (!option) return;

    setSelectedOption(optionId);
    setIsCorrect(option.correct);
    setShowFeedback(true);
    
    if (option.correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        onComplete(score + (option.correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderPieChart = (data: number[], labels: string[], colors: string[]) => {
    const total = data.reduce((sum, value) => sum + value, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {data.map((value, index) => {
            const angle = (value / total) * 360;
            const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const result = (
              <path
                key={index}
                d={path}
                fill={colors[index]}
                stroke="white"
                strokeWidth="2"
              />
            );
            
            currentAngle += angle;
            return result;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex gap-1">
            {labels.map((label, index) => (
              <span key={index} className="text-lg">{label}</span>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBarChart = (data: number[], labels: string[], colors: string[]) => {
    const maxValue = Math.max(...data);
    return (
      <div className="flex items-end justify-center gap-2 h-24">
        {data.map((value, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className="w-8 flex items-end justify-center text-white font-bold rounded-t"
              style={{ 
                height: `${(value / maxValue) * 60}px`,
                backgroundColor: colors[index],
                minHeight: '20px'
              }}
            >
              {value}
            </div>
            <div className="mt-1 text-lg">{labels[index]}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDotPlot = (data: number[], labels: string[], colors: string[]) => {
    return (
      <div className="flex flex-col gap-2">
        {data.map((value, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-lg w-8">{labels[index]}</span>
            <div className="flex gap-1">
              {Array.from({ length: value }).map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMainChart = () => {
    if (challenge.pieData && challenge.pieLabels && challenge.pieColors) {
      return renderPieChart(challenge.pieData, challenge.pieLabels, challenge.pieColors);
    }
    if (challenge.barData && challenge.barLabels && challenge.barColors) {
      return renderBarChart(challenge.barData, challenge.barLabels, challenge.barColors);
    }
    return null;
  };

  const renderOption = (option: ChartOption) => {
    const isSelected = selectedOption === option.id;
    const baseColors = ['#3b82f6', '#10b981', '#f59e0b'];
    const baseLabels = ['A', 'B', 'C'];
    
    let className = 'bg-white border-4 rounded-[15px] p-4 cursor-pointer transition-all duration-300 min-h-[44px]';
    
    if (isSelected) {
      if (showFeedback) {
        className += isCorrect ? ' border-green-500 bg-green-50' : ' border-red-500 bg-red-50 animate-shake';
      } else {
        className += ' border-grade-blue scale-98';
      }
    } else {
      className += ' border-grade-border-gray hover:scale-105';
    }

    return (
      <div
        key={option.id}
        className={className}
        onClick={() => handleOptionClick(option.id)}
      >
        {option.type === 'bar' && renderBarChart(option.data, baseLabels, baseColors)}
        {option.type === 'pie' && renderPieChart(option.data, baseLabels, baseColors)}
        {option.type === 'dot' && renderDotPlot(option.data, baseLabels, baseColors)}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-orange flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🔄 Match the Chart Type
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
              {renderMainChart()}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenge.options.map(renderOption)}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Perfect match!' : '❌ Try matching the data values!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchTheChartType;
