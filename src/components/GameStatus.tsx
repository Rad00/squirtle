
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';

const GameStatus: React.FC = () => {
  const { isGameOver, isWinner, resetGame } = useGame();

  if (!isGameOver) return null;

  return (
    <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-lg animate-fade-in">
      <div className="flex flex-col items-center">
        {isWinner ? (
          <>
            <div className="text-clue-500 text-5xl mb-2">
              <Sparkles className="w-12 h-12 animate-pulse-soft" />
            </div>
            <h2 className="text-2xl font-bold text-clue-500 mb-2">Čestitke!</h2>
            <p className="text-center mb-6">
              Uspešno ste uganili skrivno osebo!
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-destructive mb-2">Konec igre</h2>
            <p className="text-center mb-6">
              Skrivnostna oseba je bila <span className="font-bold text-clue-400">Nikola Tesla</span>.
            </p>
          </>
        )}
        <Button 
          onClick={resetGame} 
          className="bg-mystery-600 hover:bg-mystery-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Igraj ponovno
        </Button>
      </div>
    </div>
  );
};

export default GameStatus;
