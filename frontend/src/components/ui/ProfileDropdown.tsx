import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiUser, FiSettings, FiBarChart2, FiGlobe, FiBell, FiMessageSquare,
  FiClock, FiStar, FiCreditCard, FiGift, FiHelpCircle, FiMessageCircle,
  FiRefreshCw, FiLogOut, FiChevronRight
} from 'react-icons/fi';
import useAuthStore from '../../context/authStore';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

const MENU_ITEMS = [
  {
    id: 'profile',
    label: 'My Profile',
    icon: <FiUser className="w-4 h-4" />,
    description: 'View and edit your profile',
    color: '#8b5cf6',
    category: 'account'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <FiSettings className="w-4 h-4" />,
    description: 'App preferences and configuration',
    color: '#6b7280',
    category: 'account'
  },
  {
    id: 'dashboard',
    label: 'My Sports Dashboard',
    icon: <FiBarChart2 className="w-4 h-4" />,
    description: 'Personal sports analytics',
    color: '#0066cc',
    category: 'sports'
  },
  {
    id: 'region',
    label: 'Region & Timezone',
    icon: <FiGlobe className="w-4 h-4" />,
    description: 'Location and time settings',
    color: '#059669',
    category: 'account'
  },
  {
    id: 'notifications',
    label: 'Notifications Center',
    icon: <FiBell className="w-4 h-4" />,
    description: 'Manage all notifications',
    color: '#f59e0b',
    category: 'communication',
    badge: 3
  },
  {
    id: 'messages',
    label: 'Messages & Alerts',
    icon: <FiMessageSquare className="w-4 h-4" />,
    description: 'Sports alerts and messages',
    color: '#ec4899',
    category: 'communication',
    badge: 5
  },
  {
    id: 'reminders',
    label: 'Reminders',
    icon: <FiClock className="w-4 h-4" />,
    description: 'Event and race reminders',
    color: '#06b6d4',
    category: 'sports'
  },
  {
    id: 'upgrade',
    label: 'Upgrade to Pro',
    icon: <FiStar className="w-4 h-4" />,
    description: 'Unlock premium features',
    color: '#ffd700',
    category: 'premium',
    highlight: true
  },
  {
    id: 'billing',
    label: 'Billing & Subscriptions',
    icon: <FiCreditCard className="w-4 h-4" />,
    description: 'Manage your subscriptions',
    color: '#10b981',
    category: 'premium'
  },
  {
    id: 'whats-new',
    label: "What's New",
    icon: <FiGift className="w-4 h-4" />,
    description: 'Latest features and updates',
    color: '#f97316',
    category: 'support',
    badge: 'NEW'
  },
  {
    id: 'help',
    label: 'Help Center',
    icon: <FiHelpCircle className="w-4 h-4" />,
    description: 'Get help and support',
    color: '#6366f1',
    category: 'support'
  },
  {
    id: 'feedback',
    label: 'Submit Feedback',
    icon: <FiMessageCircle className="w-4 h-4" />,
    description: 'Share your thoughts',
    color: '#84cc16',
    category: 'support'
  },
  {
    id: 'switch',
    label: 'Switch Account',
    icon: <FiRefreshCw className="w-4 h-4" />,
    description: 'Change to another account',
    color: '#64748b',
    category: 'account'
  },
  {
    id: 'logout',
    label: 'Logout',
    icon: <FiLogOut className="w-4 h-4" />,
    description: 'Sign out of your account',
    color: '#ef4444',
    category: 'account',
    danger: true
  }
];

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ isOpen, onClose, onToggle }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (itemId: string) => {
    onClose();

    switch (itemId) {
      case 'profile':
        navigate('/profile');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'dashboard':
        navigate('/dashboard-settings');
        break;
      case 'region':
        navigate('/region-settings');
        break;
      case 'notifications':
        navigate('/notifications');
        break;
      case 'messages':
        navigate('/messages');
        break;
      case 'reminders':
        navigate('/reminders');
        break;
      case 'upgrade':
        navigate('/pro-upgrade');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'changelog':
        navigate('/changelog');
        break;
      case 'help':
        navigate('/help');
        break;
      case 'feedback':
        navigate('/feedback');
        break;
      case 'switch':
        navigate('/switch-account');
        break;
      case 'logout':
        logout();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);



  const groupedItems = MENU_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof MENU_ITEMS>);

  const categoryLabels = {
    account: 'Account',
    sports: 'Sports',
    communication: 'Communication',
    premium: 'Premium',
    support: 'Support'
  };

  if (!isOpen) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="absolute right-0 top-2 w-80 bg-gradient-to-br from-dark-100/95 to-dark-200/95 backdrop-blur-lg border border-gray-600/50 rounded-2xl shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-600/30">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl flex items-center justify-center shadow-neon-pink">
              <span className="text-white text-lg font-bold font-racing">
                {user?.name?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold font-racing text-white">
                {user?.name || 'User'}
              </h3>
              <p className="text-sm text-gray-400 font-sport">
                {user?.email || 'user@sportverse.com'}
              </p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="max-h-96 overflow-y-auto">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="p-4">
              <h4 className="text-xs font-sport font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h4>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleMenuClick(item.id)}
                    className={`group w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      item.highlight
                        ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 hover:from-yellow-500/30 hover:to-orange-500/30'
                        : item.danger
                        ? 'hover:bg-red-500/20 hover:border-red-500/30'
                        : 'hover:bg-gray-700/50'
                    } border border-transparent`}
                  >
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <div style={{ color: item.color }}>
                          {item.icon}
                        </div>
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-sport font-medium ${
                          item.danger ? 'text-red-400' : 'text-white'
                        } group-hover:text-accent-electric transition-colors`}>
                          {item.label}
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.description}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {item.badge && (
                        <span 
                          className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                            typeof item.badge === 'string'
                              ? 'bg-orange-500 text-white'
                              : 'bg-red-500 text-white'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      <FiChevronRight className="w-4 h-4 text-gray-400 group-hover:text-accent-electric transition-colors" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-600/30 bg-gradient-to-r from-dark-200/50 to-dark-100/50">
          <div className="text-center">
            <p className="text-xs text-gray-400 font-sport">
              SportVerse Pro • Version 2.1.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDropdown;
