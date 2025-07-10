import React from 'react';
import { FiHeart, FiBell, FiMapPin, FiClock, FiCalendar } from 'react-icons/fi';
import { Race } from '../../types';
import { formatDate, formatTime, getTimeUntilRace, getSeriesColor, isRaceUpcoming } from '../../utils/helpers';
import useAuthStore from '../../context/authStore';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface RaceCardProps {
  race: Race;
  onClick?: () => void;
  showActions?: boolean;
}

const RaceCard: React.FC<RaceCardProps> = ({ race, onClick, showActions = true }) => {
  const { user, addFavorite, removeFavorite, addReminder, removeReminder } = useAuthStore();
  
  const isFavorite = user?.favorites.includes(race.id) || false;
  const hasReminder = user?.reminders.includes(race.id) || false;
  const upcoming = isRaceUpcoming(race.date);
  const seriesColor = getSeriesColor(race.series.name);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFavorite(race.id);
    } else {
      addFavorite(race.id);
    }
  };

  const handleReminderToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasReminder) {
      removeReminder(race.id);
    } else {
      addReminder(race.id);
    }
  };

  return (
    <Card
      hover
      onClick={onClick}
      className="group relative overflow-hidden bg-gradient-to-br from-dark-100/90 to-dark-200/90 backdrop-blur-lg border-gray-600/50 hover:border-accent-electric/50 transition-all duration-300 transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
    >
      {/* Dynamic Background Gradient */}
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
        style={{
          background: `linear-gradient(135deg, ${seriesColor}20, transparent 70%)`
        }}
      />

      {/* Racing Stripe */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-current to-transparent opacity-60" style={{ color: seriesColor }} />

      {/* Status Badge */}
      {upcoming && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-accent-neon/90 to-accent-electric/90 backdrop-blur-sm border border-accent-neon/30 shadow-neon-green">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-xs font-sport font-bold text-white">
              {getTimeUntilRace(race.date)}
            </span>
          </div>
        </div>
      )}

      <div className="relative flex flex-col space-y-4 p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div
                  className="w-6 h-6 rounded-lg shadow-lg"
                  style={{ backgroundColor: seriesColor }}
                />
                <div
                  className="absolute inset-0 w-6 h-6 rounded-lg blur-sm opacity-50"
                  style={{ backgroundColor: seriesColor }}
                />
              </div>
              <span className="text-sm font-sport font-semibold text-gray-300 uppercase tracking-wider">
                {race.series.name}
              </span>
              {!upcoming && (
                <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 text-gray-300 font-sport">
                  Completed
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold font-racing text-white mb-2 line-clamp-2 group-hover:text-accent-electric transition-colors">
              {race.name}
            </h3>
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <FiMapPin className="w-4 h-4 mr-2 text-accent-purple" />
              <span className="font-sport">{race.circuit}, {race.country}</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && user && (
            <div className="flex items-center space-x-3">
              <button
                onClick={handleFavoriteToggle}
                className={`group/btn p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                  isFavorite
                    ? 'bg-gradient-to-r from-accent-pink to-f1-500 text-white shadow-neon-pink'
                    : 'bg-dark-200/50 text-gray-400 hover:bg-gradient-to-r hover:from-accent-pink/20 hover:to-f1-500/20 hover:text-accent-pink border border-gray-600 hover:border-accent-pink/50'
                }`}
              >
                <FiHeart className={`w-5 h-5 transition-all duration-300 ${isFavorite ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`} />
              </button>
              {upcoming && (
                <button
                  onClick={handleReminderToggle}
                  className={`group/btn p-3 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                    hasReminder
                      ? 'bg-gradient-to-r from-lemans-500 to-nascar-500 text-white shadow-neon'
                      : 'bg-dark-200/50 text-gray-400 hover:bg-gradient-to-r hover:from-lemans-500/20 hover:to-nascar-500/20 hover:text-lemans-500 border border-gray-600 hover:border-lemans-500/50'
                  }`}
                >
                  <FiBell className={`w-5 h-5 transition-all duration-300 ${hasReminder ? 'fill-current scale-110' : 'group-hover/btn:scale-110'}`} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Race Info */}
        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-600/30">
          <div className="flex items-center text-sm text-gray-300 group/info">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-lg flex items-center justify-center mr-3 group-hover/info:scale-110 transition-transform">
              <FiCalendar className="w-4 h-4 text-accent-purple" />
            </div>
            <div>
              <div className="font-sport font-medium">{formatDate(race.date)}</div>
              <div className="text-xs text-gray-500">Race Date</div>
            </div>
          </div>
          <div className="flex items-center text-sm text-gray-300 group/info">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-neon/20 to-accent-electric/20 rounded-lg flex items-center justify-center mr-3 group-hover/info:scale-110 transition-transform">
              <FiClock className="w-4 h-4 text-accent-neon" />
            </div>
            <div>
              <div className="font-sport font-medium">{formatTime(race.date)}</div>
              <div className="text-xs text-gray-500">Start Time</div>
            </div>
          </div>
        </div>

        {/* Time Until Race */}
        {upcoming && (
          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-1">Race starts in</p>
              <p className="text-lg font-bold text-white">
                {getTimeUntilRace(race.date)}
              </p>
            </div>
          </div>
        )}

        {/* Watch Links Preview */}
        {race.watchLinks && race.watchLinks.length > 0 && (
          <div className="border-t border-gray-700 pt-3">
            <p className="text-xs text-gray-400 mb-2">Watch on:</p>
            <div className="flex flex-wrap gap-1">
              {race.watchLinks.slice(0, 3).map((link, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded"
                >
                  {link.broadcaster}
                </span>
              ))}
              {race.watchLinks.length > 3 && (
                <span className="text-xs px-2 py-1 bg-gray-700 text-gray-300 rounded">
                  +{race.watchLinks.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {upcoming && showActions && (
          <div className="border-t border-gray-700 pt-3">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.();
              }}
            >
              View Details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RaceCard; 