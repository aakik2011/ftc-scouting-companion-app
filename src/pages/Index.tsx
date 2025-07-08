
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Trash2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all saved data? This cannot be undone.')) {
      localStorage.removeItem('eventTeams');
      localStorage.removeItem('pitScoutingScores');
      localStorage.removeItem('pitScoutingRankings');
      localStorage.removeItem('matchScoutingData');
      alert('All data has been deleted successfully.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 p-4">
      <div className="max-w-md mx-auto pt-8">
        {/* App Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-orange-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FTC Scouting</h1>
          <h2 className="text-xl text-gray-600">Companion</h2>
          <p className="text-sm text-gray-500 mt-2">Collaborative Robotics Scouting</p>
        </div>

        {/* Main Navigation */}
        <div className="space-y-6">
          <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-blue-100 hover:border-blue-200">
            <Button
              onClick={() => navigate('/pit-scouting')}
              className="w-full h-auto p-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 flex flex-col items-center space-y-3"
            >
              <Users className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-semibold">Pit Scouting</div>
                <div className="text-sm opacity-90">Survey teams before matches</div>
              </div>
            </Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 border-orange-100 hover:border-orange-200">
            <Button
              onClick={() => navigate('/match-scouting')}
              className="w-full h-auto p-6 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 flex flex-col items-center space-y-3"
            >
              <Trophy className="w-8 h-8" />
              <div className="text-center">
                <div className="text-xl font-semibold">Match Scouting</div>
                <div className="text-sm opacity-90">Scout live match performance</div>
              </div>
            </Button>
          </Card>
        </div>

        {/* Delete All Data Button */}
        <div className="mt-16 text-center">
          <Button
            onClick={handleDeleteAllData}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All Data</span>
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400 text-sm">
          <p>Built for FTC Teams</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
