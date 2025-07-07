
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUp, Trophy } from 'lucide-react';
import MatchCard from '@/components/MatchCard';

interface Match {
  id: string;
  matchNumber: string;
  teams: string[];
  status: 'upcoming' | 'in-progress' | 'completed';
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [matches] = useState<Match[]>([
    {
      id: '1',
      matchNumber: 'Q-01',
      teams: ['12345', '67890', '11111', '22222'],
      status: 'upcoming',
    },
    {
      id: '2',
      matchNumber: 'Q-02',
      teams: ['33333', '44444', '55555', '66666'],
      status: 'upcoming',
    },
    {
      id: '3',
      matchNumber: 'Q-03',
      teams: ['77777', '88888', '99999', '10101'],
      status: 'in-progress',
    },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
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
                <h1 className="text-xl font-bold text-gray-900">Match Scouting</h1>
                <p className="text-sm text-gray-500">Scout live match performance</p>
              </div>
            </div>
            <Trophy className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Match Schedule */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Match Schedule</h2>
          <div className="space-y-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchScouting;
