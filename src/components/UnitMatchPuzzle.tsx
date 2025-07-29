
import React, { useState } from 'react';

interface UnitMatchPuzzleProps {
  onComplete: (score: number) => void;
}

interface UnitCard {
  id: string;
  value: number;
  unit: string;
  display: string;
  matchId: string;
  color: string;
}

const unitCards: UnitCard[] = [
  { id: '1kg', value: 1, unit: 'kg', display: '1 kg', matchId: 'weight1', color: 'bg-green-200' },
  { id: '1000g', value: 1000, unit: 'g', display: '1000 g', matchId: 'weight1', color: 'bg-green-300' },
  { id: '2L', value: 2, unit: 'L', display: '2 L', matchId: 'volume1', color: 'bg-blue-200' },
  { id: '2000mL', value: 2000, unit: 'mL', display: '2000 mL', matchId: 'volume1', color: 'bg-blue-300' },
  { id: '1km', value: 1, unit: 'km', display: '1 km', matchId: 'length1', color: 'bg-purple-200' },
  { id: '1000m', value: 1000, unit: 'm', display: '1000 m', matchId: 'length1', color: 'bg-purple-300' }
];

const UnitMatchPuzzle: React.FC<UnitMatchPuzzleProps> = ({ onComplete }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ cardId: string; isCorrect: boolean } | null>(null);

  const handleCardClick = (cardId: string) => {
    if (matchedPairs.includes(cardId) || showFeedback) return;

    if (!selectedCard) {
      setSelectedCard(cardId);
      return;
    }

    if (selectedCard === cardId) {
      setSelectedCard(null);
      return;
    }

    // Check if cards match
    const card1 = unitCards.find(c => c.id === selectedCard);
    const card2 = unitCards.find(c => c.id === cardId);
    
    if (card1 && card2 && card1.matchId === card2.matchId) {
      // Match found!
      setMatchedPairs(prev => [...prev, selectedCard, cardId]);
      setScore(prev => prev + 1);
      setShowFeedback({ cardId: selectedCard, isCorrect: true });
      
      setTimeout(() => {
        setShowFeedback(null);
        setSelectedCard(null);
        
        // Check if all pairs are matched
        if (matchedPairs.length + 2 === unitCards.length) {
          onComplete(score + 1);
        }
      }, 1000);
    } else {
      // No match
      setShowFeedback({ cardId: selectedCard, isCorrect: false });
      
      setTimeout(() => {
        setShowFeedback(null);
        setSelectedCard(null);
      }, 1000);
    }
  };

  const getCardStyle = (card: UnitCard) => {
    const isSelected = selectedCard === card.id;
    const isMatched = matchedPairs.includes(card.id);
    const isShowingFeedback = showFeedback?.cardId === card.id || 
                             (showFeedback && selectedCard === card.id);

    if (isMatched) {
      return 'bg-green-500 border-green-600 text-white scale-105';
    }
    
    if (isShowingFeedback) {
      return showFeedback?.isCorrect 
        ? 'bg-green-500 border-green-600 text-white scale-105' 
        : 'bg-red-500 border-red-600 text-white animate-shake';
    }
    
    if (isSelected) {
      return 'bg-grade-purple border-purple-600 text-white scale-105';
    }
    
    return `${card.color} border-gray-400 hover:scale-105`;
  };

  return (
    <div className="space-y-6">
      <div className="bg-grade-soft-white rounded-[20px] p-8 border-l-[10px] border-grade-purple">
        <h2 className="font-space font-bold text-2xl text-grade-black mb-2 text-center">
          🧩 Unit Match Puzzle
        </h2>
        <p className="text-grade-black/70 font-dm text-lg text-center mb-6">
          Match equivalent units by tapping pairs!
        </p>
        
        <div className="text-center mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {unitCards.map((card) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`p-6 rounded-[15px] font-dm font-bold text-lg transition-all duration-200 border-4 ${getCardStyle(card)}`}
                disabled={matchedPairs.includes(card.id) || showFeedback !== null}
              >
                <div className="text-2xl mb-2">
                  {card.unit === 'kg' || card.unit === 'g' ? '⚖️' : 
                   card.unit === 'L' || card.unit === 'mL' ? '🧃' : '📏'}
                </div>
                <div>{card.display}</div>
              </button>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <div className="text-lg font-dm font-bold">
              Matches found: {matchedPairs.length / 2} / {unitCards.length / 2}
            </div>
          </div>
        </div>

        {showFeedback?.isCorrect && (
          <div className="text-center p-4 bg-green-100 text-green-800 rounded-[15px] font-dm font-bold text-lg">
            ✅ Equivalent! Great match!
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitMatchPuzzle;
