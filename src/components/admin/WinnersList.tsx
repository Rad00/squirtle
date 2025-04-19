
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useAdminPanel } from '@/contexts/AdminPanelContext';

export const WinnersList = () => {
  const { winners, removeWinner } = useAdminPanel();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Clues</TableHead>
          <TableHead className="w-16">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {winners.map((winner) => (
          <TableRow key={winner.id}>
            <TableCell>{winner.name}</TableCell>
            <TableCell>
              <ul className="list-disc list-inside space-y-2">
                {winner.clues.map((clue, index) => {
                  const hasImage = clue.includes('[Image:');
                  const imageUrl = hasImage ? clue.match(/\[Image: (.*?)\]/)?.[1] : null;
                  const textClue = hasImage ? clue.replace(/\[Image: .*?\]/, '').trim() : clue;

                  return (
                    <li key={index} className="truncate">
                      {textClue}
                      {imageUrl && (
                        <img src={imageUrl} alt="Clue" className="mt-1 w-20 h-20 object-cover rounded" />
                      )}
                    </li>
                  );
                })}
              </ul>
            </TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => removeWinner(winner.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
