import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
// import { Camera, CameraView } from 'expo-camera'; // disabled due to module issue
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
// import * as MediaLibrary from 'expo-media-library'; // disabled due to module issue

interface ScamAlert {
  type: 'high' | 'medium' | 'low';
  message: string;
  position: { x: number; y: number };
}

export default function ARScamScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scamAlerts, setScamAlerts] = useState<ScamAlert[]>([]);
  const [flashMode, setFlashMode] = useState<'off' | 'on'>('off');
  // const cameraRef = useRef<CameraView>(null); // disabled

  // Scam keywords to detect
  const scamKeywords = {
    high: [
      'act now', 'limited time offer', 'guaranteed money',
      'wire transfer', 'gift cards only', 'social security suspended',
      'irs lawsuit', 'arrest warrant', 'claim your prize',
      'verify account immediately', 'suspended account'
    ],
    medium: [
      'urgent', 'expires today', 'congratulations',
      'winner', 'free money', 'no credit check',
      'work from home', 'make money fast', 'risk free'
    ],
    low: [
      'click here', 'call immediately', 'limited spots',
      'exclusive offer', 'act fast', 'don\'t miss out'
    ]
  };

  useEffect(() => {
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    // Placeholder - camera permission always granted for demo
    setHasPermission(true);
  };

  // Simulate text recognition and scam detection
  const analyzeText = (detectedText: string) => {
    const alerts: ScamAlert[] = [];
    const text = detectedText.toLowerCase();

    // Check for high-risk keywords
    scamKeywords.high.forEach(keyword => {
      if (text.includes(keyword)) {
        alerts.push({
          type: 'high',
          message: `⚠️ HIGH RISK: "${keyword}" detected`,
          position: { x: Math.random() * 200, y: Math.random() * 200 }
        });
      }
    });

    // Check for medium-risk keywords
    scamKeywords.medium.forEach(keyword => {
      if (text.includes(keyword)) {
        alerts.push({
          type: 'medium',
          message: `⚡ CAUTION: "${keyword}" detected`,
          position: { x: Math.random() * 200, y: Math.random() * 200 }
        });
      }
    });

    // Check for low-risk keywords
    scamKeywords.low.forEach(keyword => {
      if (text.includes(keyword)) {
        alerts.push({
          type: 'low',
          message: `💡 Notice: "${keyword}" detected`,
          position: { x: Math.random() * 200, y: Math.random() * 200 }
        });
      }
    });

    setScamAlerts(alerts);
  };

  const startScanning = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      // Mock detected text for demo
      const mockText = "Act now! Limited time offer! Call immediately to claim your guaranteed prize money!";
      analyzeText(mockText);
      setIsScanning(false);
    }, 2000);
  };

  const takePicture = async () => {
    // Placeholder function for demo
    Alert.alert('Demo Mode', 'Camera functionality disabled in demo mode');
  };

  const clearAlerts = () => {
    setScamAlerts([]);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <View style={styles.permissionHeader}>
          <TouchableOpacity onPress={() => router.push('/learn')} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#007AFF" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.permissionContent}>
          <Text style={styles.permissionText}>Camera permission denied</Text>
          <Text style={styles.permissionSubtext}>
            To use AR Scam Scanner, please grant camera access in your device settings.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={getCameraPermissions}>
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push('/learn')} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AR Scam Scanner</Text>
        <TouchableOpacity
          onPress={() => setFlashMode(flashMode === 'off' ? 'on' : 'off')}
          style={styles.flashButton}
        >
          <IconSymbol
            name={flashMode === 'on' ? 'bolt.fill' : 'bolt'}
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        {/* Placeholder for camera view */}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>Point camera at suspicious text</Text>
        <Text style={styles.instructionsText}>
          Flyers, emails on screen, business cards, letters, or any suspicious documents
        </Text>
      </View>

      {/* Control Buttons */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.controlButton} onPress={takePicture}>
          <IconSymbol name="camera" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>Save Evidence</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.scanButton]}
          onPress={startScanning}
          disabled={isScanning}
        >
          <IconSymbol name="viewfinder" size={24} color="#FFFFFF" />
          <Text style={styles.controlButtonText}>
            {isScanning ? 'Scanning...' : 'Scan Text'}
          </Text>
        </TouchableOpacity>

        {scamAlerts.length > 0 && (
          <TouchableOpacity style={styles.controlButton} onPress={clearAlerts}>
            <IconSymbol name="xmark" size={24} color="#FFFFFF" />
            <Text style={styles.controlButtonText}>Clear Alerts</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Alert Summary */}
      {scamAlerts.length > 0 && (
        <View style={styles.alertSummary}>
          <Text style={styles.alertSummaryTitle}>
            🚨 {scamAlerts.length} Potential Scam Indicators Found
          </Text>
          <Text style={styles.alertSummaryText}>
            This document shows signs of being a scam. Proceed with extreme caution.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  permissionContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  permissionSubtext: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'relative',
  },
  backButton: {
    zIndex: 10,
    position: 'relative',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 0,
    zIndex: 1,
  },
  flashButton: {
    position: 'absolute',
    right: 20,
    top: 15,
    padding: 8,
    zIndex: 10,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  scanFrame: {
    position: 'absolute',
    top: height * 0.2,
    left: width * 0.1,
    right: width * 0.1,
    height: height * 0.3,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  alertBubble: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 200,
  },
  highAlert: {
    borderColor: '#FF453A',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 69, 58, 0.2)',
  },
  mediumAlert: {
    borderColor: '#FF9F0A',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 159, 10, 0.2)',
  },
  lowAlert: {
    borderColor: '#30D158',
    borderWidth: 2,
    backgroundColor: 'rgba(48, 209, 88, 0.2)',
  },
  alertText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  scanningIndicator: {
    position: 'absolute',
    top: height * 0.15,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scanningText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  instructionsTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  instructionsText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  controlButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    minWidth: 80,
  },
  scanButton: {
    backgroundColor: '#007AFF',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '500',
  },
  alertSummary: {
    backgroundColor: '#FF453A',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  alertSummaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alertSummaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.9,
  },
});