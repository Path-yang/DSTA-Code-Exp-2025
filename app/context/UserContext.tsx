import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User, AuthResponse } from '../services/authService';

interface UserContextType {
  user: User | null;
  isLoggedIn: boolean;
  isGuestMode: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (email: string, name: string, password: string) => Promise<AuthResponse>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (profileData: any) => Promise<AuthResponse>;
  updateStats: (stats: any) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const isAuthenticated = await authService.isLoggedIn();
      
      if (isAuthenticated) {
        // Try to get user data
        const result = await authService.getUserInfo();
        if (result.success && result.user) {
          setUser(result.user);
          setIsLoggedIn(true);
          setIsGuestMode(false);
        } else {
          // Token might be expired, clear everything
          await authService.logout();
          setUser(null);
          setIsLoggedIn(false);
          setIsGuestMode(false);
        }
      } else {
        // Check if there's stored user data from previous session
        const storedUser = await authService.getStoredUserData();
        if (storedUser) {
          setUser(storedUser);
          setIsLoggedIn(true);
          setIsGuestMode(false);
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const result = await authService.login(email, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
        setIsGuestMode(false);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, name: string, password: string): Promise<AuthResponse> => {
    try {
      setLoading(true);
      const result = await authService.register(email, name, password);
      
      if (result.success && result.user) {
        setUser(result.user);
        setIsLoggedIn(true);
        setIsGuestMode(false);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    setUser(null);
    setIsLoggedIn(false);
    setIsGuestMode(true);
  };

  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsLoggedIn(false);
      setIsGuestMode(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any): Promise<AuthResponse> => {
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success && result.user) {
        setUser(result.user);
      }
      
      return result;
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateStats = async (stats: any): Promise<boolean> => {
    try {
      const success = await authService.updateStats(stats);
      
      if (success && user) {
        // Refresh user data to get updated stats
        await refreshUserData();
      }
      
      return success;
    } catch (error) {
      console.error('Stats update error:', error);
      return false;
    }
  };

  const refreshUserData = async () => {
    try {
      if (isLoggedIn) {
        const result = await authService.getUserInfo();
        if (result.success && result.user) {
          setUser(result.user);
        }
      }
    } catch (error) {
      console.error('Refresh user data error:', error);
    }
  };

  return (
    <UserContext.Provider value={{ 
      user,
      isLoggedIn, 
      isGuestMode, 
      loading,
      login, 
      register,
      loginAsGuest, 
      logout,
      updateProfile,
      updateStats,
      refreshUserData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Default export to prevent Expo Router warnings
export default UserProvider; 