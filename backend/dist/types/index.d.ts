export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    favorites: string[];
    reminders: string[];
    created_at: Date;
    updated_at: Date;
}
export interface Series {
    id: string;
    name: string;
    color: string;
    icon: string;
    created_at: Date;
}
export interface Driver {
    id: string;
    name: string;
    team: string;
    number?: number;
    nationality: string;
    headshot?: string;
    stats?: {
        wins: number;
        podiums: number;
        points: number;
    };
    created_at: Date;
}
export interface Race {
    id: string;
    name: string;
    date: Date;
    circuit: string;
    country: string;
    series_id: string;
    schedule: RaceSchedule[];
    watch_links: WatchLink[];
    track_map?: string;
    weather?: WeatherInfo;
    series?: Series;
    created_at: Date;
    updated_at: Date;
}
export interface RaceSchedule {
    session: string;
    date: string;
    time: string;
}
export interface WatchLink {
    country: string;
    broadcaster: string;
    url?: string;
    subscription?: boolean;
}
export interface WeatherInfo {
    temperature: number;
    condition: string;
    humidity: number;
    wind_speed: number;
}
export interface AuthTokenPayload {
    userId: string;
    email: string;
    iat?: number;
    exp?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}
export interface CreateRaceRequest {
    name: string;
    date: string;
    circuit: string;
    country: string;
    series_id: string;
    schedule: RaceSchedule[];
    watch_links: WatchLink[];
    track_map?: string;
}
export interface SportsEvent {
    sport: string;
    event: string;
    date: string;
    time: string;
    location: string;
    venue?: string;
    teams?: string[];
    status?: 'upcoming' | 'live' | 'completed';
    round?: string;
    circuit?: string;
    country?: string;
}
export interface ScheduleResponse {
    success: boolean;
    data?: SportsEvent[];
    message?: string;
    error?: string;
    sport?: string;
}
export type SupportedSports = 'f1' | 'nascar' | 'rally' | 'cricket' | 'football';
//# sourceMappingURL=index.d.ts.map