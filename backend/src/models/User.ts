import { QueryResult } from 'pg';
import pool from '../config/database';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class UserModel {
  /**
   * Create a new user
   */
  static async create(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const id = uuidv4();
    const query = `
      INSERT INTO users (id, name, email, password, favorites, reminders, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
    
    const values = [id, userData.name, userData.email, userData.password, [], []];
    const result: QueryResult = await pool.query(query, values);
    
    return result.rows[0];
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult = await pool.query(query, [email]);
    
    return result.rows[0] || null;
  }

  /**
   * Find user by ID
   */
  static async findById(id: string): Promise<User | null> {
    const query = `
      SELECT id, name, email, favorites, reminders, created_at, updated_at 
      FROM users WHERE id = $1
    `;
    const result: QueryResult = await pool.query(query, [id]);
    
    return result.rows[0] || null;
  }

  /**
   * Update user profile
   */
  static async updateProfile(id: string, updates: {
    name?: string;
    email?: string;
  }): Promise<User | null> {
    const setClause = [];
    const values = [];
    let paramCount = 1;

    if (updates.name) {
      setClause.push(`name = $${paramCount++}`);
      values.push(updates.name);
    }

    if (updates.email) {
      setClause.push(`email = $${paramCount++}`);
      values.push(updates.email);
    }

    if (setClause.length === 0) {
      return this.findById(id);
    }

    setClause.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${setClause.join(', ')}
      WHERE id = $${paramCount}
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;

    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] || null;
  }

  /**
   * Add race to user's favorites
   */
  static async addFavorite(userId: string, raceId: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET favorites = array_append(favorites, $2), updated_at = NOW()
      WHERE id = $1 AND NOT ($2 = ANY(favorites))
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
    
    const result: QueryResult = await pool.query(query, [userId, raceId]);
    return result.rows[0] || null;
  }

  /**
   * Remove race from user's favorites
   */
  static async removeFavorite(userId: string, raceId: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET favorites = array_remove(favorites, $2), updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
    
    const result: QueryResult = await pool.query(query, [userId, raceId]);
    return result.rows[0] || null;
  }

  /**
   * Add race to user's reminders
   */
  static async addReminder(userId: string, raceId: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET reminders = array_append(reminders, $2), updated_at = NOW()
      WHERE id = $1 AND NOT ($2 = ANY(reminders))
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
    
    const result: QueryResult = await pool.query(query, [userId, raceId]);
    return result.rows[0] || null;
  }

  /**
   * Remove race from user's reminders
   */
  static async removeReminder(userId: string, raceId: string): Promise<User | null> {
    const query = `
      UPDATE users 
      SET reminders = array_remove(reminders, $2), updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
    
    const result: QueryResult = await pool.query(query, [userId, raceId]);
    return result.rows[0] || null;
  }

  /**
   * Delete user account
   */
  static async deleteAccount(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result: QueryResult = await pool.query(query, [id]);
    
    return result.rowCount ? result.rowCount > 0 : false;
  }
} 