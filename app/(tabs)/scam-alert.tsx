import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function ScamAlertScreen() {
  const handleBack = () => router.push('/scam-detection');
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
        <View style={[styles.card, { backgroundColor: '#e74c3c' }]}>
          <Text style={styles.cardTitle}>Scam Alert</Text>
          <Text style={styles.cardSubtitle}>Unsafe Link Detected</Text>
          <Text style={styles.cardDescription}>This link is likely to be suspicious and may lead to a scam website.</Text>
          <TouchableOpacity style={styles.detailsButton} onPress={() => { }}>
            <Text style={styles.detailsText}>Details {'>>'}</Text>
          </TouchableOpacity>
          <Text style={styles.confidenceText}>Chance of scam website: {conf.toFixed(1)}%</Text>
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
  detailsButton: { marginTop: 15, alignSelf: 'flex-end' },
  detailsText: { color: '#fff', fontSize: 14, textDecorationLine: 'underline' },
  confidenceText: { color: '#fff', fontSize: 18, marginTop: 10 },
}); 