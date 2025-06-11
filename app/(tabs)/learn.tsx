import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { FontAwesome } from '@expo/vector-icons';
import EnhancedBottomNav from '../../components/EnhancedBottomNav';

export default function LearnScreen() {
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  const topics = [
    { label: 'Webinars', route: '/webinars' },
    { label: 'Chat with Experts', route: '/chat-with-experts' },
    { label: 'Victim Recovery Toolkit', route: '/victim-recovery-toolkit' },
    { label: 'Augmented Reality', route: '/augmented-reality' },
    { label: 'Reality Mode', route: '/reality-mode-intro' },
    { label: 'More Information About Scam', route: '/more-information-about-scam' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Learning About Scams</Text>
          <IconSymbol size={60} name="shield.fill" color="#e74c3c" />
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => router.push(topic.route as any)}
          >
            <Text style={styles.listText}>{topic.label}</Text>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => router.push('/help-and-hotline' as any)}
        >
          <Text style={styles.helpButtonText}>Click Here If you need HELP</Text>
        </TouchableOpacity>
      </ScrollView>
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  listText: {
    color: '#fff',
    fontSize: 16,
  },
  arrow: {
    color: '#888',
    fontSize: 16,
  },
  helpButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  preventionLabel: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
}); 