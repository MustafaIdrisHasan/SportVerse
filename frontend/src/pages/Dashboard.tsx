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
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const handleRaceClick = (raceId: string) => {
    navigate(`/race/${raceId}`);
  };

  // Mock data for development (remove when backend is ready)
  const mockRaces: Race[] = [
    {
      id: '1',
      name: 'Qatar Grand Prix',
      date: '2024-03-10T15:00:00Z',
      circuit: 'Lusail International Circuit',
      country: 'Qatar',
      seriesId: 'f1',
      series: { id: 'f1', name: 'Formula 1', color: '#e10600', icon: '🏎️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-08', time: '11:30' },
        { session: 'Practice 2', date: '2024-03-08', time: '15:00' },
        { session: 'Practice 3', date: '2024-03-09', time: '11:30' },
        { session: 'Qualifying', date: '2024-03-09', time: '15:00' },
        { session: 'Race', date: '2024-03-10', time: '15:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'ESPN', subscription: false },
        { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true },
        { country: 'Global', broadcaster: 'F1 TV Pro', subscription: true },
      ],
    },
    {
      id: '2',
      name: 'Portimão Grand Prix',
      date: '2024-03-24T14:00:00Z',
      circuit: 'Algarve International Circuit',
      country: 'Portugal',
      seriesId: 'motogp',
      series: { id: 'motogp', name: 'MotoGP', color: '#0066cc', icon: '🏍️' },
      schedule: [
        { session: 'Practice 1', date: '2024-03-22', time: '10:45' },
        { session: 'Practice 2', date: '2024-03-22', time: '15:00' },
        { session: 'Qualifying', date: '2024-03-23', time: '14:10' },
        { session: 'Race', date: '2024-03-24', time: '14:00' },
      ],
      watchLinks: [
        { country: 'US', broadcaster: 'NBC Sports', subscription: true },
        { country: 'UK', broadcaster: 'BT Sport', subscription: true },
      ],
    },
    {
      id: '3',
      name: '6 Hours of Spa-Francorchamps',
      date: '2024-05-11T13:00:00Z',
      circuit: 'Circuit de Spa-Francorchamps',
      country: 'Belgium',
      seriesId: 'wec',
      series: { id: 'wec', name: 'WEC', color: '#ff8c00', icon: '🏁' },
      schedule: [
        { session: 'Practice 1', date: '2024-05-09', time: '14:00' },
        { session: 'Practice 2', date: '2024-05-09', time: '18:00' },
        { session: 'Qualifying', date: '2024-05-10', time: '15:00' },
        { session: 'Race', date: '2024-05-11', time: '13:00' },
      ],
      watchLinks: [
        { country: 'Global', broadcaster: 'Eurosport', subscription: true },
        { country: 'US', broadcaster: 'MotorTrend', subscription: true },
      ],
    },
  ];

  // Use mock data if no real data is available
  const displayUpcoming = upcomingRaces.length > 0 ? upcomingRaces : mockRaces;
  const displayFeatured = featuredRaces.length > 0 ? featuredRaces : mockRaces.slice(0, 2);

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-racing text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-400">
            Here's what's happening in the world of racing
          </p>
        </div>

        {/* Featured Races Carousel */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiTrendingUp className="mr-3 text-blue-400" />
              Featured Races
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/schedule')}
              className="flex items-center"
            >
              View All <FiChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayFeatured.map((race) => (
              <div key={race.id} className="lg:col-span-1">
                <RaceCard
                  race={race}
                  onClick={() => handleRaceClick(race.id)}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {user?.favorites.length || 0}
              </div>
              <div className="text-sm text-gray-400">Favorite Races</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {user?.reminders.length || 0}
              </div>
              <div className="text-sm text-gray-400">Active Reminders</div>
            </div>
          </Card>
          
          <Card>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {displayUpcoming.length}
              </div>
              <div className="text-sm text-gray-400">Upcoming Races</div>
            </div>
          </Card>
        </section>

        {/* Upcoming Races */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <FiCalendar className="mr-3 text-green-400" />
              Upcoming Races
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/schedule')}
              className="flex items-center"
            >
              Full Schedule <FiChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayUpcoming.map((race) => (
              <RaceCard
                key={race.id}
                race={race}
                onClick={() => handleRaceClick(race.id)}
              />
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