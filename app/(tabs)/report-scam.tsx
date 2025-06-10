import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';

export default function ReportScamScreen() {
  const [urlInput, setUrlInput] = useState('');
  const { isGuestMode } = useUser();

  const handleReport = () => {
    if (urlInput.trim()) {
      Alert.alert(
        'Thank you!',
        'Your report has been submitted and will help protect the community.',
        [{ 
          text: 'OK', 
          onPress: () => {
            setUrlInput('');
            router.push('/scam-detection');
          }
        }]
      );
    } else {
      Alert.alert('Error', 'Please enter a URL or upload a picture to report.');
    }
  };

  const handleUploadPicture = () => {
    console.log('Upload picture pressed');
    // We'll add image picker functionality later
    Alert.alert('Coming Soon', 'Image upload feature will be available soon!');
  };

  const handleGoHome = () => {
    router.push('/scam-detection');
  };

  const handleLearn = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    console.log('Learn pressed');
    router.push('/learn');
  };

  const handleStats = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    console.log('Analytics pressed');
    router.push('/analytics');
  };

  const handleForum = () => {
    if (isGuestMode) {
      Alert.alert('Login Required', 'Please log in to access these features.');
      return;
    }
    console.log('Forum pressed');
    router.push('/forum');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => router.push('/scam-detection')} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Report a Scam</Text>
        <Text style={styles.headerDescription}>
          When you report a scam, you are creating a labeled example that teaches our detection system what to look for—suspicious keywords, sender patterns, URLs and more. These reports feed into our machine-learning model and rule-based filters, updating blacklists and on-device protections in real time. The result? Faster, more accurate blocking of new scams and a safer experience for everyone.
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* URL Input Section */}
        <View style={styles.inputSection}>
          <View style={styles.inputHeader}>
            <View style={styles.warningIcon}>
              <Text style={styles.warningIconText}>⚠️</Text>
            </View>
            <View>
              <Text style={styles.inputTitle}>Scam reporter</Text>
              <Text style={styles.inputSubtitle}>Enter URL</Text>
            </View>
          </View>

          <TextInput
            style={styles.urlInput}
            value={urlInput}
            onChangeText={setUrlInput}
            placeholder="Type Here . . ."
            placeholderTextColor="#666"
            multiline={true}
            textAlignVertical="top"
          />
        </View>

        {/* Upload Picture Section */}
        <TouchableOpacity style={styles.uploadSection} onPress={handleUploadPicture}>
          <View style={styles.uploadIcon}>
            <Text style={styles.uploadIconText}>📷</Text>
          </View>
          <View>
            <Text style={styles.uploadTitle}>Scam reporter</Text>
            <Text style={styles.uploadSubtitle}>Upload picture</Text>
          </View>
        </TouchableOpacity>

        {/* Report Button */}
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportButtonIcon}>⚠️</Text>
          <Text style={styles.reportButtonText}>Report</Text>
        </TouchableOpacity>

        {/* Footer Text */}
        <Text style={styles.footerText}>
          Every report helps strengthen our defense against scams in our community.
        </Text>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleGoHome}>
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
        <TouchableOpacity style={styles.navItem} onPress={handleForum}>
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
    marginBottom: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  headerDescription: {
    color: '#aaa',
    fontSize: 18,
    lineHeight: 24,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputHeader: {
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
  inputTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  urlInput: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
  },
  uploadSection: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#e74c3c',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  uploadIconText: {
    fontSize: 20,
  },
  uploadTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  reportButton: {
    backgroundColor: '#e74c3c',
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
  footerText: {
    color: '#e74c3c',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
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
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  activeNavText: {
    color: '#007AFF',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
});