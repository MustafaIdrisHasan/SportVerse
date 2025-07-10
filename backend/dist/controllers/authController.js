"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const auth_1 = require("../utils/auth");
const validation_1 = require("../utils/validation");
const mockUsers = [
    {
        id: 'test-user-123',
        name: 'Test User',
        email: 'test@sportverse.com',
        password: '$2b$10$rOvHPGkwJkKvx8u7Kx8uKOQGvQGvQGvQGvQGvQGvQGvQGvQGvQGvQG',
        favorites: [],
        reminders: [],
        created_at: new Date(),
        updated_at: new Date()
    }
];
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, confirmPassword } = req.body;
            if (!name || !email || !password || !confirmPassword) {
                res.status(400).json({
                    success: false,
                    error: 'All fields are required',
                });
                return;
            }
            if (!(0, validation_1.validateName)(name)) {
                res.status(400).json({
                    success: false,
                    error: 'Name must be between 2 and 100 characters',
                });
                return;
            }
            if (!(0, validation_1.validateEmail)(email)) {
                res.status(400).json({
                    success: false,
                    error: 'Please enter a valid email address',
                });
                return;
            }
            const passwordValidation = (0, validation_1.validatePassword)(password);
            if (!passwordValidation.isValid) {
                res.status(400).json({
                    success: false,
                    error: passwordValidation.errors[0],
                });
                return;
            }
            if (password !== confirmPassword) {
                res.status(400).json({
                    success: false,
                    error: 'Passwords do not match',
                });
                return;
            }
            const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (existingUser) {
                res.status(409).json({
                    success: false,
                    error: 'User with this email already exists',
                });
                return;
            }
            const newUser = {
                id: `user-${Date.now()}`,
                name: (0, validation_1.sanitizeString)(name),
                email: email.toLowerCase(),
                password: 'hashed-password',
                favorites: [],
                reminders: [],
                created_at: new Date(),
                updated_at: new Date()
            };
            mockUsers.push(newUser);
            const token = (0, auth_1.generateToken)({
                userId: newUser.id,
                email: newUser.email,
            });
            const { password: _, ...userWithoutPassword } = newUser;
            res.status(201).json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    token,
                },
                message: 'User registered successfully',
            });
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Email and password are required',
                });
                return;
            }
            if (!(0, validation_1.validateEmail)(email)) {
                res.status(400).json({
                    success: false,
                    error: 'Please enter a valid email address',
                });
                return;
            }
            const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid email or password',
                });
                return;
            }
            const isPasswordValid = password === 'password123';
            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    error: 'Invalid email or password',
                });
                return;
            }
            const token = (0, auth_1.generateToken)({
                userId: user.id,
                email: user.email,
            });
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                success: true,
                data: {
                    user: userWithoutPassword,
                    token,
                },
                message: 'Login successful',
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async getCurrentUser(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }
            const user = await User_1.UserModel.findById(req.user.userId);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }
            const { password: _, ...userWithoutPassword } = user;
            res.json({
                success: true,
                data: userWithoutPassword,
            });
        }
        catch (error) {
            console.error('Get current user error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    error: 'User not authenticated',
                });
                return;
            }
            const { name, email } = req.body;
            const updates = {};
            if (name !== undefined) {
                if (!(0, validation_1.validateName)(name)) {
                    res.status(400).json({
                        success: false,
                        error: 'Name must be between 2 and 100 characters',
                    });
                    return;
                }
                updates.name = (0, validation_1.sanitizeString)(name);
            }
            if (email !== undefined) {
                if (!(0, validation_1.validateEmail)(email)) {
                    res.status(400).json({
                        success: false,
                        error: 'Please enter a valid email address',
                    });
                    return;
                }
                const existingUser = await User_1.UserModel.findByEmail(email.toLowerCase());
                if (existingUser && existingUser.id !== req.user.userId) {
                    res.status(409).json({
                        success: false,
                        error: 'Email is already taken',
                    });
                    return;
                }
                updates.email = email.toLowerCase();
            }
            const updatedUser = await User_1.UserModel.updateProfile(req.user.userId, updates);
            if (!updatedUser) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }
            res.json({
                success: true,
                data: updatedUser,
                message: 'Profile updated successfully',
            });
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map