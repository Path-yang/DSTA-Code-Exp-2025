import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export const options = { headerShown: false };

export default function GoodNewsScreen() {
  const handleBack = () => router.push('/scam-detection');
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  const { confidence } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={[styles.header, { justifyContent: 'flex-start', paddingVertical: 15 }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { marginLeft: 10 }]}>Your Results</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: '#27ae60' }]}>
          <Text style={styles.cardTitle}>Good news!</Text>
          <Text style={styles.cardSubtitle}>The link you&apos;ve entered is verified and safe to access.</Text>
          <Text style={styles.confidenceText}>Chance of scam website: {conf.toFixed(1)}%</Text>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoHome}>
          <FontAwesome name="home" size={20} color="#fff" style={styles.navIcon} />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearn}>
          <FontAwesome name="book" size={20} color="#fff" style={styles.navIcon} />
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleAnalytics}>
          <FontAwesome name="bar-chart" size={20} color="#fff" style={styles.navIcon} />
          <Text style={styles.navText}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleForum}>
          <FontAwesome name="comments" size={20} color="#fff" style={styles.navIcon} />
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
  cardSubtitle: { color: '#fff', fontSize: 16, textAlign: 'center' },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { marginBottom: 5 },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
  confidenceText: { color: '#fff', fontSize: 18, marginTop: 10 },
}); 