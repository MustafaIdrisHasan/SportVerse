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