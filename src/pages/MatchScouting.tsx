
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
  team1: string;
  team2: string;
  team3: string;
  team4: string;
  team1Auto: string;
  team1Teleop: string;
  team1Hang: string;
  team2Auto: string;
  team2Teleop: string;
  team2Hang: string;
  team3Auto: string;
  team3Teleop: string;
  team3Hang: string;
  team4Auto: string;
  team4Teleop: string;
  team4Hang: string;
}

const MatchScouting = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [matches, setMatches] = useState<MatchEntry[]>([
    {
      matchNumber: '1',
      team1: '', team2: '', team3: '', team4: '',
      team1Auto: '', team1Teleop: '', team1Hang: '',
      team2Auto: '', team2Teleop: '', team2Hang: '',
      team3Auto: '', team3Teleop: '', team3Hang: '',
      team4Auto: '', team4Teleop: '', team4Hang: ''
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
      team1: '', team2: '', team3: '', team4: '',
      team1Auto: '', team1Teleop: '', team1Hang: '',
      team2Auto: '', team2Teleop: '', team2Hang: '',
      team3Auto: '', team3Teleop: '', team3Hang: '',
      team4Auto: '', team4Teleop: '', team4Hang: ''
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
      ['team1', 'team2', 'team3', 'team4'].forEach((teamKey) => {
        const teamNumber = match[teamKey as keyof MatchEntry] as string;
        if (teamNumber) {
          const auto = parseFloat(match[`${teamKey}Auto` as keyof MatchEntry] as string) || 0;
          const teleop = parseFloat(match[`${teamKey}Teleop` as keyof MatchEntry] as string) || 0;
          const hang = parseFloat(match[`${teamKey}Hang` as keyof MatchEntry] as string) || 0;
          const matchAverage = (auto + teleop + hang) / 3;
          
          data.push({
            teamNumber,
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

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Match #</TableHead>
              <TableHead>Team #1</TableHead>
              <TableHead>Auto</TableHead>
              <TableHead>Tele-op</TableHead>
              <TableHead>Hang</TableHead>
              <TableHead>Avg</TableHead>
              <TableHead>Team #2</TableHead>
              <TableHead>Auto</TableHead>
              <TableHead>Tele-op</TableHead>
              <TableHead>Hang</TableHead>
              <TableHead>Avg</TableHead>
              <TableHead>Team #3</TableHead>
              <TableHead>Auto</TableHead>
              <TableHead>Tele-op</TableHead>
              <TableHead>Hang</TableHead>
              <TableHead>Avg</TableHead>
              <TableHead>Team #4</TableHead>
              <TableHead>Auto</TableHead>
              <TableHead>Tele-op</TableHead>
              <TableHead>Hang</TableHead>
              <TableHead>Avg</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Input
                    value={match.matchNumber}
                    onChange={(e) => updateMatch(index, 'matchNumber', e.target.value)}
                    className="w-16"
                  />
                </TableCell>
                
                {/* Team 1 */}
                <TableCell>
                  <Input
                    value={match.team1}
                    onChange={(e) => updateMatch(index, 'team1', e.target.value)}
                    className="w-20"
                    placeholder="Team #"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team1Auto}
                    onChange={(e) => updateMatch(index, 'team1Auto', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team1Teleop}
                    onChange={(e) => updateMatch(index, 'team1Teleop', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team1Hang}
                    onChange={(e) => updateMatch(index, 'team1Hang', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {calculateAverage(match.team1Auto, match.team1Teleop, match.team1Hang)}
                </TableCell>

                {/* Team 2 */}
                <TableCell>
                  <Input
                    value={match.team2}
                    onChange={(e) => updateMatch(index, 'team2', e.target.value)}
                    className="w-20"
                    placeholder="Team #"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team2Auto}
                    onChange={(e) => updateMatch(index, 'team2Auto', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team2Teleop}
                    onChange={(e) => updateMatch(index, 'team2Teleop', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team2Hang}
                    onChange={(e) => updateMatch(index, 'team2Hang', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {calculateAverage(match.team2Auto, match.team2Teleop, match.team2Hang)}
                </TableCell>

                {/* Team 3 */}
                <TableCell>
                  <Input
                    value={match.team3}
                    onChange={(e) => updateMatch(index, 'team3', e.target.value)}
                    className="w-20"
                    placeholder="Team #"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team3Auto}
                    onChange={(e) => updateMatch(index, 'team3Auto', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team3Teleop}
                    onChange={(e) => updateMatch(index, 'team3Teleop', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team3Hang}
                    onChange={(e) => updateMatch(index, 'team3Hang', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {calculateAverage(match.team3Auto, match.team3Teleop, match.team3Hang)}
                </TableCell>

                {/* Team 4 */}
                <TableCell>
                  <Input
                    value={match.team4}
                    onChange={(e) => updateMatch(index, 'team4', e.target.value)}
                    className="w-20"
                    placeholder="Team #"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team4Auto}
                    onChange={(e) => updateMatch(index, 'team4Auto', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team4Teleop}
                    onChange={(e) => updateMatch(index, 'team4Teleop', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={match.team4Hang}
                    onChange={(e) => updateMatch(index, 'team4Hang', e.target.value)}
                    className="w-16"
                    placeholder="0"
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {calculateAverage(match.team4Auto, match.team4Teleop, match.team4Hang)}
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMatch(index)}
                    disabled={matches.length === 1}
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
                dataKey="matchNumber" 
                name="Match Number"
                domain={[1, 'dataMax']}
              />
              <YAxis 
                type="number" 
                dataKey="matchAverage" 
                name="Match Average"
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
                        <p>Average: {data.matchAverage.toFixed(1)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter dataKey="matchAverage" fill="#3b82f6" />
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
