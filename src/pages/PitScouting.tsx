
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Team {
  teamNumber: string;
  teamName: string;
}

const PitScouting = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([
    { teamNumber: '', teamName: '' },
    { teamNumber: '', teamName: '' },
    { teamNumber: '', teamName: '' }
  ]);

  useEffect(() => {
    // Load saved teams
    const savedTeams = localStorage.getItem('eventTeams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const addTeamRow = () => {
    setTeams([...teams, { teamNumber: '', teamName: '' }]);
  };

  const removeTeamRow = (index: number) => {
    if (teams.length > 1) {
      const updatedTeams = teams.filter((_, i) => i !== index);
      setTeams(updatedTeams);
      localStorage.setItem('eventTeams', JSON.stringify(updatedTeams));
    }
  };

  const updateTeam = (index: number, field: keyof Team, value: string) => {
    const updatedTeams = [...teams];
    updatedTeams[index][field] = value;
    setTeams(updatedTeams);
    // Save continuously
    localStorage.setItem('eventTeams', JSON.stringify(updatedTeams));
  };

  const handleGenerateTables = () => {
    const validTeams = teams.filter(team => team.teamNumber.trim() && team.teamName.trim());
    if (validTeams.length === 0) {
      alert('Please enter at least one team with both number and name.');
      return;
    }
    
    // Store teams in localStorage for other components to use
    localStorage.setItem('eventTeams', JSON.stringify(validTeams));
    navigate('/pit-scouting/summary/team-entry');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pit Scouting</h1>
                <p className="text-sm text-gray-500">Enter all teams at your event</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Event Teams</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter all the teams participating in your event. These will be used throughout the app. Data is saved automatically.
          </p>

          <div className="bg-white rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Number</TableHead>
                  <TableHead>Team Name</TableHead>
                  <TableHead className="w-16">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={team.teamNumber}
                        onChange={(e) => updateTeam(index, 'teamNumber', e.target.value)}
                        placeholder="e.g., 1234"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={team.teamName}
                        onChange={(e) => updateTeam(index, 'teamName', e.target.value)}
                        placeholder="e.g., Awesome Robotics"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTeamRow(index)}
                        disabled={teams.length === 1}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <Button
              onClick={addTeamRow}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Team</span>
            </Button>

            <Button
              onClick={handleGenerateTables}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Generate Scouting Tables
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PitScouting;
