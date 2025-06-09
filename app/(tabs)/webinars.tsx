import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';

export default function WebinarsScreen() {
  const handleBack = () => router.push('/learn');
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Webinars by cybersecurity experts</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Join live webinars led by cybersecurity experts, and access recorded sessions for practical advice on emerging threats.
        </Text>
        <Text style={styles.sectionTitle}>Live Webinars</Text>
        <Image source={require('@/assets/images/live webinar.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* TODO: Link to live stream */}}>
          <Text style={styles.actionButtonText}>Watch Live</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Recorded Webinars</Text>
        <Image source={require('@/assets/images/cybersec-webinar-article.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* TODO: Open recordings */}}>
          <Text style={styles.actionButtonText}>View Recordings</Text>
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
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backText: { color: '#007AFF', fontSize: 16, marginRight: 10 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  description: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  actionButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
}); 