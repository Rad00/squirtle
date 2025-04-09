
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClueCardProps {
  clue: string;
  index: number;
}

const ClueCard: React.FC<ClueCardProps> = ({ clue, index }) => {
  return (
    <div 
      className="clue-card" 
      style={{ '--animation-order': index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-mystery-700 text-white text-xs font-bold">
          {index + 1}
        </div>
        <span className="text-lg font-medium">{clue}</span>
      </div>
    </div>
  );
};

export default ClueCard;
