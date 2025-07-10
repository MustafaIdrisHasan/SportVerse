import { QueryResult } from 'pg';
import pool from '../config/database';
import { Race, RaceSchedule, WatchLink } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class RaceModel {
  /**
   * Create a new race
   */
  static async create(raceData: {
    name: string;
    date: Date;
    circuit: string;
    country: string;
    series_id: string;
    schedule: RaceSchedule[];
    watch_links: WatchLink[];
    track_map?: string;
  }): Promise<Race> {
    const id = uuidv4();
    const query = `
      INSERT INTO races (id, name, date, circuit, country, series_id, schedule, watch_links, track_map, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [
      id,
      raceData.name,
      raceData.date,
      raceData.circuit,
      raceData.country,
      raceData.series_id,
      JSON.stringify(raceData.schedule),
      JSON.stringify(raceData.watch_links),
      raceData.track_map || null,
    ];
    
    const result: QueryResult = await pool.query(query, values);
    return this.formatRace(result.rows[0]);
  }

  /**
   * Get all races with series information
   */
  static async findAll(): Promise<Race[]> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      ORDER BY r.date ASC
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows.map(row => this.formatRaceWithSeries(row));
  }

  /**
   * Get upcoming races
   */
  static async findUpcoming(limit?: number): Promise<Race[]> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.date > NOW()
      ORDER BY r.date ASC
      ${limit ? `LIMIT ${limit}` : ''}
    `;
    
    const result: QueryResult = await pool.query(query);
    return result.rows.map(row => this.formatRaceWithSeries(row));
  }

  /**
   * Get race by ID
   */
  static async findById(id: string): Promise<Race | null> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.id = $1
    `;
    
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows[0] ? this.formatRaceWithSeries(result.rows[0]) : null;
  }

  /**
   * Get races by series
   */
  static async findBySeries(seriesId: string): Promise<Race[]> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.series_id = $1
      ORDER BY r.date ASC
    `;
    
    const result: QueryResult = await pool.query(query, [seriesId]);
    return result.rows.map(row => this.formatRaceWithSeries(row));
  }

  /**
   * Search races by name or circuit
   */
  static async search(searchTerm: string): Promise<Race[]> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE LOWER(r.name) LIKE LOWER($1) 
         OR LOWER(r.circuit) LIKE LOWER($1)
         OR LOWER(r.country) LIKE LOWER($1)
      ORDER BY r.date ASC
    `;
    
    const result: QueryResult = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows.map(row => this.formatRaceWithSeries(row));
  }

  /**
   * Update race
   */
  static async update(id: string, updates: Partial<{
    name: string;
    date: Date;
    circuit: string;
    country: string;
    schedule: RaceSchedule[];
    watch_links: WatchLink[];
    track_map: string;
  }>): Promise<Race | null> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'schedule' || key === 'watch_links') {
          setClause.push(`${key} = $${paramCount++}`);
          values.push(JSON.stringify(value));
        } else {
          setClause.push(`${key} = $${paramCount++}`);
          values.push(value);
        }
      }
    });

    if (setClause.length === 0) {
      return this.findById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE races 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] ? this.formatRace(result.rows[0]) : null;
  }

  /**
   * Delete race
   */
  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM races WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    
    return result.rowCount ? result.rowCount > 0 : false;
  }

  /**
   * Check if a race exists by name and date
   */
  static async findByNameAndDate(name: string, date: Date): Promise<Race | null> {
    const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE LOWER(r.name) = LOWER($1) AND DATE(r.date) = DATE($2)
    `;
    
    const result: QueryResult = await pool.query(query, [name, date]);
    return result.rows[0] ? this.formatRaceWithSeries(result.rows[0]) : null;
  }

  /**
   * Create race from scraped sports event data
   */
  static async createFromSportsEvent(eventData: {
    sport: string;
    event: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    location: string;
    circuit?: string;
    country?: string;
  }): Promise<Race> {
    // Get series ID based on sport
    const seriesId = await this.getSeriesIdBySport(eventData.sport);
    
    // Convert date and time to full datetime
    const eventDateTime = new Date(`${eventData.date}T${eventData.time}:00`);
    
    // Create schedule array
    const schedule = [
      {
        session: 'Race',
        date: eventData.date,
        time: eventData.time
      }
    ];

    // Create default watch links
    const watchLinks = this.getDefaultWatchLinks(eventData.sport);

    const raceData = {
      name: eventData.event,
      date: eventDateTime,
      circuit: eventData.circuit || eventData.location,
      country: eventData.country || this.extractCountryFromLocation(eventData.location),
      series_id: seriesId,
      schedule,
      watch_links: watchLinks,
    };

    return this.create(raceData);
  }

  /**
   * Get series ID by sport name
   */
  private static async getSeriesIdBySport(sport: string): Promise<string> {
    const sportMappings: { [key: string]: string } = {
      'F1': 'f1',
      'NASCAR': 'nascar', 
      'Rally': 'wrc',
      'Cricket': 'cricket',
      'Football': 'football'
    };
    
    const seriesName = sportMappings[sport] || sport.toLowerCase();
    
    // Try to find existing series
    const query = 'SELECT id FROM series WHERE LOWER(name) = $1 OR id = $1';
    const result: QueryResult = await pool.query(query, [seriesName]);
    
    if (result.rows[0]) {
      return result.rows[0].id;
    }
    
    // Create new series if not found
    const newSeriesId = uuidv4();
    const insertQuery = `
      INSERT INTO series (id, name, color, icon, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      RETURNING id
    `;
    
    const seriesData = this.getSeriesDefaults(sport);
    const insertResult: QueryResult = await pool.query(insertQuery, [
      newSeriesId,
      seriesData.name,
      seriesData.color,
      seriesData.icon
    ]);
    
    return insertResult.rows[0].id;
  }

  /**
   * Get default series data by sport
   */
  private static getSeriesDefaults(sport: string) {
    const defaults: { [key: string]: { name: string; color: string; icon: string } } = {
      'F1': { name: 'Formula 1', color: '#e10600', icon: '🏎️' },
      'NASCAR': { name: 'NASCAR', color: '#ffed00', icon: '🏁' },
      'Rally': { name: 'WRC', color: '#0066cc', icon: '🚗' },
      'Cricket': { name: 'Cricket', color: '#00a651', icon: '🏏' },
      'Football': { name: 'Football', color: '#00471b', icon: '⚽' }
    };
    
    return defaults[sport] || { name: sport, color: '#6b7280', icon: '🏆' };
  }

  /**
   * Get default watch links by sport
   */
  private static getDefaultWatchLinks(sport: string): WatchLink[] {
    const defaultLinks: { [key: string]: WatchLink[] } = {
      'F1': [
        { country: 'Global', broadcaster: 'F1 TV Pro', subscription: true },
        { country: 'US', broadcaster: 'ESPN', subscription: false },
        { country: 'UK', broadcaster: 'Sky Sports F1', subscription: true }
      ],
      'NASCAR': [
        { country: 'US', broadcaster: 'FOX/NBC', subscription: false },
        { country: 'US', broadcaster: 'NASCAR.com', subscription: true }
      ],
      'Rally': [
        { country: 'Global', broadcaster: 'WRC+', subscription: true }
      ],
      'Cricket': [
        { country: 'India', broadcaster: 'Star Sports', subscription: true },
        { country: 'Global', broadcaster: 'ESPN+', subscription: true }
      ],
      'Football': [
        { country: 'Global', broadcaster: 'ESPN+', subscription: true },
        { country: 'UK', broadcaster: 'BBC/ITV', subscription: false }
      ]
    };
    
    return defaultLinks[sport] || [
      { country: 'Global', broadcaster: 'TBD', subscription: false }
    ];
  }

  /**
   * Extract country from location string
   */
  private static extractCountryFromLocation(location: string): string {
    // Simple extraction - can be enhanced
    const parts = location.split(',');
    return parts[parts.length - 1].trim();
  }

  /**
   * Format race data from database
   */
  private static formatRace(row: any): Race {
    return {
      ...row,
      schedule: typeof row.schedule === 'string' ? JSON.parse(row.schedule) : row.schedule,
      watch_links: typeof row.watch_links === 'string' ? JSON.parse(row.watch_links) : row.watch_links,
    };
  }

  /**
   * Format race data with series information
   */
  private static formatRaceWithSeries(row: any): Race {
    const race = this.formatRace(row);
    return {
      ...race,
      series: {
        id: race.series_id,
        name: row.series_name || 'Unknown',
        color: row.series_color || '#6b7280',
        icon: row.series_icon || '🏁',
        created_at: new Date(),
      },
    };
  }
} 