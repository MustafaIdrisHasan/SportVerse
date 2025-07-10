import React, { useState, useMemo } from 'react';
import { FiSearch, FiX, FiCheck } from 'react-icons/fi';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface Sport {
  id: string;
  name: string;
  icon: string;
  color: string;
  isPinned?: boolean;
}

interface SportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportsCategories: { [key: string]: Sport[] };
  pinnedSports: Sport[];
  onSportPin: (sport: Sport) => void;
  onSportUnpin: (sportId: string) => void;
}

const SportsModal: React.FC<SportsModalProps> = ({
  isOpen,
  onClose,
  sportsCategories,
  pinnedSports,
  onSportPin,
  onSportUnpin
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter sports based on search query
  const filteredSports = useMemo(() => {
    if (!searchQuery && !selectedCategory) return sportsCategories;

    const filtered: { [key: string]: Sport[] } = {};

    Object.entries(sportsCategories).forEach(([category, sports]) => {
      if (selectedCategory && category !== selectedCategory) return;

      const matchingSports = sports.filter(sport =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

      if (matchingSports.length > 0) {
        filtered[category] = matchingSports;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sportsCategories]);

  const totalSports = Object.values(sportsCategories).flat().length;
  const categories = Object.keys(sportsCategories);

  const isPinned = (sportId: string) => pinnedSports.some(sport => sport.id === sportId);
  const canPin = pinnedSports.length < 6;

  const handleSportToggle = (sport: Sport) => {
    if (isPinned(sport.id)) {
      onSportUnpin(sport.id);
    } else if (canPin) {
      onSportPin(sport);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-4xl">
          <Card className="bg-gradient-to-br from-dark-100/95 to-dark-200/95 backdrop-blur-lg border-gray-600/50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-600/30">
              <div>
                <h2 className="text-2xl font-bold font-racing bg-gradient-to-r from-accent-purple to-accent-pink bg-clip-text text-transparent">
                  Explore Sports
                </h2>
                <p className="text-sm text-gray-400 font-sport mt-1">
                  Discover and pin your favorite sports • {totalSports} sports available
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-600/50 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Search and Filters */}
            <div className="p-6 border-b border-gray-600/30">
              {/* Search Bar */}
              <div className="relative mb-4">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-200/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-accent-purple/50 focus:ring-2 focus:ring-accent-purple/20 transition-all font-sport"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-sport transition-all ${
                    selectedCategory === null
                      ? 'bg-accent-purple text-white'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg text-sm font-sport transition-all ${
                      selectedCategory === category
                        ? 'bg-accent-purple text-white'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Pin Status */}
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400 font-sport">
                  {pinnedSports.length}/6 sports pinned
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                  <span className="text-xs text-gray-400">Pinned sports appear in top navigation</span>
                </div>
              </div>
            </div>

            {/* Sports Grid */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {Object.entries(filteredSports).map(([category, sports]) => (
                <div key={category} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-bold font-racing text-white mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-accent-neon to-accent-electric bg-clip-text text-transparent">
                      {category}
                    </span>
                    <span className="ml-2 text-sm text-gray-400 font-sport">
                      ({sports.length})
                    </span>
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {sports.map((sport) => {
                      const pinned = isPinned(sport.id);
                      return (
                        <button
                          key={sport.id}
                          onClick={() => handleSportToggle(sport)}
                          disabled={!pinned && !canPin}
                          className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                            pinned
                              ? 'bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 border-accent-purple/50 shadow-neon-pink'
                              : canPin
                              ? 'bg-dark-200/30 border-gray-600/30 hover:border-gray-500/50 hover:bg-dark-200/50'
                              : 'bg-dark-200/20 border-gray-700/30 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {/* Pin Indicator */}
                          {pinned && (
                            <div className="absolute top-2 right-2">
                              <div className="w-6 h-6 bg-accent-purple rounded-full flex items-center justify-center">
                                <FiCheck className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          )}

                          <div className="text-center">
                            <div className="text-2xl mb-2">{sport.icon}</div>
                            <div className="text-sm font-sport font-medium text-white group-hover:text-accent-electric transition-colors">
                              {sport.name}
                            </div>
                          </div>

                          {/* Hover Effect */}
                          <div 
                            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity"
                            style={{ backgroundColor: sport.color }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {Object.keys(filteredSports).length === 0 && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-bold text-gray-400 mb-2">No sports found</h3>
                  <p className="text-sm text-gray-500">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-600/30">
              <div className="text-sm text-gray-400 font-sport">
                Pin your favorite sports for quick access in the top navigation
              </div>
              <Button
                onClick={onClose}
                variant="primary"
                className="bg-gradient-to-r from-accent-purple to-accent-pink hover:shadow-neon-pink"
              >
                Done
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SportsModal;
