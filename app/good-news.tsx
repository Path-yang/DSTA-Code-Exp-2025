import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function GoodNewsScreen() {
  const handleBack = () => router.push('/(tabs)/scam-detection');
  const handleGoHome = () => router.push('/(tabs)/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/(tabs)/analytics');
  const handleForum = () => router.push('/forum');

  const { confidence, url } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;
  const checkedUrl = decodeURIComponent(url as string || '');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[styles.header, { justifyContent: 'flex-start', paddingVertical: 15 }] }>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { marginLeft: 10 }]}>Your Results</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#27ae60' }]}>  
          <Text style={styles.cardTitle}>Good news!</Text>
          <Text style={styles.cardSubtitle}>The link you&apos;ve entered is verified and safe to access.</Text>
          <Text style={styles.confidenceText}>✅ {conf.toFixed(1)}% Confidence - SAFE WEBSITE</Text>
          {checkedUrl && (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Checked URL:</Text>
              <Text style={styles.urlText} numberOfLines={3} ellipsizeMode="middle">{checkedUrl}</Text>
            </View>
          )}
          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Safety Tips:</Text>
            <Text style={styles.tipText}>• Always verify the sender before clicking links</Text>
            <Text style={styles.tipText}>• Look for HTTPS and official domain names</Text>
            <Text style={styles.tipText}>• Be cautious with shortened URLs</Text>
          </View>
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
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' },
  title: { color: '#fff', fontSize: 28, fontWeight: 'bold' },
  backButton: { padding: 5 },
  backText: { color: '#007AFF', fontSize: 16 },
  content: { flexGrow: 1, paddingHorizontal: 20 },
  card: { flex: 1, width: '100%', borderRadius: 12, padding: 20, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
  cardTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  cardSubtitle: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 15 },
  confidenceText: { color: '#fff', fontSize: 18, marginBottom: 20, fontWeight: '600' },
  urlContainer: { marginBottom: 20, width: '100%' },
  urlLabel: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  urlText: { color: '#d4edda', fontSize: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 },
  tipsContainer: { width: '100%' },
  tipsTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  tipText: { color: '#d4edda', fontSize: 14, marginBottom: 5 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
}); 