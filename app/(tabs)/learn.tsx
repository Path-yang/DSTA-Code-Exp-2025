import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function LearnScreen() {
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  const topics = [
    { label: 'What is a scam' },
    { label: 'Common Types of Scam' },
    { label: 'How To Identify Scam' },
    { label: 'Avoiding Scams' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning About Scams</Text>
        <IconSymbol size={60} name="shield.fill" color="#e74c3c" />
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {topics.map((topic, index) => (
          <TouchableOpacity
            key={index}
            style={styles.listItem}
            onPress={() => {
              if (topic.label === 'What is a scam') {
                router.push('/what-is-scam' as any);
              } else if (topic.label === 'Common Types of Scam') {
                router.push('/common-types-of-scam' as any);
              } else if (topic.label === 'How To Identify Scam') {
                router.push('/how-to-identify-scams' as any);
              } else if (topic.label === 'Avoiding Scams') {
                router.push('/avoiding-scams' as any);
              }
            }}
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
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleLearn}>
          <Text style={[styles.navIcon, styles.activeNavText]}>📚</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleAnalytics}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Stats</Text>
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
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
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
    color: '#fff',
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  activeNavText: {
    color: '#007AFF',
  },
}); 