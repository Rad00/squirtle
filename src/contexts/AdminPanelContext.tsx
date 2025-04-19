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
      
      // Store directly without modifying clue content
      // If localStorage exceeds quota, we'll handle it via try/catch
      try {
        localStorage.setItem('gameWinners', JSON.stringify([mostRecentWinner]));
      } catch (storageError) {
        console.error('Storage quota exceeded, trying with compressed data');
        
        // If storage failed, try with reduced image data
        const processedClues = mostRecentWinner.clues.map(clue => {
          if (clue.includes('[Image:') && clue.length > 500) {
            // Get the start of the image data, enough to display something
            // but reduce storage requirements
            const imageStart = clue.indexOf('[Image:');
            const textPart = clue.substring(0, imageStart).trim();
            return textPart; // Just keep the text part without image
          }
          return clue;
        });
        
        const compressedWinner = {
          ...mostRecentWinner,
          clues: processedClues
        };
        
        try {
          localStorage.setItem('gameWinners', JSON.stringify([compressedWinner]));
          console.warn('Stored winner with reduced image data');
        } catch (finalError) {
          console.error('Failed to store data even after compression:', finalError);
          // Just store name and ID as last resort
          const minimalWinner = {
            id: mostRecentWinner.id,
            name: mostRecentWinner.name,
            clues: mostRecentWinner.clues.map(c => c.includes('[Image:') ? 
              c.substring(0, c.indexOf('[Image:')) : c)
          };
          localStorage.setItem('gameWinners', JSON.stringify([minimalWinner]));
        }
      }
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
