
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClueCardProps {
  clue: string;
  index: number;
}

const ClueCard: React.FC<ClueCardProps> = ({ clue, index }) => {
  // Check if the clue contains an image URL
  const hasImage = clue.includes('[Image:');
  const imageUrl = hasImage ? clue.match(/\[Image: (.*?)\]/)?.[1] : null;
  const textClue = hasImage ? clue.replace(/\[Image: .*?\]/, '').trim() : clue;

  return (
    <div 
      className="clue-card space-y-2" 
      style={{ '--animation-order': index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-mystery-700 text-white text-xs font-bold">
          {index + 1}
        </div>
        <span className="text-lg font-medium">{textClue}</span>
      </div>
      {imageUrl && (
        <div className="mt-2">
          <img src={imageUrl} alt="Clue" className="max-w-full h-auto rounded-lg" />
        </div>
      )}
    </div>
  );
};

export default ClueCard;
