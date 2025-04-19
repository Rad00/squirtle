
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPanel } from '@/contexts/AdminPanelContext';

export const WinnerForm = () => {
  const { addWinner } = useAdminPanel();
  const [name, setName] = useState('');
  const [clues, setClues] = useState(['', '', '', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clues.every(clue => clue.trim())) {
      addWinner({ name, clues });
      setName('');
      setClues(['', '', '', '', '']);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Winner Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter winner name"
          required
        />
      </div>
      
      {clues.map((clue, index) => (
        <div key={index}>
          <label className="block text-sm font-medium mb-2">Clue {index + 1}</label>
          <Textarea
            value={clue}
            onChange={(e) => {
              const newClues = [...clues];
              newClues[index] = e.target.value;
              setClues(newClues);
            }}
            placeholder={`Enter clue ${index + 1}`}
            required
          />
        </div>
      ))}
      
      <Button type="submit">Add Winner</Button>
    </form>
  );
};
