import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { AuthState, User } from '../types';
import { authAPI, userAPI } from '../utils/api';

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login({ email, password });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.error || 'Login failed');
          }
        } catch (error: any) {
          console.error('Login error:', error);
          throw error;
        }
      },

      register: async (name: string, email: string, password: string) => {
        try {
          const response = await authAPI.register({ name, email, password, confirmPassword: password });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store token in localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            set({
              user,
              token,
              isAuthenticated: true,
            });
          } else {
            throw new Error(response.error || 'Registration failed');
          }
        } catch (error: any) {
          console.error('Registration error:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      addFavorite: async (raceId: string) => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await userAPI.addFavorite(raceId);
          
          if (response.success) {
            const updatedUser: User = {
              ...user,
              favorites: [...user.favorites, raceId],
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Add favorite error:', error);
        }
      },

      removeFavorite: async (raceId: string) => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await userAPI.removeFavorite(raceId);
          
          if (response.success) {
            const updatedUser: User = {
              ...user,
              favorites: user.favorites.filter(id => id !== raceId),
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Remove favorite error:', error);
        }
      },

      addReminder: async (raceId: string) => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await userAPI.addReminder(raceId);
          
          if (response.success) {
            const updatedUser: User = {
              ...user,
              reminders: [...user.reminders, raceId],
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Add reminder error:', error);
        }
      },

      removeReminder: async (raceId: string) => {
        const { user } = get();
        if (!user) return;

        try {
          const response = await userAPI.removeReminder(raceId);
          
          if (response.success) {
            const updatedUser: User = {
              ...user,
              reminders: user.reminders.filter(id => id !== raceId),
            };
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
          }
        } catch (error) {
          console.error('Remove reminder error:', error);
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore; 