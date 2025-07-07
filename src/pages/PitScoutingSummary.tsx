
import React, { useState } from 'react';
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

const PitScoutingSummary = () => {
  const navigate = useNavigate();
  const { entryId } = useParams();

  // Get the entry data from localStorage or state management
  // For now, we'll use mock structure but with empty fields as requested
  const entryData = {
    teamNumber: "",
    teamName: "",
    drivetrainType: "",
    autonomousCapability: ""
  };

  // Create tables with empty fields for team numbers and names
  const tables = [
    {
      id: 1,
      title: "Table 1",
      columns: ["Team Number", "Team Name", "Auto"],
      data: [
        { teamNumber: "", teamName: "", auto: "95" },
        { teamNumber: "", teamName: "", auto: "85" },
        { teamNumber: "", teamName: "", auto: "75" },
        { teamNumber: "", teamName: "", auto: "70" }
      ]
    },
    {
      id: 2,
      title: "Table 2", 
      columns: ["Team Number", "Team Name", "TeleOp"],
      data: [
        { teamNumber: "", teamName: "", teleop: "92" },
        { teamNumber: "", teamName: "", teleop: "89" },
        { teamNumber: "", teamName: "", teleop: "77" },
        { teamNumber: "", teamName: "", teleop: "68" }
      ]
    },
    {
      id: 3,
      title: "Table 3",
      columns: ["Team Number", "Team Name", "Endgame"],
      data: [
        { teamNumber: "", teamName: "", endgame: "85" },
        { teamNumber: "", teamName: "", endgame: "82" },
        { teamNumber: "", teamName: "", endgame: "80" },
        { teamNumber: "", teamName: "", endgame: "65" }
      ]
    },
    {
      id: 4,
      title: "Table 5",
      columns: ["Team Number", "Team Name", "Compatibility Score", "Overall Score"],
      data: [
        { teamNumber: "", teamName: "", compatibility: "90", overall: "90" },
        { teamNumber: "", teamName: "", compatibility: "88", overall: "85" },
        { teamNumber: "", teamName: "", compatibility: "85", overall: "81" },
        { teamNumber: "", teamName: "", compatibility: "80", overall: "75" }
      ]
    },
    {
      id: 5,
      title: "Table 6",
      columns: ["Team Number", "Team Name", "Rank"],
      data: [
        { teamNumber: "", teamName: "", rank: "1" },
        { teamNumber: "", teamName: "", rank: "2" },
        { teamNumber: "", teamName: "", rank: "3" },
        { teamNumber: "", teamName: "", rank: "4" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-md mx-auto px-4 py-4">
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
                <p className="text-sm text-slate-400">Swipe to navigate between tables</p>
              </div>
            </div>
            <Users className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <p className="text-center text-slate-400 mb-6 text-sm">
          Use this table to rank all the teams at your competition.
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
                        {table.data.map((row, index) => (
                          <TableRow key={index} className="border-slate-700">
                            <TableCell className="text-white">{row.teamNumber}</TableCell>
                            <TableCell className="text-white">{row.teamName}</TableCell>
                            <TableCell className="text-white">
                              {(row as any)[Object.keys(row)[2]]}
                            </TableCell>
                            {table.columns.length > 3 && (
                              <TableCell className="text-white">
                                {(row as any)[Object.keys(row)[3]]}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
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
            onClick={() => console.log('Generate Rank List')}
          >
            Generate Rank List
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
