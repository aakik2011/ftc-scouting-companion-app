
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2, BarChart3 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MatchData {
  matchNumber: string;
  redTeam1: string;
  redTeam2: string;
  blueTeam1: string;
  blueTeam2: string;
  // Red Alliance Scores
  redTeam1Auto: number;
  redTeam1Teleop: number;
  redTeam1Hang: number;
  redTeam2Auto: number;
  redTeam2Teleop: number;
  redTeam2Hang: number;
  // Blue Alliance Scores
  blueTeam1Auto: number;
  blueTeam1Teleop: number;
  blueTeam1Hang: number;
  blueTeam2Auto: number;
  blueTeam2Teleop: number;
  blueTeam2Hang: number;
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [matches, setMatches] = useState<MatchData[]>([
    {
      matchNumber: '1',
      redTeam1: '', redTeam2: '', blueTeam1: '', blueTeam2: '',
      redTeam1Auto: 0, redTeam1Teleop: 0, redTeam1Hang: 0,
      redTeam2Auto: 0, redTeam2Teleop: 0, redTeam2Hang: 0,
      blueTeam1Auto: 0, blueTeam1Teleop: 0, blueTeam1Hang: 0,
      blueTeam2Auto: 0, blueTeam2Teleop: 0, blueTeam2Hang: 0
    }
  ]);

  useEffect(() => {
    // Load saved match data
    const savedMatches = localStorage.getItem('matchScoutingData');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  const addMatch = () => {
    const newMatchNumber = (matches.length + 1).toString();
    const newMatch: MatchData = {
      matchNumber: newMatchNumber,
      redTeam1: '', redTeam2: '', blueTeam1: '', blueTeam2: '',
      redTeam1Auto: 0, redTeam1Teleop: 0, redTeam1Hang: 0,
      redTeam2Auto: 0, redTeam2Teleop: 0, redTeam2Hang: 0,
      blueTeam1Auto: 0, blueTeam1Teleop: 0, blueTeam1Hang: 0,
      blueTeam2Auto: 0, blueTeam2Teleop: 0, blueTeam2Hang: 0
    };
    const updatedMatches = [...matches, newMatch];
    setMatches(updatedMatches);
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));
  };

  const removeMatch = (index: number) => {
    if (matches.length > 1) {
      const updatedMatches = matches.filter((_, i) => i !== index);
      setMatches(updatedMatches);
      localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));
    }
  };

  const updateMatch = (index: number, field: keyof MatchData, value: string | number) => {
    const updatedMatches = [...matches];
    
    if (typeof value === 'string') {
      updatedMatches[index][field] = value as any;
    } else {
      // Limit numeric values to 0-5
      updatedMatches[index][field] = Math.max(0, Math.min(5, value)) as any;
    }
    
    setMatches(updatedMatches);
    // Save continuously
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));
  };

  const calculateMatchAverage = (auto: number, teleop: number, hang: number) => {
    return ((auto + teleop + hang) / 3).toFixed(1);
  };

  const calculateTotalAverage = (auto: number, teleop: number, hang: number) => {
    return ((auto + teleop + hang) / 3).toFixed(1);
  };

  const generateGraphData = () => {
    const data: any[] = [];
    
    matches.forEach((match) => {
      const teams = [
        { team: match.redTeam1, auto: match.redTeam1Auto, teleop: match.redTeam1Teleop, hang: match.redTeam1Hang },
        { team: match.redTeam2, auto: match.redTeam2Auto, teleop: match.redTeam2Teleop, hang: match.redTeam2Hang },
        { team: match.blueTeam1, auto: match.blueTeam1Auto, teleop: match.blueTeam1Teleop, hang: match.blueTeam1Hang },
        { team: match.blueTeam2, auto: match.blueTeam2Auto, teleop: match.blueTeam2Teleop, hang: match.blueTeam2Hang }
      ];
      
      teams.forEach(({ team, auto, teleop, hang }) => {
        if (team) {
          const overallScore = (auto + teleop + hang) / 3;
          
          data.push({
            x: parseInt(match.matchNumber),
            y: overallScore,
            teamNumber: team,
            matchNumber: match.matchNumber,
            overallScore: overallScore.toFixed(1)
          });
        }
      });
    });
    
    return data;
  };

  const TableView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Match Schedule & Scouting</h2>
        <Button onClick={addMatch} variant="outline" className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Match</span>
        </Button>
      </div>
      <p className="text-sm text-gray-600">All scores are on a scale of 0-5. Data is saved automatically.</p>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <div key={index} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <label className="font-medium">Match #:</label>
                <Input
                  value={match.matchNumber}
                  onChange={(e) => updateMatch(index, 'matchNumber', e.target.value)}
                  className="w-20"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeMatch(index)}
                disabled={matches.length === 1}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Red Alliance */}
            <div className="mb-4">
              <h3 className="text-lg font-medium text-red-600 mb-2">Red Alliance</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Red Team 1 */}
                <div>
                  <h4 className="font-medium mb-2">Team 1</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team #</TableHead>
                        <TableHead>Auto</TableHead>
                        <TableHead>Tele-op</TableHead>
                        <TableHead>Hang</TableHead>
                        <TableHead>Match Avg</TableHead>
                        <TableHead>Total Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            value={match.redTeam1}
                            onChange={(e) => updateMatch(index, 'redTeam1', e.target.value)}
                            className="w-20"
                            placeholder="Team #"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam1Auto}
                            onChange={(e) => updateMatch(index, 'redTeam1Auto', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam1Teleop}
                            onChange={(e) => updateMatch(index, 'redTeam1Teleop', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam1Hang}
                            onChange={(e) => updateMatch(index, 'redTeam1Hang', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateMatchAverage(match.redTeam1Auto, match.redTeam1Teleop, match.redTeam1Hang)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateTotalAverage(match.redTeam1Auto, match.redTeam1Teleop, match.redTeam1Hang)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                {/* Red Team 2 */}
                <div>
                  <h4 className="font-medium mb-2">Team 2</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team #</TableHead>
                        <TableHead>Auto</TableHead>
                        <TableHead>Tele-op</TableHead>
                        <TableHead>Hang</TableHead>
                        <TableHead>Match Avg</TableHead>
                        <TableHead>Total Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            value={match.redTeam2}
                            onChange={(e) => updateMatch(index, 'redTeam2', e.target.value)}
                            className="w-20"
                            placeholder="Team #"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam2Auto}
                            onChange={(e) => updateMatch(index, 'redTeam2Auto', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam2Teleop}
                            onChange={(e) => updateMatch(index, 'redTeam2Teleop', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.redTeam2Hang}
                            onChange={(e) => updateMatch(index, 'redTeam2Hang', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateMatchAverage(match.redTeam2Auto, match.redTeam2Teleop, match.redTeam2Hang)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateTotalAverage(match.redTeam2Auto, match.redTeam2Teleop, match.redTeam2Hang)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Blue Alliance */}
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Blue Alliance</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Blue Team 1 */}
                <div>
                  <h4 className="font-medium mb-2">Team 1</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team #</TableHead>
                        <TableHead>Auto</TableHead>
                        <TableHead>Tele-op</TableHead>
                        <TableHead>Hang</TableHead>
                        <TableHead>Match Avg</TableHead>
                        <TableHead>Total Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            value={match.blueTeam1}
                            onChange={(e) => updateMatch(index, 'blueTeam1', e.target.value)}
                            className="w-20"
                            placeholder="Team #"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam1Auto}
                            onChange={(e) => updateMatch(index, 'blueTeam1Auto', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam1Teleop}
                            onChange={(e) => updateMatch(index, 'blueTeam1Teleop', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam1Hang}
                            onChange={(e) => updateMatch(index, 'blueTeam1Hang', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateMatchAverage(match.blueTeam1Auto, match.blueTeam1Teleop, match.blueTeam1Hang)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateTotalAverage(match.blueTeam1Auto, match.blueTeam1Teleop, match.blueTeam1Hang)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                
                {/* Blue Team 2 */}
                <div>
                  <h4 className="font-medium mb-2">Team 2</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team #</TableHead>
                        <TableHead>Auto</TableHead>
                        <TableHead>Tele-op</TableHead>
                        <TableHead>Hang</TableHead>
                        <TableHead>Match Avg</TableHead>
                        <TableHead>Total Avg</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Input
                            value={match.blueTeam2}
                            onChange={(e) => updateMatch(index, 'blueTeam2', e.target.value)}
                            className="w-20"
                            placeholder="Team #"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam2Auto}
                            onChange={(e) => updateMatch(index, 'blueTeam2Auto', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam2Teleop}
                            onChange={(e) => updateMatch(index, 'blueTeam2Teleop', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            value={match.blueTeam2Hang}
                            onChange={(e) => updateMatch(index, 'blueTeam2Hang', parseInt(e.target.value) || 0)}
                            className="w-16"
                            placeholder="0-5"
                            type="number"
                            min="0"
                            max="5"
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateMatchAverage(match.blueTeam2Auto, match.blueTeam2Teleop, match.blueTeam2Hang)}
                        </TableCell>
                        <TableCell className="font-medium">
                          {calculateTotalAverage(match.blueTeam2Auto, match.blueTeam2Teleop, match.blueTeam2Hang)}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const GraphView = () => {
    const graphData = generateGraphData();
    
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Performance Analysis</h2>
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Team Performance by Match</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Match Number"
                domain={['dataMin', 'dataMax']}
                label={{ value: 'Match Number', position: 'insideBottom', offset: -5 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Overall Score"
                domain={[0, 5]}
                label={{ value: 'Overall Score', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border rounded shadow">
                        <p className="font-medium">Team {data.teamNumber}</p>
                        <p>Match {data.matchNumber}</p>
                        <p>Overall Score: {data.overallScore}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="y" fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 py-4">
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
                <h1 className="text-xl font-bold text-gray-900">Match Scouting</h1>
                <p className="text-sm text-gray-500">Enter match data and view performance analysis</p>
              </div>
            </div>
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4">
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <Card className="p-6">
                <TableView />
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="p-6">
                <GraphView />
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
        
        <div className="flex justify-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default MatchScouting;
