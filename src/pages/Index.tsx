
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { useGame } from '@/contexts/GameContext';
import ClueCard from '@/components/ClueCard';
import GuessInput from '@/components/GuessInput';
import GameStatus from '@/components/GameStatus';
import { Sparkles, AlertCircle } from 'lucide-react';
import { AdminPanelProvider } from '@/contexts/AdminPanelContext';
import { useAdminPanel } from '@/contexts/AdminPanelContext';

const GameBoard: React.FC = () => {
  const { revealedClues } = useGame();
  const { winners } = useAdminPanel();
  
  // Check if there are any winners
  const hasWinners = winners.length > 0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
          <span className="text-mystery-400 mr-2">Squirtle</span>
          <Sparkles className="ml-2 text-clue-300 w-6 h-6" />
        </h1>
        <p className="text-muted-foreground">
          Reveal clues and guess the mystery person
        </p>
      </div>

      {!hasWinners ? (
        <div className="text-center p-6 bg-card border border-border rounded-lg shadow-lg">
          <AlertCircle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Mystery Person Available</h2>
          <p className="mb-4 text-muted-foreground">
            Please go to the <a href="/admin" className="text-blue-500 hover:underline">Admin Panel</a> and add a mystery person with clues first.
          </p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      <AdminPanelProvider>
        <GameProvider>
          <GameBoard />
        </GameProvider>
      </AdminPanelProvider>
    </div>
  );
};

export default Index;
