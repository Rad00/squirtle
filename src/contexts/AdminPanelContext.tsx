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
        setWinners(parsedWinners);
      }
    } catch (error) {
      console.error('Error loading winners from localStorage:', error);
    }
  }, []);

  // Save winners to localStorage whenever they change
  useEffect(() => {
    try {
      // Store only the most recent winner to avoid exceeding storage quota
      const winnersToStore = winners.length > 0 ? [winners[winners.length - 1]] : [];
      localStorage.setItem('gameWinners', JSON.stringify(winnersToStore));
    } catch (error) {
      console.error('Error saving winners to localStorage:', error);
    }
  }, [winners]);

  const addWinner = (winner: Omit<Winner, 'id'>) => {
    // When adding a new winner, remove all previous ones to save space
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
