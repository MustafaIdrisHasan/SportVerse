import React, { useState } from 'react';
import { FiCalendar, FiBell, FiTrendingUp, FiUsers, FiSettings, FiBookmark, FiClock, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import Card from '../ui/Card';

interface QuickTool {
  id: string;
  name: string;
  icon: React.ReactNode;
  count?: number;
  color: string;
  description: string;
}

const QUICK_TOOLS: QuickTool[] = [
  {
    id: 'calendar',
    name: 'Calendar',
    icon: <FiCalendar className="w-5 h-5" />,
    count: 8,
    color: '#0066cc',
    description: 'Upcoming events'
  },
  {
    id: 'alerts',
    name: 'Alerts',
    icon: <FiBell className="w-5 h-5" />,
    count: 3,
    color: '#ff8c00',
    description: 'New notifications'
  },
  {
    id: 'leaderboards',
    name: 'Leaderboards',
    icon: <FiTrendingUp className="w-5 h-5" />,
    color: '#32cd32',
    description: 'Rankings & stats'
  },
  {
    id: 'following',
    name: 'Following',
    icon: <FiUsers className="w-5 h-5" />,
    count: 12,
    color: '#8b5cf6',
    description: 'Teams & athletes'
  },
  {
    id: 'bookmarks',
    name: 'Bookmarks',
    icon: <FiBookmark className="w-5 h-5" />,
    count: 5,
    color: '#ec4899',
    description: 'Saved content'
  },
  {
    id: 'schedule',
    name: 'My Schedule',
    icon: <FiClock className="w-5 h-5" />,
    count: 4,
    color: '#06b6d4',
    description: 'Personal events'
  }
];

const RECENT_ACTIVITY = [
  {
    id: '1',
    type: 'event',
    title: 'Monaco GP started',
    time: '2 min ago',
    icon: '🏎️',
    color: '#e10600'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Goal! Man City 1-0',
    time: '5 min ago',
    icon: '⚽',
    color: '#00aa00'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'NBA Finals in 30 min',
    time: '10 min ago',
    icon: '🏀',
    color: '#ff6600'
  },
  {
    id: '4',
    type: 'update',
    title: 'Djokovic advances',
    time: '15 min ago',
    icon: '🎾',
    color: '#32cd32'
  }
];

interface QuickToolsProps {
  onCollapse?: () => void;
  isCollapsed?: boolean;
}

const QuickTools: React.FC<QuickToolsProps> = ({ onCollapse, isCollapsed = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      {/* Quick Tools Header with Collapse Button */}
      <div className="mb-6 mt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-accent-electric" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h4 className="text-lg font-bold font-racing text-white">Quick Tools</h4>
          </div>
          <div className="flex items-center space-x-3">
            {onCollapse && (
              <div className="relative group/collapse">
                <button
                  onClick={onCollapse}
                  className="relative p-2.5 rounded-xl bg-gradient-to-r from-accent-electric/20 to-accent-purple/20 hover:from-accent-electric/30 hover:to-accent-purple/30 border-2 border-accent-electric/40 hover:border-accent-electric/60 transition-all duration-300 group shadow-lg hover:shadow-accent-electric/25 collapse-button-enhanced"
                  title={isCollapsed ? "Expand Quick Tools" : "Collapse Quick Tools"}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-electric/10 to-accent-purple/10 blur-sm group-hover:blur-md transition-all duration-300"></div>

                  {/* Attention dot indicator */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-electric rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent-electric rounded-full"></div>

                  {isCollapsed ? (
                    <FiChevronLeft className="relative w-5 h-5 text-accent-electric group-hover:text-white transition-colors duration-200" />
                  ) : (
                    <FiChevronRight className="relative w-5 h-5 text-accent-electric group-hover:text-white transition-colors duration-200" />
                  )}

                  {/* Pulse animation border */}
                  <div className="absolute inset-0 rounded-xl border-2 border-accent-electric/30 animate-pulse opacity-50"></div>
                </button>

                {/* Hover label */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover/collapse:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  <div className="bg-dark-200/90 text-accent-electric text-xs px-2 py-1 rounded-md border border-accent-electric/30 whitespace-nowrap backdrop-blur-sm">
                    {isCollapsed ? "Expand" : "Collapse"}
                  </div>
                </div>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2.5 rounded-lg bg-gray-700/50 hover:bg-gray-600/70 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-200 group"
              title="Settings"
            >
              <FiSettings className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-transparent via-gray-600/50 to-transparent mb-4"></div>

        <div className="grid grid-cols-2 gap-3">
          {QUICK_TOOLS.map((tool) => (
            <button
              key={tool.id}
              className="group relative p-4 rounded-xl bg-dark-200/30 hover:bg-dark-200/50 border border-gray-600/30 hover:border-gray-500/50 transition-all duration-300"
            >
              {/* Tool Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${tool.color}20`, border: `1px solid ${tool.color}30` }}
              >
                <div style={{ color: tool.color }}>
                  {tool.icon}
                </div>
              </div>

              {/* Tool Info */}
              <div className="text-left">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-sport font-medium text-white group-hover:text-accent-electric transition-colors">
                    {tool.name}
                  </span>
                  {tool.count && (
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: tool.color }}
                    >
                      {tool.count}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 font-sport">
                  {tool.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"
                style={{ backgroundColor: tool.color }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-bold font-racing text-white">Recent Activity</h4>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {RECENT_ACTIVITY.map((activity) => (
            <div
              key={activity.id}
              className="group flex items-center space-x-3 p-3 rounded-lg bg-dark-200/20 hover:bg-dark-200/40 transition-all duration-300 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                style={{ backgroundColor: `${activity.color}20` }}
              >
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-sport font-medium text-white group-hover:text-accent-electric transition-colors truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-gray-400 font-sport">
                  {activity.time}
                </p>
              </div>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activity.color }}
              />
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2 text-sm font-sport text-gray-400 hover:text-white transition-colors">
          View all activity
        </button>
      </div>

      {/* Quick Stats */}
      <div className="mb-6">
        <h4 className="text-md font-bold font-racing text-white mb-4">Today's Stats</h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-sport text-gray-300">Live Events</span>
              </div>
              <span className="text-sm font-bold text-red-400">12</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-neon rounded-full"></div>
                <span className="text-sm font-sport text-gray-300">Upcoming</span>
              </div>
              <span className="text-sm font-bold text-accent-neon">28</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                <span className="text-sm font-sport text-gray-300">Following</span>
              </div>
              <span className="text-sm font-bold text-accent-purple">8</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-accent-pink rounded-full"></div>
                <span className="text-sm font-sport text-gray-300">Alerts</span>
              </div>
              <span className="text-sm font-bold text-accent-pink">3</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-sport text-gray-400">Daily Goal</span>
              <span className="text-xs font-sport text-gray-400">75%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-accent-purple to-accent-pink h-2 rounded-full transition-all duration-500"
                style={{ width: '75%' }}
              />
            </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div>
        <div className="flex items-center space-x-2 mb-4">
          <FiTrendingUp className="w-5 h-5 text-accent-electric" />
          <h4 className="text-md font-bold font-racing text-white">Trending</h4>
        </div>

        <div className="space-y-3">
          {[
            { topic: '#MonacoGP', count: '2.5M', color: '#e10600' },
            { topic: '#ChampionsLeague', count: '1.8M', color: '#00aa00' },
            { topic: '#NBAFinals', count: '1.2M', color: '#ff6600' },
            { topic: '#Wimbledon', count: '800K', color: '#32cd32' }
          ].map((trend, index) => (
            <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-dark-200/30 transition-colors cursor-pointer">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: trend.color }}
                />
                <span className="text-sm font-sport text-white">{trend.topic}</span>
              </div>
              <span className="text-xs font-sport text-gray-400">{trend.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickTools;
