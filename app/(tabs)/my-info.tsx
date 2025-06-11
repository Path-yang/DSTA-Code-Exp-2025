import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { useUser } from '../context/UserContext';
import BackendStatus from '../components/BackendStatus';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';

export default function MyInfoScreen() {
  const { user, isLoggedIn, isGuestMode, logout, loading } = useUser();
  const [userStats, setUserStats] = useState({
    scansCompleted: 0,
    threatsDetected: 0,
    reportsSubmitted: 0,
    forumPosts: 0,
    memberSince: 'Guest User'
  });

  useEffect(() => {
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
    router.push('/(tabs)/register');
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
  const handleMyInfo = () => {}; // Already here

  const renderStatCard = (title: string, value: string | number, icon: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statIcon}>{icon}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );

  const renderActionItem = (icon: string, title: string, subtitle: string, onPress: () => void) => (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      <Text style={styles.actionIcon}>{icon}</Text>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.actionArrow}>{'>'}</Text>
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
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {isGuestMode ? '👤' : user?.profile?.avatar || '👨‍💻'}
            </Text>
          </View>
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
            <Text style={styles.sectionTitle}>📊 Guest Activity</Text>
            <View style={styles.statsGrid}>
              {renderStatCard('Scans Completed', 'Login to track', '🔍')}
              {renderStatCard('Threats Detected', 'Login to track', '⚠️')}
              {renderStatCard('Reports Submitted', 'Login to track', '🚩')}
              {renderStatCard('Forum Posts', 'Login to track', '💬')}
            </View>
          </View>
        )}

        {/* Authentication Section */}
        {isGuestMode ? (
          <View style={styles.authSection}>
            <Text style={styles.authTitle}>🔐 Join Our Community</Text>
            <Text style={styles.authSubtitle}>
              Sign up to access advanced features, save your scan history, and participate in community discussions.
            </Text>
            <TouchableOpacity style={styles.guestLoginButton} onPress={handleLogin}>
              <Text style={styles.guestLoginIcon}>🔑</Text>
              <Text style={styles.guestLoginText}>Login to Your Account</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* User Stats */}
            <View style={styles.statsSection}>
              <Text style={styles.sectionTitle}>📊 Your Activity</Text>
              <View style={styles.statsGrid}>
                {renderStatCard('Scans Completed', userStats.scansCompleted, '🔍')}
                {renderStatCard('Threats Detected', userStats.threatsDetected, '⚠️')}
                {renderStatCard('Reports Submitted', userStats.reportsSubmitted, '🚩')}
                {renderStatCard('Forum Posts', userStats.forumPosts, '💬')}
              </View>
            </View>

            {/* Account Actions */}
            <View style={styles.actionsSection}>
              <Text style={styles.sectionTitle}>⚙️ Account Settings</Text>
              {renderActionItem('🔔', 'Notifications', 'Manage your notification preferences', () => {})}
              {renderActionItem('🔒', 'Privacy & Security', 'Update password and privacy settings', () => {})}
              {renderActionItem('📊', 'Data & Analytics', 'View your personal analytics and data', () => {})}
              {renderActionItem('❓', 'Help & Support', 'Get help and contact support', () => {})}
              
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>🚪 Logout</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarText: {
    fontSize: 40,
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
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
    fontSize: 32,
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
    fontSize: 24,
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
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 20,
    marginRight: 10,
  },
  guestLoginText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 