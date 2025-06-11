import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Alert, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Stack } from 'expo-router';

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
      <FontAwesome name={icon as any} size={20} color="#007AFF" style={styles.contentIcon} />
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
            {renderContentItem('envelope', 'Phishing Scams', 'Fraudulent emails, texts, or websites designed to steal personal information')}
            {renderContentItem('dollar', 'Investment Scams', 'Fake investment opportunities promising unrealistic high returns')}
            {renderContentItem('heart', 'Romance Scams', 'Online dating fraud targeting victims emotionally and financially')}
            {renderContentItem('wrench', 'Tech Support Scams', 'Fake technical support calls claiming your device is infected')}
            {renderContentItem('shopping-cart', 'Shopping Scams', 'Fake online stores selling non-existent or counterfeit products')}
            {renderContentItem('briefcase', 'Job Scams', 'Fake job offers requiring upfront payments or personal information')}
            {renderContentItem('trophy', 'Lottery/Prize Scams', 'Fake winnings requiring fees or taxes to claim prizes')}
            {renderContentItem('handshake-o', 'Charity Scams', 'Fake charities exploiting disasters or humanitarian causes')}
          </View>
        );
      case 'howToIdentify':
        return (
          <View>
            {renderContentItem('clock-o', 'Urgent Pressure', 'Scammers create false urgency to rush your decisions')}
            {renderContentItem('star', 'Too Good to Be True', 'Offers that seem unrealistically beneficial or profitable')}
            {renderContentItem('envelope-o', 'Unsolicited Contact', 'Unexpected calls, emails, or messages from unknown sources')}
            {renderContentItem('lock', 'Personal Info Requests', 'Asking for passwords, SSN, or sensitive bank details')}
            {renderContentItem('edit', 'Poor Grammar/Spelling', 'Many scams contain obvious language and spelling errors')}
            {renderContentItem('link', 'Suspicious Links', 'URLs that don\'t match legitimate websites or look altered')}
            {renderContentItem('credit-card', 'Upfront Payments', 'Requests for money before delivering services or goods')}
            {renderContentItem('phone', 'Lack of Verification', 'No official contact information or proper credentials')}
          </View>
        );
      case 'avoidingScams':
        return (
          <View>
            {renderContentItem('check', 'Verify Independently', 'Always verify offers through official channels and websites')}
            {renderContentItem('ban', 'Never Share Personal Info', 'Don\'t give out sensitive information to unknown parties')}
            {renderContentItem('credit-card-alt', 'Use Secure Payment Methods', 'Avoid wire transfers, gift cards, or cryptocurrency payments')}
            {renderContentItem('star-o', 'Check Reviews', 'Research companies and individuals online before engaging')}
            {renderContentItem('lightbulb-o', 'Trust Your Instincts', 'If something feels wrong or suspicious, it probably is')}
            {renderContentItem('refresh', 'Keep Software Updated', 'Use updated antivirus and security software regularly')}
            {renderContentItem('book', 'Educate Yourself', 'Stay informed about current scam tactics and trends')}
            {renderContentItem('exclamation-triangle', 'Report Suspicious Activity', 'Help others by reporting scams to authorities')}
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
      icon: 'exclamation-triangle',
      hasLink: false
    },
    {
      key: 'howToIdentify' as keyof SectionState,
      title: 'How To Identify Scam',
      icon: 'search',
      hasLink: false
    },
    {
      key: 'avoidingScams' as keyof SectionState,
      title: 'Avoiding Scams',
      icon: 'shield',
      hasLink: false
    },
    {
      key: 'readMore' as keyof SectionState,
      title: 'Read More About the Dangers of Scams',
      icon: 'book',
      hasLink: true
    }
  ];

  return (
    <>
      <Stack.Screen
        options={{
          animation: 'none',
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>More Information About Scam</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {sections.map((section) => (
            <View key={section.key} style={styles.sectionContainer}>
              <TouchableOpacity
                style={styles.sectionHeader}
                onPress={() => toggleSection(section.key)}
              >
                <View style={styles.sectionTitleContainer}>
                  <FontAwesome name={section.icon as any} size={24} color="#007AFF" style={styles.sectionIcon} />
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <FontAwesome
                  name={expandedSections[section.key] ? 'chevron-down' : 'chevron-right'}
                  size={18}
                  color="#007AFF"
                />
              </TouchableOpacity>

              {expandedSections[section.key] && (
                <View style={styles.sectionContent}>
                  {renderSectionContent(section.key)}
                  {section.hasLink && (
                    <TouchableOpacity style={styles.linkButton} onPress={handleReadMoreLink}>
                      <View style={styles.linkButtonContent}>
                        <FontAwesome name="external-link" size={16} color="#fff" />
                        <Text style={styles.linkButtonText}>Visit IMDA Website</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 15,
    backgroundColor: '#000',
    position: 'relative'
  },
  backButton: {
    zIndex: 10,
    position: 'relative'
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 15,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 0,
    zIndex: 1
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
    marginRight: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
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
  linkButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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