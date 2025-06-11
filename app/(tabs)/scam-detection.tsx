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
import { FontAwesome } from '@expo/vector-icons';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';

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
  const { isLoggedIn, isGuestMode, logout, updateStats } = useUser();

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

      // Update user stats if logged in
      if (isLoggedIn && !isGuestMode) {
        try {
          await updateStats({
            scans_completed: 1,
            threats_detected: actualRiskScore >= 51 ? 1 : 0
          });
        } catch (error) {
          console.error('Failed to update stats:', error);
        }
      }

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

  const handleReadMore = () => {
    Alert.alert(
      "Open IMDA Website",
      "You'll be redirected to the official IMDA site to learn more about scam prevention.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => Linking.openURL('https://www.imda.gov.sg/how-we-can-help/anti-scam-measures#:~:text=Learn%20about%20the%20different%20scam,6pm%2C%20excluding%20Public%20Holidays)')
        }
      ]
    );
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

  const handleMyInfo = () => {
    router.push('/(tabs)/my-info');
  };

  const handleLogout = () => {
    if (isLoggedIn || isGuestMode) {
      logout();
    } else {
      // Not logged in, go to login page
      router.push('/');
    }
  };

  const getLogoutButtonText = () => {
    if (isLoggedIn) return 'Logout';
    if (isGuestMode) return 'Login';
    return 'Login';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Scam Detection</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Need help deciphering if somebody is trying to scam you? Paste suspicious messages or links and let our AI and community flag the risks — fast, free, and secure.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Read More Card */}
        <TouchableOpacity style={styles.readMoreCard} onPress={handleReadMore}>
          <View style={styles.cardIcon}>
            <FontAwesome name="book" size={20} color="#fff" />
          </View>
          <Text style={styles.cardText}>Read more about the dangers of scams</Text>
          <Text style={styles.linkText}>Link</Text>
        </TouchableOpacity>

        {/* Scam Detector Section */}
        <View style={styles.detectorSection}>
          <View style={styles.detectorHeader}>
            <View style={styles.warningIcon}>
              <FontAwesome name="exclamation-triangle" size={20} color="#fff" />
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
            <FontAwesome name="exclamation-triangle" size={20} color="#fff" style={styles.detectButtonIcon} />
            <Text style={styles.detectButtonText}>Detect</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <FontAwesome name="flag" size={20} color="#fff" style={styles.reportButtonIcon} />
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>

        <Text style={styles.warningText}>
          Please remain vigilant... Do not be the next victim
        </Text>
      </View>

      {/* Enhanced Bottom Navigation */}
      <EnhancedBottomNav
        onTabPress={(tabId) => {
          switch (tabId) {
            case 'home':
              router.push('/scam-detection');
              break;
            case 'learn':
              handleLearn();
              break;
            case 'analytics':
              handleStats();
              break;
            case 'forum':
              handleChatForum();
              break;
          }
        }}
      />
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
  },
  readMoreCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
  cardText: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  linkText: {
    color: '#4a9eff',
    fontSize: 14,
  },
  detectorSection: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
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
    marginBottom: 15,
  },
  detectButtonIcon: {
    marginRight: 10,
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#e74c3c',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 15,
  },
  reportButton: {
    backgroundColor: '#f39c12',
    borderRadius: 25,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  reportButtonIcon: {
    marginRight: 10,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});