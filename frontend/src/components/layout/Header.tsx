import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSettings, FiHome, FiCalendar } from 'react-icons/fi';
import useAuthStore from '../../context/authStore';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gradient-to-r from-dark-50/95 via-gray-900/95 to-dark-100/95 backdrop-blur-lg border-b border-gradient-to-r from-f1-500/30 via-motogp-500/30 to-lemans-500/30 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-racing-gradient rounded-xl flex items-center justify-center shadow-neon group-hover:shadow-neon-pink transition-all duration-300 transform group-hover:scale-110">
                <span className="text-white font-bold text-lg font-racing">SV</span>
              </div>
              <div className="absolute inset-0 bg-racing-gradient rounded-xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-racing text-2xl font-bold bg-gradient-to-r from-white via-accent-electric to-white bg-clip-text text-transparent">
                SportVerse
              </span>
              <span className="text-xs text-gray-400 font-sport tracking-wider">
                RACING UNIVERSE
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-f1-500/20 hover:to-motogp-500/20 text-gray-300 hover:text-white transition-all duration-300 border border-transparent hover:border-accent-electric/30"
            >
              <FiHome className="w-5 h-5 group-hover:text-accent-electric transition-colors" />
              <span className="font-sport font-medium">Dashboard</span>
            </Link>
            <Link
              to="/schedule"
              className="group flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-transparent to-transparent hover:from-motogp-500/20 hover:to-lemans-500/20 text-gray-300 hover:text-white transition-all duration-300 border border-transparent hover:border-accent-neon/30"
            >
              <FiCalendar className="w-5 h-5 group-hover:text-accent-neon transition-colors" />
              <span className="font-sport font-medium">Schedule</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="relative group">
                  <button className="group flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-dark-100/50 to-dark-200/50 hover:from-accent-purple/20 hover:to-accent-pink/20 transition-all duration-300 border border-gray-700 hover:border-accent-purple/50 shadow-lg hover:shadow-neon-pink">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-pink rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FiUser className="w-5 h-5 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-sport font-medium text-white">{user.name}</div>
                      <div className="text-xs text-gray-400">{user.email}</div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-3 w-56 bg-gradient-to-br from-dark-100/95 to-dark-200/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-600/50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="p-3">
                      <button className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-accent-purple/20 hover:to-accent-pink/20 transition-all duration-200 rounded-lg group/item">
                        <FiSettings className="w-5 h-5 mr-3 group-hover/item:text-accent-purple transition-colors" />
                        <span className="font-sport">Settings</span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-f1-500/20 hover:to-lemans-500/20 transition-all duration-200 rounded-lg group/item mt-1"
                      >
                        <FiLogOut className="w-5 h-5 mr-3 group-hover/item:text-f1-500 transition-colors" />
                        <span className="font-sport">Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Series Filter Bar */}
      {isAuthenticated && (
        <div className="border-t border-gradient-to-r from-f1-500/30 via-motogp-500/30 to-lemans-500/30 bg-gradient-to-r from-dark-50/80 via-gray-900/80 to-dark-100/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-4 py-4 overflow-x-auto">
              <button className="group flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-f1-500 to-f1-600 hover:from-f1-600 hover:to-f1-700 transition-all duration-300 text-sm font-sport font-semibold shadow-lg hover:shadow-neon transform hover:scale-105 whitespace-nowrap">
                <span className="text-xl">🏎️</span>
                <span className="text-white">Formula 1</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="group flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-motogp-500 to-motogp-600 hover:from-motogp-600 hover:to-motogp-700 transition-all duration-300 text-sm font-sport font-semibold shadow-lg hover:shadow-neon transform hover:scale-105 whitespace-nowrap">
                <span className="text-xl">🏍️</span>
                <span className="text-white">MotoGP</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="group flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-lemans-500 to-lemans-600 hover:from-lemans-600 hover:to-lemans-700 transition-all duration-300 text-sm font-sport font-semibold shadow-lg hover:shadow-neon transform hover:scale-105 whitespace-nowrap">
                <span className="text-xl">🏁</span>
                <span className="text-white">Le Mans</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button className="group flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r from-nascar-500 to-nascar-600 hover:from-nascar-600 hover:to-nascar-700 transition-all duration-300 text-sm font-sport font-semibold shadow-lg hover:shadow-neon transform hover:scale-105 whitespace-nowrap">
                <span className="text-xl">🏆</span>
                <span className="text-white">NASCAR</span>
                <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 