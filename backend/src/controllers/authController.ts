import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { validateEmail, validatePassword, validateName, sanitizeString } from '../utils/validation';
import { LoginRequest, RegisterRequest, ApiResponse } from '../types';

// Mock user store for testing (since database is disabled)
const mockUsers = [
  {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@sportverse.com',
    password: '$2b$10$rOvHPGkwJkKvx8u7Kx8uKOQGvQGvQGvQGvQGvQGvQGvQGvQGvQGvQG', // hashed "password123"
    favorites: [],
    reminders: [],
    created_at: new Date(),
    updated_at: new Date()
  }
];

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { name, email, password, confirmPassword }: RegisterRequest = req.body;

      // Validation
      if (!name || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          error: 'All fields are required',
        });
        return;
      }

      if (!validateName(name)) {
        res.status(400).json({
          success: false,
          error: 'Name must be between 2 and 100 characters',
        });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({
          success: false,
          error: 'Please enter a valid email address',
        });
        return;
      }

      const passwordValidation = validatePassword(password);
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

      // Check if user already exists (using mock data)
      const existingUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        res.status(409).json({
          success: false,
          error: 'User with this email already exists',
        });
        return;
      }

      // Create user (add to mock store)
      const newUser = {
        id: `user-${Date.now()}`,
        name: sanitizeString(name),
        email: email.toLowerCase(),
        password: 'hashed-password', // In real app, this would be hashed
        favorites: [],
        reminders: [],
        created_at: new Date(),
        updated_at: new Date()
      };

      mockUsers.push(newUser);

      // Generate token
      const token = generateToken({
        userId: newUser.id,
        email: newUser.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'User registered successfully',
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * User login
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginRequest = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: 'Email and password are required',
        });
        return;
      }

      if (!validateEmail(email)) {
        res.status(400).json({
          success: false,
          error: 'Please enter a valid email address',
        });
        return;
      }

      // Find user (using mock data since database is disabled)
      const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Verify password (simple check for test user)
      const isPasswordValid = password === 'password123';
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          error: 'Invalid email or password',
        });
        return;
      }

      // Generate token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'Login successful',
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const user = await UserModel.findById(req.user.userId);
      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      console.error('Get current user error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'User not authenticated',
        });
        return;
      }

      const { name, email } = req.body;
      const updates: { name?: string; email?: string } = {};

      if (name !== undefined) {
        if (!validateName(name)) {
          res.status(400).json({
            success: false,
            error: 'Name must be between 2 and 100 characters',
          });
          return;
        }
        updates.name = sanitizeString(name);
      }

      if (email !== undefined) {
        if (!validateEmail(email)) {
          res.status(400).json({
            success: false,
            error: 'Please enter a valid email address',
          });
          return;
        }

        // Check if email is already taken by another user
        const existingUser = await UserModel.findByEmail(email.toLowerCase());
        if (existingUser && existingUser.id !== req.user.userId) {
          res.status(409).json({
            success: false,
            error: 'Email is already taken',
          });
          return;
        }

        updates.email = email.toLowerCase();
      }

      const updatedUser = await UserModel.updateProfile(req.user.userId, updates);
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
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
} 