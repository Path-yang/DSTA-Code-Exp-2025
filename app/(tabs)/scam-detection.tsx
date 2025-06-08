import React, { useState } from 'react';
import { Alert, Linking } from 'react-native';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';

export default function ScamDetectionScreen() {
  const [urlInput, setUrlInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDetect = async () => {
    if (!urlInput.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await axios.post('https://phishing-backend-beh4.onrender.com/predict', {
        url: urlInput.trim(),
      });

      setResult(response.data);
      console.log('Detection result:', response.data);
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
    console.log('Chat forum pressed');
    // We'll add forum navigation later
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scam Detection</Text>
        <Text style={styles.headerSubtitle}>
          Need help deciphering if somebody is trying to scam you? Paste suspicious messages or links and let our AI and community flag the risks — fast, free, and secure.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Read More Card */}
        <TouchableOpacity style={styles.readMoreCard} onPress={handleReadMore}>
          <View style={styles.cardIcon}>
            <Text style={styles.cardIconText}>📚</Text>
          </View>
          <Text style={styles.cardText}>Read more about the dangers of scams</Text>
          <Text style={styles.linkText}>Link</Text>
        </TouchableOpacity>

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

        {/* Results Section */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Your results...</Text>
            {loading ? (
              <Text style={styles.resultSubtitle}>Loading...</Text>
            ) : error ? (
              <Text style={[styles.resultSubtitle, { color: 'red' }]}>{error}</Text>
            ) : result ? (
              <>
                <Text style={styles.resultSubtitle}>
                  {result.is_phishing ? 'Phishing Detected!' : 'This link appears safe.'}
                </Text>
                {result.confidence && (
                  <Text style={styles.resultSubtitle}>
                    Confidence: {(result.confidence).toFixed(1)}%
                  </Text>
                )}
                {result.keywords_found?.length > 0 && (
                  <Text style={styles.resultSubtitle}>
                    Keywords: {result.keywords_found.join(', ')}
                  </Text>
                )}
                {result.explanation && (
                  <Text style={styles.resultSubtitle}>
                    Explanation: {result.explanation}
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.resultSubtitle}>Pending user input</Text>
            )}
          </View>

          <TouchableOpacity style={styles.forumCard} onPress={handleChatForum}>
            <View style={styles.forumIcon}>
              <Text style={styles.forumIconText}>💬</Text>
            </View>
            <View>
              <Text style={styles.forumTitle}>Chat forum</Text>
              <Text style={styles.forumSubtitle}>Seen similar links?</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.detectButton} onPress={handleDetect}>
          <Text style={styles.detectButtonIcon}>⚠️</Text>
          <Text style={styles.detectButtonText}>Detect</Text>
        </TouchableOpacity>

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
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Stats</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
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
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  headerSubtitle: {
    color: '#aaa',
    fontSize: 14,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
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
  cardIconText: {
    fontSize: 20,
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
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  resultCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
  },
  resultTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultSubtitle: {
    color: '#aaa',
    fontSize: 12,
  },
  forumCard: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forumIcon: {
    width: 30,
    height: 30,
    backgroundColor: '#e74c3c',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  forumIconText: {
    fontSize: 16,
  },
  forumTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  forumSubtitle: {
    color: '#aaa',
    fontSize: 12,
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
});