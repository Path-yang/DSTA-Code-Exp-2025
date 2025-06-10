import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function ScamAlertScreen() {
  const handleBack = () => router.push('/(tabs)/scam-detection');
  const handleGoHome = () => router.push('/(tabs)/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/(tabs)/analytics');
  const handleForum = () => router.push('/forum');

  const { confidence, url, details } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;
  const checkedUrl = decodeURIComponent(url as string || '');
  const warningDetails = decodeURIComponent(details as string || '').split(', ').filter(d => d.length > 0);

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
        <View style={[styles.card, { backgroundColor: '#e74c3c' }]}>  
          <Text style={styles.cardTitle}>⚠️ Warning!</Text>
          <Text style={styles.cardSubtitle}>This link appears to be suspicious or potentially harmful. Do not proceed.</Text>
          <Text style={styles.confidenceText}>⚠️ {conf.toFixed(1)}% Risk Level - DANGEROUS</Text>
          
          {checkedUrl && (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Suspicious URL:</Text>
              <Text style={styles.urlText} numberOfLines={3} ellipsizeMode="middle">{checkedUrl}</Text>
            </View>
          )}

          {warningDetails.length > 0 && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Security Issues Detected:</Text>
              {warningDetails.map((detail, index) => (
                <Text key={index} style={styles.detailText}>• {detail}</Text>
              ))}
            </View>
          )}

          <View style={styles.actionContainer}>
            <Text style={styles.actionTitle}>What to do:</Text>
            <Text style={styles.actionText}>• Do NOT click on this link</Text>
            <Text style={styles.actionText}>• Do NOT enter personal information</Text>
            <Text style={styles.actionText}>• Report this to authorities if received via message</Text>
            <Text style={styles.actionText}>• Delete the message containing this link</Text>
          </View>

          <TouchableOpacity style={styles.reportButton} onPress={() => router.push('/(tabs)/report-scam')}>
            <Text style={styles.reportButtonText}>🚩 Report This Scam</Text>
          </TouchableOpacity>
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
  urlText: { color: '#ffebee', fontSize: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 },
  detailsContainer: { marginBottom: 20, width: '100%' },
  detailsTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  detailText: { color: '#ffcdd2', fontSize: 14, marginBottom: 5 },
  actionContainer: { marginBottom: 20, width: '100%' },
  actionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  actionText: { color: '#ffcdd2', fontSize: 14, marginBottom: 5 },
  reportButton: { backgroundColor: '#c62828', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 10 },
  reportButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
}); 