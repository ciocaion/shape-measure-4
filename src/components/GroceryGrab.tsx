
import React, { useState } from 'react';

interface GroceryGrabProps {
  onComplete: (score: number) => void;
}

interface GroceryItem {
  id: string;
  name: string;
  weight: number;
  unit: 'g' | 'kg';
  emoji: string;
  color: string;
}

const groceryItems: GroceryItem[] = [
  { id: 'apple', name: 'Apple', weight: 100, unit: 'g', emoji: '🍎', color: 'bg-red-200' },
  { id: 'watermelon', name: 'Watermelon', weight: 1.2, unit: 'kg', emoji: '🍉', color: 'bg-green-200' },
  { id: 'flour', name: 'Flour', weight: 500, unit: 'g', emoji: '🥖', color: 'bg-yellow-200' },
  { id: 'milk', name: 'Milk', weight: 1, unit: 'kg', emoji: '🥛', color: 'bg-blue-200' },
  { id: 'banana', name: 'Banana', weight: 120, unit: 'g', emoji: '🍌', color: 'bg-yellow-200' },
  { id: 'potato', name: 'Potato', weight: 200, unit: 'g', emoji: '🥔', color: 'bg-orange-200' }
];

const GroceryGrab: React.FC<GroceryGrabProps> = ({ onComplete }) => {
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const challenges = [
    {
      question: 'Which weighs more than 1 kg?',
      type: 'single',
      correctItems: ['watermelon', 'milk'],
      targetWeight: 1000
    },
    {
      question: 'Pick items that make exactly 2 kg',
      type: 'combination',
      correctItems: ['watermelon', 'flour', 'banana', 'apple'],
      targetWeight: 2000
    },
    {
      question: '1000 g equals which unit?',
      type: 'conversion',
      correctItems: ['1kg'],
      targetWeight: 1000
    }
  ];

  const challenge = challenges[currentChallenge];

  const handleItemSelect = (itemId: string) => {
    if (showFeedback) return;
    
    if (challenge.type === 'single') {
      setSelectedItems([itemId]);
      checkAnswer([itemId]);
    } else {
      const newSelection = selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId];
      setSelectedItems(newSelection);
    }
  };

  const checkAnswer = (items: string[]) => {
    let correct = false;
    
    if (challenge.type === 'single') {
      correct = challenge.correctItems.includes(items[0]);
    } else if (challenge.type === 'combination') {
      const totalWeight = items.reduce((sum, itemId) => {
        const item = groceryItems.find(g => g.id === itemId);
        if (!item) return sum;
        return sum + (item.unit === 'kg' ? item.weight * 1000 : item.weight);
      }, 0);
      correct = totalWeight === challenge.targetWeight;
    } else if (challenge.type === 'conversion') {
      correct = items.includes('1kg');
    }
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentChallenge < challenges.length - 1) {
        setCurrentChallenge(prev => prev + 1);
        setSelectedItems([]);
        setShowFeedback(false);
      } else {
        onComplete(score + (correct ? 1 : 0));
      }
    }, 2000);
  };

  const renderGroceryScale = () => {
    const totalWeight = selectedItems.reduce((sum, itemId) => {
      const item = groceryItems.find(g => g.id === itemId);
      if (!item) return sum;
      return sum + (item.unit === 'kg' ? item.weight * 1000 : item.weight);
    }, 0);

    return (
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-32 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-[15px] border-4 border-gray-500">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full border-2 border-grade-black font-dm font-bold text-sm">
              {totalWeight}g
            </div>
          </div>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-2 bg-gray-600 rounded-full"></div>
        </div>
      </div>
    );
  };

  const renderConversionOptions = () => {
    if (challenge.type !== 'conversion') return null;
    
    const options = [
      { label: '1 kg', value: '1kg' },
      { label: '100 kg', value: '100kg' },
      { label: '10 g', value: '10g' }
    ];
    
    return (
      <div className="flex justify-center gap-4">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => {
              setSelectedItems([option.value]);
              checkAnswer([option.value]);
            }}
            className={`px-6 py-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${
              selectedItems.includes(option.value)
                ? isCorrect
                  ? 'bg-green-500 border-green-600 text-white'
                  : 'bg-red-500 border-red-600 text-white'
                : 'bg-white border-green-600 hover:scale-105'
            }`}
            disabled={showFeedback}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-8 border-l-[10px] border-green-600">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🍎 Grocery Grab — kg ↔ g
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-6">
          Round {currentChallenge + 1} of {challenges.length}
        </p>
        
        <div className="text-center mb-8">
          <h3 className="font-dm font-bold text-xl text-grade-black mb-6">
            {challenge.question}
          </h3>
          
          {renderGroceryScale()}
          
          {challenge.type === 'conversion' ? renderConversionOptions() : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {groceryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemSelect(item.id)}
                  className={`p-4 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${
                    selectedItems.includes(item.id)
                      ? 'bg-green-500 border-green-600 text-white scale-105'
                      : `${item.color} border-green-600 hover:scale-105`
                  }`}
                  disabled={showFeedback}
                >
                  <div className="text-4xl mb-2">{item.emoji}</div>
                  <div className="text-sm">{item.weight} {item.unit}</div>
                </button>
              ))}
            </div>
          )}
          
          {challenge.type === 'combination' && (
            <div className="mt-6">
              <button
                onClick={() => checkAnswer(selectedItems)}
                className="bg-grade-purple text-white px-6 py-3 rounded-[15px] font-dm font-bold text-lg hover:scale-105 transition-transform"
                disabled={showFeedback || selectedItems.length === 0}
              >
                Check Answer
              </button>
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

export default GroceryGrab;
