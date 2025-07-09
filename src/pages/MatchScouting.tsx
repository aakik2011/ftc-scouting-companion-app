
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2, BarChart3, Settings } from 'lucide-react';
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
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface MatchSchedule {
  matchNumber: string;
  redTeam1: string;
  redTeam2: string;
  blueTeam1: string;
  blueTeam2: string;
}

interface MatchData extends MatchSchedule {
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
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [ourTeam, setOurTeam] = useState<string>('');
  const [matchSchedule, setMatchSchedule] = useState<MatchSchedule[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);

  useEffect(() => {
    // Load saved setup data
    const savedSetup = localStorage.getItem('matchScoutingSetup');
    if (savedSetup) {
      const setup = JSON.parse(savedSetup);
      setIsSetupComplete(setup.isSetupComplete);
      setTotalMatches(setup.totalMatches);
      setOurTeam(setup.ourTeam);
      setMatchSchedule(setup.matchSchedule);
    }

    // Load saved match data
    const savedMatches = localStorage.getItem('matchScoutingData');
    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }
  }, []);

  const saveSetup = () => {
    const setup = {
      isSetupComplete: true,
      totalMatches,
      ourTeam,
      matchSchedule
    };
    localStorage.setItem('matchScoutingSetup', JSON.stringify(setup));
    setIsSetupComplete(true);
    
    // Initialize matches with schedule data
    const initialMatches: MatchData[] = matchSchedule.map(schedule => ({
      ...schedule,
      redTeam1Auto: 0, redTeam1Teleop: 0, redTeam1Hang: 0,
      redTeam2Auto: 0, redTeam2Teleop: 0, redTeam2Hang: 0,
      blueTeam1Auto: 0, blueTeam1Teleop: 0, blueTeam1Hang: 0,
      blueTeam2Auto: 0, blueTeam2Teleop: 0, blueTeam2Hang: 0
    }));
    setMatches(initialMatches);
    localStorage.setItem('matchScoutingData', JSON.stringify(initialMatches));
  };

  const resetSetup = () => {
    setIsSetupComplete(false);
    setTotalMatches(0);
    setOurTeam('');
    setMatchSchedule([]);
    setMatches([]);
    localStorage.removeItem('matchScoutingSetup');
    localStorage.removeItem('matchScoutingData');
  };

  const updateSchedule = (index: number, field: keyof MatchSchedule, value: string) => {
    const updatedSchedule = [...matchSchedule];
    updatedSchedule[index] = { ...updatedSchedule[index], [field]: value };
    setMatchSchedule(updatedSchedule);
  };

  const generateSchedule = () => {
    const schedule: MatchSchedule[] = [];
    for (let i = 1; i <= totalMatches; i++) {
      schedule.push({
        matchNumber: i.toString(),
        redTeam1: '',
        redTeam2: '',
        blueTeam1: '',
        blueTeam2: ''
      });
    }
    setMatchSchedule(schedule);
  };

  const updateMatch = (index: number, field: keyof MatchData, value: string) => {
    const updatedMatches = [...matches];
    
    if (field === 'matchNumber' || field === 'redTeam1' || field === 'redTeam2' || field === 'blueTeam1' || field === 'blueTeam2') {
      updatedMatches[index][field] = value;
    } else {
      // Handle numeric fields with proper validation
      const numericValue = Math.max(0, Math.min(5, parseInt(value) || 0));
      (updatedMatches[index] as any)[field] = numericValue;
    }
    
    setMatches(updatedMatches);
    localStorage.setItem('matchScoutingData', JSON.stringify(updatedMatches));
  };

  const calculateMatchAverage = (auto: number, teleop: number, hang: number) => {
    return ((auto + teleop + hang) / 3).toFixed(1);
  };

  const isOurTeam = (teamNumber: string) => {
    return teamNumber === ourTeam;
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

  const SetupView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Match Schedule Setup</h2>
        <Button onClick={resetSetup} variant="outline" size="sm">
          <Settings className="w-4 h-4 mr-2" />
          Reset Setup
        </Button>
      </div>
      
      <Card className="p-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Total Number of Matches</label>
              <Input
                type="number"
                value={totalMatches || ''}
                onChange={(e) => setTotalMatches(parseInt(e.target.value) || 0)}
                placeholder="Enter total matches"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Your Team Number</label>
              <Input
                value={ourTeam}
                onChange={(e) => setOurTeam(e.target.value)}
                placeholder="Enter your team number"
              />
            </div>
          </div>
          
          <Button onClick={generateSchedule} disabled={!totalMatches}>
            Generate Match Schedule
          </Button>
        </div>
      </Card>

      {matchSchedule.length > 0 && (
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Match Schedule</h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {matchSchedule.map((match, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">Match {match.matchNumber}</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-sm font-medium text-red-600 mb-2">Red Alliance</h5>
                    <div className="space-y-2">
                      <Input
                        placeholder="Red Team 1"
                        value={match.redTeam1}
                        onChange={(e) => updateSchedule(index, 'redTeam1', e.target.value)}
                      />
                      <Input
                        placeholder="Red Team 2"
                        value={match.redTeam2}
                        onChange={(e) => updateSchedule(index, 'redTeam2', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h5 className="text-sm font-medium text-blue-600 mb-2">Blue Alliance</h5>
                    <div className="space-y-2">
                      <Input
                        placeholder="Blue Team 1"
                        value={match.blueTeam1}
                        onChange={(e) => updateSchedule(index, 'blueTeam1', e.target.value)}
                      />
                      <Input
                        placeholder="Blue Team 2"
                        value={match.blueTeam2}
                        onChange={(e) => updateSchedule(index, 'blueTeam2', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button onClick={saveSetup} className="bg-gradient-to-r from-orange-600 to-orange-700">
              Complete Setup & Start Scouting
            </Button>
          </div>
        </Card>
      )}
    </div>
  );

  const TableView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Match Scouting Data</h2>
        <div className="text-sm text-gray-600">
          Your Team: <span className="font-medium">{ourTeam}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600">All scores are on a scale of 0-5. Data is saved automatically.</p>

      <div className="space-y-6">
        {matches.map((match, index) => (
          <div key={index} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Match {match.matchNumber}</h3>
            </div>

            {/* Red Alliance */}
            <div className="mb-4">
              <h4 className="text-md font-medium text-red-600 mb-3">Red Alliance</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team #</TableHead>
                    <TableHead>Auto (0-5)</TableHead>
                    <TableHead>Tele-op (0-5)</TableHead>
                    <TableHead>Hang (0-5)</TableHead>
                    <TableHead>Match Avg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className={isOurTeam(match.redTeam1) ? "bg-yellow-100" : ""}>
                    <TableCell className="font-medium">{match.redTeam1}</TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam1Auto.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam1Auto', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam1Teleop.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam1Teleop', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam1Hang.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam1Hang', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateMatchAverage(match.redTeam1Auto, match.redTeam1Teleop, match.redTeam1Hang)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={isOurTeam(match.redTeam2) ? "bg-yellow-100" : ""}>
                    <TableCell className="font-medium">{match.redTeam2}</TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam2Auto.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam2Auto', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam2Teleop.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam2Teleop', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.redTeam2Hang.toString()}
                        onChange={(e) => updateMatch(index, 'redTeam2Hang', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateMatchAverage(match.redTeam2Auto, match.redTeam2Teleop, match.redTeam2Hang)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Blue Alliance */}
            <div>
              <h4 className="text-md font-medium text-blue-600 mb-3">Blue Alliance</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Team #</TableHead>
                    <TableHead>Auto (0-5)</TableHead>
                    <TableHead>Tele-op (0-5)</TableHead>
                    <TableHead>Hang (0-5)</TableHead>
                    <TableHead>Match Avg</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow className={isOurTeam(match.blueTeam1) ? "bg-yellow-100" : ""}>
                    <TableCell className="font-medium">{match.blueTeam1}</TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam1Auto.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam1Auto', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam1Teleop.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam1Teleop', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam1Hang.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam1Hang', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateMatchAverage(match.blueTeam1Auto, match.blueTeam1Teleop, match.blueTeam1Hang)}
                    </TableCell>
                  </TableRow>
                  <TableRow className={isOurTeam(match.blueTeam2) ? "bg-yellow-100" : ""}>
                    <TableCell className="font-medium">{match.blueTeam2}</TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam2Auto.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam2Auto', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam2Teleop.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam2Teleop', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={match.blueTeam2Hang.toString()}
                        onChange={(e) => updateMatch(index, 'blueTeam2Hang', e.target.value)}
                        className="w-16"
                        type="number"
                        min="0"
                        max="5"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {calculateMatchAverage(match.blueTeam2Auto, match.blueTeam2Teleop, match.blueTeam2Hang)}
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
              {/* Add horizontal reference lines at each integer value */}
              {[1, 2, 3, 4, 5].map(value => (
                <ReferenceLine key={value} y={value} stroke="#e5e7eb" strokeDasharray="5 5" />
              ))}
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
                <p className="text-sm text-gray-500">
                  {!isSetupComplete ? 'Setup match schedule' : 'Enter match data and view performance analysis'}
                </p>
              </div>
            </div>
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto p-4">
        {!isSetupComplete ? (
          <Card className="p-6">
            <SetupView />
          </Card>
        ) : (
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
        )}
        
        {isSetupComplete && (
          <div className="flex justify-center mt-4 space-x-2">
            <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchScouting;
