
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowUp, Save } from 'lucide-react';

interface TeamRating {
  teamNumber: string;
  auto: number[];
  teleop: number[];
  hang: number[];
  average: number;
}

const MatchScout = () => {
  const navigate = useNavigate();
  const { matchId } = useParams();
  const [teamRatings, setTeamRatings] = useState<TeamRating[]>([
    { teamNumber: '12345', auto: [3], teleop: [3], hang: [3], average: 3 },
    { teamNumber: '67890', auto: [3], teleop: [3], hang: [3], average: 3 },
    { teamNumber: '11111', auto: [3], teleop: [3], hang: [3], average: 3 },
    { teamNumber: '22222', auto: [3], teleop: [3], hang: [3], average: 3 },
  ]);

  const updateTeamRating = (teamIndex: number, category: 'auto' | 'teleop' | 'hang', value: number[]) => {
    const updatedRatings = [...teamRatings];
    updatedRatings[teamIndex][category] = value;
    
    // Calculate average
    const auto = updatedRatings[teamIndex].auto[0];
    const teleop = updatedRatings[teamIndex].teleop[0];
    const hang = updatedRatings[teamIndex].hang[0];
    updatedRatings[teamIndex].average = Math.round(((auto + teleop + hang) / 3) * 10) / 10;
    
    setTeamRatings(updatedRatings);
  };

  const handleSave = () => {
    console.log('Saving match scouting data:', teamRatings);
    navigate('/match-scouting');
  };

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
                onClick={() => navigate('/match-scouting')}
                className="rotate-90"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Match Scouting</h1>
                <p className="text-sm text-gray-500">Match ID: {matchId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="space-y-4">
          {teamRatings.map((team, index) => (
            <Card key={team.teamNumber} className="p-4">
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Team {team.teamNumber}</h3>
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Avg: {team.average}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Auto</span>
                    <span className="text-sm text-gray-500">{team.auto[0]}/5</span>
                  </div>
                  <Slider
                    value={team.auto}
                    onValueChange={(value) => updateTeamRating(index, 'auto', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tele-op</span>
                    <span className="text-sm text-gray-500">{team.teleop[0]}/5</span>
                  </div>
                  <Slider
                    value={team.teleop}
                    onValueChange={(value) => updateTeamRating(index, 'teleop', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Hang</span>
                    <span className="text-sm text-gray-500">{team.hang[0]}/5</span>
                  </div>
                  <Slider
                    value={team.hang}
                    onValueChange={(value) => updateTeamRating(index, 'hang', value)}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </Card>
          ))}

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Match Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchScout;
