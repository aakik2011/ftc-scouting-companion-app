
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users } from 'lucide-react';

interface Match {
  id: string;
  matchNumber: string;
  teams: string[];
  status: 'upcoming' | 'in-progress' | 'completed';
}

interface MatchCardProps {
  match: Match;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartScouting = () => {
    navigate(`/match-scouting/scout/${match.id}`);
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-200 border-2 hover:border-orange-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Match {match.matchNumber}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <Users className="w-4 h-4 mr-1" />
              <span>{match.teams.length} teams</span>
            </div>
          </div>
        </div>
        <Badge className={getStatusColor(match.status)}>
          {match.status.replace('-', ' ')}
        </Badge>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Teams:</p>
        <div className="flex flex-wrap gap-2">
          {match.teams.map((team, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {team}
            </Badge>
          ))}
        </div>
      </div>

      <Button
        onClick={handleStartScouting}
        className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
        disabled={match.status === 'completed'}
      >
        {match.status === 'completed' ? 'View Results' : 'Start Scouting'}
      </Button>
    </Card>
  );
};

export default MatchCard;
