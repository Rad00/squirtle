
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Winner {
  id: string;
  name: string;
  clues: string[];
  imageUrl?: string;
}

interface AdminPanelContextType {
  winners: Winner[];
  addWinner: (winner: Omit<Winner, 'id'>) => void;
  removeWinner: (id: string) => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | undefined>(undefined);

export const AdminPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [winners, setWinners] = useState<Winner[]>([]);

  // Load winners from localStorage on initial render
  useEffect(() => {
    try {
      const savedWinners = localStorage.getItem('gameWinners');
      if (savedWinners) {
        const parsedWinners = JSON.parse(savedWinners);
        setWinners(Array.isArray(parsedWinners) ? parsedWinners : [parsedWinners]);
      }
    } catch (error) {
      console.error('Error loading winners from localStorage:', error);
    }
  }, []);

  // Save winners to localStorage whenever they change
  useEffect(() => {
    if (winners.length === 0) return;
    
    try {
      // Only store the most recent winner to save space
      const mostRecentWinner = winners[winners.length - 1];
      
      // Compress image data if needed
      let winnerToStore = mostRecentWinner;
      
      // Check if clues contain large image data and truncate if necessary
      const processedClues = mostRecentWinner.clues.map(clue => {
        if (clue.includes('[Image:') && clue.length > 1000) {
          // Truncate image data if it's too large
          return clue.substring(0, 1000) + '...]';
        }
        return clue;
      });
      
      winnerToStore = {
        ...mostRecentWinner,
        clues: processedClues
      };
      
      localStorage.setItem('gameWinners', JSON.stringify([winnerToStore]));
    } catch (error) {
      console.error('Error saving winners to localStorage:', error);
    }
  }, [winners]);

  const addWinner = (winner: Omit<Winner, 'id'>) => {
    // Generate a new winner with ID
    const newWinner = {
      ...winner,
      id: Date.now().toString(),
    };
    // We only keep the latest winner to prevent storage issues
    setWinners([newWinner]);
  };

  const removeWinner = (id: string) => {
    setWinners(winners.filter(winner => winner.id !== id));
  };

  return (
    <AdminPanelContext.Provider
      value={{
        winners,
        addWinner,
        removeWinner,
      }}
    >
      {children}
    </AdminPanelContext.Provider>
  );
};

export const useAdminPanel = () => {
  const context = useContext(AdminPanelContext);
  if (context === undefined) {
    throw new Error('useAdminPanel must be used within a AdminPanelProvider');
  }
  return context;
};
