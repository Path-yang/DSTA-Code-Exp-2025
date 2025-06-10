import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function WebsiteNotFound() {
  const { url, reason } = useLocalSearchParams();
  const displayUrl = Array.isArray(url) ? url[0] : url || 'unknown';
  const displayReason = Array.isArray(reason) ? reason[0] : reason || 'Website does not exist';

  const handleBackHome = () => {
    router.replace('/');
  };

  const handleTryAgain = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#9ca3af" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Results</Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Main Result Card */}
          <View style={styles.resultCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="globe-outline" size={48} color="#9ca3af" />
            </View>
            
            <Text style={styles.resultTitle}>Website Not Found</Text>
            <Text style={styles.resultSubtitle}>
              The website you entered does not exist or is currently not accessible.
            </Text>

            {/* Status Indicator */}
            <View style={styles.statusContainer}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
              <Text style={styles.statusText}>Website Does Not Exist</Text>
            </View>

            {/* URL Display */}
            <View style={styles.urlSection}>
              <Text style={styles.sectionTitle}>Entered URL:</Text>
              <View style={styles.urlContainer}>
                <Text style={styles.urlText}>{displayUrl}</Text>
              </View>
            </View>

            {/* Issue Details */}
            <View style={styles.detailsSection}>
              <Text style={styles.sectionTitle}>Issue Detected:</Text>
              <Text style={styles.detailText}>• {displayReason}</Text>
            </View>

            {/* Possible Causes */}
            <View style={styles.causesSection}>
              <Text style={styles.sectionTitle}>Possible Causes:</Text>
              <Text style={styles.causeText}>• Website address is misspelled</Text>
              <Text style={styles.causeText}>• Website is temporarily offline</Text>
              <Text style={styles.causeText}>• Domain has expired or been suspended</Text>
              <Text style={styles.causeText}>• Website has been permanently removed</Text>
              <Text style={styles.causeText}>• Invalid or incomplete web address</Text>
            </View>

            {/* Recommendations */}
            <View style={styles.recommendationsSection}>
              <Text style={styles.sectionTitle}>What You Can Do:</Text>
              <Text style={styles.recommendationText}>• Double-check the spelling of the URL</Text>
              <Text style={styles.recommendationText}>• Try adding "www." if it's missing</Text>
              <Text style={styles.recommendationText}>• Verify the URL from the original source</Text>
              <Text style={styles.recommendationText}>• Search for the website name instead</Text>
              <Text style={styles.recommendationText}>• Contact the organization if you need support</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleTryAgain}>
              <Ionicons name="refresh" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleBackHome}>
              <Ionicons name="home" size={20} color="#9ca3af" />
              <Text style={styles.secondaryButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(156, 163, 175, 0.2)',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#9ca3af',
    fontSize: 16,
    marginLeft: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 20,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultCard: {
    backgroundColor: 'rgba(75, 85, 99, 0.8)',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  iconContainer: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#d1d5db',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  statusText: {
    color: '#fecaca',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  urlSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  urlContainer: {
    backgroundColor: 'rgba(55, 65, 81, 0.8)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.3)',
  },
  urlText: {
    color: '#e5e7eb',
    fontSize: 14,
    fontFamily: 'monospace',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailText: {
    color: '#d1d5db',
    fontSize: 14,
    lineHeight: 20,
  },
  causesSection: {
    marginBottom: 24,
  },
  causeText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 4,
  },
  recommendationsSection: {
    marginBottom: 8,
  },
  recommendationText: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 4,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: '#6b7280',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(156, 163, 175, 0.5)',
  },
  secondaryButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 