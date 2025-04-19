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
  const [clues, setClues] = useState(['', '', '', '']);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(false);
  const [instagramUrl, setInstagramUrl] = useState('');
  const [twitterUrl, setTwitterUrl] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageLoading(true);
      
      if (file.size > 500 * 1024) {
        toast({
          title: "Image too large",
          description: "Please use an image smaller than 500KB to avoid storage issues.",
          variant: "destructive",
        });
        setImageLoading(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrl(result);
        setImageLoading(false);
      };
      reader.onerror = () => {
        setImageLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && clues.every(clue => clue.trim()) && imageUrl) {
      const allClues = [...clues, `[Image: ${imageUrl}]`];
      
      addWinner({ 
        name, 
        clues: allClues,
        socialMedia: {
          instagram: instagramUrl,
          twitter: twitterUrl
        }
      });
      
      toast({
        title: "Winner Added",
        description: `${name} has been added as a mystery person.`,
      });
      
      setName('');
      setClues(['', '', '', '']);
      setImageUrl('');
      setInstagramUrl('');
      setTwitterUrl('');
      
      if (onComplete) {
        onComplete();
      }
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all text clues and upload an image for the final clue.",
        variant: "destructive",
      });
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
        <label className="block text-sm font-medium mb-2">Social Media Links</label>
        <div className="space-y-2">
          <Input
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Instagram URL (optional)"
            type="url"
          />
          <Input
            value={twitterUrl}
            onChange={(e) => setTwitterUrl(e.target.value)}
            placeholder="Twitter URL (optional)"
            type="url"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Clue 5 - Upload Image (max 500KB)</label>
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/jpeg,image/png,image/gif"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
            required
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
