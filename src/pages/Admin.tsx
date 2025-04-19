
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AdminPanelProvider } from '@/contexts/AdminPanelContext';
import { WinnerForm } from '@/components/admin/WinnerForm';
import { WinnersList } from '@/components/admin/WinnersList';

const AdminContent = () => {
  const [isAddingWinner, setIsAddingWinner] = useState(false);
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Current Winners</CardTitle>
            <Button onClick={() => setIsAddingWinner(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Winner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <WinnersList />
        </CardContent>
      </Card>

      {isAddingWinner && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Winner</CardTitle>
          </CardHeader>
          <CardContent>
            <WinnerForm onComplete={() => setIsAddingWinner(false)} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const Admin = () => {
  return (
    <AdminPanelProvider>
      <AdminContent />
    </AdminPanelProvider>
  );
};

export default Admin;
