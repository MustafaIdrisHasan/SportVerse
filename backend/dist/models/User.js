"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const uuid_1 = require("uuid");
class UserModel {
    static async create(userData) {
        const id = (0, uuid_1.v4)();
        const query = `
      INSERT INTO users (id, name, email, password, favorites, reminders, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
        const values = [id, userData.name, userData.email, userData.password, [], []];
        const result = await database_1.default.query(query, values);
        return result.rows[0];
    }
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await database_1.default.query(query, [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const query = `
      SELECT id, name, email, favorites, reminders, created_at, updated_at 
      FROM users WHERE id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] || null;
    }
    static async updateProfile(id, updates) {
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
        const result = await database_1.default.query(query, values);
        return result.rows[0] || null;
    }
    static async addFavorite(userId, raceId) {
        const query = `
      UPDATE users 
      SET favorites = array_append(favorites, $2), updated_at = NOW()
      WHERE id = $1 AND NOT ($2 = ANY(favorites))
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [userId, raceId]);
        return result.rows[0] || null;
    }
    static async removeFavorite(userId, raceId) {
        const query = `
      UPDATE users 
      SET favorites = array_remove(favorites, $2), updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [userId, raceId]);
        return result.rows[0] || null;
    }
    static async addReminder(userId, raceId) {
        const query = `
      UPDATE users 
      SET reminders = array_append(reminders, $2), updated_at = NOW()
      WHERE id = $1 AND NOT ($2 = ANY(reminders))
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [userId, raceId]);
        return result.rows[0] || null;
    }
    static async removeReminder(userId, raceId) {
        const query = `
      UPDATE users 
      SET reminders = array_remove(reminders, $2), updated_at = NOW()
      WHERE id = $1
      RETURNING id, name, email, favorites, reminders, created_at, updated_at
    `;
        const result = await database_1.default.query(query, [userId, raceId]);
        return result.rows[0] || null;
    }
    static async deleteAccount(id) {
        const query = 'DELETE FROM users WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount ? result.rowCount > 0 : false;
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map