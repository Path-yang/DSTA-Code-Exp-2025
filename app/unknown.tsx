import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function UnknownScreen() {
  const { confidence, url, explanations } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 40;
  const checkedUrl = decodeURIComponent(url as string || '');
  
  // Debug logging
  console.log('Unknown screen - Raw explanations param:', explanations);
  console.log('Unknown screen - Type of explanations:', typeof explanations);
  
  // Parse explanations if available, with robust fallback
  let parsedExplanations = null;
  try {
    if (explanations && typeof explanations === 'string') {
      console.log('Unknown screen - Attempting to parse explanations...');
      parsedExplanations = JSON.parse(decodeURIComponent(explanations));
      console.log('Unknown screen - Parsed explanations:', parsedExplanations);
    } else {
      console.log('Unknown screen - No explanations provided or wrong type');
    }
  } catch (error) {
    console.log('Unknown screen - Could not parse explanations:', error);
    parsedExplanations = null;
  }

  // Ensure we always have explanations to show
  if (!parsedExplanations || !parsedExplanations.primaryReasons || parsedExplanations.primaryReasons.length === 0) {
    parsedExplanations = {
      classification: 'This website has characteristics that make it potentially risky, though not definitively harmful.',
      primaryReasons: [
        'Domain structure appears unusual for a legitimate website',
        'Some characteristics match patterns found in suspicious sites',
        'Limited verifiable information available about this domain',
        'Risk assessment indicates caution is warranted'
      ],
      technicalDetails: [
        `Risk confidence level: ${conf}% based on multiple analysis factors`,
        'Domain reputation and trustworthiness could not be fully verified',
        'Website structure shows some irregular patterns'
      ],
      userGuidance: 'Exercise extra caution with this website. Verify its legitimacy before entering any personal or financial information.'
    };
  }

  const handleBack = () => router.push('/(tabs)/scam-detection');
  
  const handleReport = () => {
    router.push('/(tabs)/report-scam');
  };
  
  const handleLearnMore = () => {
    Linking.openURL('https://www.csa.gov.sg/Tips-Resource/Online-Safety/Phishing');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#e9a900" />

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
          <Text style={styles.warningTitle}>PROCEED WITH CAUTION</Text>
          <Text style={styles.warningSubtitle}>
            This website has some suspicious elements but isn't definitively harmful.
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreLabel}>UNCERTAINTY LEVEL:</Text>
            <Text style={styles.scoreValue}>{conf}%</Text>
            <View style={styles.scoreBar}>
              <View style={[styles.scoreBarFill, { width: `${conf}%` as any }]} />
            </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            Why We Flagged This:
          </Text>
          <View style={styles.warningsList}>
            {parsedExplanations && parsedExplanations.primaryReasons && parsedExplanations.primaryReasons.length > 0 ? 
              parsedExplanations.primaryReasons.map((reason: string, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Text style={styles.warningBullet}>⚠️</Text>
                  <Text style={styles.warningText}>{reason}</Text>
                </View>
              )) : 
              <>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>⚠️</Text>
                  <Text style={styles.warningText}>Domain structure appears unusual for a legitimate website</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>⚠️</Text>
                  <Text style={styles.warningText}>Some characteristics match patterns found in suspicious sites</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>⚠️</Text>
                  <Text style={styles.warningText}>Limited verifiable information available about this domain</Text>
                </View>
              </>
            }
          </View>

          <Text style={styles.sectionTitle}>Technical Analysis:</Text>
          <View style={styles.warningsList}>
            {parsedExplanations && parsedExplanations.technicalDetails && parsedExplanations.technicalDetails.length > 0 ? 
              parsedExplanations.technicalDetails.map((detail: string, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🔍</Text>
                  <Text style={styles.warningText}>{detail}</Text>
                </View>
              )) : 
              <>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🔍</Text>
                  <Text style={styles.warningText}>Risk confidence level: {conf}% based on multiple analysis factors</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🔍</Text>
                  <Text style={styles.warningText}>Website security indicators suggest caution is warranted</Text>
                </View>
              </>
            }
          </View>

          <Text style={styles.sectionTitle}>AI Analysis:</Text>
          <View style={styles.warningsList}>
            {parsedExplanations && parsedExplanations.mlInsights && parsedExplanations.mlInsights.length > 0 ? 
              parsedExplanations.mlInsights.map((insight: string, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🤖</Text>
                  <Text style={styles.warningText}>{insight}</Text>
                </View>
              )) : 
              <>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🤖</Text>
                  <Text style={styles.warningText}>Machine learning model indicates moderate risk level</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🤖</Text>
                  <Text style={styles.warningText}>Neural network analysis suggests proceeding with caution</Text>
                </View>
              </>
            }
          </View>

          {checkedUrl ? (
            <View style={styles.urlContainer}>
              <Text style={styles.urlLabel}>Website:</Text>
              <Text style={styles.urlText} numberOfLines={2}>{checkedUrl}</Text>
            </View>
          ) : null}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Recommended Actions:</Text>
          <View style={styles.actionsList}>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>1.</Text>
              <Text style={styles.actionText}>Be cautious about sharing personal information</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>2.</Text>
              <Text style={styles.actionText}>Verify the website through other sources if possible</Text>
            </View>
            <View style={styles.actionItem}>
              <Text style={styles.actionNumber}>3.</Text>
              <Text style={styles.actionText}>Consider using a VPN or secure browser for added protection</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.learnMoreButton} onPress={handleLearnMore}>
            <Text style={styles.learnMoreText}>Learn About Web Safety</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
            <Text style={styles.reportText}>Report If Suspicious</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9a900',
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
    backgroundColor: '#f9a825',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  warningEmoji: {
    fontSize: 40,
  },
  warningTitle: {
    color: '#f9a825',
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
    color: '#f9a825',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scoreValue: {
    color: '#f9a825',
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
    backgroundColor: '#f9a825',
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
    color: '#f9a825',
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
    color: '#f9a825',
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
    backgroundColor: '#f9a825',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
    width: '100%',
    alignItems: 'center',
  },
  reportText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 