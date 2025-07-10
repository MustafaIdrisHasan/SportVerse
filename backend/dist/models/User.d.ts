import { User } from '../types';
export declare class UserModel {
    static create(userData: {
        name: string;
        email: string;
        password: string;
    }): Promise<User>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: string): Promise<User | null>;
    static updateProfile(id: string, updates: {
        name?: string;
        email?: string;
    }): Promise<User | null>;
    static addFavorite(userId: string, raceId: string): Promise<User | null>;
    static removeFavorite(userId: string, raceId: string): Promise<User | null>;
    static addReminder(userId: string, raceId: string): Promise<User | null>;
    static removeReminder(userId: string, raceId: string): Promise<User | null>;
    static deleteAccount(id: string): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map