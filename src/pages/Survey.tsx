
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { ArrowUp, Save } from 'lucide-react';

const Survey = () => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const [surveyData, setSurveyData] = useState({
    drivetrainType: '',
    scoringCapability: [3],
    autonomousRating: [3],
    notes: '',
  });

  const handleSave = () => {
    console.log('Saving survey data:', surveyData);
    // Here you would save to your database
    navigate('/pit-scouting');
  };

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
                onClick={() => navigate('/pit-scouting')}
                className="rotate-90"
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Team Survey</h1>
                <p className="text-sm text-gray-500">Team ID: {teamId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        <div className="space-y-6">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="drivetrain">Drivetrain Type</Label>
                <Input
                  id="drivetrain"
                  value={surveyData.drivetrainType}
                  onChange={(e) => setSurveyData({ ...surveyData, drivetrainType: e.target.value })}
                  placeholder="e.g., Mecanum, Tank, etc."
                />
              </div>

              <div>
                <Label>Scoring Capability (1-5)</Label>
                <div className="px-2 py-4">
                  <Slider
                    value={surveyData.scoringCapability}
                    onValueChange={(value) => setSurveyData({ ...surveyData, scoringCapability: value })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-semibold">{surveyData.scoringCapability[0]}</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              <div>
                <Label>Autonomous Rating (1-5)</Label>
                <div className="px-2 py-4">
                  <Slider
                    value={surveyData.autonomousRating}
                    onValueChange={(value) => setSurveyData({ ...surveyData, autonomousRating: value })}
                    max={5}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>1</span>
                    <span className="font-semibold">{surveyData.autonomousRating[0]}</span>
                    <span>5</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={surveyData.notes}
                  onChange={(e) => setSurveyData({ ...surveyData, notes: e.target.value })}
                  placeholder="Any additional observations..."
                  rows={4}
                />
              </div>
            </div>
          </Card>

          <Button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Survey
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Survey;
