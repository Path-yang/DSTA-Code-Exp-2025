import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export const options = { headerShown: false };

export default function ScamAlertScreen() {
  const handleBack = () => router.push('/scam-detection');
  const { confidence, details, sources } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;
  const detailsArray = details ? JSON.parse(decodeURIComponent(details as string)) : [];
  const sourcesObj = sources ? JSON.parse(decodeURIComponent(sources as string)) : {};

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
        <View style={[styles.card, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.cardTitle}>Scam Alert</Text>
          <Text style={styles.cardSubtitle}>Dangerous Link Detected</Text>
          <Text style={styles.cardDescription}>This link is highly likely to be malicious and dangerous to visit.</Text>
          <Text style={styles.confidenceText}>Chance of scam website: {conf.toFixed(1)}%</Text>
          
          {detailsArray.length > 0 && (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Why is this dangerous?</Text>
              {detailsArray.map((detail: string, index: number) => (
                <View key={index} style={styles.explanationItem}>
                  <FontAwesome name="exclamation-triangle" size={14} color="#fff" style={styles.warningIcon} />
                  <Text style={styles.explanationText}>{detail}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.warningSection}>
            <Text style={styles.warningTitle}>⚠️ STRONG WARNING ⚠️</Text>
            <Text style={styles.warningText}>• DO NOT enter personal information</Text>
            <Text style={styles.warningText}>• DO NOT download any files</Text>
            <Text style={styles.warningText}>• DO NOT enter login credentials</Text>
            <Text style={styles.warningText}>• Close this website immediately</Text>
            <Text style={styles.warningText}>• Report this to authorities if needed</Text>
          </View>
        </View>
      </ScrollView>
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
  cardTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  cardSubtitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 10 },
  cardDescription: { color: '#fff', fontSize: 16, textAlign: 'center' },
  confidenceText: { color: '#fff', fontSize: 18, marginTop: 10 },
  explanationSection: { marginTop: 20, width: '100%' },
  explanationTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  explanationItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 10 },
  warningIcon: { marginRight: 8 },
  explanationText: { color: '#fff', fontSize: 14, flex: 1, textAlign: 'left' },
  warningSection: { marginTop: 20, width: '100%', backgroundColor: 'rgba(255,0,0,0.2)', padding: 15, borderRadius: 8 },
  warningTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  warningText: { color: '#fff', fontSize: 14, marginBottom: 4, textAlign: 'left' },
}); 