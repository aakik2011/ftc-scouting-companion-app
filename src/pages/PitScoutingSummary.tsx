
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

const PitScoutingSummary = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const savedTeams = localStorage.getItem('eventTeams');
    if (savedTeams) {
      setTeams(JSON.parse(savedTeams));
    }
  }, []);

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
      columns: ["Team Number", "Team Name", "Final Rank"],
      dataKey: "rank"
    }
  ];

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
                        {teams.slice(0, 8).map((team, index) => (
                          <TableRow key={index} className="border-slate-700">
                            <TableCell className="text-white">{team.teamNumber}</TableCell>
                            <TableCell className="text-white">{team.teamName}</TableCell>
                            <TableCell className="text-white">
                              {/* Empty field for user to fill in */}
                              <input 
                                className="bg-transparent border-b border-slate-600 text-white w-16 focus:outline-none focus:border-blue-400"
                                placeholder="-"
                              />
                            </TableCell>
                            {table.columns.length > 3 && (
                              <TableCell className="text-white">
                                <input 
                                  className="bg-transparent border-b border-slate-600 text-white w-16 focus:outline-none focus:border-blue-400"
                                  placeholder="-"
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
            onClick={() => console.log('Generate Final Rankings')}
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
