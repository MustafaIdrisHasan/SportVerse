import React, { useState } from 'react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface SyncResult {
  sport: string;
  success: boolean;
  message: string;
  data?: {
    total: number;
    added: number;
    skipped: number;
    errors: number;
  };
  timestamp: string;
}

const SPORTS = [
  { id: 'f1', name: 'Formula 1', icon: '🏎️', color: 'bg-red-500' },
  { id: 'nascar', name: 'NASCAR', icon: '🏁', color: 'bg-yellow-500' },
  { id: 'rally', name: 'Rally/WRC', icon: '🚗', color: 'bg-blue-500' },
  { id: 'cricket', name: 'Cricket', icon: '🏏', color: 'bg-green-500' },
  { id: 'football', name: 'Football', icon: '⚽', color: 'bg-green-600' }
];

const SyncPanel: React.FC = () => {
  const [syncResults, setSyncResults] = useState<SyncResult[]>([]);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});

  const handleSync = async (sportId: string) => {
    setLoading(prev => ({ ...prev, [sportId]: true }));
    
    try {
      const response = await fetch(`/api/schedule/sync/${sportId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      
      const syncResult: SyncResult = {
        sport: sportId,
        success: result.success,
        message: result.message,
        data: result.data,
        timestamp: new Date().toISOString()
      };

      setSyncResults(prev => [syncResult, ...prev.slice(0, 9)]); // Keep last 10 results
      
    } catch (error) {
      const syncResult: SyncResult = {
        sport: sportId,
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };

      setSyncResults(prev => [syncResult, ...prev.slice(0, 9)]);
    } finally {
      setLoading(prev => ({ ...prev, [sportId]: false }));
    }
  };

  const handleSyncAll = async () => {
    setLoading(prev => ({ ...prev, all: true }));
    
    try {
      const response = await fetch('/api/schedule/sync/all', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();
      
      const syncResult: SyncResult = {
        sport: 'all',
        success: result.success,
        message: result.message,
        data: result.data?.summary,
        timestamp: new Date().toISOString()
      };

      setSyncResults(prev => [syncResult, ...prev.slice(0, 9)]);
      
    } catch (error) {
      const syncResult: SyncResult = {
        sport: 'all',
        success: false,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };

      setSyncResults(prev => [syncResult, ...prev.slice(0, 9)]);
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sports Data Sync Panel</h2>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-600">Backend Connected</span>
        </div>
      </div>

      {/* Individual Sport Sync Buttons */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Manual Sync Operations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SPORTS.map((sport) => (
            <Button
              key={sport.id}
              onClick={() => handleSync(sport.id)}
              disabled={loading[sport.id]}
              className={`flex items-center justify-center space-x-2 ${sport.color} text-white hover:opacity-90 disabled:opacity-50`}
            >
              {loading[sport.id] ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="text-lg">{sport.icon}</span>
              )}
              <span>{sport.name}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <Button
            onClick={handleSyncAll}
            disabled={loading.all}
            className="w-full bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50"
          >
            {loading.all ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Syncing All Sports...</span>
              </div>
            ) : (
              <span>🌟 Sync All Sports</span>
            )}
          </Button>
        </div>
      </Card>

      {/* Sync Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sync Results</h3>
        {syncResults.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No sync operations yet. Click a sport button above to start syncing.
          </p>
        ) : (
          <div className="space-y-3">
            {syncResults.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      result.success 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.sport.toUpperCase()}
                    </span>
                    <span className={`text-sm ${
                      result.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {result.success ? '✅' : '❌'} {result.message}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(result.timestamp)}
                  </span>
                </div>
                
                {result.data && (
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium">Stats:</span> {result.data.total} total, {result.data.added} added, {result.data.skipped} skipped, {result.data.errors} errors
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* API Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">API Information</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900">Sync Endpoints</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• POST /api/schedule/sync/f1</li>
                <li>• POST /api/schedule/sync/nascar</li>
                <li>• POST /api/schedule/sync/rally</li>
                <li>• POST /api/schedule/sync/cricket</li>
                <li>• POST /api/schedule/sync/football</li>
                <li>• POST /api/schedule/sync/all</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900">Data Endpoints</h4>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• GET /api/schedule/races</li>
                <li>• GET /api/schedule/races/upcoming</li>
                <li>• GET /api/schedule/f1 (legacy)</li>
                <li>• GET /api/schedule/upcoming (legacy)</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">Usage Instructions</h4>
            <p className="text-sm text-blue-700 mt-1">
              Use the sync buttons to manually update sports data from external sources. 
              The frontend should use the new <code>/api/schedule/races</code> endpoints 
              instead of the legacy endpoints for real-time data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SyncPanel; 