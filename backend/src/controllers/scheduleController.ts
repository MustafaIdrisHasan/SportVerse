import { Request, Response } from 'express';
import { SportsEvent, ScheduleResponse, SupportedSports, ApiResponse } from '../types';
import {
  getF1Schedule,
  getNASCARSchedule,
  getRallySchedule,
  getCricketMatches,
  getFootballMatches
} from '../utils/sportsScraper';
import { RaceModel } from '../models/Race';

export class ScheduleController {
  /**
   * Get schedule for a specific sport
   */
  static async getSchedule(req: Request, res: Response): Promise<void> {
    try {
      const { sport } = req.params;
      
      if (!sport) {
        res.status(400).json({
          success: false,
          error: 'Sport parameter is required',
        });
        return;
      }

      const normalizedSport = sport.toLowerCase() as SupportedSports;
      
      // Validate sport
      const supportedSports: SupportedSports[] = ['f1', 'nascar', 'rally', 'cricket', 'football'];
      if (!supportedSports.includes(normalizedSport)) {
        res.status(400).json({
          success: false,
          error: `Unsupported sport: ${sport}. Supported sports: ${supportedSports.join(', ')}`,
        });
        return;
      }

      let events: SportsEvent[] = [];
      
      // Get schedule based on sport
      switch (normalizedSport) {
        case 'f1':
          events = await getF1Schedule();
          break;
        case 'nascar':
          events = await getNASCARSchedule();
          break;
        case 'rally':
          events = await getRallySchedule();
          break;
        case 'cricket':
          events = await getCricketMatches();
          break;
        case 'football':
          events = await getFootballMatches();
          break;
        default:
          res.status(400).json({
            success: false,
            error: 'Invalid sport specified',
          });
          return;
      }

      // Sort events by date
      events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const response: ScheduleResponse = {
        success: true,
        data: events,
        message: `Successfully fetched ${events.length} upcoming ${sport.toUpperCase()} events`,
        sport: normalizedSport,
      };

      res.json(response);
    } catch (error) {
      console.error(`Error fetching ${req.params.sport} schedule:`, error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching schedule',
      });
    }
  }

  /**
   * Get all sports schedules
   */
  static async getAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      const sports: SupportedSports[] = ['f1', 'nascar', 'rally', 'cricket', 'football'];
      const allEvents: SportsEvent[] = [];

      // Fetch all sports schedules in parallel
      const promises = sports.map(async (sport) => {
        try {
          switch (sport) {
            case 'f1':
              return await getF1Schedule();
            case 'nascar':
              return await getNASCARSchedule();
            case 'rally':
              return await getRallySchedule();
            case 'cricket':
              return await getCricketMatches();
            case 'football':
              return await getFootballMatches();
            default:
              return [];
          }
        } catch (error) {
          console.error(`Error fetching ${sport} schedule:`, error);
          return [];
        }
      });

      const results = await Promise.all(promises);
      
      // Flatten and combine all events
      results.forEach(events => {
        allEvents.push(...events);
      });

      // Sort all events by date
      allEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      const response: ScheduleResponse = {
        success: true,
        data: allEvents,
        message: `Successfully fetched ${allEvents.length} upcoming events across all sports`,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching all schedules:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching schedules',
      });
    }
  }

  /**
   * Get upcoming events (next 7 days)
   */
  static async getUpcomingEvents(req: Request, res: Response): Promise<void> {
    try {
      const { sport } = req.query;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      let events: SportsEvent[] = [];
      
      if (sport) {
        // Get events for specific sport
        const normalizedSport = (sport as string).toLowerCase() as SupportedSports;
        const supportedSports: SupportedSports[] = ['f1', 'nascar', 'rally', 'cricket', 'football'];
        
        if (!supportedSports.includes(normalizedSport)) {
          res.status(400).json({
            success: false,
            error: `Unsupported sport: ${sport}. Supported sports: ${supportedSports.join(', ')}`,
          });
          return;
        }

        switch (normalizedSport) {
          case 'f1':
            events = await getF1Schedule();
            break;
          case 'nascar':
            events = await getNASCARSchedule();
            break;
          case 'rally':
            events = await getRallySchedule();
            break;
          case 'cricket':
            events = await getCricketMatches();
            break;
          case 'football':
            events = await getFootballMatches();
            break;
        }
      } else {
        // Get all sports events
        const sports: SupportedSports[] = ['f1', 'nascar', 'rally', 'cricket', 'football'];
        const promises = sports.map(async (sportType) => {
          try {
            switch (sportType) {
              case 'f1':
                return await getF1Schedule();
              case 'nascar':
                return await getNASCARSchedule();
              case 'rally':
                return await getRallySchedule();
              case 'cricket':
                return await getCricketMatches();
              case 'football':
                return await getFootballMatches();
              default:
                return [];
            }
          } catch (error) {
            console.error(`Error fetching ${sportType} schedule:`, error);
            return [];
          }
        });

        const results = await Promise.all(promises);
        results.forEach(sportEvents => {
          events.push(...sportEvents);
        });
      }

      // Filter for next 7 days
      const now = new Date();
      const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const upcomingEvents = events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= now && eventDate <= sevenDaysFromNow;
      });

      // Sort by date and limit results
      upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const limitedEvents = upcomingEvents.slice(0, limit);

      const response: ScheduleResponse = {
        success: true,
        data: limitedEvents,
        message: `Successfully fetched ${limitedEvents.length} upcoming events in the next 7 days`,
        sport: sport as string,
      };

      res.json(response);
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error while fetching upcoming events',
      });
    }
  }

  /**
   * Sync F1 schedule from scraper to database
   */
  static async syncF1Schedule(req: Request, res: Response): Promise<void> {
    try {
      const events = await getF1Schedule();
      let addedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      console.log(`🏁 Starting F1 schedule sync with ${events.length} events...`);

      for (const event of events) {
        try {
          // Convert date string to Date object for comparison
          const eventDate = new Date(`${event.date}T00:00:00`);
          
          // Check if race already exists
          const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
          
          if (existingRace) {
            console.log(`⏭️  Skipping existing race: ${event.event} on ${event.date}`);
            skippedCount++;
            continue;
          }

          // Create new race from scraped event
          await RaceModel.createFromSportsEvent(event);
          console.log(`✅ Added race: ${event.event} on ${event.date}`);
          addedCount++;

        } catch (error) {
          const errorMsg = `Failed to process event ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`;
          console.error(`❌ ${errorMsg}`);
          errors.push(errorMsg);
        }
      }

      const response: ApiResponse = {
        success: true,
        data: {
          total: events.length,
          added: addedCount,
          skipped: skippedCount,
          errors: errors.length
        },
        message: `F1 schedule sync completed. Added ${addedCount} new races, skipped ${skippedCount} existing races.`
      };

      if (errors.length > 0) {
        response.message += ` ${errors.length} errors occurred.`;
      }

      console.log(`🏁 F1 sync completed: ${addedCount} added, ${skippedCount} skipped, ${errors.length} errors`);
      res.json(response);

    } catch (error) {
      console.error('❌ F1 schedule sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync F1 schedule',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Sync NASCAR schedule from scraper to database
   */
  static async syncNASCARSchedule(req: Request, res: Response): Promise<void> {
    try {
      const events = await getNASCARSchedule();
      let addedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      console.log(`🏁 Starting NASCAR schedule sync with ${events.length} events...`);

      for (const event of events) {
        try {
          const eventDate = new Date(`${event.date}T00:00:00`);
          const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
          
          if (existingRace) {
            skippedCount++;
            continue;
          }

          await RaceModel.createFromSportsEvent(event);
          addedCount++;
        } catch (error) {
          errors.push(`Failed to process ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        success: true,
        data: { total: events.length, added: addedCount, skipped: skippedCount, errors: errors.length },
        message: `NASCAR schedule sync completed. Added ${addedCount} new races, skipped ${skippedCount} existing races.`
      });

    } catch (error) {
      console.error('NASCAR schedule sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync NASCAR schedule'
      });
    }
  }

  /**
   * Sync Rally (WRC) schedule from scraper to database
   */
  static async syncRallySchedule(req: Request, res: Response): Promise<void> {
    try {
      const events = await getRallySchedule();
      let addedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      console.log(`🚗 Starting Rally schedule sync with ${events.length} events...`);

      for (const event of events) {
        try {
          const eventDate = new Date(`${event.date}T00:00:00`);
          const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
          
          if (existingRace) {
            skippedCount++;
            continue;
          }

          await RaceModel.createFromSportsEvent(event);
          addedCount++;
        } catch (error) {
          errors.push(`Failed to process ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        success: true,
        data: { total: events.length, added: addedCount, skipped: skippedCount, errors: errors.length },
        message: `Rally schedule sync completed. Added ${addedCount} new races, skipped ${skippedCount} existing races.`
      });

    } catch (error) {
      console.error('Rally schedule sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync Rally schedule'
      });
    }
  }

  /**
   * Sync Cricket matches from scraper to database
   */
  static async syncCricketSchedule(req: Request, res: Response): Promise<void> {
    try {
      const events = await getCricketMatches();
      let addedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      console.log(`🏏 Starting Cricket schedule sync with ${events.length} events...`);

      for (const event of events) {
        try {
          const eventDate = new Date(`${event.date}T00:00:00`);
          const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
          
          if (existingRace) {
            skippedCount++;
            continue;
          }

          await RaceModel.createFromSportsEvent(event);
          addedCount++;
        } catch (error) {
          errors.push(`Failed to process ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        success: true,
        data: { total: events.length, added: addedCount, skipped: skippedCount, errors: errors.length },
        message: `Cricket schedule sync completed. Added ${addedCount} new matches, skipped ${skippedCount} existing matches.`
      });

    } catch (error) {
      console.error('Cricket schedule sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync Cricket schedule'
      });
    }
  }

  /**
   * Sync Football matches from scraper to database
   */
  static async syncFootballSchedule(req: Request, res: Response): Promise<void> {
    try {
      const events = await getFootballMatches();
      let addedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      console.log(`⚽ Starting Football schedule sync with ${events.length} events...`);

      for (const event of events) {
        try {
          const eventDate = new Date(`${event.date}T00:00:00`);
          const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
          
          if (existingRace) {
            skippedCount++;
            continue;
          }

          await RaceModel.createFromSportsEvent(event);
          addedCount++;
        } catch (error) {
          errors.push(`Failed to process ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      res.json({
        success: true,
        data: { total: events.length, added: addedCount, skipped: skippedCount, errors: errors.length },
        message: `Football schedule sync completed. Added ${addedCount} new matches, skipped ${skippedCount} existing matches.`
      });

    } catch (error) {
      console.error('Football schedule sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync Football schedule'
      });
    }
  }

  /**
   * Sync all sports schedules at once
   */
  static async syncAllSchedules(req: Request, res: Response): Promise<void> {
    try {
      console.log('🚀 Starting sync for all sports...');
      
      const results = {
        f1: { added: 0, skipped: 0, errors: 0 },
        nascar: { added: 0, skipped: 0, errors: 0 },
        rally: { added: 0, skipped: 0, errors: 0 },
        cricket: { added: 0, skipped: 0, errors: 0 },
        football: { added: 0, skipped: 0, errors: 0 }
      };

      const allErrors: string[] = [];

      // Sync F1
      try {
        const f1Events = await getF1Schedule();
        for (const event of f1Events) {
          try {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
            
            if (existingRace) {
              results.f1.skipped++;
            } else {
              await RaceModel.createFromSportsEvent(event);
              results.f1.added++;
            }
          } catch (error) {
            results.f1.errors++;
            allErrors.push(`F1 - ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        allErrors.push(`F1 fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Sync NASCAR
      try {
        const nascarEvents = await getNASCARSchedule();
        for (const event of nascarEvents) {
          try {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
            
            if (existingRace) {
              results.nascar.skipped++;
            } else {
              await RaceModel.createFromSportsEvent(event);
              results.nascar.added++;
            }
          } catch (error) {
            results.nascar.errors++;
            allErrors.push(`NASCAR - ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        allErrors.push(`NASCAR fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Sync Rally
      try {
        const rallyEvents = await getRallySchedule();
        for (const event of rallyEvents) {
          try {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
            
            if (existingRace) {
              results.rally.skipped++;
            } else {
              await RaceModel.createFromSportsEvent(event);
              results.rally.added++;
            }
          } catch (error) {
            results.rally.errors++;
            allErrors.push(`Rally - ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        allErrors.push(`Rally fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Sync Cricket
      try {
        const cricketEvents = await getCricketMatches();
        for (const event of cricketEvents) {
          try {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
            
            if (existingRace) {
              results.cricket.skipped++;
            } else {
              await RaceModel.createFromSportsEvent(event);
              results.cricket.added++;
            }
          } catch (error) {
            results.cricket.errors++;
            allErrors.push(`Cricket - ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        allErrors.push(`Cricket fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Sync Football
      try {
        const footballEvents = await getFootballMatches();
        for (const event of footballEvents) {
          try {
            const eventDate = new Date(`${event.date}T00:00:00`);
            const existingRace = await RaceModel.findByNameAndDate(event.event, eventDate);
            
            if (existingRace) {
              results.football.skipped++;
            } else {
              await RaceModel.createFromSportsEvent(event);
              results.football.added++;
            }
          } catch (error) {
            results.football.errors++;
            allErrors.push(`Football - ${event.event}: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (error) {
        allErrors.push(`Football fetch failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      const totalAdded = Object.values(results).reduce((sum, sport) => sum + sport.added, 0);
      const totalSkipped = Object.values(results).reduce((sum, sport) => sum + sport.skipped, 0);
      const totalErrors = Object.values(results).reduce((sum, sport) => sum + sport.errors, 0);

      console.log(`🚀 All sports sync completed: ${totalAdded} added, ${totalSkipped} skipped, ${totalErrors} errors`);

      res.json({
        success: true,
        data: {
          summary: {
            totalAdded,
            totalSkipped,
            totalErrors: totalErrors
          },
          details: results,
          errors: allErrors
        },
        message: `All sports sync completed. Added ${totalAdded} new events, skipped ${totalSkipped} existing events.`
      });

    } catch (error) {
      console.error('❌ All sports sync failed:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to sync all sports schedules',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }

  /**
   * Get races from database (real data)
   */
  static async getRaces(req: Request, res: Response): Promise<void> {
    try {
      const races = await RaceModel.findAll();
      
      res.json({
        success: true,
        data: races,
        message: `Successfully fetched ${races.length} races from database`
      });
    } catch (error) {
      console.error('Error fetching races from database:', error);
      
      // Fallback data for demonstration when database is not available
      const fallbackRaces = [
        {
          id: 'f1-bahrain-2024',
          name: 'Bahrain Grand Prix',
          date: '2024-03-15T15:00:00Z',
          circuit: 'Bahrain International Circuit',
          country: 'Bahrain',
          seriesId: 'f1',
          series: { 
            id: 'f1', 
            name: 'Formula 1', 
            color: '#e10600', 
            icon: '🏎️' 
          },
          schedule: [
            { session: 'Practice 1', date: '2024-03-13', time: '11:30' },
            { session: 'Practice 2', date: '2024-03-13', time: '15:00' },
            { session: 'Practice 3', date: '2024-03-14', time: '11:30' },
            { session: 'Qualifying', date: '2024-03-14', time: '15:00' },
            { session: 'Race', date: '2024-03-15', time: '15:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'ESPN', subscription: false },
            { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true }
          ]
        },
        {
          id: 'f1-saudi-2024',
          name: 'Saudi Arabian Grand Prix',
          date: '2024-03-22T18:00:00Z',
          circuit: 'Jeddah Corniche Circuit',
          country: 'Saudi Arabia',
          seriesId: 'f1',
          series: { 
            id: 'f1', 
            name: 'Formula 1', 
            color: '#e10600', 
            icon: '🏎️' 
          },
          schedule: [
            { session: 'Practice 1', date: '2024-03-20', time: '14:30' },
            { session: 'Practice 2', date: '2024-03-20', time: '18:00' },
            { session: 'Practice 3', date: '2024-03-21', time: '14:30' },
            { session: 'Qualifying', date: '2024-03-21', time: '18:00' },
            { session: 'Race', date: '2024-03-22', time: '18:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'ESPN', subscription: false },
            { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true }
          ]
        },
        {
          id: 'nascar-daytona-2024',
          name: 'Daytona 500',
          date: '2024-02-18T14:30:00Z',
          circuit: 'Daytona International Speedway',
          country: 'United States',
          seriesId: 'nascar',
          series: { 
            id: 'nascar', 
            name: 'NASCAR Cup Series', 
            color: '#ffcc00', 
            icon: '🏁' 
          },
          schedule: [
            { session: 'Practice', date: '2024-02-16', time: '12:00' },
            { session: 'Qualifying', date: '2024-02-16', time: '19:00' },
            { session: 'Race', date: '2024-02-18', time: '14:30' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'FOX Sports', subscription: false }
          ]
        },
        {
          id: 'motogp-qatar-2024',
          name: 'Qatar Grand Prix',
          date: '2024-03-10T19:00:00Z',
          circuit: 'Lusail International Circuit',
          country: 'Qatar',
          seriesId: 'motogp',
          series: { 
            id: 'motogp', 
            name: 'MotoGP', 
            color: '#0066cc', 
            icon: '🏍️' 
          },
          schedule: [
            { session: 'Practice 1', date: '2024-03-08', time: '10:45' },
            { session: 'Practice 2', date: '2024-03-08', time: '15:00' },
            { session: 'Qualifying', date: '2024-03-09', time: '14:10' },
            { session: 'Race', date: '2024-03-10', time: '19:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'NBC Sports', subscription: true }
          ]
        }
      ];

      res.json({
        success: true,
        data: fallbackRaces,
        message: `Using fallback data: ${fallbackRaces.length} races (database unavailable)`
      });
    }
  }

  /**
   * Get upcoming races from database (real data)
   */
  static async getUpcomingRaces(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const races = await RaceModel.findUpcoming(limit);
      
      res.json({
        success: true,
        data: races,
        message: `Successfully fetched ${races.length} upcoming races from database`
      });
    } catch (error) {
      console.error('Error fetching upcoming races from database:', error);
      
      // Fallback upcoming races for demonstration
      const now = new Date();
      const upcomingRaces = [
        {
          id: 'f1-australia-2024',
          name: 'Australian Grand Prix',
          date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          circuit: 'Albert Park Circuit',
          country: 'Australia',
          seriesId: 'f1',
          series: { 
            id: 'f1', 
            name: 'Formula 1', 
            color: '#e10600', 
            icon: '🏎️' 
          },
          schedule: [
            { session: 'Practice 1', date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '02:30' },
            { session: 'Practice 2', date: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '06:00' },
            { session: 'Practice 3', date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '02:30' },
            { session: 'Qualifying', date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '06:00' },
            { session: 'Race', date: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '06:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'ESPN', subscription: false },
            { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true },
            { country: 'AU', broadcaster: 'Fox Sports', subscription: true }
          ]
        },
        {
          id: 'nascar-atlanta-2024',
          name: 'Atlanta 400',
          date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          circuit: 'Atlanta Motor Speedway',
          country: 'United States',
          seriesId: 'nascar',
          series: { 
            id: 'nascar', 
            name: 'NASCAR Cup Series', 
            color: '#ffcc00', 
            icon: '🏁' 
          },
          schedule: [
            { session: 'Practice', date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '15:00' },
            { session: 'Qualifying', date: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '17:00' },
            { session: 'Race', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '15:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'FOX Sports', subscription: false }
          ]
        },
        {
          id: 'motogp-americas-2024',
          name: 'Americas Grand Prix',
          date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          circuit: 'Circuit of the Americas',
          country: 'United States',
          seriesId: 'motogp',
          series: { 
            id: 'motogp', 
            name: 'MotoGP', 
            color: '#0066cc', 
            icon: '🏍️' 
          },
          schedule: [
            { session: 'Practice 1', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '15:45' },
            { session: 'Practice 2', date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '20:00' },
            { session: 'Qualifying', date: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '19:10' },
            { session: 'Race', date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], time: '20:00' }
          ],
          watchLinks: [
            { country: 'US', broadcaster: 'NBC Sports', subscription: true }
          ]
        }
      ];

      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const limitedRaces = limit ? upcomingRaces.slice(0, limit) : upcomingRaces;
      
      res.json({
        success: true,
        data: limitedRaces,
        message: `Using fallback data: ${limitedRaces.length} upcoming races (database unavailable)`
      });
    }
  }
} 