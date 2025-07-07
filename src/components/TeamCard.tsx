
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Edit } from 'lucide-react';

interface Team {
  id: string;
  teamNumber: string;
  teamName: string;
  pitLocation: string;
  surveyData?: any;
}

interface TeamCardProps {
  team: Team;
}

const TeamCard = ({ team }: TeamCardProps) => {
  const navigate = useNavigate();

  const handleEditSurvey = () => {
    navigate(`/pit-scouting/survey/${team.id}`);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border-2 hover:border-blue-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">{team.teamNumber.slice(-2)}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Team {team.teamNumber}</h3>
              <p className="text-sm text-gray-600">{team.teamName}</p>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>Pit {team.pitLocation}</span>
          </div>
        </div>
        <Button
          onClick={handleEditSurvey}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Edit className="w-4 h-4 mr-1" />
          Survey
        </Button>
      </div>
    </Card>
  );
};

export default TeamCard;
