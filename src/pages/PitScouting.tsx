
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Plus, ChevronRight } from 'lucide-react';

interface ScoutingEntry {
  id: string;
  teamNumber: string;
  teamName: string;
  pitLocation: string;
  drivetrainType: string;
  autonomousCapability: string;
  teleOpStrengths: string;
  endgameCapability: string;
  notes: string;
}

const PitScouting = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<ScoutingEntry[]>([]);
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentEntry, setCurrentEntry] = useState<Partial<ScoutingEntry>>({});

  const questions = [
    {
      id: 'teamNumber',
      title: 'What teams are in your competition this year?',
      subtitle: 'Team Number/Basic Entry',
      placeholder: '1234, 5678, 9012, 3456',
      field: 'teamNumber'
    },
    {
      id: 'teamName',
      title: 'What are the team number/team name?',
      subtitle: '',
      placeholder: 'Team Name',
      field: 'teamName'
    },
    {
      id: 'drivetrain',
      title: 'What are some questions you want to ask the teams?',
      subtitle: 'Auto, Teleop, Endgame',
      placeholder: 'Drivetrain type, capabilities, etc.',
      field: 'drivetrainType'
    },
    {
      id: 'autonomous',
      title: 'How well did YOU like to rank teams?',
      subtitle: 'Compatibility, Overall Score',
      placeholder: 'Autonomous capabilities',
      field: 'autonomousCapability'
    }
  ];

  const handleStartScouting = () => {
    setShowQuestions(true);
    setCurrentQuestionIndex(0);
    setCurrentEntry({});
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Complete entry and show summary
      const newEntry: ScoutingEntry = {
        id: Date.now().toString(),
        teamNumber: currentEntry.teamNumber || '',
        teamName: currentEntry.teamName || '',
        pitLocation: currentEntry.pitLocation || '',
        drivetrainType: currentEntry.drivetrainType || '',
        autonomousCapability: currentEntry.autonomousCapability || '',
        teleOpStrengths: currentEntry.teleOpStrengths || '',
        endgameCapability: currentEntry.endgameCapability || '',
        notes: currentEntry.notes || ''
      };
      setEntries([...entries, newEntry]);
      navigate(`/pit-scouting/summary/${newEntry.id}`);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCurrentEntry({ ...currentEntry, [field]: value });
  };

  if (showQuestions) {
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        <div className="max-w-md mx-auto p-6">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowQuestions(false)}
              className="text-white mb-4"
            >
              <ArrowUp className="w-5 h-5 rotate-90" />
            </Button>
            <h1 className="text-2xl font-bold mb-2">{currentQuestion.title}</h1>
            {currentQuestion.subtitle && (
              <p className="text-slate-400">{currentQuestion.subtitle}</p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <Textarea
                value={currentEntry[currentQuestion.field as keyof ScoutingEntry] || ''}
                onChange={(e) => handleInputChange(currentQuestion.field, e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="bg-slate-800 border-slate-700 text-white min-h-[120px]"
                rows={6}
              />
            </div>

            <Button
              onClick={handleNextQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Generate Tables'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestionIndex ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
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
                <h1 className="text-xl font-bold text-gray-900">Pit Scouting</h1>
                <p className="text-sm text-gray-500">Survey teams in the pits</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {entries.length === 0 ? (
          <div className="space-y-6">
            <Card className="p-6 text-center">
              <div className="text-gray-600 mb-4">
                <Plus className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <h3 className="text-lg font-semibold mb-2">Start Pit Scouting</h3>
                <p className="text-sm text-gray-500">
                  Answer some questions to help us generate a table for you.
                </p>
              </div>
              <Button
                onClick={handleStartScouting}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Start Scouting
              </Button>
            </Card>
          </div>
        ) : (
          <div className="space-y-4">
            <Button
              onClick={handleStartScouting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              New Scouting Entry
            </Button>
            
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">Team {entry.teamNumber}</h3>
                    <p className="text-sm text-gray-600">{entry.teamName}</p>
                  </div>
                  <Button
                    onClick={() => navigate(`/pit-scouting/summary/${entry.id}`)}
                    size="sm"
                    variant="outline"
                  >
                    View Summary
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PitScouting;
