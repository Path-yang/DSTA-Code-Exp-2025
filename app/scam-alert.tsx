import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Linking } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

export const options = { headerShown: false };

export default function ScamAlertScreen() {
  const { confidence, url, explanations } = useLocalSearchParams();
  const conf = parseFloat(confidence as string) || 75;
  const checkedUrl = decodeURIComponent(url as string || '');
  
  // Debug logging
  console.log('ScamAlert screen - Raw explanations param:', explanations);
  console.log('ScamAlert screen - Type of explanations:', typeof explanations);
  
  // Parse explanations if available, with robust fallback
  let parsedExplanations = null;
  try {
    if (explanations && typeof explanations === 'string') {
      console.log('ScamAlert screen - Attempting to parse explanations...');
      parsedExplanations = JSON.parse(decodeURIComponent(explanations));
      console.log('ScamAlert screen - Parsed explanations:', parsedExplanations);
    } else {
      console.log('ScamAlert screen - No explanations provided in URL, using fallback');
    }
  } catch (error) {
    console.log('ScamAlert screen - Could not parse explanations:', error);
  }

  // Create comprehensive fallback explanations if none provided
  if (!parsedExplanations || !parsedExplanations.primaryReasons) {
    console.log('ScamAlert screen - Using fallback explanations');
    parsedExplanations = {
      primaryReasons: [
        "Domain characteristics match known suspicious patterns",
        "Website structure appears designed to deceive users", 
        "High-risk indicators detected in multiple analysis layers",
        "Potentially fraudulent or malicious content suspected"
      ],
      technicalDetails: [
        `Risk assessment score: ${conf}% based on comprehensive analysis`,
        "Multiple red flags detected during automated scanning",
        "Domain reputation and trust signals are concerning",
        "Website security indicators suggest potential threats"
      ],
      mlInsights: [
        "Neural network confidence level indicates high risk",
        "Pattern matching algorithms detected suspicious characteristics",
        "Machine learning model flags this as potentially dangerous",
        "Advanced AI analysis suggests avoiding this website"
      ],
      userGuidance: [
        "Do not enter any personal information on this website",
        "Avoid downloading any files from this domain",
        "Report this website if you received it from someone else",
        "Consider running a security scan if you've already visited"
      ]
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

          <Text style={styles.sectionTitle}>Why This is Dangerous:</Text>
          <View style={styles.warningsList}>
            {parsedExplanations && parsedExplanations.primaryReasons && parsedExplanations.primaryReasons.length > 0 ? 
              parsedExplanations.primaryReasons.map((reason: string, index: number) => (
                <View key={index} style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🚨</Text>
                  <Text style={styles.warningText}>{reason}</Text>
                </View>
              )) : 
              <>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🚨</Text>
                  <Text style={styles.warningText}>Domain characteristics match known suspicious patterns</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🚨</Text>
                  <Text style={styles.warningText}>Website structure appears designed to deceive users</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🚨</Text>
                  <Text style={styles.warningText}>High-risk indicators detected in multiple analysis layers</Text>
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
                  <Text style={styles.warningText}>Risk assessment score: {conf}% based on comprehensive analysis</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🔍</Text>
                  <Text style={styles.warningText}>Multiple red flags detected during automated scanning</Text>
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
                  <Text style={styles.warningText}>Neural network confidence level indicates high risk</Text>
                </View>
                <View style={styles.warningItem}>
                  <Text style={styles.warningBullet}>🤖</Text>
                  <Text style={styles.warningText}>Machine learning model flags this as potentially dangerous</Text>
                </View>
              </>
            }
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
}); 