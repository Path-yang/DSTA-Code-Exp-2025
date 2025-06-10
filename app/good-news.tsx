import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function GoodNewsScreen() {
  const { confidence, url } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 15;
  const checkedUrl = decodeURIComponent(url as string || '');

  const handleBack = () => router.push('/(tabs)/scam-detection');
  
  const handleLearnMore = () => {
    Linking.openURL('https://www.csa.gov.sg/Tips-Resource/Online-Safety/Online-Safety-for-Everyone');
  };

  const handleVisitWebsite = () => {
    if (checkedUrl) {
      let visitUrl = checkedUrl;
      if (!visitUrl.startsWith('http://') && !visitUrl.startsWith('https://')) {
        visitUrl = 'https://' + visitUrl;
      }
      Linking.openURL(visitUrl);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#30c940" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.resultCard}>
          <View style={styles.safeSign}>
            <Text style={styles.safeEmoji}>✅</Text>
          </View>
          <Text style={styles.safeTitle}>SAFE WEBSITE</Text>
          <Text style={styles.safeSubtitle}>
            We've determined this website appears to be safe to visit.
          </Text>

          {checkedUrl ? (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Website:</Text>
              <Text style={styles.urlText} numberOfLines={2}>{checkedUrl}</Text>
            </View>
          ) : null}

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>CONFIDENCE:</Text>
            <Text style={styles.scoreValue}>{conf}%</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${100 - conf}%` as any }]} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Safe Indicators:</Text>
          <View style={styles.indicatorsList}>
            <View style={styles.indicatorItem}>
              <Text style={styles.indicatorBullet}>•</Text>
              <Text style={styles.indicatorText}>No suspicious patterns detected</Text>
            </View>
            <View style={styles.indicatorItem}>
              <Text style={styles.indicatorBullet}>•</Text>
              <Text style={styles.indicatorText}>Proper secure connection (HTTPS)</Text>
            </View>
            <View style={styles.indicatorItem}>
              <Text style={styles.indicatorBullet}>•</Text>
              <Text style={styles.indicatorText}>Not flagged in security databases</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Good Practices:</Text>
          <View style={styles.practicesList}>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceNumber}>1.</Text>
              <Text style={styles.practiceText}>Still avoid sharing sensitive information unnecessarily</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceNumber}>2.</Text>
              <Text style={styles.practiceText}>Be cautious with downloads from any website</Text>
            </View>
            <View style={styles.practiceItem}>
              <Text style={styles.practiceNumber}>3.</Text>
              <Text style={styles.practiceText}>Report if you encounter suspicious content</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
            <Text style={styles.learnMoreText}>Web Safety Tips</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.visitButton} onPress={handleVisitWebsite}>
            <Text style={styles.visitText}>Visit Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#30c940',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    padding: 15,
    paddingBottom: 30,
  },
  resultCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  safeSign: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34c759',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  safeEmoji: {
    fontSize: 40,
  },
  safeTitle: {
    color: '#34c759',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  safeSubtitle: {
    color: '#f8f8f8',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  urlContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    marginBottom: 20,
  },
  urlLabel: {
    color: '#8e8e93',
    fontSize: 14,
    marginBottom: 4,
  },
  urlText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'monospace',
  },
  scoreContainer: {
    width: '100%',
    marginBottom: 24,
  },
  scoreLabel: {
    color: '#34c759',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#34c759',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#34c759',
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#2a2a2a',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#333',
    marginVertical: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  indicatorsList: {
    alignSelf: 'stretch',
  },
  indicatorItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  indicatorBullet: {
    color: '#34c759',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  indicatorText: {
    color: '#f8f8f8',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  practicesList: {
    alignSelf: 'stretch',
  },
  practiceItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  practiceNumber: {
    color: '#34c759',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  practiceText: {
    color: '#f8f8f8',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  learnMoreButton: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  learnMoreText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  visitButton: {
    backgroundColor: '#34c759',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  visitText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 