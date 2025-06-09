import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function GoodNewsScreen() {
  const handleBack = () => router.back();
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  const { confidence } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.title}>Your Results</Text>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#27ae60' }]}>  
          <Text style={styles.cardTitle}>Good news!</Text>
          <Text style={styles.cardSubtitle}>The link you&apos;ve entered is verified and safe to access.</Text>
          <Text style={styles.confidenceText}>Chance of scam website: {conf.toFixed(1)}%</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleGoHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearn}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  backButton: { padding: 5 },
  backText: { color: '#007AFF', fontSize: 16 },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  card: { flex: 1, width: '100%', borderRadius: 12, padding: 20, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  cardTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  cardSubtitle: { color: '#fff', fontSize: 16, textAlign: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
  confidenceText: { color: '#fff', fontSize: 18, marginTop: 10 },
}); 