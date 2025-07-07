
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Team {
  teamNumber: string;
  teamName: string;
  pitLocation: string;
}

interface AddTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (team: Team) => void;
}

const AddTeamModal = ({ isOpen, onClose, onAdd }: AddTeamModalProps) => {
  const [formData, setFormData] = useState<Team>({
    teamNumber: '',
    teamName: '',
    pitLocation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.teamNumber && formData.teamName && formData.pitLocation) {
      onAdd(formData);
      setFormData({ teamNumber: '', teamName: '', pitLocation: '' });
    }
  };

  const handleChange = (field: keyof Team, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="teamNumber">Team Number</Label>
            <Input
              id="teamNumber"
              value={formData.teamNumber}
              onChange={(e) => handleChange('teamNumber', e.target.value)}
              placeholder="e.g., 12345"
              required
            />
          </div>
          <div>
            <Label htmlFor="teamName">Team Name</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => handleChange('teamName', e.target.value)}
              placeholder="e.g., Tech Tigers"
              required
            />
          </div>
          <div>
            <Label htmlFor="pitLocation">Pit Location</Label>
            <Input
              id="pitLocation"
              value={formData.pitLocation}
              onChange={(e) => handleChange('pitLocation', e.target.value)}
              placeholder="e.g., A-12"
              required
            />
          </div>
          <div className="flex space-x-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700">
              Add Team
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTeamModal;
