// import AsyncStorage from '@react-native-async-storage/async-storage'; // disabled due to module issue

const API_BASE_URL = 'http://192.168.1.112:8001/api';
const DEMO_MODE = false; // Using real backend

// Storage solution with profile image persistence in user context
let memoryStorage: { [key: string]: string } = {};

// Helper functions to replace AsyncStorage
const getItem = async (key: string): Promise<string | null> => {
  return memoryStorage[key] || null;
};

const setItem = async (key: string, value: string): Promise<void> => {
  memoryStorage[key] = value;
};

const multiRemove = async (keys: string[]): Promise<void> => {
  keys.forEach(key => {
    delete memoryStorage[key];
  });
};

// Profile image management
const setProfileImage = async (imageUrl: string): Promise<void> => {
  await setItem('user_profile_image', imageUrl);
  // Also store in user session data
  const userData = await getItem('user_data');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      user.profile_image = imageUrl;
      await setItem('user_data', JSON.stringify(user));
    } catch (e) {
      console.error('Error updating user data with profile image:', e);
    }
  }
};

const getProfileImage = async (): Promise<string | null> => {
  let profileImage = await getItem('user_profile_image');
  
  // If no profile image exists, initialize with a default one
  if (!profileImage) {
    const defaultImages = ['user-circle', 'smile-o', 'star', 'heart', 'trophy', 'shield', 'diamond', 'graduation-cap'];
    const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    await setItem('user_profile_image', randomImage);
    profileImage = randomImage;
  }
  
  return profileImage;
};

// Initialize with default profile images for demo users
const initializeDefaultProfileImages = async () => {
  // Set some default profile images if none exist
  const existingImage = await getItem('user_profile_image');
  if (!existingImage) {
    const defaultImages = ['user-circle', 'smile-o', 'star', 'heart', 'trophy', 'shield', 'diamond', 'graduation-cap'];
    const randomImage = defaultImages[Math.floor(Math.random() * defaultImages.length)];
    await setItem('user_profile_image', randomImage);
  }
};

export interface User {
  id: number;
  email: string;
  name: string;
  is_verified: boolean;
  created_at: string;
  last_login_at: string | null;
  stats: {
    scans_completed: number;
    threats_detected: number;
    reports_submitted: number;
    forum_posts: number;
    member_since: string;
    last_activity: string;
  };
  profile: {
    phone_number: string;
    date_of_birth: string | null;
    location: string;
    avatar: string;
    notification_preferences: Record<string, any>;
  };
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  access?: string;
  refresh?: string;
  error?: any;
  message?: string;
}

class AuthService {
  private async getStoredToken(): Promise<string | null> {
    return await getItem('access_token');
  }

  private async storeTokens(access: string, refresh: string): Promise<void> {
    await setItem('access_token', access);
    await setItem('refresh_token', refresh);
  }

  private async clearTokens(): Promise<void> {
    await multiRemove(['access_token', 'refresh_token', 'user_data']);
  }

  private async makeAuthenticatedRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const token = await this.getStoredToken();

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
    });
  }

  async register(email: string, name: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          password,
          password_confirm: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await this.storeTokens(data.access, data.refresh);
        await setItem('user_data', JSON.stringify(data.user));

        return {
          success: true,
          user: data.user,
          access: data.access,
          refresh: data.refresh,
          message: data.message,
        };
      } else {
        return { success: false, error: data };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Demo mode - bypass server and return mock user
    if (DEMO_MODE) {
      // Check if we have an existing profile image
      const existingProfileImage = await getItem('user_profile_image');
      
      const demoUser: User = {
        id: 1,
        email: email,
        name: email.split('@')[0] || 'Demo User',
        is_verified: true,
        created_at: '2024-01-01T00:00:00Z',
        last_login_at: new Date().toISOString(),
        stats: {
          scans_completed: 42,
          threats_detected: 8,
          reports_submitted: 3,
          forum_posts: 5,
          member_since: '2024-01-01',
          last_activity: new Date().toISOString()
        },
        profile: {
          phone_number: '+65 9123 4567',
          date_of_birth: '1990-01-01',
          location: 'Singapore',
          avatar: existingProfileImage || '',
          notification_preferences: {}
        }
      };

      // Store demo tokens and user data
      await this.storeTokens('demo_access_token', 'demo_refresh_token');
      await setItem('user_data', JSON.stringify(demoUser));
      
      // Initialize default profile image if none exists
      if (!existingProfileImage) {
        await initializeDefaultProfileImages();
      }

      return {
        success: true,
        user: demoUser,
        access: 'demo_access_token',
        refresh: 'demo_refresh_token',
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        await this.storeTokens(data.access, data.refresh);
        await setItem('user_data', JSON.stringify(data.user));

        return {
          success: true,
          user: data.user,
          access: data.access,
          refresh: data.refresh,
        };
      } else {
        return { success: false, error: data };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async logout(): Promise<boolean> {
    try {
      // Demo mode - just clear tokens without server call
      if (DEMO_MODE) {
        await this.clearTokens();
        return true;
      }

      const refreshToken = await getItem('refresh_token');

      if (refreshToken) {
        await this.makeAuthenticatedRequest('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh_token: refreshToken }),
        });
      }

      await this.clearTokens();
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      await this.clearTokens(); // Clear tokens anyway
      return false;
    }
  }

  async getUserInfo(): Promise<AuthResponse> {
    try {
      // Demo mode - return stored demo user
      if (DEMO_MODE) {
        const userData = await this.getStoredUserData();
        if (userData) {
          return { success: true, user: userData };
        } else {
          return { success: false, error: 'No demo user data found' };
        }
      }

      const response = await this.makeAuthenticatedRequest('/auth/me/');
      const data = await response.json();

      if (response.ok) {
        await setItem('user_data', JSON.stringify(data));
        return { success: true, user: data };
      } else {
        // If token is invalid, try to refresh
        if (response.status === 401) {
          const refreshSuccess = await this.refreshToken();
          if (refreshSuccess) {
            return this.getUserInfo(); // Retry with new token
          }
        }
        return { success: false, error: data };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateProfile(profileData: {
    name?: string;
    phone_number?: string;
    location?: string;
    avatar?: string;
  }): Promise<AuthResponse> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/profile/update/', {
        method: 'PATCH',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok) {
        await setItem('user_data', JSON.stringify(data.user));
        return { success: true, user: data.user, message: data.message };
      } else {
        return { success: false, error: data };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async updateStats(stats: {
    scans_completed?: number;
    threats_detected?: number;
    reports_submitted?: number;
    forum_posts?: number;
  }): Promise<boolean> {
    try {
      // Demo mode - just return success without server call
      if (DEMO_MODE) {
        return true;
      }

      const response = await this.makeAuthenticatedRequest('/auth/stats/update/', {
        method: 'POST',
        body: JSON.stringify(stats),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to update stats:', error);
      return false;
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = await getItem('refresh_token');

      if (!refreshToken) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const data = await response.json();

      if (response.ok) {
        await setItem('access_token', data.access);
        return true;
      } else {
        await this.clearTokens();
        return false;
      }
    } catch (error) {
      console.error('Token refresh error:', error);
      await this.clearTokens();
      return false;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      const response = await this.makeAuthenticatedRequest('/auth/password/change/', {
        method: 'POST',
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data };
      }
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const token = await this.getStoredToken();
      return !!token;
    } catch {
      return false;
    }
  }

  async getStoredUserData(): Promise<User | null> {
    try {
      const userData = await getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      // Demo mode - return false so UI shows "Demo Mode"
      if (DEMO_MODE) {
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/health/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

const authService = new AuthService();

export default {
  login: authService.login.bind(authService),
  register: authService.register.bind(authService),
  logout: authService.logout.bind(authService),
  getUserInfo: authService.getUserInfo.bind(authService),
  updateProfile: authService.updateProfile.bind(authService),
  refreshToken: authService.refreshToken.bind(authService),
  isLoggedIn: authService.isLoggedIn.bind(authService),
  getStoredUserData: authService.getStoredUserData.bind(authService),
  updateStats: authService.updateStats.bind(authService),
  healthCheck: authService.healthCheck.bind(authService),
  setProfileImage,
  getProfileImage,
  initializeDefaultProfileImages,
  getItem,
  setItem,
  multiRemove
}; 