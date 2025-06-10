import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  isGuestMode: boolean;
  login: () => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  const login = () => {
    setIsLoggedIn(true);
    setIsGuestMode(false);
  };

  const loginAsGuest = () => {
    setIsLoggedIn(false);
    setIsGuestMode(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsGuestMode(false);
  };

  return (
    <UserContext.Provider value={{ isLoggedIn, isGuestMode, login, loginAsGuest, logout }}>
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