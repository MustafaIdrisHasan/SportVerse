import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTrendingUp, FiCalendar, FiHeart, FiChevronRight } from 'react-icons/fi';
import Layout from '../components/layout/Layout';
import RaceCard from '../components/race/RaceCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Race } from '../types';
import { racesAPI } from '../utils/api';
import useAuthStore from '../context/authStore';

const Dashboard: React.FC = () => {
  const [upcomingRaces, setUpcomingRaces] = useState<Race[]>([]);
  const [featuredRaces, setFeaturedRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const [upcomingResponse, allRacesResponse] = await Promise.all([
          racesAPI.getUpcomingRaces(),
          racesAPI.getAllRaces()
        ]);

        if (upcomingResponse.success && upcomingResponse.data) {
          setUpcomingRaces(upcomingResponse.data.slice(0, 6));
          setFeaturedRaces(upcomingResponse.data.slice(0, 3));
        }

        if (allRacesResponse.success && allRacesResponse.data) {
          // If no upcoming races, show some recent/featured races
          if (!upcomingResponse.data || upcomingResponse.data.length === 0) {
            setFeaturedRaces(allRacesResponse.data.slice(0, 3));
          }
        }
      } catch (err) {
        setError('Failed to load races. Please try again later.');
        console.error('Error fetching races:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const handleRaceClick = (raceId: string) => {
    navigate(`/race/${raceId}`);
  };

  // Use the fetched data directly since backend provides fallback data
  const displayUpcoming = upcomingRaces;
  const displayFeatured = featuredRaces;

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">RS</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold font-racing text-white mb-4">
                Welcome to RaceScope
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Your ultimate motor racing aggregator. Track Formula 1, MotoGP, Le Mans, and more. 
                Never miss a race again.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                >
                  Get Started Free
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Welcome Section */}
        <div className="relative mb-12 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-f1-500/20 via-motogp-500/20 to-lemans-500/20 rounded-3xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-lg rounded-3xl p-8 border border-gray-600/30 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-16 h-16 bg-racing-gradient rounded-2xl flex items-center justify-center shadow-neon">
                    <span className="text-2xl">🏁</span>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold font-racing bg-gradient-to-r from-white via-accent-electric to-white bg-clip-text text-transparent mb-2">
                      Welcome back, {user?.name?.split(' ')[0]}!
                    </h1>
                    <p className="text-lg text-gray-300 font-sport">
                      Ready to dive into the world of high-speed racing? 🏎️💨
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 font-sport">Live Updates Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-accent-electric rounded-full animate-pulse"></div>
                    <span className="text-gray-300 font-sport">{displayUpcoming.length} Upcoming Races</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="w-32 h-32 bg-gradient-to-br from-accent-purple/30 to-accent-pink/30 rounded-full blur-2xl animate-pulse-slow"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Races Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-f1-500 to-motogp-500 rounded-xl flex items-center justify-center shadow-neon">
                <FiTrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-racing bg-gradient-to-r from-f1-500 via-motogp-500 to-lemans-500 bg-clip-text text-transparent">
                  🔥 Featured Races
                </h2>
                <p className="text-gray-400 font-sport">Don't miss these epic showdowns</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/schedule')}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-transparent to-transparent hover:from-accent-purple/20 hover:to-accent-pink/20 border border-gray-600 hover:border-accent-purple/50 rounded-xl transition-all duration-300"
            >
              <span className="font-sport font-medium">View All</span>
              <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayFeatured.map((race, index) => (
              <div
                key={race.id}
                className="group transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-f1-500/20 via-motogp-500/20 to-lemans-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <RaceCard
                    race={race}
                    onClick={() => handleRaceClick(race.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Racing Stats Dashboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <Card className="relative bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-lg border-accent-purple/30 hover:border-accent-purple/60 transition-all duration-300 transform group-hover:scale-105">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-accent-pink rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon-pink">
                  <span className="text-2xl">❤️</span>
                </div>
                <div className="text-4xl font-bold font-racing bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent mb-2">
                  {user?.favorites.length || 0}
                </div>
                <div className="text-sm text-gray-300 font-sport font-medium">Favorite Races</div>
                <div className="text-xs text-gray-500 mt-1">Your racing passion</div>
              </div>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-lemans-500/20 to-nascar-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <Card className="relative bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-lg border-lemans-500/30 hover:border-lemans-500/60 transition-all duration-300 transform group-hover:scale-105">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-lemans-500 to-nascar-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon">
                  <span className="text-2xl">🔔</span>
                </div>
                <div className="text-4xl font-bold font-racing bg-gradient-to-r from-lemans-500 to-nascar-500 bg-clip-text text-transparent mb-2">
                  {user?.reminders.length || 0}
                </div>
                <div className="text-sm text-gray-300 font-sport font-medium">Active Reminders</div>
                <div className="text-xs text-gray-500 mt-1">Never miss a race</div>
              </div>
            </Card>
          </div>

          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-neon/20 to-accent-electric/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <Card className="relative bg-gradient-to-br from-dark-100/80 to-dark-200/80 backdrop-blur-lg border-accent-neon/30 hover:border-accent-neon/60 transition-all duration-300 transform group-hover:scale-105">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-neon to-accent-electric rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-neon-green">
                  <span className="text-2xl">🏁</span>
                </div>
                <div className="text-4xl font-bold font-racing bg-gradient-to-r from-accent-neon to-accent-electric bg-clip-text text-transparent mb-2">
                  {displayUpcoming.length}
                </div>
                <div className="text-sm text-gray-300 font-sport font-medium">Upcoming Races</div>
                <div className="text-xs text-gray-500 mt-1">Ready to race</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Upcoming Races Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-neon to-accent-electric rounded-xl flex items-center justify-center shadow-neon-green">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold font-racing bg-gradient-to-r from-accent-neon via-accent-electric to-accent-neon bg-clip-text text-transparent">
                  ⚡ Upcoming Races
                </h2>
                <p className="text-gray-400 font-sport">Get ready for the next adrenaline rush</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/schedule')}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-transparent to-transparent hover:from-accent-neon/20 hover:to-accent-electric/20 border border-gray-600 hover:border-accent-neon/50 rounded-xl transition-all duration-300"
            >
              <span className="font-sport font-medium">Full Schedule</span>
              <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayUpcoming.map((race, index) => (
              <div
                key={race.id}
                className="group transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-neon/20 via-accent-electric/20 to-accent-purple/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <RaceCard
                    race={race}
                    onClick={() => handleRaceClick(race.id)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* My Favorites */}
        {user?.favorites && user.favorites.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <FiHeart className="mr-3 text-red-400" />
                My Favorites
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayUpcoming
                .filter(race => user.favorites.includes(race.id))
                .map((race) => (
                  <RaceCard
                    key={race.id}
                    race={race}
                    onClick={() => handleRaceClick(race.id)}
                  />
                ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading races...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">{error}</p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard; 