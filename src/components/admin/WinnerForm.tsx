
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAdminPanel } from '@/contexts/AdminPanelContext';
import { Upload } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface WinnerFormProps {
  onComplete?: () => void;
}

export const WinnerForm = ({ onComplete }: WinnerFormProps) => {
  const { addWinner } = useAdminPanel();
  const [name, setName] = useState('');
  const [clues, setClues] = useState(['', '', '', '', '']);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      
      // Check file size before loading (max 100KB)
      if (file.size > 100 * 1024) {
        toast({
          title: "Image too large",
          description: "Please use an image smaller than 100KB to avoid storage issues.",
          variant: "destructive",
        });
        setImageLoading(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        // Compress image if needed (this is a simple approach)
        setImageUrl(result);
        setImageLoading(false);
      };
      reader.onerror = () => {
        toast({
          title: "Error loading image",
          description: "Failed to load the image. Please try a different image.",
          variant: "destructive",
        });
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clues.every(clue => clue.trim())) {
      const lastClue = imageUrl ? `${clues[4]} [Image: ${imageUrl}]` : clues[4];
      const updatedClues = [...clues.slice(0, 4), lastClue];
      
      addWinner({ name, clues: updatedClues });
      
      toast({
        title: "Winner Added",
        description: `${name} has been added as a mystery person.`,
      });
      
      setName('');
      setClues(['', '', '', '', '']);
      setImageUrl('');
      
      if (onComplete) {
        onComplete();
      }
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
        <label className="block text-sm font-medium mb-2">Upload Image for Last Clue (max 100KB)</label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label 
            htmlFor="image-upload" 
            className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            {imageLoading ? "Loading..." : "Choose Image"}
          </label>
          {imageUrl && (
            <img src={imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Small images recommended to avoid storage issues.</p>
      </div>
      
      <Button type="submit" disabled={imageLoading}>Add Winner</Button>
    </form>
  );
};
