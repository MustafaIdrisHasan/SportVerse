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
      className="relative overflow-hidden"
    >
      {/* Series Color Bar */}
      <div 
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: seriesColor }}
      />

      <div className="flex flex-col space-y-4">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-xs px-2 py-1 rounded-full text-white font-medium" style={{ backgroundColor: seriesColor }}>
                {race.series.name}
              </span>
              {!upcoming && (
                <span className="text-xs px-2 py-1 rounded-full bg-gray-600 text-gray-300">
                  Completed
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {race.name}
            </h3>
            <div className="flex items-center text-sm text-gray-400">
              <FiMapPin className="w-4 h-4 mr-1" />
              <span>{race.circuit}, {race.country}</span>
            </div>
          </div>

          {/* Actions */}
          {showActions && user && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleFavoriteToggle}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite 
                    ? 'text-red-400 bg-red-900/20 hover:bg-red-900/30' 
                    : 'text-gray-400 hover:text-red-400 hover:bg-gray-800'
                }`}
              >
                <FiHeart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              {upcoming && (
                <button
                  onClick={handleReminderToggle}
                  className={`p-2 rounded-lg transition-colors ${
                    hasReminder 
                      ? 'text-yellow-400 bg-yellow-900/20 hover:bg-yellow-900/30' 
                      : 'text-gray-400 hover:text-yellow-400 hover:bg-gray-800'
                  }`}
                >
                  <FiBell className={`w-4 h-4 ${hasReminder ? 'fill-current' : ''}`} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Race Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center text-sm text-gray-300">
            <FiCalendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatDate(race.date)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-300">
            <FiClock className="w-4 h-4 mr-2 text-gray-400" />
            <span>{formatTime(race.date)}</span>
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