
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface ClueCardProps {
  clue: string;
  index: number;
}

const ClueCard: React.FC<ClueCardProps> = ({ clue, index }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Check if the clue contains an image URL
  const hasImage = clue.includes('[Image:');
  
  // Extract the image URL more reliably with a proper regex
  let imageUrl = null;
  if (hasImage) {
    const match = clue.match(/\[Image:\s*(.*?)\]/);
    if (match && match[1]) {
      imageUrl = match[1];
      // Check if the base64 string is cut off
      if (imageUrl.endsWith('...') || imageUrl.endsWith('...]')) {
        console.warn("Image data appears to be truncated");
      }
    }
  }
  
  // Extract the text portion of the clue
  let textClue = hasImage ? clue.replace(/\[Image:\s*.*?\]/, '').trim() : clue;
  
  // If after removing the image tag the textClue is empty, add a placeholder
  const hasTextContent = textClue.length > 0;

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading image:", imageUrl);
    setImageError(true);
    // Hide the broken image
    (e.target as HTMLImageElement).style.display = 'none';
  };

  return (
    <div 
      className="clue-card space-y-2" 
      style={{ '--animation-order': index } as React.CSSProperties}
    >
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-mystery-700 text-white text-xs font-bold">
          {index + 1}
        </div>
        {hasTextContent && <span className="text-lg font-medium">{textClue}</span>}
      </div>
      {hasImage && imageUrl && !imageError && (
        <div className="mt-2">
          <img 
            src={imageUrl} 
            alt="Clue Image" 
            className="max-w-full h-auto rounded-lg object-contain" 
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          {!imageLoaded && (
            <div className="text-sm text-muted-foreground">Loading image...</div>
          )}
        </div>
      )}
      {hasImage && imageError && (
        <div className="p-2 bg-muted rounded-md text-sm">
          The image for this clue couldn't be displayed.
        </div>
      )}
    </div>
  );
};

export default ClueCard;
