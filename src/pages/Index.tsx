
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { useGame } from '@/contexts/GameContext';
import ClueCard from '@/components/ClueCard';
import GuessInput from '@/components/GuessInput';
import GameStatus from '@/components/GameStatus';
import { Sparkles } from 'lucide-react';

const GameBoard: React.FC = () => {
  const { revealedClues } = useGame();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
          <span className="text-mystery-400 mr-2">Clue</span>
          <span className="text-clue-400">Quest</span>
          <Sparkles className="ml-2 text-clue-300 w-6 h-6" />
        </h1>
        <p className="text-muted-foreground">
          Reveal clues and guess the mystery person
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <span className="text-mystery-400 mr-2">Revealed</span> 
          <span className="text-clue-400">Clues</span>
        </h2>
        <div className="space-y-2">
          {revealedClues.map((clue, index) => (
            <ClueCard key={index} clue={clue} index={index} />
          ))}
        </div>
      </div>

      <GuessInput />
      <GameStatus />
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <GameProvider>
        <GameBoard />
      </GameProvider>
    </div>
  );
};

export default Index;
