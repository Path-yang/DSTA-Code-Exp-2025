import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert, Image } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // disabled due to module issue
// import * as ImagePicker from 'expo-image-picker'; // disabled due to missing dependency
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import BackendStatus from '../components/BackendStatus';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';
import authService from '../services/authService';

export default function MyInfoScreen() {
  const { user, isLoggedIn, isGuestMode, logout, loading } = useUser();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({
    scansCompleted: 0,
    threatsDetected: 0,
    reportsSubmitted: 0,
    forumPosts: 0,
    memberSince: 'Guest User'
  });

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        const profileImage = await authService.getProfileImage();
        if (profileImage) {
          setProfileImage(profileImage);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
    
    loadProfileImage();
    
    if (isLoggedIn && !isGuestMode && user?.stats) {
      setUserStats({
        scansCompleted: user.stats.scans_completed,
        threatsDetected: user.stats.threats_detected,
        reportsSubmitted: user.stats.reports_submitted,
        forumPosts: user.stats.forum_posts,
        memberSince: new Date(user.stats.member_since).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long'
        })
      });
    }
  }, [isLoggedIn, isGuestMode, user]);

  const handleLogin = () => {
    router.push('/');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logout();
            router.push('/'); // Redirect to login page
          }
        }
      ]
    );
  };

  const handleGoHome = () => router.push('/(tabs)/scam-detection');
  const handleLearn = () => router.push('/(tabs)/learn');
  const handleAnalytics = () => router.push('/(tabs)/analytics');
  const handleForum = () => router.push('/(tabs)/forum');
  const handleMyInfo = () => { }; // Already here

  const pickImage = async () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose how you would like to update your profile picture',
      [
        {
          text: 'Choose Avatar Icon',
          onPress: () => showAvatarPicker()
        },
        {
          text: 'Enter Image URL',
          onPress: () => showImageURLInput()
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ]
    );
  };

  const showAvatarPicker = () => {
    const avatarOptions = ['user', 'user-circle', 'user-secret', 'shield', 'star', 'heart', 'diamond', 'crown'];
    const buttons = avatarOptions.map(icon => ({
      text: icon,
      onPress: async () => {
        setProfileImage(icon);
        await authService.setProfileImage(icon);
      }
    }));
    buttons.push({
      text: 'Cancel',
      onPress: () => {}
    });
    
    Alert.alert(
      'Select Avatar',
      'Choose an avatar icon',
      buttons
    );
  };

  const showImageURLInput = () => {
    Alert.prompt(
      'Enter Image URL',
      'Paste a URL to your profile image (must be https://)',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Set Image',
          onPress: async (url) => {
            if (url && url.startsWith('https://')) {
              setProfileImage(url);
              await authService.setProfileImage(url);
            } else {
              Alert.alert('Invalid URL', 'Please enter a valid HTTPS URL');
            }
          }
        }
      ],
      'plain-text',
      '',
      'url'
    );
  };

  const renderStatCard = (title: string, value: string | number, icon: string) => (
    <View style={styles.statCard}>
      <FontAwesome name={icon as any} size={32} color="#007AFF" style={styles.statIcon} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderActionItem = (icon: string, title: string, subtitle: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <FontAwesome name={icon as any} size={24} color="#007AFF" style={styles.actionIcon} />
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <FontAwesome name="chevron-right" size={16} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Information</Text>
          <View style={styles.headerRight}>
            <BackendStatus style={styles.backendStatus} />
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
            {profileImage && !isGuestMode ? (
              typeof profileImage === 'string' && profileImage.startsWith('http') ? (
                <Image source={{ uri: profileImage }} style={styles.avatarImage} />
              ) : (
                <FontAwesome
                  name={profileImage as any}
                  size={80}
                  color="#007AFF"
                />
              )
            ) : (
              <FontAwesome
                name={isGuestMode ? 'user' : 'user-circle'}
                size={80}
                color="#007AFF"
              />
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>
            {isGuestMode ? 'Guest User' : user?.name || 'User'}
          </Text>
          <Text style={styles.userEmail}>
            {isGuestMode ? 'Not logged in' : user?.email || 'user@example.com'}
          </Text>
          {!isGuestMode && (
            <Text style={styles.memberSince}>
              Member since: {userStats.memberSince}
            </Text>
          )}
        </View>

        {/* Guest Stats Section */}
        {isGuestMode && (
          <View style={styles.statsSection}>
            <View style={styles.sectionTitleContainer}>
              <FontAwesome name="bar-chart" size={20} color="#007AFF" />
              <Text style={styles.sectionTitle}>Guest Activity</Text>
            </View>
            <View style={styles.statsGrid}>
              {renderStatCard('Scans Completed', 'Login to track', 'search')}
              {renderStatCard('Threats Detected', 'Login to track', 'exclamation-triangle')}
              {renderStatCard('Reports Submitted', 'Login to track', 'flag')}
              {renderStatCard('Forum Posts', 'Login to track', 'comments')}
            </View>
          </View>
        )}

        {/* Authentication Section */}
        {isGuestMode ? (
          <View style={styles.authSection}>
            <View style={styles.sectionTitleContainer}>
              <FontAwesome name="lock" size={20} color="#007AFF" />
              <Text style={styles.authTitle}>Join Our Community</Text>
            </View>
            <Text style={styles.authSubtitle}>
              Sign up to access advanced features, save your scan history, and participate in community discussions.
            </Text>
            <TouchableOpacity style={styles.guestLoginButton} onPress={handleLogin}>
              <FontAwesome name="key" size={20} color="#fff" style={styles.guestLoginIcon} />
              <Text style={styles.guestLoginText}>Login to Your Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* User Stats */}
            <View style={styles.statsSection}>
              <View style={styles.sectionTitleContainer}>
                <FontAwesome name="bar-chart" size={20} color="#007AFF" />
                <Text style={styles.sectionTitle}>Your Activity</Text>
              </View>
              <View style={styles.statsGrid}>
                {renderStatCard('Scans Completed', userStats.scansCompleted, 'search')}
                {renderStatCard('Threats Detected', userStats.threatsDetected, 'exclamation-triangle')}
                {renderStatCard('Reports Submitted', userStats.reportsSubmitted, 'flag')}
                {renderStatCard('Forum Posts', userStats.forumPosts, 'comments')}
              </View>
            </View>

            {/* Account Actions */}
            <View style={styles.actionsSection}>
              <View style={styles.sectionTitleContainer}>
                <FontAwesome name="cog" size={20} color="#007AFF" />
                <Text style={styles.sectionTitle}>Account Settings</Text>
              </View>
              {renderActionItem('bell', 'Notifications', 'Manage your notification preferences', () => { })}
              {renderActionItem('lock', 'Privacy & Security', 'Update password and privacy settings', () => { })}
              {renderActionItem('bar-chart', 'Data & Analytics', 'View your personal analytics and data', () => { })}
              {renderActionItem('question-circle', 'Help & Support', 'Get help and contact support', () => { })}

              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <View style={styles.logoutButtonContent}>
                  <FontAwesome name="sign-out" size={16} color="#fff" />
                  <Text style={styles.logoutText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      {/* Enhanced Bottom Navigation */}
      <EnhancedBottomNav
        onTabPress={(tabId) => {
          switch (tabId) {
            case 'home':
              handleGoHome();
              break;
            case 'learn':
              handleLearn();
              break;
            case 'analytics':
              handleAnalytics();
              break;
            case 'forum':
              handleForum();
              break;
            case 'myInfo':
              handleMyInfo();
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  userEmail: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 5,
  },
  memberSince: {
    color: '#666',
    fontSize: 14,
  },
  authSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  authTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
  authSubtitle: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
  },
  statIcon: {
    marginBottom: 10,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statTitle: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
  actionsSection: {
    marginBottom: 30,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  actionArrow: {
    color: '#666',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  backendStatus: {
    marginRight: 10,
  },
  guestLoginButton: {
    backgroundColor: '#666',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestLoginIcon: {
    marginRight: 10,
  },
  guestLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 