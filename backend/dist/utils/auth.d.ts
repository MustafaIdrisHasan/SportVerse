import { AuthTokenPayload } from '../types';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (password: string, hash: string) => Promise<boolean>;
export declare const generateToken: (payload: Omit<AuthTokenPayload, "iat" | "exp">) => string;
export declare const verifyToken: (token: string) => AuthTokenPayload;
export declare const extractTokenFromHeader: (authHeader?: string) => string | null;
//# sourceMappingURL=auth.d.ts.map