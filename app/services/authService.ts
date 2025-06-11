import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://10.51.5.189:8000/api';

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
    return await AsyncStorage.getItem('access_token');
  }

  private async storeTokens(access: string, refresh: string): Promise<void> {
    await AsyncStorage.setItem('access_token', access);
    await AsyncStorage.setItem('refresh_token', refresh);
  }

  private async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token', 'user_data']);
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
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

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
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));

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
      const refreshToken = await AsyncStorage.getItem('refresh_token');

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
      const response = await this.makeAuthenticatedRequest('/auth/me/');
      const data = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('user_data', JSON.stringify(data));
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
        await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
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
      const refreshToken = await AsyncStorage.getItem('refresh_token');

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
        await AsyncStorage.setItem('access_token', data.access);
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
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/health/`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default new AuthService(); 