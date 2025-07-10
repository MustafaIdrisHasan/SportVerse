import React, { useState, useEffect } from 'react';
import { FiTrendingUp, FiClock, FiMapPin, FiUsers, FiStar, FiChevronRight, FiPlay, FiRadio } from 'react-icons/fi';
import Card from '../ui/Card';
import Button from '../ui/Button';

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

const MOCK_EVENTS: FeaturedEvent[] = [
  {
    id: '1',
    title: 'Monaco Grand Prix',
    sport: { name: 'Formula 1', icon: '🏎️', color: '#e10600' },
    status: 'live',
    startTime: '2024-01-15T14:00:00Z',
    location: 'Monaco',
    participants: ['Max Verstappen', 'Lewis Hamilton', 'Charles Leclerc'],
    viewers: 2500000,
    importance: 'high',
    description: 'The most prestigious race in Formula 1 calendar'
  },
  {
    id: '2',
    title: 'Champions League Final',
    sport: { name: 'Football', icon: '⚽', color: '#00aa00' },
    status: 'upcoming',
    startTime: '2024-01-15T20:00:00Z',
    location: 'Wembley Stadium',
    participants: ['Manchester City', 'Real Madrid'],
    viewers: 1800000,
    importance: 'high',
    description: 'The ultimate showdown in European football'
  },
  {
    id: '3',
    title: 'NBA Finals Game 7',
    sport: { name: 'Basketball', icon: '🏀', color: '#ff6600' },
    status: 'upcoming',
    startTime: '2024-01-16T02:00:00Z',
    location: 'TD Garden',
    participants: ['Boston Celtics', 'Los Angeles Lakers'],
    viewers: 1200000,
    importance: 'high',
    description: 'Winner takes all in this decisive game'
  },
  {
    id: '4',
    title: 'Wimbledon Men\'s Final',
    sport: { name: 'Tennis', icon: '🎾', color: '#32cd32' },
    status: 'upcoming',
    startTime: '2024-01-16T14:00:00Z',
    location: 'All England Club',
    participants: ['Novak Djokovic', 'Carlos Alcaraz'],
    viewers: 800000,
    importance: 'medium',
    description: 'The most prestigious tennis tournament'
  },
  {
    id: '5',
    title: 'MotoGP Catalunya',
    sport: { name: 'MotoGP', icon: '🏍️', color: '#0066cc' },
    status: 'completed',
    startTime: '2024-01-14T13:00:00Z',
    location: 'Circuit de Barcelona-Catalunya',
    participants: ['Francesco Bagnaia', 'Jorge Martin', 'Marc Marquez'],
    viewers: 600000,
    importance: 'medium',
    description: 'Thrilling race in the Spanish countryside'
  },
  {
    id: '6',
    title: 'UFC 300 Main Event',
    sport: { name: 'MMA', icon: '🥋', color: '#8b0000' },
    status: 'upcoming',
    startTime: '2024-01-16T04:00:00Z',
    location: 'T-Mobile Arena',
    participants: ['Jon Jones', 'Stipe Miocic'],
    viewers: 950000,
    importance: 'high',
    description: 'Heavyweight championship bout'
  }
];

interface FeaturedEventsProps {
  onTeamRadioToggle?: () => void;
}

const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ onTeamRadioToggle }) => {
  const [events, setEvents] = useState<FeaturedEvent[]>([]);
  const [filter, setFilter] = useState<'all' | 'live' | 'upcoming' | 'today'>('all');

  useEffect(() => {
    setEvents(MOCK_EVENTS);
  }, []);

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
