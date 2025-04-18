
import React, { useEffect } from 'react';
import { GameProvider } from '@/contexts/GameContext';
import { useGame } from '@/contexts/GameContext';
import ClueCard from '@/components/ClueCard';
import GuessInput from '@/components/GuessInput';
import GameStatus from '@/components/GameStatus';
import { AdminPanelProvider, useAdminPanel } from '@/contexts/AdminPanelContext';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const GameBoard: React.FC = () => {
  const { revealedClues } = useGame();
  const { winners } = useAdminPanel();
  
  const hasWinners = winners && winners.length > 0;
  
  useEffect(() => {
    console.log('Current winners in GameBoard:', winners);
  }, [winners]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center">
          <span className="text-mystery-400 mr-2">Squirtle</span>
          <img 
            src="/lovable-uploads/d1584ad0-67f6-4960-a397-4fb15061350a.png" 
            alt="Squirtle Logo" 
            className="h-12 w-12 ml-4 rounded-lg"  // Changed to rounded-lg (8px) and moved to right
          />
        </h1>
        <p className="text-muted-foreground">
          Guess today's adult actor
        </p>
      </div>

      {!hasWinners ? (
        <div className="text-center p-6 bg-card border border-border rounded-lg shadow-lg">
          <Alert>
            <AlertTitle className="text-xl font-semibold">No Active Game</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              There is currently no game available. Please check back later.
            </AlertDescription>
          </Alert>
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

