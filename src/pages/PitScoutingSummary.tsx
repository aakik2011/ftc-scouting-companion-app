
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowUp, Users } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Team {
  teamNumber: string;
  teamName: string;
}

interface TeamScore {
  teamNumber: string;
  teamName: string;
  autoScore: number;
  teleopScore: number;
  endgameScore: number;
  compatibilityScore: number;
  overallScore: number;
}

const PitScoutingSummary = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);
  const [teamScores, setTeamScores] = useState<{ [key: string]: TeamScore }>({});
  const [finalRankings, setFinalRankings] = useState<TeamScore[]>([]);

  useEffect(() => {
    const savedTeams = localStorage.getItem('eventTeams');
    if (savedTeams) {
      const parsedTeams = JSON.parse(savedTeams);
      setTeams(parsedTeams);
      
      // Initialize team scores
      const initialScores: { [key: string]: TeamScore } = {};
      parsedTeams.forEach((team: Team) => {
        initialScores[team.teamNumber] = {
          teamNumber: team.teamNumber,
          teamName: team.teamName,
          autoScore: 0,
          teleopScore: 0,
          endgameScore: 0,
          compatibilityScore: 0,
          overallScore: 0,
        };
      });
      setTeamScores(initialScores);
    }
  }, []);

  const updateTeamScore = (teamNumber: string, field: keyof TeamScore, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTeamScores(prev => ({
      ...prev,
      [teamNumber]: {
        ...prev[teamNumber],
        [field]: numericValue
      }
    }));
  };

  const generateFinalRankings = () => {
    const rankedTeams = Object.values(teamScores).sort((a, b) => {
      // Sort by overall score (descending), then by compatibility score (descending)
      if (b.overallScore !== a.overallScore) {
        return b.overallScore - a.overallScore;
      }
      return b.compatibilityScore - a.compatibilityScore;
    });
    
    setFinalRankings(rankedTeams);
  };

  // Create tables using actual team data
  const tables = [
    {
      id: 1,
      title: "Auto Performance Ranking",
      columns: ["Team Number", "Team Name", "Auto Score"],
      dataKey: "auto"
    },
    {
      id: 2,
      title: "TeleOp Performance Ranking", 
      columns: ["Team Number", "Team Name", "TeleOp Score"],
      dataKey: "teleop"
    },
    {
      id: 3,
      title: "Endgame Performance Ranking",
      columns: ["Team Number", "Team Name", "Endgame Score"],
      dataKey: "endgame"
    },
    {
      id: 4,
      title: "Overall Team Rankings",
      columns: ["Team Number", "Team Name", "Compatibility Score", "Overall Score"],
      dataKey: "overall"
    },
    {
      id: 5,
      title: "Final Team Rankings",
      columns: ["Rank", "Team Number", "Team Name", "Total Score"],
      dataKey: "rank"
    }
  ];

  const renderTableContent = (table: any) => {
    if (table.dataKey === "rank") {
      return (
        <>
          {finalRankings.length > 0 ? (
            finalRankings.map((team, index) => (
              <TableRow key={index} className="border-slate-700">
                <TableCell className="text-white font-bold">#{index + 1}</TableCell>
                <TableCell className="text-white">{team.teamNumber}</TableCell>
                <TableCell className="text-white">{team.teamName}</TableCell>
                <TableCell className="text-white">{team.overallScore.toFixed(1)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-slate-700">
              <TableCell colSpan={4} className="text-center text-slate-400 py-8">
                Click "Generate Final Rankings" to see ranked teams
              </TableCell>
            </TableRow>
          )}
        </>
      );
    }

    return (
      <>
        {teams.slice(0, 8).map((team, index) => (
          <TableRow key={index} className="border-slate-700">
            <TableCell className="text-white">{team.teamNumber}</TableCell>
            <TableCell className="text-white">{team.teamName}</TableCell>
            <TableCell className="text-white">
              <input 
                className="bg-transparent border-b border-slate-600 text-white w-16 focus:outline-none focus:border-blue-400"
                placeholder="-"
                type="number"
                value={
                  table.dataKey === "auto" ? teamScores[team.teamNumber]?.autoScore || "" :
                  table.dataKey === "teleop" ? teamScores[team.teamNumber]?.teleopScore || "" :
                  table.dataKey === "endgame" ? teamScores[team.teamNumber]?.endgameScore || "" :
                  teamScores[team.teamNumber]?.compatibilityScore || ""
                }
                onChange={(e) => {
                  const field = table.dataKey === "auto" ? "autoScore" :
                               table.dataKey === "teleop" ? "teleopScore" :
                               table.dataKey === "endgame" ? "endgameScore" :
                               "compatibilityScore";
                  updateTeamScore(team.teamNumber, field, e.target.value);
                }}
              />
            </TableCell>
            {table.columns.length > 3 && (
              <TableCell className="text-white">
                <input 
                  className="bg-transparent border-b border-slate-600 text-white w-16 focus:outline-none focus:border-blue-400"
                  placeholder="-"
                  type="number"
                  value={teamScores[team.teamNumber]?.overallScore || ""}
                  onChange={(e) => updateTeamScore(team.teamNumber, "overallScore", e.target.value)}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
        {teams.length === 0 && (
          <TableRow className="border-slate-700">
            <TableCell colSpan={table.columns.length} className="text-center text-slate-400 py-8">
              No teams entered yet. Go back to Pit Scouting to add teams.
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/pit-scouting')}
                className="text-white"
              >
                <ArrowUp className="w-5 h-5 rotate-90" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Summary Tables</h1>
                <p className="text-sm text-slate-400">Swipe to navigate between ranking tables</p>
              </div>
            </div>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <p className="text-center text-slate-400 mb-6 text-sm">
          Use these tables to rank and analyze all teams at your competition.
        </p>

        <Carousel className="w-full">
          <CarouselContent>
            {tables.map((table) => (
              <CarouselItem key={table.id}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center text-white mb-6">
                    {table.title}
                  </h2>

                  <div className="bg-slate-800 rounded-lg p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-700">
                          {table.columns.map((column, index) => (
                            <TableHead key={index} className="text-slate-300">
                              {column}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {renderTableContent(table)}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white border-slate-600 hover:bg-slate-700" />
          <CarouselNext className="text-white border-slate-600 hover:bg-slate-700" />
        </Carousel>

        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-2 h-2 bg-slate-600 rounded-full" />
            ))}
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={generateFinalRankings}
          >
            Generate Final Rankings
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <Users className="w-6 h-6 text-slate-500" />
        </div>
      </div>
    </div>
  );
};

export default PitScoutingSummary;
