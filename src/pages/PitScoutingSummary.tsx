import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users } from 'lucide-react';
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

    // Load saved scores
    const savedScores = localStorage.getItem('pitScoutingScores');
    if (savedScores) {
      setTeamScores(JSON.parse(savedScores));
    }

    // Load saved rankings
    const savedRankings = localStorage.getItem('pitScoutingRankings');
    if (savedRankings) {
      setFinalRankings(JSON.parse(savedRankings));
    }
  }, []);

  const updateTeamScore = (teamNumber: string, field: keyof TeamScore, value: string) => {
    const updatedScores = {
      ...teamScores,
      [teamNumber]: {
        ...teamScores[teamNumber],
        [field]: value
      }
    };
    setTeamScores(updatedScores);
    localStorage.setItem('pitScoutingScores', JSON.stringify(updatedScores));
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
    localStorage.setItem('pitScoutingRankings', JSON.stringify(rankedTeams));
  };

  const tables = [
    {
      id: 1,
      title: "Auto Performance Notes",
      columns: ["Team Number", "Team Name", "Auto Performance Notes"],
      dataKey: "auto"
    },
    {
      id: 2,
      title: "TeleOp Performance Notes", 
      columns: ["Team Number", "Team Name", "TeleOp Performance Notes"],
      dataKey: "teleop"
    },
    {
      id: 3,
      title: "Endgame Performance Notes",
      columns: ["Team Number", "Team Name", "Endgame Performance Notes"],
      dataKey: "endgame"
    },
    {
      id: 4,
      title: "Overall Team Assessment",
      columns: ["Team Number", "Team Name", "Compatibility Notes", "Overall Assessment"],
      dataKey: "overall"
    },
    {
      id: 5,
      title: "Final Team Rankings",
      columns: ["Rank", "Team Number", "Team Name", "Overall Assessment"],
      dataKey: "rank"
    }
  ];

  const renderTableContent = (table: any) => {
    if (table.dataKey === "rank") {
      return (
        <>
          {finalRankings.length > 0 ? (
            finalRankings.map((team, index) => (
              <TableRow key={index} className="border-gray-200">
                <TableCell className="text-gray-900 font-bold">#{index + 1}</TableCell>
                <TableCell className="text-gray-900">{team.teamNumber}</TableCell>
                <TableCell className="text-gray-900">{team.teamName}</TableCell>
                <TableCell className="text-gray-900">{team.overallScore}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow className="border-gray-200">
              <TableCell colSpan={4} className="text-center text-gray-500 py-8">
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
          <TableRow key={index} className="border-gray-200">
            <TableCell className="text-gray-900">{team.teamNumber}</TableCell>
            <TableCell className="text-gray-900">{team.teamName}</TableCell>
            <TableCell className="text-gray-900">
              <textarea 
                className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 w-full min-h-[60px] resize-none focus:outline-none focus:border-blue-500"
                placeholder="Enter notes about this team..."
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
              <TableCell className="text-gray-900">
                <textarea 
                  className="bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 w-full min-h-[60px] resize-none focus:outline-none focus:border-blue-500"
                  placeholder="Enter overall assessment..."
                  value={teamScores[team.teamNumber]?.overallScore || ""}
                  onChange={(e) => updateTeamScore(team.teamNumber, "overallScore", e.target.value)}
                />
              </TableCell>
            )}
          </TableRow>
        ))}
        {teams.length === 0 && (
          <TableRow className="border-gray-200">
            <TableCell colSpan={table.columns.length} className="text-center text-gray-500 py-8">
              No teams entered yet. Go back to Pit Scouting to add teams.
            </TableCell>
          </TableRow>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/pit-scouting')}
                className="text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Summary Tables</h1>
                <p className="text-sm text-gray-500">Swipe to navigate between ranking tables</p>
              </div>
            </div>
            <Users className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <p className="text-center text-gray-600 mb-6 text-sm">
          Use these tables to assess and analyze all teams at your competition with detailed notes.
        </p>

        <Carousel className="w-full">
          <CarouselContent>
            {tables.map((table) => (
              <CarouselItem key={table.id}>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                    {table.title}
                  </h2>

                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-200">
                          {table.columns.map((column, index) => (
                            <TableHead key={index} className="text-gray-700">
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
          <CarouselPrevious className="text-gray-900 border-gray-300 hover:bg-gray-100" />
          <CarouselNext className="text-gray-900 border-gray-300 hover:bg-gray-100" />
        </Carousel>

        <div className="flex justify-between items-center mt-8">
          <div className="flex space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="w-2 h-2 bg-gray-400 rounded-full" />
            ))}
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={generateFinalRankings}
          >
            Generate Final Rankings
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <Users className="w-6 h-6 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default PitScoutingSummary;
