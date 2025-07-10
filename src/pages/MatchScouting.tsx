
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Trophy, Users, Target, BarChart3, Plus, Trash2 } from 'lucide-react';

interface Match {
  id: string;
  matchNumber: string;
  redTeams: string[];
  blueTeams: string[];
  redScore1: string;
  redScore2: string;
  redScore3: string;
  blueScore1: string;
  blueScore2: string;
  blueScore3: string;
  notes: string;
  redAverage: number;
  blueAverage: number;
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<Match[]>([]);
  const [newMatch, setNewMatch] = useState({
    matchNumber: '',
    redTeams: ['', '', ''],
    blueTeams: ['', '', ''],
    redScore1: '',
    redScore2: '',
    redScore3: '',
    blueScore1: '',
    blueScore2: '',
    blueScore3: '',
    notes: '',
  });

  useEffect(() => {
    const savedData = localStorage.getItem('matchScoutingData');
    if (savedData) {
      setMatches(JSON.parse(savedData));
    }
  }, []);

  const calculateAverage = (score1: string, score2: string, score3: string): number => {
    const num1 = parseFloat(score1) || 0;
    const num2 = parseFloat(score2) || 0;
    const num3 = parseFloat(score3) || 0;
    return (num1 + num2 + num3) / 3;
  };

  const handleSaveMatch = () => {
    if (!newMatch.matchNumber.trim()) return;

    const match: Match = {
      id: Date.now().toString(),
      matchNumber: newMatch.matchNumber,
      redTeams: newMatch.redTeams,
      blueTeams: newMatch.blueTeams,
      redScore1: newMatch.redScore1,
      redScore2: newMatch.redScore2,
      redScore3: newMatch.redScore3,
      blueScore1: newMatch.blueScore1,
      blueScore2: newMatch.blueScore2,
      blueScore3: newMatch.blueScore3,
      notes: newMatch.notes,
      redAverage: calculateAverage(newMatch.redScore1, newMatch.redScore2, newMatch.redScore3),
      blueAverage: calculateAverage(newMatch.blueScore1, newMatch.blueScore2, newMatch.blueScore3),
    };

    const updatedMatches = [...matches, match];
    setMatches(updatedMatches);
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));

    // Reset form
    setNewMatch({
      matchNumber: '',
      redTeams: ['', '', ''],
      blueTeams: ['', '', ''],
      redScore1: '',
      redScore2: '',
      redScore3: '',
      blueScore1: '',
      blueScore2: '',
      blueScore3: '',
      notes: '',
    });
  };

  const handleDeleteMatch = (matchId: string) => {
    const updatedMatches = matches.filter(match => match.id !== matchId);
    setMatches(updatedMatches);
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));
  };

  const updateTeam = (alliance: 'red' | 'blue', index: number, value: string) => {
    if (alliance === 'red') {
      const newRedTeams = [...newMatch.redTeams];
      newRedTeams[index] = value;
      setNewMatch({ ...newMatch, redTeams: newRedTeams });
    } else {
      const newBlueTeams = [...newMatch.blueTeams];
      newBlueTeams[index] = value;
      setNewMatch({ ...newMatch, blueTeams: newBlueTeams });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Match Scouting</h1>
                <p className="text-sm text-gray-500">Real-time match performance tracking</p>
              </div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Add New Match Form */}
        <Card className="p-6 border-2 border-orange-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Add New Match
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="matchNumber">Match Number</Label>
              <Input
                id="matchNumber"
                value={newMatch.matchNumber}
                onChange={(e) => setNewMatch({ ...newMatch, matchNumber: e.target.value })}
                placeholder="e.g., Q1, SF2, F1"
              />
            </div>

            {/* Red Alliance */}
            <div>
              <h3 className="font-semibold text-red-700 mb-2 flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                Red Alliance
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {newMatch.redTeams.map((team, index) => (
                  <Input
                    key={index}
                    value={team}
                    onChange={(e) => updateTeam('red', index, e.target.value)}
                    placeholder={`Team ${index + 1}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Score 1 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.redScore1}
                    onChange={(e) => setNewMatch({ ...newMatch, redScore1: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
                <div>
                  <Label className="text-xs">Score 2 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.redScore2}
                    onChange={(e) => setNewMatch({ ...newMatch, redScore2: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
                <div>
                  <Label className="text-xs">Score 3 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.redScore3}
                    onChange={(e) => setNewMatch({ ...newMatch, redScore3: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
              </div>
            </div>

            {/* Blue Alliance */}
            <div>
              <h3 className="font-semibold text-blue-700 mb-2 flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                Blue Alliance
              </h3>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {newMatch.blueTeams.map((team, index) => (
                  <Input
                    key={index}
                    value={team}
                    onChange={(e) => updateTeam('blue', index, e.target.value)}
                    placeholder={`Team ${index + 1}`}
                  />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-xs">Score 1 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.blueScore1}
                    onChange={(e) => setNewMatch({ ...newMatch, blueScore1: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
                <div>
                  <Label className="text-xs">Score 2 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.blueScore2}
                    onChange={(e) => setNewMatch({ ...newMatch, blueScore2: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
                <div>
                  <Label className="text-xs">Score 3 (0-5)</Label>
                  <Input
                    type="text"
                    value={newMatch.blueScore3}
                    onChange={(e) => setNewMatch({ ...newMatch, blueScore3: e.target.value })}
                    placeholder="0-5"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Match Notes</Label>
              <Textarea
                id="notes"
                value={newMatch.notes}
                onChange={(e) => setNewMatch({ ...newMatch, notes: e.target.value })}
                placeholder="Additional observations about the match..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleSaveMatch}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
            >
              Save Match
            </Button>
          </div>
        </Card>

        {/* Matches List */}
        {matches.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Match Results ({matches.length})
            </h2>
            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.id} className="p-4 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Match {match.matchNumber}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteMatch(match.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Red Alliance Results */}
                    <div className="border border-red-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-red-700 flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                          Red Alliance
                        </h4>
                        <Badge className="bg-red-100 text-red-800">
                          Avg: {match.redAverage.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Teams:</span>
                          <span>{match.redTeams.filter(t => t).join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Scores:</span>
                          <span>{match.redScore1} | {match.redScore2} | {match.redScore3}</span>
                        </div>
                      </div>
                    </div>

                    {/* Blue Alliance Results */}
                    <div className="border border-blue-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-blue-700 flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                          Blue Alliance
                        </h4>
                        <Badge className="bg-blue-100 text-blue-800">
                          Avg: {match.blueAverage.toFixed(1)}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Teams:</span>
                          <span>{match.blueTeams.filter(t => t).join(', ')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Scores:</span>
                          <span>{match.blueScore1} | {match.blueScore2} | {match.blueScore3}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {match.notes && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <strong>Notes:</strong> {match.notes}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {matches.length === 0 && (
          <Card className="p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches recorded yet</h3>
            <p className="text-gray-600">Add your first match above to start tracking performance!</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MatchScouting;
