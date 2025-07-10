import React, { useState, useEffect, useRef } from 'react';
import { FiX, FiRadio, FiFilter, FiVolume2, FiVolumeX, FiPlay, FiPause } from 'react-icons/fi';

interface RadioMessage {
  id: string;
  driver: string;
  team: string;
  timestamp: string;
  message: string;
  type: 'driver-to-pit' | 'pit-to-driver' | 'team-internal';
  isLive?: boolean;
  audioUrl?: string;
}

interface TeamRadioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_RADIO_MESSAGES: RadioMessage[] = [
  {
    id: '1',
    driver: 'Max Verstappen',
    team: 'Red Bull Racing',
    timestamp: '14:23:45',
    message: 'The car feels good, but I need more front downforce in sector 2.',
    type: 'driver-to-pit',
    isLive: true
  },
  {
    id: '2',
    driver: 'Lewis Hamilton',
    team: 'Mercedes',
    timestamp: '14:23:12',
    message: 'Copy Lewis, we see the gap. Push now, push now!',
    type: 'pit-to-driver'
  },
  {
    id: '3',
    driver: 'Charles Leclerc',
    team: 'Ferrari',
    timestamp: '14:22:58',
    message: 'Something is wrong with the rear, it\'s sliding too much.',
    type: 'driver-to-pit'
  },
  {
    id: '4',
    driver: 'Lando Norris',
    team: 'McLaren',
    timestamp: '14:22:34',
    message: 'Box, box, box! Confirm box this lap.',
    type: 'pit-to-driver'
  },
  {
    id: '5',
    driver: 'George Russell',
    team: 'Mercedes',
    timestamp: '14:22:15',
    message: 'The tires are gone, I can\'t keep this pace.',
    type: 'driver-to-pit'
  },
  {
    id: '6',
    driver: 'Carlos Sainz',
    team: 'Ferrari',
    timestamp: '14:21:47',
    message: 'Carlos, you\'re doing great. Keep this rhythm.',
    type: 'pit-to-driver'
  }
];

const TEAM_COLORS = {
  'Red Bull Racing': '#1e40af',
  'Mercedes': '#00d2be',
  'Ferrari': '#dc2626',
  'McLaren': '#f97316',
  'Alpine': '#0ea5e9',
  'Aston Martin': '#059669',
  'Williams': '#3b82f6',
  'AlphaTauri': '#6366f1',
  'Alfa Romeo': '#991b1b',
  'Haas': '#6b7280'
};

const TeamRadioDrawer: React.FC<TeamRadioDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<RadioMessage[]>(MOCK_RADIO_MESSAGES);
  const [selectedTeam, setSelectedTeam] = useState<string>('all');
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [playingMessage, setPlayingMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const teams = Array.from(new Set(messages.map(msg => msg.team)));
  const filteredMessages = selectedTeam === 'all' 
    ? messages 
    : messages.filter(msg => msg.team === selectedTeam);

  // Simulate live messages
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const newMessage: RadioMessage = {
        id: Date.now().toString(),
        driver: 'Max Verstappen',
        team: 'Red Bull Racing',
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        message: 'Radio check, radio check. How do you copy?',
        type: 'driver-to-pit',
        isLive: true
      };

      setMessages(prev => [newMessage, ...prev].slice(0, 20)); // Keep only latest 20 messages
    }, 15000); // New message every 15 seconds

    return () => clearInterval(interval);
  }, [isOpen]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getMessageTypeIcon = (type: RadioMessage['type']) => {
    switch (type) {
      case 'driver-to-pit':
        return '🏎️';
      case 'pit-to-driver':
        return '📻';
      case 'team-internal':
        return '🔧';
      default:
        return '📡';
    }
  };

  const getMessageTypeLabel = (type: RadioMessage['type']) => {
    switch (type) {
      case 'driver-to-pit':
        return 'Driver';
      case 'pit-to-driver':
        return 'Pit Wall';
      case 'team-internal':
        return 'Team';
      default:
        return 'Radio';
    }
  };

  const handlePlayAudio = (messageId: string) => {
    if (playingMessage === messageId) {
      setPlayingMessage(null);
    } else {
      setPlayingMessage(messageId);
      // Simulate audio playback
      setTimeout(() => setPlayingMessage(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-96 bg-gradient-to-br from-dark-100/95 to-dark-200/95 backdrop-blur-lg border-l border-gray-600/50 shadow-2xl transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-f1-500 to-f1-600 rounded-xl flex items-center justify-center shadow-neon">
              <FiRadio className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-racing text-white">Team Radio</h2>
              <p className="text-sm text-gray-400 font-sport">Live F1 Communications</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-600/30 space-y-4">
          {/* Team Filter */}
          <div>
            <label className="block text-sm font-sport font-medium text-gray-300 mb-2">
              Filter by Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 bg-dark-200/50 border border-gray-600/50 rounded-lg text-white font-sport focus:outline-none focus:border-accent-purple/50"
            >
              <option value="all">All Teams</option>
              {teams.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>

          {/* Audio Controls */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-sport text-gray-300">Audio Playback</span>
            <button
              onClick={() => setIsAudioEnabled(!isAudioEnabled)}
              className={`p-2 rounded-lg transition-colors ${
                isAudioEnabled 
                  ? 'bg-accent-neon/20 text-accent-neon' 
                  : 'bg-gray-700/50 text-gray-400'
              }`}
            >
              {isAudioEnabled ? <FiVolume2 className="w-4 h-4" /> : <FiVolumeX className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                message.isLive 
                  ? 'bg-gradient-to-r from-red-500/20 to-red-600/20 border-red-500/30 shadow-neon-pink' 
                  : 'bg-dark-200/30 border-gray-600/30 hover:border-gray-500/50'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ 
                      backgroundColor: `${TEAM_COLORS[message.team as keyof typeof TEAM_COLORS]}20`,
                      color: TEAM_COLORS[message.team as keyof typeof TEAM_COLORS]
                    }}
                  >
                    {getMessageTypeIcon(message.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-sport font-bold text-white">
                        {message.driver}
                      </span>
                      {message.isLive && (
                        <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                          LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-400">
                      <span>{message.team}</span>
                      <span>•</span>
                      <span>{getMessageTypeLabel(message.type)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400 font-mono">
                    {message.timestamp}
                  </span>
                  {isAudioEnabled && (
                    <button
                      onClick={() => handlePlayAudio(message.id)}
                      className="p-1 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
                    >
                      {playingMessage === message.id ? (
                        <FiPause className="w-3 h-3 text-accent-neon" />
                      ) : (
                        <FiPlay className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Content */}
              <p className="text-sm text-gray-300 font-sport leading-relaxed">
                "{message.message}"
              </p>

              {/* Audio Waveform (when playing) */}
              {playingMessage === message.id && (
                <div className="mt-3 flex items-center space-x-1">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-accent-neon rounded-full animate-pulse"
                      style={{
                        height: `${Math.random() * 16 + 4}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-600/30 bg-gradient-to-r from-dark-200/50 to-dark-100/50">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="font-sport">
              {filteredMessages.length} messages
            </span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live Feed Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRadioDrawer;
