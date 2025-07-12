
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Trophy, Trash2, BarChart3, Target, Award } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const handleDeleteAllData = () => {
    if (window.confirm('Are you sure you want to delete all saved data? This cannot be undone.')) {
      // Clear all pit scouting data
      localStorage.removeItem('eventTeams');
      localStorage.removeItem('pitScoutingScores');
      localStorage.removeItem('pitScoutingRankings');
      
      // Clear all match scouting data
      localStorage.removeItem('matchScoutingSetup');
      localStorage.removeItem('matchScoutingData');
      
      // Force a page refresh to reset the app state
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-orange-600/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 lg:py-16">
            {/* App Icon */}
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-orange-500 rounded-3xl flex items-center justify-center shadow-xl">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            
            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              FTC Scouting
              <span className="block text-3xl lg:text-4xl text-gray-600 font-medium">Companion</span>
            </h1>
            
            {/* User Info */}
            <div className="mb-4">
              <p className="text-lg font-semibold text-blue-700">
                Aakarsh Kachalia
              </p>
              <p className="text-base text-orange-600 font-medium">
                FTC Team 7083 TundraBots
              </p>
            </div>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-gray-600 mb-2">
              Professional Robotics Competition Analysis
            </p>
            <p className="text-base text-gray-500 max-w-2xl mx-auto">
              Streamline your FTC scouting process with comprehensive pit surveys and real-time match analysis
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Features Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-12">
          {/* Pit Scouting Card */}
          <Card className="group relative overflow-hidden border-2 border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative p-6 lg:p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pit Scouting</h3>
                  <p className="text-gray-600 mb-4 text-base">
                    Comprehensive team evaluation through structured surveys and automated ranking systems
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-6">
                    <li className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-blue-600" />
                      Team compatibility analysis
                    </li>
                    <li className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-blue-600" />
                      Automated scoring & rankings
                    </li>
                    <li className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-blue-600" />
                      Performance predictions
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate('/pit-scouting')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Start Pit Scouting
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Match Scouting Card */}
          <Card className="group relative overflow-hidden border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-100 to-transparent rounded-bl-full opacity-50"></div>
            <div className="relative p-6 lg:p-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Match Scouting</h3>
                  <p className="text-gray-600 mb-4 text-base">
                    Real-time match performance tracking with advanced analytics and visualization
                  </p>
                  <ul className="text-sm text-gray-500 space-y-1 mb-6">
                    <li className="flex items-center">
                      <Target className="w-4 h-4 mr-2 text-orange-600" />
                      Live match scoring (0-5 scale)
                    </li>
                    <li className="flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-orange-600" />
                      Performance trend analysis
                    </li>
                    <li className="flex items-center">
                      <Award className="w-4 h-4 mr-2 text-orange-600" />
                      Alliance strategy insights
                    </li>
                  </ul>
                  <Button
                    onClick={() => navigate('/match-scouting')}
                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 rounded-xl transition-all duration-300"
                  >
                    Start Match Scouting
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Data Management Section */}
        <div className="text-center">
          <Card className="inline-block p-6 bg-gray-50 border-gray-200">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Management</h3>
              <p className="text-sm text-gray-600">
                Reset all scouting data to start fresh for a new competition
              </p>
            </div>
            <Button
              onClick={handleDeleteAllData}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-2 rounded-lg flex items-center space-x-2 mx-auto"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete All Data</span>
            </Button>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Built for FTC Teams • Professional Competition Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
