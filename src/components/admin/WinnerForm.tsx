
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPanel } from '@/contexts/AdminPanelContext';
import { Upload } from 'lucide-react';

export const WinnerForm = () => {
  const { addWinner } = useAdminPanel();
  const [name, setName] = useState('');
  const [clues, setClues] = useState(['', '', '', '', '']);
  const [imageUrl, setImageUrl] = useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageUrl(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clues.every(clue => clue.trim())) {
      const lastClue = imageUrl ? `${clues[4]} [Image: ${imageUrl}]` : clues[4];
      const updatedClues = [...clues.slice(0, 4), lastClue];
      addWinner({ name, clues: updatedClues, imageUrl });
      setName('');
      setClues(['', '', '', '', '']);
      setImageUrl('');
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

      <div>
        <label className="block text-sm font-medium mb-2">Upload Image for Last Clue</label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Choose Image
          </label>
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
          )}
        </div>
      </div>
      
      <Button type="submit">Add Winner</Button>
    </form>
  );
};
