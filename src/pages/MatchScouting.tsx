
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Plus, Trash2, BarChart3 } from 'lucide-react';
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
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Team {
  teamNumber: string;
  teamName: string;
}

interface MatchEntry {
  matchNumber: string;
  redTeam1: string;
  redTeam2: string;
  blueTeam1: string;
  blueTeam2: string;
  redTeam1Auto: string;
  redTeam1Teleop: string;
  redTeam1Hang: string;
  redTeam2Auto: string;
  redTeam2Teleop: string;
  redTeam2Hang: string;
  blueTeam1Auto: string;
  blueTeam1Teleop: string;
  blueTeam1Hang: string;
  blueTeam2Auto: string;
  blueTeam2Teleop: string;
  blueTeam2Hang: string;
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchEntry[]>([
    {
      matchNumber: '1',
      redTeam1: '', redTeam2: '', blueTeam1: '', blueTeam2: '',
      redTeam1Auto: '', redTeam1Teleop: '', redTeam1Hang: '',
      redTeam2Auto: '', redTeam2Teleop: '', redTeam2Hang: '',
      blueTeam1Auto: '', blueTeam1Teleop: '', blueTeam1Hang: '',
      blueTeam2Auto: '', blueTeam2Teleop: '', blueTeam2Hang: ''
    }
  ]);

  useEffect(() => {
    const savedTeams = localStorage.getItem('eventTeams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

  const addMatch = () => {
    const newMatchNumber = (matches.length + 1).toString();
    setMatches([...matches, {
      matchNumber: newMatchNumber,
      redTeam1: '', redTeam2: '', blueTeam1: '', blueTeam2: '',
      redTeam1Auto: '', redTeam1Teleop: '', redTeam1Hang: '',
      redTeam2Auto: '', redTeam2Teleop: '', redTeam2Hang: '',
      blueTeam1Auto: '', blueTeam1Teleop: '', blueTeam1Hang: '',
      blueTeam2Auto: '', blueTeam2Teleop: '', blueTeam2Hang: ''
    }]);
  };

  const removeMatch = (index: number) => {
    if (matches.length > 1) {
      setMatches(matches.filter((_, i) => i !== index));
    }
  };

  const updateMatch = (index: number, field: keyof MatchEntry, value: string) => {
    const updatedMatches = [...matches];
    updatedMatches[index][field] = value;
    setMatches(updatedMatches);
  };

  const calculateAverage = (auto: string, teleop: string, hang: string) => {
    const a = parseFloat(auto) || 0;
    const t = parseFloat(teleop) || 0;
    const h = parseFloat(hang) || 0;
    return ((a + t + h) / 3).toFixed(1);
  };

  const generateGraphData = () => {
    const data: any[] = [];
    matches.forEach((match, matchIndex) => {
      const teams = [
        { key: 'redTeam1', team: match.redTeam1, auto: match.redTeam1Auto, teleop: match.redTeam1Teleop, hang: match.redTeam1Hang },
        { key: 'redTeam2', team: match.redTeam2, auto: match.redTeam2Auto, teleop: match.redTeam2Teleop, hang: match.redTeam2Hang },
        { key: 'blueTeam1', team: match.blueTeam1, auto: match.blueTeam1Auto, teleop: match.blueTeam1Teleop, hang: match.blueTeam1Hang },
        { key: 'blueTeam2', team: match.blueTeam2, auto: match.blueTeam2Auto, teleop: match.blueTeam2Teleop, hang: match.blueTeam2Hang }
      ];
      
      teams.forEach(({ team, auto, teleop, hang }) => {
        if (team) {
          const autoScore = parseFloat(auto) || 0;
          const teleopScore = parseFloat(teleop) || 0;
          const hangScore = parseFloat(hang) || 0;
          const matchAverage = (autoScore + teleopScore + hangScore) / 3;
          
          data.push({
            teamNumber: team,
            matchAverage,
            totalAverage: matchAverage, // For now, same as match average
            matchNumber: match.matchNumber,
            type: 'Match Average'
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
                        onChange={(e) => updateMatch(index, 'redTeam1Auto', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam1Teleop}
                        onChange={(e) => updateMatch(index, 'redTeam1Teleop', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam1Hang}
                        onChange={(e) => updateMatch(index, 'redTeam1Hang', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.redTeam1Auto, match.redTeam1Teleop, match.redTeam1Hang)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.redTeam1Auto, match.redTeam1Teleop, match.redTeam1Hang)}
                    </TableCell>
                  </TableRow>
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
                        onChange={(e) => updateMatch(index, 'redTeam2Auto', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam2Teleop}
                        onChange={(e) => updateMatch(index, 'redTeam2Teleop', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam2Hang}
                        onChange={(e) => updateMatch(index, 'redTeam2Hang', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.redTeam2Auto, match.redTeam2Teleop, match.redTeam2Hang)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.redTeam2Auto, match.redTeam2Teleop, match.redTeam2Hang)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Blue Alliance */}
            <div>
              <h3 className="text-lg font-medium text-blue-600 mb-2">Blue Alliance</h3>
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
                        onChange={(e) => updateMatch(index, 'blueTeam1Auto', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam1Teleop}
                        onChange={(e) => updateMatch(index, 'blueTeam1Teleop', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam1Hang}
                        onChange={(e) => updateMatch(index, 'blueTeam1Hang', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.blueTeam1Auto, match.blueTeam1Teleop, match.blueTeam1Hang)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.blueTeam1Auto, match.blueTeam1Teleop, match.blueTeam1Hang)}
                    </TableCell>
                  </TableRow>
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
                        onChange={(e) => updateMatch(index, 'blueTeam2Auto', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam2Teleop}
                        onChange={(e) => updateMatch(index, 'blueTeam2Teleop', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam2Hang}
                        onChange={(e) => updateMatch(index, 'blueTeam2Hang', e.target.value)}
                        className="w-16"
                        placeholder="0"
                        type="number"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.blueTeam2Auto, match.blueTeam2Teleop, match.blueTeam2Hang)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateAverage(match.blueTeam2Auto, match.blueTeam2Teleop, match.blueTeam2Hang)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
          <h3 className="text-lg font-medium mb-4">Team Performance Scatter Plot</h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart data={graphData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="matchAverage" 
                name="Match Average"
                domain={[0, 5]}
              />
              <YAxis 
                type="number" 
                dataKey="totalAverage" 
                name="Total Average"
                domain={[0, 5]}
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
                        <p>Match Average: {data.matchAverage.toFixed(1)}</p>
                        <p>Total Average: {data.totalAverage.toFixed(1)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="totalAverage" fill="#3b82f6" />
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
                className="rotate-90"
              >
                <ArrowUp className="w-5 h-5" />
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
