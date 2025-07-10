import * as cron from 'node-cron';
import axios from 'axios';

/**
 * Automatic Sports Schedule Sync Scheduler
 * 
 * This module sets up cron jobs to automatically sync sports schedules
 * from scrapers to the database at regular intervals.
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000';

/**
 * Call sync endpoint via HTTP request
 */
const callSyncEndpoint = async (endpoint: string, sport: string): Promise<void> => {
  try {
    console.log(`🔄 [CRON] Starting sync for ${sport}...`);
    
    const response = await axios.post(`${API_BASE_URL}/api/schedule/sync/${endpoint}`, {}, {
      timeout: 60000, // 60 seconds timeout
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SportVerse-Cron-Scheduler'
      }
    });

    if (response.data.success) {
      console.log(`✅ [CRON] ${sport} sync completed:`, response.data.message);
    } else {
      console.error(`❌ [CRON] ${sport} sync failed:`, response.data.error);
    }
  } catch (error) {
    console.error(`❌ [CRON] ${sport} sync error:`, error instanceof Error ? error.message : 'Unknown error');
  }
};

/**
 * Initialize cron jobs for automatic syncing
 */
export const initializeSyncScheduler = (): void => {
  const isProductionOrStaging = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging';
  
  if (!isProductionOrStaging) {
    console.log('🕒 [CRON] Sync scheduler disabled in development mode');
    console.log('🕒 [CRON] To enable automatic syncing, set NODE_ENV to "production" or "staging"');
    return;
  }

  console.log('🚀 [CRON] Initializing sports schedule sync scheduler...');

  // Sync F1 schedule every 6 hours at minutes 0
  // Runs at: 00:00, 06:00, 12:00, 18:00
  cron.schedule('0 */6 * * *', async () => {
    await callSyncEndpoint('f1', 'F1');
  }, {
    timezone: 'UTC'
  });

  // Sync NASCAR schedule every 8 hours at minute 15
  // Runs at: 00:15, 08:15, 16:15
  cron.schedule('15 */8 * * *', async () => {
    await callSyncEndpoint('nascar', 'NASCAR');
  }, {
    timezone: 'UTC'
  });

  // Sync Rally schedule every 12 hours at minute 30
  // Runs at: 00:30, 12:30
  cron.schedule('30 */12 * * *', async () => {
    await callSyncEndpoint('rally', 'Rally');
  }, {
    timezone: 'UTC'
  });

  // Sync Cricket schedule every 4 hours at minute 45
  // Runs at: 00:45, 04:45, 08:45, 12:45, 16:45, 20:45
  cron.schedule('45 */4 * * *', async () => {
    await callSyncEndpoint('cricket', 'Cricket');
  }, {
    timezone: 'UTC'
  });

  // Sync Football schedule every 6 hours at minute 30
  // Runs at: 00:30, 06:30, 12:30, 18:30
  cron.schedule('30 */6 * * *', async () => {
    await callSyncEndpoint('football', 'Football');
  }, {
    timezone: 'UTC'
  });

  // Sync ALL sports once daily at 3:00 AM UTC (comprehensive sync)
  cron.schedule('0 3 * * *', async () => {
    console.log('🌟 [CRON] Starting comprehensive daily sync for all sports...');
    await callSyncEndpoint('all', 'All Sports');
  }, {
    timezone: 'UTC'
  });

  console.log('✅ [CRON] Sports schedule sync scheduler initialized successfully');
  console.log('📅 [CRON] Scheduled syncs:');
  console.log('   🏁 F1: Every 6 hours (00:00, 06:00, 12:00, 18:00 UTC)');
  console.log('   🏁 NASCAR: Every 8 hours (00:15, 08:15, 16:15 UTC)');
  console.log('   🚗 Rally: Every 12 hours (00:30, 12:30 UTC)');
  console.log('   🏏 Cricket: Every 4 hours (00:45, 04:45, 08:45, 12:45, 16:45, 20:45 UTC)');
  console.log('   ⚽ Football: Every 6 hours (00:30, 06:30, 12:30, 18:30 UTC)');
  console.log('   🌟 All Sports: Daily at 03:00 UTC');
};

/**
 * Manual sync trigger functions (for testing or manual operations)
 */
export const manualSync = {
  f1: () => callSyncEndpoint('f1', 'F1'),
  nascar: () => callSyncEndpoint('nascar', 'NASCAR'),
  rally: () => callSyncEndpoint('rally', 'Rally'),
  cricket: () => callSyncEndpoint('cricket', 'Cricket'),
  football: () => callSyncEndpoint('football', 'Football'),
  all: () => callSyncEndpoint('all', 'All Sports')
};

/**
 * Get cron job status
 */
export const getCronStatus = () => {
  const tasks = cron.getTasks();
  return {
    totalTasks: tasks.size,
    isEnabled: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging',
    environment: process.env.NODE_ENV || 'development'
  };
};

// Export for use in tests or manual operations
export default {
  initializeSyncScheduler,
  manualSync,
  getCronStatus
}; 