
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Winner {
  id: string;
  name: string;
  clues: string[];
}

interface AdminPanelContextType {
  winners: Winner[];
  addWinner: (winner: Omit<Winner, 'id'>) => void;
  removeWinner: (id: string) => void;
}

const AdminPanelContext = createContext<AdminPanelContextType | undefined>(undefined);

export const AdminPanelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [winners, setWinners] = useState<Winner[]>([]);

  const addWinner = (winner: Omit<Winner, 'id'>) => {
    const newWinner = {
      ...winner,
      id: Date.now().toString(),
    };
    setWinners([...winners, newWinner]);
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
