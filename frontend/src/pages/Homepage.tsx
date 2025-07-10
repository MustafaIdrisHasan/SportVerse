import React, { useState, useEffect } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import useAuthStore from '../context/authStore';
import Layout from '../components/layout/Layout';
import SportsModal from '../components/sports/SportsModal';
import FeaturedEvents from '../components/events/FeaturedEvents';
import QuickTools from '../components/navigation/QuickTools';
import LiveIndicator from '../components/ui/LiveIndicator';
import ProfileDropdown from '../components/ui/ProfileDropdown';
import ResizableSidebar from '../components/ui/ResizableSidebar';
import TeamRadioDrawer from '../components/f1/TeamRadioDrawer';
import Card from '../components/ui/Card';

// Mock data for sports categories
const SPORTS_CATEGORIES = {
  'Motorsports': [
    { id: 'f1', name: 'Formula 1', icon: '🏎️', color: '#e10600', isPinned: true },
    { id: 'motogp', name: 'MotoGP', icon: '🏍️', color: '#0066cc', isPinned: true },
    { id: 'nascar', name: 'NASCAR', icon: '🏁', color: '#ffd700', isPinned: true },
    { id: 'lemans', name: 'Le Mans', icon: '🏆', color: '#ff8c00', isPinned: true },
    { id: 'indycar', name: 'IndyCar', icon: '🏎️', color: '#ff0000' },
    { id: 'rally', name: 'Rally', icon: '🚗', color: '#00ff00' },
  ],
  'Team Sports': [
    { id: 'football', name: 'Football', icon: '⚽', color: '#00aa00', isPinned: true },
    { id: 'basketball', name: 'Basketball', icon: '🏀', color: '#ff6600', isPinned: true },
    { id: 'baseball', name: 'Baseball', icon: '⚾', color: '#0066cc' },
    { id: 'hockey', name: 'Hockey', icon: '🏒', color: '#000000' },
    { id: 'rugby', name: 'Rugby', icon: '🏉', color: '#8b4513' },
    { id: 'volleyball', name: 'Volleyball', icon: '🏐', color: '#ffff00' },
  ],
  'Racquet Sports': [
    { id: 'tennis', name: 'Tennis', icon: '🎾', color: '#32cd32' },
    { id: 'badminton', name: 'Badminton', icon: '🏸', color: '#ff69b4' },
    { id: 'squash', name: 'Squash', icon: '🎾', color: '#4169e1' },
    { id: 'tabletennis', name: 'Table Tennis', icon: '🏓', color: '#ff4500' },
  ],
  'Individual Sports': [
    { id: 'athletics', name: 'Athletics', icon: '🏃', color: '#ffd700' },
    { id: 'swimming', name: 'Swimming', icon: '🏊', color: '#00bfff' },
    { id: 'cycling', name: 'Cycling', icon: '🚴', color: '#32cd32' },
    { id: 'golf', name: 'Golf', icon: '⛳', color: '#228b22' },
    { id: 'boxing', name: 'Boxing', icon: '🥊', color: '#dc143c' },
    { id: 'wrestling', name: 'Wrestling', icon: '🤼', color: '#8b4513' },
  ],
  'Winter Sports': [
    { id: 'skiing', name: 'Skiing', icon: '⛷️', color: '#87ceeb' },
    { id: 'snowboarding', name: 'Snowboarding', icon: '🏂', color: '#4682b4' },
    { id: 'icehockey', name: 'Ice Hockey', icon: '🏒', color: '#000080' },
    { id: 'figureskating', name: 'Figure Skating', icon: '⛸️', color: '#ff69b4' },
  ],
  'Combat Sports': [
    { id: 'mma', name: 'MMA', icon: '🥋', color: '#8b0000' },
    { id: 'karate', name: 'Karate', icon: '🥋', color: '#ff6347' },
    { id: 'judo', name: 'Judo', icon: '🥋', color: '#4169e1' },
    { id: 'taekwondo', name: 'Taekwondo', icon: '🦵', color: '#ff1493' },
  ]
};

const Homepage: React.FC = () => {
  const { user } = useAuthStore();
  const [showSportsModal, setShowSportsModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showTeamRadio, setShowTeamRadio] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [pinnedSports, setPinnedSports] = useState<any[]>([]);
  const [liveUpdates] = useState({
    events: 12,
    alerts: 3,
    following: 8
  });



  useEffect(() => {
    // Get pinned sports from all categories
    const pinned = Object.values(SPORTS_CATEGORIES)
      .flat()
      .filter(sport => 'isPinned' in sport && sport.isPinned === true)
      .slice(0, 6);
    setPinnedSports(pinned);
  }, []);

  const handleSportPin = (sport: any) => {
    if (pinnedSports.length < 6 && !pinnedSports.find(p => p.id === sport.id)) {
      setPinnedSports([...pinnedSports, sport]);
    }
  };

  const handleSportUnpin = (sportId: string) => {
    setPinnedSports(pinnedSports.filter(sport => sport.id !== sportId));
  };

  return (
    <Layout showHeader={false}>
      <div className="min-h-screen bg-gradient-to-br from-dark-50 via-gray-900 to-dark-100">
        {/* Top Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-gradient-to-r from-dark-50/95 via-gray-900/95 to-dark-100/95 backdrop-blur-lg border-b border-gray-600/30 shadow-xl">
          <div className="max-w-full mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="relative">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-racing-gradient rounded-lg lg:rounded-xl flex items-center justify-center shadow-neon">
                    <span className="text-white font-bold text-sm lg:text-lg font-racing">SV</span>
                  </div>
                  <div className="absolute inset-0 bg-racing-gradient rounded-lg lg:rounded-xl blur-md opacity-30"></div>
                </div>
                <div>
                  <h1 className="text-lg lg:text-xl font-bold font-racing bg-gradient-to-r from-white via-accent-electric to-white bg-clip-text text-transparent">
                    SportVerse
                  </h1>
                  <div className="text-xs text-gray-400 font-sport hidden lg:block">Your Sports Universe</div>
                </div>
              </div>

              {/* Pinned Sports - Desktop */}
              <div className="hidden md:flex items-center space-x-2">
                {pinnedSports.map((sport) => (
                  <button
                    key={sport.id}
                    className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-transparent to-transparent hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 border border-transparent hover:border-gray-500/30"
                    style={{ 
                      '--sport-color': sport.color,
                      borderColor: `${sport.color}20`
                    } as React.CSSProperties}
                  >
                    <span className="text-lg">{sport.icon}</span>
                    <span className="text-sm font-sport text-gray-300 group-hover:text-white transition-colors">
                      {sport.name}
                    </span>
                  </button>
                ))}
                
                {/* Explore Sports Button */}
                <button
                  onClick={() => setShowSportsModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 hover:from-accent-purple/30 hover:to-accent-pink/30 border border-accent-purple/30 hover:border-accent-purple/50 rounded-lg transition-all duration-300 group"
                >
                  <FiPlus className="w-4 h-4 text-accent-purple group-hover:text-accent-pink transition-colors" />
                  <span className="text-sm font-sport text-gray-300 group-hover:text-white">Explore Sports</span>
                </button>
              </div>

              {/* Mobile Sports Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setShowSportsModal(true)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-accent-purple/20 to-accent-pink/20 hover:from-accent-purple/30 hover:to-accent-pink/30 border border-accent-purple/30 hover:border-accent-purple/50 rounded-lg transition-all duration-300"
                >
                  <FiPlus className="w-4 h-4 text-accent-purple" />
                  <span className="text-sm font-sport text-gray-300">Sports</span>
                </button>
              </div>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <LiveIndicator count={liveUpdates.events} label="Live" />
                <div className="relative">
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="group flex items-center space-x-2 p-2 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-accent-purple/20 hover:to-accent-pink/20 border border-transparent hover:border-accent-purple/30 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <span className="text-white text-sm font-bold">{user?.name?.[0] || 'U'}</span>
                    </div>
                    <FiChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-white transition-all duration-300 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  <ProfileDropdown
                    isOpen={showProfileDropdown}
                    onClose={() => setShowProfileDropdown(false)}
                    onToggle={() => setShowProfileDropdown(!showProfileDropdown)}
                  />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile Pinned Sports Bar */}
        <div className="md:hidden bg-gradient-to-r from-dark-50/90 via-gray-900/90 to-dark-100/90 backdrop-blur-sm border-b border-gray-600/20 px-4 py-3">
          <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
            {pinnedSports.map((sport) => (
              <button
                key={sport.id}
                className="flex-shrink-0 flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-transparent to-transparent hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-300 border border-transparent hover:border-gray-500/30"
                style={{
                  '--sport-color': sport.color,
                  borderColor: `${sport.color}20`
                } as React.CSSProperties}
              >
                <span className="text-base">{sport.icon}</span>
                <span className="text-xs font-sport text-gray-300 whitespace-nowrap">
                  {sport.name}
                </span>
              </button>
            ))}
            {pinnedSports.length === 0 && (
              <div className="text-sm text-gray-400 font-sport">
                Pin your favorite sports to see them here
              </div>
            )}
          </div>
        </div>

        {/* Main Layout Container */}
        <div className="relative min-h-[calc(100vh-64px)]">
          {/* Main Content Area */}
          <div
            className="transition-all duration-300 ease-in-out pt-4"
            style={{
              marginRight: window.innerWidth >= 1280 ? `${sidebarWidth}px` : '0px'
            }}
          >
            <main className="p-4 lg:p-6 max-w-full overflow-hidden">
              {/* Welcome Section */}
              <section className="mb-6">
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-f1-500/10 via-motogp-500/10 to-lemans-500/10 rounded-2xl blur-xl"></div>
                  <Card className="relative bg-gradient-to-br from-dark-100/90 to-dark-200/90 backdrop-blur-lg border-gray-600/30 p-4 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold font-racing mb-2">
                          <span className="bg-gradient-to-r from-f1-500 via-accent-electric to-motogp-500 bg-clip-text text-transparent">
                            Welcome back, {user?.name?.split(' ')[0] || 'Champion'}! 🏆
                          </span>
                        </h2>
                        <p className="text-sm lg:text-base text-gray-300 font-sport mb-3 lg:mb-4">
                          Stay updated with live sports action across the globe
                        </p>

                        {/* Live Update Indicators */}
                        <div className="flex flex-wrap items-center gap-3 lg:gap-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-xs lg:text-sm text-gray-300 font-sport">
                              <strong className="text-green-400">{liveUpdates.events}</strong> Live
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-accent-electric rounded-full animate-pulse"></div>
                            <span className="text-xs lg:text-sm text-gray-300 font-sport">
                              <strong className="text-accent-electric">{liveUpdates.alerts}</strong> Alerts
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 lg:w-3 lg:h-3 bg-accent-purple rounded-full animate-pulse"></div>
                            <span className="text-xs lg:text-sm text-gray-300 font-sport">
                              <strong className="text-accent-purple">{liveUpdates.following}</strong> Updates
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="hidden xl:block flex-shrink-0">
                        <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 rounded-full blur-2xl animate-pulse-slow"></div>
                      </div>
                    </div>
                  </Card>
                </div>
              </section>

              {/* Featured Events Section */}
              <div className="w-full">
                <FeaturedEvents onTeamRadioToggle={() => setShowTeamRadio(true)} />
              </div>
            </main>
          </div>

          {/* Right Side Resizable Sidebar */}
          <div
            className="hidden xl:block fixed right-0 bottom-0 z-30"
            style={{ top: '64px' }}
          >
            <ResizableSidebar
              defaultWidth={320}
              minWidth={240}
              maxWidth={600}
              onWidthChange={setSidebarWidth}
              className="h-full"
            >
              <QuickTools />
            </ResizableSidebar>
          </div>
        </div>

        {/* Sports Modal */}
        {showSportsModal && (
          <SportsModal
            isOpen={showSportsModal}
            onClose={() => setShowSportsModal(false)}
            sportsCategories={SPORTS_CATEGORIES}
            pinnedSports={pinnedSports}
            onSportPin={handleSportPin}
            onSportUnpin={handleSportUnpin}
          />
        )}

        {/* Team Radio Drawer */}
        <TeamRadioDrawer
          isOpen={showTeamRadio}
          onClose={() => setShowTeamRadio(false)}
        />
      </div>
    </Layout>
  );
};

export default Homepage;
