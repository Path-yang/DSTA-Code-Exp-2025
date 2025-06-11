import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export const options = { headerShown: false };

export default function UnknownScreen() {
  const { confidence, details, sources } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 0;
  const detailsArray = details ? JSON.parse(decodeURIComponent(details as string)) : [];
  const sourcesObj = sources ? JSON.parse(decodeURIComponent(sources as string)) : {};
  
  const handleBack = () => router.push('/scam-detection');

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
        <View style={[styles.card, { backgroundColor: '#f1c40f' }]}>
          <Text style={styles.cardTitle}>Unknown</Text>
          <Text style={styles.cardSubtitle}>Suspicious Link Detected</Text>
          <Text style={styles.cardDescription}>This link appears to be suspicious and may lead to a scam website.</Text>
          <Text style={styles.confidenceText}>Chance of scam website: {conf.toFixed(1)}%</Text>
          
          {detailsArray.length > 0 && (
            <View style={styles.explanationSection}>
              <Text style={styles.explanationTitle}>Why is this suspicious?</Text>
              {detailsArray.map((detail: string, index: number) => (
                <View key={index} style={styles.explanationItem}>
                  <FontAwesome name="warning" size={14} color="#fff" style={styles.warningIcon} />
                  <Text style={styles.explanationText}>{detail}</Text>
                </View>
              ))}
            </View>
          )}
          
          <View style={styles.recommendationSection}>
            <Text style={styles.recommendationTitle}>Our Recommendation:</Text>
            <Text style={styles.recommendationText}>• Avoid entering personal information</Text>
            <Text style={styles.recommendationText}>• Do not download files from this site</Text>
            <Text style={styles.recommendationText}>• Verify the website URL carefully</Text>
            <Text style={styles.recommendationText}>• Consider using official websites instead</Text>
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
  confidenceText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  explanationSection: { marginTop: 20, width: '100%' },
  explanationTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  explanationItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 10 },
  warningIcon: { marginRight: 8 },
  explanationText: { color: '#fff', fontSize: 14, flex: 1, textAlign: 'left' },
  recommendationSection: { marginTop: 20, width: '100%' },
  recommendationTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  recommendationText: { color: '#fff', fontSize: 14, marginBottom: 4, textAlign: 'left' },
}); 