
import React, { useState } from 'react';

interface FillMissingChartPartProps {
  onComplete: (score: number) => void;
}

interface ChartPart {
  id: string;
  value: number;
  color: string;
  label: string;
}

const challenges = [
  {
    id: 1,
    question: "Drag the missing pie slice to complete the chart",
    type: 'pie' as const,
    existingParts: [
      { id: 'part1', value: 40, color: '#ef4444', label: '🍎' },
      { id: 'part2', value: 30, color: '#eab308', label: '🍌' }
    ],
    missingPart: { id: 'missing', value: 30, color: '#f97316', label: '🍊' },
    options: [
      { id: 'option1', value: 30, color: '#f97316', label: '🍊' },
      { id: 'option2', value: 20, color: '#10b981', label: '🥝' },
      { id: 'option3', value: 40, color: '#8b5cf6', label: '🍇' }
    ]
  },
  {
    id: 2,
    question: "Complete the bar chart with the missing bar",
    type: 'bar' as const,
    existingParts: [
      { id: 'part1', value: 8, color: '#3b82f6', label: '🚗' },
      { id: 'part2', value: 12, color: '#10b981', label: '🚌' }
    ],
    missingPart: { id: 'missing', value: 6, color: '#f59e0b', label: '🚲' },
    options: [
      { id: 'option1', value: 6, color: '#f59e0b', label: '🚲' },
      { id: 'option2', value: 10, color: '#ef4444', label: '🏍️' },
      { id: 'option3', value: 4, color: '#8b5cf6', label: '🛴' }
    ]
  },
  {
    id: 3,
    question: "Fill in the missing dot row",
    type: 'dot' as const,
    existingParts: [
      { id: 'part1', value: 5, color: '#06b6d4', label: '⚽' },
      { id: 'part2', value: 3, color: '#f97316', label: '🏀' }
    ],
    missingPart: { id: 'missing', value: 7, color: '#84cc16', label: '🎾' },
    options: [
      { id: 'option1', value: 7, color: '#84cc16', label: '🎾' },
      { id: 'option2', value: 4, color: '#ef4444', label: '🏈' },
      { id: 'option3', value: 6, color: '#8b5cf6', label: '🏐' }
    ]
  }
];

const FillMissingChartPart: React.FC<FillMissingChartPartProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [droppedItem, setDroppedItem] = useState<ChartPart | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenge = challenges[currentChallenge];

  const handleDragStart = (e: React.DragEvent, optionId: string) => {
    setDraggedItem(optionId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    const option = challenge.options.find(opt => opt.id === draggedItem);
    if (!option) return;

    setDroppedItem(option);
    const correct = option.value === challenge.missingPart.value;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setDraggedItem(null);
        setDroppedItem(null);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderPieChart = () => {
    const allParts = [...challenge.existingParts, ...(droppedItem ? [droppedItem] : [])];
    const total = allParts.reduce((sum, part) => sum + part.value, 0);
    let currentAngle = 0;
    
    return (
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {allParts.map((part, index) => {
            const angle = (part.value / total) * 360;
            const x1 = 50 + 40 * Math.cos(currentAngle * Math.PI / 180);
            const y1 = 50 + 40 * Math.sin(currentAngle * Math.PI / 180);
            const x2 = 50 + 40 * Math.cos((currentAngle + angle) * Math.PI / 180);
            const y2 = 50 + 40 * Math.sin((currentAngle + angle) * Math.PI / 180);
            
            const largeArcFlag = angle > 180 ? 1 : 0;
            const path = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
            
            const result = (
              <path
                key={part.id}
                d={path}
                fill={part.color}
                stroke="white"
                strokeWidth="2"
                className={part.id === droppedItem?.id ? 'animate-pulse' : ''}
              />
            );
            
            currentAngle += angle;
            return result;
          })}
          
          {/* Missing part placeholder */}
          {!droppedItem && (
            <path
              d="M 50 50 L 50 10 A 40 40 0 0 1 85 30 Z"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="3"
              strokeDasharray="5,5"
              className="drop-zone"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            />
          )}
        </svg>
        
        {!droppedItem && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ top: '20%', left: '60%' }}
          >
            <div className="text-2xl animate-bounce">?</div>
          </div>
        )}
      </div>
    );
  };

  const renderBarChart = () => {
    const allParts = [...challenge.existingParts, ...(droppedItem ? [droppedItem] : [])];
    const maxValue = Math.max(...allParts.map(p => p.value), 15);
    
    return (
      <div className="flex items-end justify-center gap-8 h-48">
        {challenge.existingParts.map((part) => (
          <div key={part.id} className="flex flex-col items-center">
            <div
              className="w-16 flex items-end justify-center text-white font-bold rounded-t text-lg"
              style={{ 
                height: `${(part.value / maxValue) * 120}px`,
                backgroundColor: part.color,
                minHeight: '30px'
              }}
            >
              {part.value}
            </div>
            <div className="mt-2 text-2xl">{part.label}</div>
          </div>
        ))}
        
        {/* Missing bar placeholder */}
        <div className="flex flex-col items-center">
          {droppedItem ? (
            <div
              className="w-16 flex items-end justify-center text-white font-bold rounded-t text-lg animate-pulse"
              style={{ 
                height: `${(droppedItem.value / maxValue) * 120}px`,
                backgroundColor: droppedItem.color,
                minHeight: '30px'
              }}
            >
              {droppedItem.value}
            </div>
          ) : (
            <div
              className="w-16 border-4 border-dashed border-grade-border-gray rounded-t flex items-center justify-center cursor-pointer"
              style={{ height: '80px' }}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-2xl animate-bounce">?</div>
            </div>
          )}
          <div className="mt-2 text-2xl">
            {droppedItem ? droppedItem.label : challenge.missingPart.label}
          </div>
        </div>
      </div>
    );
  };

  const renderDotPlot = () => {
    const allParts = [...challenge.existingParts, ...(droppedItem ? [droppedItem] : [])];
    
    return (
      <div className="flex flex-col gap-4">
        {challenge.existingParts.map((part) => (
          <div key={part.id} className="flex items-center gap-4">
            <span className="text-2xl w-12">{part.label}</span>
            <div className="flex gap-1">
              {Array.from({ length: part.value }).map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: part.color }}
                />
              ))}
            </div>
          </div>
        ))}
        
        {/* Missing dot row placeholder */}
        <div className="flex items-center gap-4">
          <span className="text-2xl w-12">{challenge.missingPart.label}</span>
          {droppedItem ? (
            <div className="flex gap-1">
              {Array.from({ length: droppedItem.value }).map((_, dotIndex) => (
                <div
                  key={dotIndex}
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ backgroundColor: droppedItem.color }}
                />
              ))}
            </div>
          ) : (
            <div
              className="flex items-center gap-1 p-2 border-4 border-dashed border-grade-border-gray rounded cursor-pointer"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="text-lg animate-bounce">? ? ? ?</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (challenge.type === 'pie') return renderPieChart();
    if (challenge.type === 'bar') return renderBarChart();
    if (challenge.type === 'dot') return renderDotPlot();
    return null;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="bg-grade-soft-white rounded-[20px] p-6 border-l-[10px] border-grade-purple flex-1">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧩 Fill Missing Chart Part
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
          
          <div className="flex justify-center gap-4">
            {challenge.options.map((option) => (
              <div
                key={option.id}
                className="bg-white border-2 border-grade-border-gray rounded-[15px] p-4 cursor-move hover:scale-105 transition-transform"
                draggable
                onDragStart={(e) => handleDragStart(e, option.id)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{option.label}</span>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="font-bold">{option.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showFeedback && (
          <div className={`text-center p-4 rounded-[15px] font-dm font-bold text-lg ${
            isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isCorrect ? '✅ Perfect fit!' : '❌ Try another piece!'}
          </div>
        )}
      </div>
    </div>
  );
};

export default FillMissingChartPart;
