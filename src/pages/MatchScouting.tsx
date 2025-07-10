
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, Trophy, Settings, BarChart3, Trash2, Save } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MatchSetup {
  totalMatches: number;
  ourTeam: string;
  matches: {
    matchNumber: number;
    redTeam1: string;
    redTeam2: string;
    blueTeam1: string;
    blueTeam2: string;
  }[];
}

interface TeamScore {
  auto: number;
  teleop: number;
  hang: number;
  matchAverage: number;
}

interface MatchData {
  matchNumber: number;
  redTeam1: string;
  redTeam2: string;
  blueTeam1: string;
  blueTeam2: string;
  scores: {
    [teamNumber: string]: TeamScore;
  };
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [matchSetup, setMatchSetup] = useState<MatchSetup>({
    totalMatches: 0,
    ourTeam: '',
    matches: []
  });
  const [matchData, setMatchData] = useState<MatchData[]>([]);
  const [setupForm, setSetupForm] = useState({
    totalMatches: '',
    ourTeam: ''
  });

  useEffect(() => {
    const savedSetup = localStorage.getItem('matchScoutingSetup');
    const savedData = localStorage.getItem('matchScoutingData');
    
    if (savedSetup) {
      const setup = JSON.parse(savedSetup);
      setMatchSetup(setup);
      setIsSetupComplete(true);
    }
    
    if (savedData) {
      setMatchData(JSON.parse(savedData));
    }
  }, []);

  const handleSetupSubmit = () => {
    const totalMatches = parseInt(setupForm.totalMatches);
    if (totalMatches <= 0 || !setupForm.ourTeam.trim()) return;

    const matches = Array.from({ length: totalMatches }, (_, i) => ({
      matchNumber: i + 1,
      redTeam1: '',
      redTeam2: '',
      blueTeam1: '',
      blueTeam2: ''
    }));

    const setup: MatchSetup = {
      totalMatches,
      ourTeam: setupForm.ourTeam,
      matches
    };

    setMatchSetup(setup);
    localStorage.setItem('matchScoutingSetup', JSON.stringify(setup));
    setIsSetupComplete(true);
  };

  const updateMatchTeam = (matchIndex: number, position: string, teamNumber: string) => {
    const updatedSetup = { ...matchSetup };
    updatedSetup.matches[matchIndex] = {
      ...updatedSetup.matches[matchIndex],
      [position]: teamNumber
    };
    setMatchSetup(updatedSetup);
    localStorage.setItem('matchScoutingSetup', JSON.stringify(updatedSetup));
  };

  const finalizeSchedule = () => {
    const initialMatchData: MatchData[] = matchSetup.matches.map(match => ({
      ...match,
      scores: {}
    }));

    // Initialize scores for all teams
    matchSetup.matches.forEach(match => {
      const teams = [match.redTeam1, match.redTeam2, match.blueTeam1, match.blueTeam2];
      teams.forEach(team => {
        if (team.trim()) {
          const matchIndex = initialMatchData.findIndex(m => m.matchNumber === match.matchNumber);
          if (matchIndex !== -1) {
            initialMatchData[matchIndex].scores[team] = {
              auto: 0,
              teleop: 0,
              hang: 0,
              matchAverage: 0
            };
          }
        }
      });
    });

    setMatchData(initialMatchData);
    localStorage.setItem('matchScoutingData', JSON.stringify(initialMatchData));
  };

  const updateScore = (matchIndex: number, teamNumber: string, field: 'auto' | 'teleop' | 'hang', value: string) => {
    const numValue = Math.max(0, Math.min(5, parseInt(value) || 0));
    const updatedData = [...matchData];
    
    if (!updatedData[matchIndex].scores[teamNumber]) {
      updatedData[matchIndex].scores[teamNumber] = { auto: 0, teleop: 0, hang: 0, matchAverage: 0 };
    }
    
    updatedData[matchIndex].scores[teamNumber][field] = numValue;
    
    // Calculate match average
    const scores = updatedData[matchIndex].scores[teamNumber];
    scores.matchAverage = Number(((scores.auto + scores.teleop + scores.hang) / 3).toFixed(1));
    
    setMatchData(updatedData);
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedData));
  };

  const calculateTotalAverage = (teamNumber: string): number => {
    const teamMatches = matchData.filter(match => match.scores[teamNumber]);
    if (teamMatches.length === 0) return 0;
    
    const total = teamMatches.reduce((sum, match) => sum + match.scores[teamNumber].matchAverage, 0);
    return Number((total / teamMatches.length).toFixed(1));
  };

  const getChartData = () => {
    const teamAverages: { [team: string]: number[] } = {};
    
    matchData.forEach((match, index) => {
      Object.keys(match.scores).forEach(team => {
        if (!teamAverages[team]) teamAverages[team] = [];
        teamAverages[team][index] = match.scores[team].matchAverage;
      });
    });

    return matchData.map((match, index) => {
      const dataPoint: any = { match: `Match ${match.matchNumber}` };
      Object.keys(teamAverages).forEach(team => {
        dataPoint[team] = teamAverages[team][index] || 0;
      });
      return dataPoint;
    });
  };

  const resetAllData = () => {
    if (window.confirm('Are you sure you want to reset all match scouting data?')) {
      localStorage.removeItem('matchScoutingSetup');
      localStorage.removeItem('matchScoutingData');
      setIsSetupComplete(false);
      setMatchSetup({ totalMatches: 0, ourTeam: '', matches: [] });
      setMatchData([]);
      setSetupForm({ totalMatches: '', ourTeam: '' });
    }
  };

  if (!isSetupComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Match Scouting Setup</h1>
                  <p className="text-sm text-gray-500">Configure your competition schedule</p>
                </div>
              </div>
              <Settings className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4">
          {matchSetup.totalMatches === 0 ? (
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">Competition Setup</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="totalMatches">Total Number of Matches</Label>
                  <Input
                    id="totalMatches"
                    type="number"
                    min="1"
                    value={setupForm.totalMatches}
                    onChange={(e) => setSetupForm({ ...setupForm, totalMatches: e.target.value })}
                    placeholder="Enter total matches (e.g., 12)"
                  />
                </div>
                <div>
                  <Label htmlFor="ourTeam">Our Team Number</Label>
                  <Input
                    id="ourTeam"
                    value={setupForm.ourTeam}
                    onChange={(e) => setSetupForm({ ...setupForm, ourTeam: e.target.value })}
                    placeholder="Enter your team number"
                  />
                </div>
                <Button onClick={handleSetupSubmit} className="w-full bg-orange-600 hover:bg-orange-700">
                  Create Match Schedule
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold mb-4">Enter Team Schedule</h2>
                <p className="text-gray-600 mb-4">
                  Competition: {matchSetup.totalMatches} matches | Our Team: {matchSetup.ourTeam}
                </p>
                
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Match</TableHead>
                        <TableHead className="text-red-600">Red Team 1</TableHead>
                        <TableHead className="text-red-600">Red Team 2</TableHead>
                        <TableHead className="text-blue-600">Blue Team 1</TableHead>
                        <TableHead className="text-blue-600">Blue Team 2</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {matchSetup.matches.map((match, index) => (
                        <TableRow key={match.matchNumber}>
                          <TableCell className="font-medium">Q{match.matchNumber}</TableCell>
                          <TableCell>
                            <Input
                              value={match.redTeam1}
                              onChange={(e) => updateMatchTeam(index, 'redTeam1', e.target.value)}
                              placeholder="Team #"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={match.redTeam2}
                              onChange={(e) => updateMatchTeam(index, 'redTeam2', e.target.value)}
                              placeholder="Team #"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={match.blueTeam1}
                              onChange={(e) => updateMatchTeam(index, 'blueTeam1', e.target.value)}
                              placeholder="Team #"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={match.blueTeam2}
                              onChange={(e) => updateMatchTeam(index, 'blueTeam2', e.target.value)}
                              placeholder="Team #"
                              className="w-20"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button onClick={finalizeSchedule} className="bg-green-600 hover:bg-green-700">
                    <Save className="w-4 h-4 mr-2" />
                    Finalize Schedule
                  </Button>
                  <Button onClick={resetAllData} variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset Setup
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Match Scouting</h1>
                <p className="text-sm text-gray-500">Team {matchSetup.ourTeam} | {matchSetup.totalMatches} matches</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetAllData} variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Trophy className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Performance Chart */}
        {matchData.some(match => Object.keys(match.scores).length > 0) && (
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Performance Trends
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={getChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {[1, 2, 3, 4, 5].map(y => (
                    <Line key={y} y={y} stroke="#e5e7eb" strokeDasharray="2 2" />
                  ))}
                  <XAxis 
                    dataKey="match" 
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    ticks={[0, 1, 2, 3, 4, 5]}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  {Object.keys(matchData.reduce((acc, match) => ({ ...acc, ...match.scores }), {})).map((team, index) => (
                    <Line
                      key={team}
                      type="monotone"
                      dataKey={team}
                      stroke={`hsl(${index * 60 % 360}, 70%, 50%)`}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Match Data Entry */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Match Data Entry</h2>
          {matchData.map((match, matchIndex) => (
            <Card key={match.matchNumber} className="p-4">
              <h3 className="text-lg font-semibold mb-4">Match {match.matchNumber}</h3>
              
              {/* Red Alliance */}
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <h4 className="font-semibold text-red-700 mb-2">Red Alliance</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>Auto (0-5)</TableHead>
                          <TableHead>Tele-op (0-5)</TableHead>
                          <TableHead>Hang (0-5)</TableHead>
                          <TableHead>Match Avg</TableHead>
                          <TableHead>Total Avg</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[match.redTeam1, match.redTeam2].filter(team => team.trim()).map(team => (
                          <TableRow key={team}>
                            <TableCell className="font-medium">{team}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.auto || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'auto', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.teleop || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'teleop', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.hang || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'hang', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {match.scores[team]?.matchAverage || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-red-100 text-red-800">
                                {calculateTotalAverage(team)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {/* Blue Alliance */}
              <div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="font-semibold text-blue-700 mb-2">Blue Alliance</h4>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Team</TableHead>
                          <TableHead>Auto (0-5)</TableHead>
                          <TableHead>Tele-op (0-5)</TableHead>
                          <TableHead>Hang (0-5)</TableHead>
                          <TableHead>Match Avg</TableHead>
                          <TableHead>Total Avg</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[match.blueTeam1, match.blueTeam2].filter(team => team.trim()).map(team => (
                          <TableRow key={team}>
                            <TableCell className="font-medium">{team}</TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.auto || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'auto', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.teleop || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'teleop', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                min="0"
                                max="5"
                                value={match.scores[team]?.hang || 0}
                                onChange={(e) => updateScore(matchIndex, team, 'hang', e.target.value)}
                                className="w-16"
                              />
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {match.scores[team]?.matchAverage || 0}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge className="bg-blue-100 text-blue-800">
                                {calculateTotalAverage(team)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchScouting;
