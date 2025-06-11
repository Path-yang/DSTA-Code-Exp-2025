import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import authService from '../services/authService';

interface BackendStatusProps {
  style?: any;
}

export default function BackendStatus({ style }: BackendStatusProps) {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const connected = await authService.healthCheck();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (loading) return '#666';
    return isConnected ? '#00C851' : '#FF4444';
  };

  const getStatusText = () => {
    if (loading) return 'Checking...';
    return isConnected ? 'Backend Online' : 'Demo Mode';
  };

  const getStatusIcon = () => {
    if (loading) return '⏳';
    return isConnected ? '🟢' : '🟡';
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={checkConnection}
    >
      <Text style={styles.icon}>{getStatusIcon()}</Text>
      <Text style={[styles.statusText, { color: getStatusColor() }]}>
        {getStatusText()}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 