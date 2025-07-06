export interface User {
  id: string;
  name: string;
  email: string;
  favorites: string[];
  reminders: string[];
  createdAt: string;
}

export interface Series {
  id: string;
  name: string;
  color: string;
  icon: string;
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
}

export interface Race {
  id: string;
  name: string;
  date: string;
  circuit: string;
  country: string;
  seriesId: string;
  series: Series;
  schedule: RaceSchedule[];
  watchLinks: WatchLink[];
  drivers?: Driver[];
  weather?: WeatherInfo;
  trackMap?: string;
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
  windSpeed: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addFavorite: (raceId: string) => void;
  removeFavorite: (raceId: string) => void;
  addReminder: (raceId: string) => void;
  removeReminder: (raceId: string) => void;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 