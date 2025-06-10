import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function UnknownScreen() {
  const handleBack = () => router.push('/(tabs)/scam-detection');
  const handleGoHome = () => router.push('/(tabs)/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/(tabs)/analytics');
  const handleForum = () => router.push('/forum');

  const { confidence, url, details } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;
  const checkedUrl = decodeURIComponent(url as string || '');
  const warningDetails = details ? decodeURIComponent(details as string || '').split(', ').filter(d => d.length > 0) : [];

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
        <View style={[styles.card, { backgroundColor: '#f39c12' }]}>  
          <Text style={styles.cardTitle}>⚠️ Proceed with Caution</Text>
          <Text style={styles.cardSubtitle}>We cannot determine if this link is safe or harmful. Exercise caution before proceeding.</Text>
          <Text style={styles.confidenceText}>⚠️ {conf.toFixed(1)}% Uncertainty - PROCEED WITH CAUTION</Text>
          
          {checkedUrl && (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Checked URL:</Text>
              <Text style={styles.urlText} numberOfLines={3} ellipsizeMode="middle">{checkedUrl}</Text>
            </View>
          )}

          {warningDetails.length > 0 && (
            <View style={styles.detailsContainer}>
              <Text style={styles.detailsTitle}>Issues Found:</Text>
              {warningDetails.map((detail, index) => (
                <Text key={index} style={styles.detailText}>• {detail}</Text>
              ))}
            </View>
          )}

          <View style={styles.cautionContainer}>
            <Text style={styles.cautionTitle}>Safety Recommendations:</Text>
            <Text style={styles.cautionText}>• Verify the source before clicking</Text>
            <Text style={styles.cautionText}>• Check if the sender is legitimate</Text>
            <Text style={styles.cautionText}>• Look for spelling errors in the URL</Text>
            <Text style={styles.cautionText}>• Do not enter sensitive information</Text>
            <Text style={styles.cautionText}>• When in doubt, don't click</Text>
          </View>

          <View style={styles.tipsContainer}>
            <Text style={styles.tipsTitle}>Additional Checks:</Text>
            <Text style={styles.tipText}>• Hover over the link to see the full URL</Text>
            <Text style={styles.tipText}>• Search for the website independently</Text>
            <Text style={styles.tipText}>• Ask someone tech-savvy for help</Text>
            <Text style={styles.tipText}>• Contact the organization directly</Text>
          </View>

          <TouchableOpacity style={styles.reportButton} onPress={() => router.push('/(tabs)/report-scam')}>
            <Text style={styles.reportButtonText}>🚩 Report if Suspicious</Text>
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
  urlText: { color: '#fef9e7', fontSize: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: 8 },
  detailsContainer: { marginBottom: 20, width: '100%' },
  detailsTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  detailText: { color: '#fdeaa7', fontSize: 14, marginBottom: 5 },
  cautionContainer: { marginBottom: 20, width: '100%' },
  cautionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  cautionText: { color: '#fdeaa7', fontSize: 14, marginBottom: 5 },
  tipsContainer: { marginBottom: 20, width: '100%' },
  tipsTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 10 },
  tipText: { color: '#fdeaa7', fontSize: 14, marginBottom: 5 },
  reportButton: { backgroundColor: '#e67e22', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 10 },
  reportButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
}); 