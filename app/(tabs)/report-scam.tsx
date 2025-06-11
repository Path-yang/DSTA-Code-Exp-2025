import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';
import { FontAwesome } from '@expo/vector-icons';

export default function ReportScamScreen() {
  const [urlInput, setUrlInput] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const { isGuestMode } = useUser();
  const urlInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  const handleReport = () => {
    if (urlInput.trim()) {
      Alert.alert(
        'Thank you!',
        'Your report has been submitted and will help protect the community.',
        [{
          text: 'OK',
          onPress: () => {
            setUrlInput('');
            // Show second popup about victim recovery
            Alert.alert(
              'Learn more about victim recovery?',
              '',
              [
                {
                  text: 'No',
                  onPress: () => router.push('/scam-detection')
                },
                {
                  text: 'Yes',
                  onPress: () => router.push('/victim-recovery-toolkit')
                }
              ]
            );
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.content,
              isKeyboardVisible && styles.contentWithKeyboard
            ]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            scrollEnabled={isKeyboardVisible}
          >
            {/* Combined Reporter Section */}
            <View style={styles.reporterContainer}>
              {/* URL Input Section */}
              <View style={styles.inputSection}>
                <View style={styles.inputHeader}>
                  <View style={styles.warningIcon}>
                    <FontAwesome name="exclamation-triangle" size={20} color="#fff" />
                  </View>
                  <View>
                    <Text style={styles.inputTitle}>Scam reporter</Text>
                    <Text style={styles.inputSubtitle}>Enter URL</Text>
                  </View>
                </View>

                <TextInput
                  ref={urlInputRef}
                  style={styles.urlInput}
                  value={urlInput}
                  onChangeText={setUrlInput}
                  placeholder="Type Here . . ."
                  placeholderTextColor="#666"
                  multiline={false}
                  autoComplete="off"
                  autoCorrect={true}
                  autoCapitalize="sentences"
                  textContentType="none"
                  secureTextEntry={false}
                  onSubmitEditing={() => {
                    urlInputRef.current?.blur();
                    Keyboard.dismiss();
                  }}
                  blurOnSubmit={true}
                />
              </View>

              {/* Upload Picture Section */}
              <TouchableOpacity style={styles.uploadSection} onPress={handleUploadPicture}>
                <View style={styles.uploadIcon}>
                  <FontAwesome name="camera" size={20} color="#fff" />
                </View>
                <View>
                  <Text style={styles.uploadSubtitle}>Upload picture</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Report Button */}
            <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
              <FontAwesome name="flag" size={18} color="#fff" style={styles.reportButtonIcon} />
              <Text style={styles.reportButtonText}>Report</Text>
            </TouchableOpacity>

            {/* Footer Text */}
            <Text style={styles.footerText}>
              Every report helps strengthen our defense against scams in our community.
            </Text>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView >
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contentWithKeyboard: {
    paddingBottom: 300,
  },
  reporterContainer: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
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
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 15,
    color: '#fff',
    fontSize: 16,
    height: 50,
  },
  uploadSection: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 15,
    marginBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
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

  uploadTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  uploadSubtitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
  footerText: {
    color: '#e74c3c',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
});