import { Race, RaceSchedule, WatchLink } from '../types';
export declare class RaceModel {
    static create(raceData: {
        name: string;
        date: Date;
        circuit: string;
        country: string;
        series_id: string;
        schedule: RaceSchedule[];
        watch_links: WatchLink[];
        track_map?: string;
    }): Promise<Race>;
    static findAll(): Promise<Race[]>;
    static findUpcoming(limit?: number): Promise<Race[]>;
    static findById(id: string): Promise<Race | null>;
    static findBySeries(seriesId: string): Promise<Race[]>;
    static search(searchTerm: string): Promise<Race[]>;
    static update(id: string, updates: Partial<{
        name: string;
        date: Date;
        circuit: string;
        country: string;
        schedule: RaceSchedule[];
        watch_links: WatchLink[];
        track_map: string;
    }>): Promise<Race | null>;
    static delete(id: string): Promise<boolean>;
    private static formatRace;
    private static formatRaceWithSeries;
}
//# sourceMappingURL=Race.d.ts.map