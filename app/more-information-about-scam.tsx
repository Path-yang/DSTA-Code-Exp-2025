import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert, Linking } from 'react-native';
import { router } from 'expo-router';

interface SectionState {
  commonTypes: boolean;
  howToIdentify: boolean;
  avoidingScams: boolean;
  readMore: boolean;
}

export default function MoreInformationAboutScamScreen() {
  const [expandedSections, setExpandedSections] = useState<SectionState>({
    commonTypes: false,
    howToIdentify: false,
    avoidingScams: false,
    readMore: false,
  });

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleReadMoreLink = () => {
    Alert.alert(
      "Open IMDA Website",
      "You'll be redirected to the official IMDA site to learn more about scam prevention.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Proceed",
          onPress: () => Linking.openURL('https://www.imda.gov.sg/how-we-can-help/anti-scam-measures#:~:text=Learn%20about%20the%20different%20scam,6pm%2C%20excluding%20Public%20Holidays)')
        }
      ]
    );
  };

  const renderContentItem = (icon: string, title: string, description: string) => (
    <View style={styles.contentItem}>
      <Text style={styles.contentIcon}>{icon}</Text>
      <View style={styles.contentTextContainer}>
        <Text style={styles.contentTitle}>{title}</Text>
        <Text style={styles.contentDescription}>{description}</Text>
      </View>
    </View>
  );

  const renderSectionContent = (sectionKey: keyof SectionState) => {
    switch (sectionKey) {
      case 'commonTypes':
        return (
          <View>
            {renderContentItem('🎣', 'Phishing Scams', 'Fraudulent emails, texts, or websites designed to steal personal information')}
            {renderContentItem('💰', 'Investment Scams', 'Fake investment opportunities promising unrealistic high returns')}
            {renderContentItem('💕', 'Romance Scams', 'Online dating fraud targeting victims emotionally and financially')}
            {renderContentItem('🔧', 'Tech Support Scams', 'Fake technical support calls claiming your device is infected')}
            {renderContentItem('🛒', 'Shopping Scams', 'Fake online stores selling non-existent or counterfeit products')}
            {renderContentItem('💼', 'Job Scams', 'Fake job offers requiring upfront payments or personal information')}
            {renderContentItem('🎰', 'Lottery/Prize Scams', 'Fake winnings requiring fees or taxes to claim prizes')}
            {renderContentItem('🤲', 'Charity Scams', 'Fake charities exploiting disasters or humanitarian causes')}
          </View>
        );
      case 'howToIdentify':
        return (
          <View>
            {renderContentItem('⏰', 'Urgent Pressure', 'Scammers create false urgency to rush your decisions')}
            {renderContentItem('🌟', 'Too Good to Be True', 'Offers that seem unrealistically beneficial or profitable')}
            {renderContentItem('📧', 'Unsolicited Contact', 'Unexpected calls, emails, or messages from unknown sources')}
            {renderContentItem('🔐', 'Personal Info Requests', 'Asking for passwords, SSN, or sensitive bank details')}
            {renderContentItem('✍️', 'Poor Grammar/Spelling', 'Many scams contain obvious language and spelling errors')}
            {renderContentItem('🔗', 'Suspicious Links', 'URLs that don\'t match legitimate websites or look altered')}
            {renderContentItem('💳', 'Upfront Payments', 'Requests for money before delivering services or goods')}
            {renderContentItem('📞', 'Lack of Verification', 'No official contact information or proper credentials')}
          </View>
        );
      case 'avoidingScams':
        return (
          <View>
            {renderContentItem('✅', 'Verify Independently', 'Always verify offers through official channels and websites')}
            {renderContentItem('🚫', 'Never Share Personal Info', 'Don\'t give out sensitive information to unknown parties')}
            {renderContentItem('💳', 'Use Secure Payment Methods', 'Avoid wire transfers, gift cards, or cryptocurrency payments')}
            {renderContentItem('⭐', 'Check Reviews', 'Research companies and individuals online before engaging')}
            {renderContentItem('🤔', 'Trust Your Instincts', 'If something feels wrong or suspicious, it probably is')}
            {renderContentItem('🔄', 'Keep Software Updated', 'Use updated antivirus and security software regularly')}
            {renderContentItem('📚', 'Educate Yourself', 'Stay informed about current scam tactics and trends')}
            {renderContentItem('🚨', 'Report Suspicious Activity', 'Help others by reporting scams to authorities')}
          </View>
        );
      case 'readMore':
        return (
          <Text style={styles.sectionText}>
            Get comprehensive information about scam prevention and protection from the official IMDA website.
          </Text>
        );
      default:
        return null;
    }
  };

  const sections = [
    {
      key: 'commonTypes' as keyof SectionState,
      title: 'Common Types of Scams',
      icon: '⚠️',
      hasLink: false
    },
    {
      key: 'howToIdentify' as keyof SectionState,
      title: 'How To Identify Scam',
      icon: '🔍',
      hasLink: false
    },
    {
      key: 'avoidingScams' as keyof SectionState,
      title: 'Avoiding Scams',
      icon: '🛡️',
      hasLink: false
    },
    {
      key: 'readMore' as keyof SectionState,
      title: 'Read More About the Dangers of Scams',
      icon: '📚',
      hasLink: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>More Information About Scam</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.key} style={styles.sectionContainer}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.key)}
            >
              <View style={styles.sectionTitleContainer}>
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSections[section.key] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {expandedSections[section.key] && (
              <View style={styles.sectionContent}>
                {renderSectionContent(section.key)}
                {section.hasLink && (
                  <TouchableOpacity style={styles.linkButton} onPress={handleReadMoreLink}>
                    <Text style={styles.linkButtonText}>🔗 Visit IMDA Website</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  sectionContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  expandIcon: {
    color: '#007AFF',
    fontSize: 18,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  sectionText: {
    color: '#ccc',
    fontSize: 16,
    lineHeight: 24,
  },
  linkButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 12,
    marginTop: 15,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  contentIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  contentTextContainer: {
    flex: 1,
  },
  contentTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contentDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
}); 