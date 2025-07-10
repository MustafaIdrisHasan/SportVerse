import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiMapPin, FiUsers, FiStar, FiChevronRight, FiPlay, FiRadio } from 'react-icons/fi';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { racesAPI } from '../../utils/api';

interface FeaturedEvent {
  id: string;
  title: string;
  sport: {
    name: string;
    icon: string;
    color: string;
  };
  status: 'live' | 'upcoming' | 'completed';
  startTime: string;
  location: string;
  participants: string[];
  viewers?: number;
  importance: 'high' | 'medium' | 'low';
  description: string;
}

interface FeaturedEventsProps {
  onTeamRadioToggle?: () => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ onTeamRadioToggle }) => {
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'today'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await racesAPI.getUpcomingRaces();
      
      if (response.success && response.data) {
        // Convert races to featured events format
        const featuredEvents: FeaturedEvent[] = response.data.map((race: any) => ({
          id: race.id,
          title: race.name,
          sport: {
            name: race.series?.name || 'Racing',
            icon: race.series?.icon || '🏁',
            color: race.series?.color || '#e10600'
          },
          status: getEventStatus(race.date),
          startTime: race.date,
          location: race.circuit || race.country,
          participants: getParticipants(race.series?.name),
          viewers: Math.floor(Math.random() * 2000000) + 500000, // Simulated viewers
          importance: getImportance(race.name),
          description: getDescription(race.name, race.series?.name)
        }));
        
        setEvents(featuredEvents);
      } else {
        setError('Failed to load events');
      }
    } catch (err) {
      setError('Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getEventStatus = (dateString: string): 'live' | 'upcoming' | 'completed' => {
    const eventDate = new Date(dateString);
    const now = new Date();
    const timeDiff = eventDate.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60);
    
    if (hoursDiff < 0) return 'completed';
    if (hoursDiff < 3) return 'live'; // Consider live if within 3 hours
    return 'upcoming';
  };

  const getParticipants = (seriesName?: string): string[] => {
    const participants: { [key: string]: string[] } = {
      'Formula 1': ['Max Verstappen', 'Lewis Hamilton', 'Charles Leclerc', 'Lando Norris'],
      'NASCAR Cup Series': ['Kyle Larson', 'Chase Elliott', 'Denny Hamlin', 'Ryan Blaney'],
      'MotoGP': ['Francesco Bagnaia', 'Jorge Martin', 'Marc Marquez', 'Enea Bastianini'],
      'default': ['Leading Drivers', 'Top Competitors', 'Championship Contenders']
    };
    
    return participants[seriesName || 'default'] || participants['default'];
  };

  const getImportance = (raceName: string): 'high' | 'medium' | 'low' => {
    const highImportance = ['monaco', 'daytona', 'indianapolis', 'le mans', 'silverstone'];
    const mediumImportance = ['bahrain', 'austria', 'singapore', 'australia'];
    
    const lowerName = raceName.toLowerCase();
    if (highImportance.some(important => lowerName.includes(important))) return 'high';
    if (mediumImportance.some(important => lowerName.includes(important))) return 'medium';
    return 'low';
  };

  const getDescription = (raceName: string, seriesName?: string): string => {
    const descriptions: { [key: string]: string } = {
      'monaco': 'The most prestigious race in Formula 1 calendar',
      'daytona': 'The Great American Race and NASCAR\'s biggest event',
      'indianapolis': 'The Greatest Spectacle in Racing',
      'le mans': 'The legendary 24-hour endurance race',
      'silverstone': 'The home of British motorsport',
      'bahrain': 'Season opener in the desert under lights',
      'australia': 'The thrilling season opener Down Under',
      'default': `Exciting ${seriesName || 'racing'} action awaits`
    };
    
    const lowerName = raceName.toLowerCase();
    for (const [key, desc] of Object.entries(descriptions)) {
      if (lowerName.includes(key)) return desc;
    }
    return descriptions['default'];
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    if (filter === 'live') return event.status === 'live';
    if (filter === 'upcoming') return event.status === 'upcoming';
    if (filter === 'today') {
      const today = new Date().toDateString();
      const eventDate = new Date(event.startTime).toDateString();
      return today === eventDate;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-sport font-bold text-red-400">LIVE</span>
          </div>
        );
      case 'upcoming':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-accent-neon/20 to-accent-electric/20 border border-accent-neon/30 rounded-full">
            <FiClock className="w-3 h-3 text-accent-neon" />
            <span className="text-xs font-sport font-bold text-accent-neon">UPCOMING</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-2 px-3 py-1 bg-gradient-to-r from-gray-500/20 to-gray-600/20 border border-gray-500/30 rounded-full">
            <span className="text-xs font-sport font-bold text-gray-400">COMPLETED</span>
          </div>
        );
      default:
        return null;
    }
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatViewers = (viewers?: number) => {
    if (!viewers) return '';
    if (viewers >= 1000000) {
      return `${(viewers / 1000000).toFixed(1)}M`;
    }
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(0)}K`;
    }
    return viewers.toString();
  };

  if (loading) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-f1-500 to-motogp-500 rounded-xl flex items-center justify-center animate-pulse">
              <FiTrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-400 font-sport">Loading featured events...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <FiTrendingUp className="w-8 h-8 text-white" />
            </div>
            <p className="text-red-400 font-sport mb-2">Failed to load events</p>
            <Button variant="ghost" onClick={fetchEvents}>
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-f1-500 to-motogp-500 rounded-xl flex items-center justify-center shadow-neon">
            <FiTrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-racing bg-gradient-to-r from-f1-500 via-accent-electric to-motogp-500 bg-clip-text text-transparent">
              🔥 Today's Featured Events
            </h2>
            <p className="text-gray-400 font-sport">Don't miss these epic showdowns happening now and later today</p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="lg"
          className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-transparent to-transparent hover:from-accent-purple/20 hover:to-accent-pink/20 border border-gray-600 hover:border-accent-purple/50 rounded-xl transition-all duration-300"
        >
          <span className="font-sport font-medium">View All Events</span>
          <FiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 mb-6">
        {[
          { key: 'all', label: 'All Events', count: events.length },
          { key: 'live', label: 'Live Now', count: events.filter(e => e.status === 'live').length },
          { key: 'upcoming', label: 'Upcoming', count: events.filter(e => e.status === 'upcoming').length },
          { key: 'today', label: 'Today', count: events.filter(e => new Date(e.startTime).toDateString() === new Date().toDateString()).length }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-sport transition-all ${
              filter === tab.key
                ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-neon-pink'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              filter === tab.key ? 'bg-white/20' : 'bg-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <div 
            key={event.id}
            className="group transform hover:scale-105 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="relative">
              <div 
                className="absolute inset-0 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-20"
                style={{ backgroundColor: event.sport.color }}
              />
              <Card className="relative bg-gradient-to-br from-dark-100/90 to-dark-200/90 backdrop-blur-lg border-gray-600/50 hover:border-gray-500/70 transition-all duration-300 overflow-hidden">
                {/* Event Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: event.sport.color }}
                      >
                        <span className="text-lg">{event.sport.icon}</span>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-sport uppercase tracking-wider">
                          {event.sport.name}
                        </div>
                        <h3 className="text-lg font-bold font-racing text-white group-hover:text-accent-electric transition-colors">
                          {event.title}
                        </h3>
                      </div>
                    </div>
                    {getStatusBadge(event.status)}
                  </div>

                  <p className="text-sm text-gray-400 font-sport mb-4">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-300">
                      <FiClock className="w-4 h-4 mr-2 text-accent-purple" />
                      <span className="font-sport">{formatTime(event.startTime)}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-300">
                      <FiMapPin className="w-4 h-4 mr-2 text-accent-neon" />
                      <span className="font-sport">{event.location}</span>
                    </div>
                    {event.viewers && (
                      <div className="flex items-center text-sm text-gray-300">
                        <FiUsers className="w-4 h-4 mr-2 text-accent-pink" />
                        <span className="font-sport">{formatViewers(event.viewers)} watching</span>
                      </div>
                    )}
                  </div>

                  {/* Participants */}
                  <div className="mt-4">
                    <div className="text-xs text-gray-500 font-sport uppercase tracking-wider mb-2">
                      Participants
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {event.participants.slice(0, 2).map((participant, idx) => (
                        <span 
                          key={idx}
                          className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs font-sport text-gray-300"
                        >
                          {participant}
                        </span>
                      ))}
                      {event.participants.length > 2 && (
                        <span className="px-2 py-1 bg-gray-700/50 rounded-lg text-xs font-sport text-gray-400">
                          +{event.participants.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 pb-6 space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full bg-gradient-to-r from-transparent to-transparent hover:from-gray-700/50 hover:to-gray-600/50 border border-gray-600 hover:border-gray-500 group/btn"
                  >
                    {event.status === 'live' ? (
                      <>
                        <FiPlay className="w-4 h-4 mr-2 group-hover/btn:text-red-400 transition-colors" />
                        <span className="font-sport">Watch Live</span>
                      </>
                    ) : (
                      <>
                        <FiStar className="w-4 h-4 mr-2 group-hover/btn:text-accent-electric transition-colors" />
                        <span className="font-sport">Set Reminder</span>
                      </>
                    )}
                  </Button>

                  {/* Team Radio Button for F1 Events */}
                  {event.sport.name === 'Formula 1' && onTeamRadioToggle && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTeamRadioToggle();
                      }}
                      className="w-full bg-gradient-to-r from-f1-500/20 to-f1-600/20 hover:from-f1-500/30 hover:to-f1-600/30 border border-f1-500/30 hover:border-f1-500/50 group/radio"
                    >
                      <FiRadio className="w-4 h-4 mr-2 text-f1-500 group-hover/radio:text-f1-400 transition-colors" />
                      <span className="font-sport text-f1-400 group-hover/radio:text-f1-300">Team Radio</span>
                    </Button>
                  )}
                </div>

                {/* Importance Indicator */}
                {event.importance === 'high' && (
                  <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-gradient-to-r from-accent-electric to-accent-neon rounded-full animate-pulse"></div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-bold text-gray-400 mb-2">No events found</h3>
          <p className="text-sm text-gray-500">Try adjusting your filter or check back later</p>
        </div>
      )}
    </section>
  );
};

export default FeaturedEvents;
