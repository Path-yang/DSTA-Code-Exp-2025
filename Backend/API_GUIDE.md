# Scam Detection API - Authentication Guide

## Base URL
```
http://localhost:8000/api/
```

## Authentication Endpoints

### 1. Health Check
**GET** `/api/auth/health/`
- **Description**: Check if API is running
- **Authentication**: None required
- **Response**:
```json
{
    "status": "healthy",
    "message": "Scam Detection API is running",
    "version": "1.0.0"
}
```

### 2. User Registration
**POST** `/api/auth/register/`
- **Description**: Register a new user
- **Authentication**: None required
- **Request Body**:
```json
{
    "email": "user@example.com",
    "name": "John Doe",
    "password": "securepassword123",
    "password_confirm": "securepassword123"
}
```
- **Response** (201 Created):
```json
{
    "message": "User registered successfully",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "is_verified": false,
        "created_at": "2024-01-01T12:00:00Z",
        "last_login_at": null,
        "stats": {
            "scans_completed": 0,
            "threats_detected": 0,
            "reports_submitted": 0,
            "forum_posts": 0,
            "member_since": "2024-01-01T12:00:00Z",
            "last_activity": "2024-01-01T12:00:00Z"
        },
        "profile": {
            "phone_number": "",
            "date_of_birth": null,
            "location": "",
            "avatar": "👨‍💻",
            "notification_preferences": {}
        }
    }
}
```

### 3. User Login
**POST** `/api/auth/login/`
- **Description**: Login existing user
- **Authentication**: None required
- **Request Body**:
```json
{
    "email": "user@example.com",
    "password": "securepassword123"
}
```
- **Response** (200 OK):
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "is_verified": false,
        "created_at": "2024-01-01T12:00:00Z",
        "last_login_at": "2024-01-01T12:30:00Z",
        "stats": { /* user stats */ },
        "profile": { /* user profile */ }
    }
}
```

### 4. Get User Info
**GET** `/api/auth/me/`
- **Description**: Get current user's information
- **Authentication**: JWT Bearer token required
- **Headers**:
```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```
- **Response** (200 OK):
```json
{
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "is_verified": false,
    "created_at": "2024-01-01T12:00:00Z",
    "last_login_at": "2024-01-01T12:30:00Z",
    "stats": {
        "scans_completed": 42,
        "threats_detected": 8,
        "reports_submitted": 3,
        "forum_posts": 12,
        "member_since": "2024-01-01T12:00:00Z",
        "last_activity": "2024-01-01T13:00:00Z"
    },
    "profile": {
        "phone_number": "+65 9876 5432",
        "date_of_birth": "1990-01-01",
        "location": "Singapore",
        "avatar": "👨‍💻",
        "notification_preferences": {"email": true, "push": true}
    }
}
```

### 5. Update User Profile
**PUT/PATCH** `/api/auth/profile/update/`
- **Description**: Update user profile information
- **Authentication**: JWT Bearer token required
- **Request Body**:
```json
{
    "name": "John Updated",
    "phone_number": "+65 1234 5678",
    "location": "Singapore",
    "avatar": "👤"
}
```
- **Response** (200 OK):
```json
{
    "message": "Profile updated successfully",
    "user": { /* updated user info */ }
}
```

### 6. Get User Stats
**GET** `/api/auth/stats/`
- **Description**: Get user's activity statistics
- **Authentication**: JWT Bearer token required
- **Response** (200 OK):
```json
{
    "scans_completed": 42,
    "threats_detected": 8,
    "reports_submitted": 3,
    "forum_posts": 12,
    "member_since": "2024-01-01T12:00:00Z",
    "last_activity": "2024-01-01T13:00:00Z"
}
```

### 7. Update User Stats
**POST** `/api/auth/stats/update/`
- **Description**: Update user activity statistics
- **Authentication**: JWT Bearer token required
- **Request Body**:
```json
{
    "scans_completed": 1,
    "threats_detected": 0,
    "reports_submitted": 0,
    "forum_posts": 0
}
```
- **Response** (200 OK):
```json
{
    "message": "Stats updated successfully",
    "stats": { /* updated stats */ }
}
```

### 8. Change Password
**POST** `/api/auth/password/change/`
- **Description**: Change user password
- **Authentication**: JWT Bearer token required
- **Request Body**:
```json
{
    "old_password": "oldpassword123",
    "new_password": "newpassword456"
}
```
- **Response** (200 OK):
```json
{
    "message": "Password changed successfully"
}
```

### 9. Logout
**POST** `/api/auth/logout/`
- **Description**: Logout user (blacklist refresh token)
- **Authentication**: JWT Bearer token required
- **Request Body**:
```json
{
    "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response** (200 OK):
```json
{
    "message": "Logged out successfully"
}
```

### 10. Refresh Token
**POST** `/api/auth/token/refresh/`
- **Description**: Refresh access token
- **Authentication**: None required
- **Request Body**:
```json
{
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```
- **Response** (200 OK):
```json
{
    "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

## Testing with cURL

### Register a new user:
```bash
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test User",
    "password": "testpass123",
    "password_confirm": "testpass123"
  }'
```

### Login:
```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpass123"
  }'
```

### Get user info (replace TOKEN with actual access token):
```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Bearer TOKEN"
```

## Error Responses

### 400 Bad Request
```json
{
    "field_name": ["Error message"]
}
```

### 401 Unauthorized
```json
{
    "detail": "Given token not valid for any token type",
    "code": "token_not_valid",
    "messages": [
        {
            "token_class": "AccessToken",
            "token_type": "access",
            "message": "Token is invalid or expired"
        }
    ]
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

## Admin Interface
Access Django admin at: `http://localhost:8000/admin/`
- **Username**: admin@admin.com
- **Password**: admin123

## Integration with React Native

### Install dependencies:
```bash
npm install @react-native-async-storage/async-storage
```

### Example usage in React Native:
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// API base URL
const API_BASE_URL = 'http://localhost:8000/api';

// Login function
const login = async (email, password) => {
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
      // Store tokens
      await AsyncStorage.setItem('access_token', data.access);
      await AsyncStorage.setItem('refresh_token', data.refresh);
      await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
      
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get user info
const getUserInfo = async () => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (response.ok) {
      return { success: true, user: data };
    } else {
      return { success: false, error: data };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Update stats
const updateStats = async (stats) => {
  try {
    const token = await AsyncStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE_URL}/auth/stats/update/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stats),
    });
    
    return response.ok;
  } catch (error) {
    console.error('Failed to update stats:', error);
    return false;
  }
};
```

## Production Considerations

1. **Environment Variables**: Use environment variables for sensitive settings
2. **HTTPS**: Always use HTTPS in production
3. **Database**: Use PostgreSQL or MySQL instead of SQLite
4. **CORS**: Configure CORS properly for your domain
5. **Rate Limiting**: Implement rate limiting for API endpoints
6. **Logging**: Add proper logging for monitoring
7. **Backup**: Set up regular database backups 