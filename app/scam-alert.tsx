import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function ScamAlertScreen() {
  const { confidence, url } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 75;
  const checkedUrl = decodeURIComponent(url as string || '');

  const handleBack = () => router.push('/(tabs)/scam-detection');
  
  const handleReport = () => {
    router.push('/(tabs)/report-scam');
  };
  
  const handleLearnMore = () => {
    Linking.openURL('https://www.csa.gov.sg/Tips-Resource/Online-Safety/Phishing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#d10000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your Results</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.resultCard}>
          <View style={styles.warningSign}>
            <Text style={styles.warningEmoji}>⚠️</Text>
          </View>
          <Text style={styles.warningTitle}>DANGEROUS WEBSITE</Text>
          <Text style={styles.warningSubtitle}>
            We've detected this website is likely fraudulent or malicious.
          </Text>

          {checkedUrl ? (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Website:</Text>
              <Text style={styles.urlText} numberOfLines={2}>{checkedUrl}</Text>
            </View>
          ) : null}

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>RISK LEVEL:</Text>
            <Text style={styles.scoreValue}>{conf}%</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${conf}%` as any }]} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Warning Signs:</Text>
          <View style={styles.warningsList}>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>This website has been flagged as potentially dangerous</Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>It may attempt to steal your personal information</Text>
            </View>
            <View style={styles.warningItem}>
              <Text style={styles.warningBullet}>•</Text>
              <Text style={styles.warningText}>Could contain malware or other harmful content</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Recommended Actions:</Text>
          <View style={styles.actionsList}>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>1.</Text>
              <Text style={styles.actionText}>Avoid visiting this website</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>2.</Text>
              <Text style={styles.actionText}>Do not enter any personal information</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>3.</Text>
              <Text style={styles.actionText}>If you received this link, report it to the sender's platform</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
            <Text style={styles.learnMoreText}>Learn About Phishing</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Text style={styles.reportText}>Report This Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleBack}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearnMore}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleReport}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d10000',
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
  warningSign: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningEmoji: {
    fontSize: 40,
  },
  warningTitle: {
    color: '#ff3b30',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  warningSubtitle: {
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
    color: '#ff3b30',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#ff3b30',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreBar: {
    height: 10,
    width: '100%',
    backgroundColor: '#2a2a2a',
    borderRadius: 5,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    backgroundColor: '#ff3b30',
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
  warningsList: {
    alignSelf: 'stretch',
  },
  warningItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  warningBullet: {
    color: '#ff3b30',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#f8f8f8',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
  actionsList: {
    alignSelf: 'stretch',
  },
  actionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  actionNumber: {
    color: '#ff3b30',
    fontSize: 16,
    marginRight: 8,
    fontWeight: 'bold',
  },
  actionText: {
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
  reportButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  reportText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
}); 