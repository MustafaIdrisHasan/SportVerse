"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaceModel = void 0;
const database_1 = __importDefault(require("../config/database"));
const uuid_1 = require("uuid");
class RaceModel {
    static async create(raceData) {
        const id = (0, uuid_1.v4)();
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
        const result = await database_1.default.query(query, values);
        return this.formatRace(result.rows[0]);
    }
    static async findAll() {
        const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      ORDER BY r.date ASC
    `;
        const result = await database_1.default.query(query);
        return result.rows.map(row => this.formatRaceWithSeries(row));
    }
    static async findUpcoming(limit) {
        const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.date > NOW()
      ORDER BY r.date ASC
      ${limit ? `LIMIT ${limit}` : ''}
    `;
        const result = await database_1.default.query(query);
        return result.rows.map(row => this.formatRaceWithSeries(row));
    }
    static async findById(id) {
        const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.id = $1
    `;
        const result = await database_1.default.query(query, [id]);
        return result.rows[0] ? this.formatRaceWithSeries(result.rows[0]) : null;
    }
    static async findBySeries(seriesId) {
        const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE r.series_id = $1
      ORDER BY r.date ASC
    `;
        const result = await database_1.default.query(query, [seriesId]);
        return result.rows.map(row => this.formatRaceWithSeries(row));
    }
    static async search(searchTerm) {
        const query = `
      SELECT r.*, s.name as series_name, s.color as series_color, s.icon as series_icon
      FROM races r
      LEFT JOIN series s ON r.series_id = s.id
      WHERE LOWER(r.name) LIKE LOWER($1) 
         OR LOWER(r.circuit) LIKE LOWER($1)
         OR LOWER(r.country) LIKE LOWER($1)
      ORDER BY r.date ASC
    `;
        const result = await database_1.default.query(query, [`%${searchTerm}%`]);
        return result.rows.map(row => this.formatRaceWithSeries(row));
    }
    static async update(id, updates) {
        const setClause = [];
        const values = [];
        let paramCount = 1;
        Object.entries(updates).forEach(([key, value]) => {
            if (value !== undefined) {
                if (key === 'schedule' || key === 'watch_links') {
                    setClause.push(`${key} = $${paramCount++}`);
                    values.push(JSON.stringify(value));
                }
                else {
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
        const result = await database_1.default.query(query, values);
        return result.rows[0] ? this.formatRace(result.rows[0]) : null;
    }
    static async delete(id) {
        const query = 'DELETE FROM races WHERE id = $1';
        const result = await database_1.default.query(query, [id]);
        return result.rowCount ? result.rowCount > 0 : false;
    }
    static formatRace(row) {
        return {
            ...row,
            schedule: typeof row.schedule === 'string' ? JSON.parse(row.schedule) : row.schedule,
            watch_links: typeof row.watch_links === 'string' ? JSON.parse(row.watch_links) : row.watch_links,
        };
    }
    static formatRaceWithSeries(row) {
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
exports.RaceModel = RaceModel;
//# sourceMappingURL=Race.js.map