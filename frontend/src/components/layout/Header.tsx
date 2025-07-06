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
    <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RS</span>
            </div>
            <span className="font-racing text-xl font-bold text-white">
              RaceScope
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <FiHome className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/schedule"
              className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
            >
              <FiCalendar className="w-4 h-4" />
              <span>Schedule</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm text-white font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>

                {/* User Menu */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                      <FiUser className="w-4 h-4 text-gray-300" />
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <button className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors">
                        <FiSettings className="w-4 h-4 mr-3" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                      >
                        <FiLogOut className="w-4 h-4 mr-3" />
                        Logout
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
        <div className="border-t border-gray-700 bg-gray-850">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center space-x-6 py-3">
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-f1 hover:bg-red-700 transition-colors text-sm font-medium">
                <span>🏎️</span>
                <span>Formula 1</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-motogp hover:bg-blue-700 transition-colors text-sm font-medium">
                <span>🏍️</span>
                <span>MotoGP</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-lemans hover:bg-orange-700 transition-colors text-sm font-medium">
                <span>🏁</span>
                <span>Le Mans</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 