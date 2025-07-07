
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Search, Users } from 'lucide-react';
import TeamCard from '@/components/TeamCard';
import AddTeamModal from '@/components/AddTeamModal';

interface Team {
  id: string;
  teamNumber: string;
  teamName: string;
  pitLocation: string;
  surveyData?: any;
}

const PitScouting = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      teamNumber: '12345',
      teamName: 'Tech Tigers',
      pitLocation: 'A-12',
    },
    {
      id: '2',
      teamNumber: '67890',
      teamName: 'Robo Raptors',
      pitLocation: 'B-05',
    },
    {
      id: '3',
      teamNumber: '11111',
      teamName: 'Circuit Breakers',
      pitLocation: 'C-18',
    },
  ]);

  const filteredTeams = teams.filter(team =>
    team.teamNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTeam = (newTeam: Omit<Team, 'id'>) => {
    setTeams([...teams, { ...newTeam, id: Date.now().toString() }]);
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="rotate-90"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pit Scouting</h1>
                <p className="text-sm text-gray-500">Survey teams in the pits</p>
              </div>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Search and Add */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            Add New Team
          </Button>
        </div>

        {/* Teams List */}
        <div className="space-y-4">
          {filteredTeams.length > 0 ? (
            filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))
          ) : (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Users className="w-12 h-12 mx-auto mb-3" />
                <p>No teams found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      <AddTeamModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTeam}
      />
    </div>
  );
};

export default PitScouting;
