import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';
import ScamDetector from '../../utils/scamDetection';
import WebsiteChecker from '../../utils/websiteChecker';

interface DetectionResult {
  is_phishing: boolean;
  confidence: number;
  keywords_found?: string[];
  explanation?: string;
}

export default function ScamDetectionScreen() {
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { isGuestMode, logout } = useUser();

  const handleDetect = async () => {
    if (!urlInput.trim()) return;
    setLoading(true);
    setError('');
    try {
      // First check if the website exists
      const websiteCheck = await WebsiteChecker.checkWebsiteExists(urlInput.trim());
      const urlParam = encodeURIComponent(urlInput.trim());
      
      // If website doesn't exist, redirect to not-found page
      if (!websiteCheck.exists) {
        const reasonParam = encodeURIComponent(websiteCheck.reason);
        router.push(`/website-not-found?url=${urlParam}&reason=${reasonParam}` as any);
        setLoading(false);
        return;
      }

      // If website exists, proceed with rule-based scam detection
      const result = await ScamDetector.analyzeURL(urlInput.trim());
      const { confidence, riskScore = 0 } = result;
      const actualRiskScore = riskScore || confidence || 0;

      console.log(`🔍 Analyzed URL: ${urlInput.trim()} → Risk Score: ${actualRiskScore}%`);

      // Route based on risk score, not classification
      if (actualRiskScore >= 51) {
        // HIGH RISK - Dangerous/Phishing (51-100%)
        router.push(`/scam-alert?confidence=${actualRiskScore}&url=${urlParam}` as any);
      } else if (actualRiskScore >= 31) {
        // MEDIUM RISK - Unknown/Suspicious (31-50%)
        router.push(`/unknown?confidence=${actualRiskScore}&url=${urlParam}` as any);
      } else {
        // LOW RISK - Safe (0-30%)
        router.push(`/good-news?confidence=${actualRiskScore}&url=${urlParam}` as any);
      }
    } catch (err) {
      setError('❌ Unable to analyze URL. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = () => {
    console.log('Report pressed');
    router.push('/(tabs)/report-scam');
  };



  const handleChatForum = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    console.log('Chat forum pressed');
    router.push('/forum');
  };

  const handleStats = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    console.log('Analytics pressed');
    router.push('/analytics');
  };

  const handleLearn = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    router.push('/learn');
  };

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Scam Detection</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>{isGuestMode ? 'Login' : 'Logout'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>
          Need help deciphering if somebody is trying to scam you? Paste suspicious messages or links and let our AI and community flag the risks — fast, free, and secure.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* AI/ML Model Info Card */}
        <View style={styles.aiModelCard}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>🤖</Text>
          </View>
          <View style={styles.aiModelContent}>
            <Text style={styles.aiModelTitle}>AI-Powered Scam Detection</Text>
            <Text style={styles.aiModelDescription}>
              Our AI analyzes URLs using advanced pattern recognition, domain verification, content scanning, and real-time threat databases to identify scams with high accuracy. Get instant safety ratings and clear explanations for every detection.
            </Text>
          </View>
        </View>

        {/* Scam Detector Section */}
        <View style={styles.detectorSection}>
          <View style={styles.detectorHeader}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>⚠️</Text>
            </View>
            <View>
              <Text style={styles.detectorTitle}>Scam detector:</Text>
              <Text style={styles.detectorSubtitle}>Enter URL</Text>
            </View>
          </View>

          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="Type Here . . ."
            placeholderTextColor="#666"
          />
        </View>

        {/* Results Section removed - handled via separate pages */}

        {/* Action Buttons */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        ) : (
          <TouchableOpacity style={styles.detectButton} onPress={handleDetect}>
            <Text style={styles.detectButtonIcon}>⚠️</Text>
            <Text style={styles.detectButtonText}>Detect</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.warningText}>
          Please remain vigilant... Do not be the next victim
        </Text>

        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportButtonIcon}>🚩</Text>
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={() => router.push('/scam-detection')}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearn}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleStats}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleChatForum}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Forum</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: 18,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  aiModelCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aiModelContent: {
    flex: 1,
  },
  aiModelTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  aiModelDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  cardIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardIconText: {
    fontSize: 20,
  },

  detectorSection: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },
  detectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  warningIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  warningIconText: {
    fontSize: 20,
  },
  detectorTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detectorSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  urlInput: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  detectButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  detectButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#e74c3c',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 10,
  },
  reportButton: {
    backgroundColor: '#f39c12',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  reportButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  logoutButton: {
    padding: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  activeNavText: {
    color: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});