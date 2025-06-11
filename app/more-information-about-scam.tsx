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

  const sections = [
    {
      key: 'commonTypes' as keyof SectionState,
      title: 'Common Types of Scams',
      icon: '⚠️',
      content: `• **Phishing Scams**: Fraudulent emails, texts, or websites designed to steal personal information
• **Investment Scams**: Fake investment opportunities promising high returns
• **Romance Scams**: Online dating fraud targeting victims emotionally
• **Tech Support Scams**: Fake technical support calls claiming your device is infected
• **Shopping Scams**: Fake online stores selling non-existent products
• **Job Scams**: Fake job offers requiring upfront payments
• **Lottery/Prize Scams**: Fake winnings requiring fees to claim prizes
• **Charity Scams**: Fake charities exploiting disasters or causes`
    },
    {
      key: 'howToIdentify' as keyof SectionState,
      title: 'How To Identify Scam',
      icon: '🔍',
      content: `• **Urgent Pressure**: Scammers create false urgency to rush decisions
• **Too Good to Be True**: Offers that seem unrealistically beneficial
• **Unsolicited Contact**: Unexpected calls, emails, or messages
• **Request for Personal Info**: Asking for passwords, SSN, or bank details
• **Poor Grammar/Spelling**: Many scams contain obvious language errors
• **Suspicious Links**: URLs that don't match legitimate websites
• **Upfront Payments**: Requests for money before services/goods
• **Lack of Verification**: No official contact information or credentials`
    },
    {
      key: 'avoidingScams' as keyof SectionState,
      title: 'Avoiding Scams',
      icon: '🛡️',
      content: `• **Verify Independently**: Always verify offers through official channels
• **Never Share Personal Info**: Don't give out sensitive information
• **Use Secure Payment Methods**: Avoid wire transfers or gift cards
• **Check Reviews**: Research companies and individuals online
• **Trust Your Instincts**: If something feels wrong, it probably is
• **Keep Software Updated**: Use updated antivirus and security software
• **Educate Yourself**: Stay informed about current scam tactics
• **Report Suspicious Activity**: Help others by reporting scams to authorities`
    },
    {
      key: 'readMore' as keyof SectionState,
      title: 'Read More About the Dangers of Scams',
      icon: '📚',
      content: 'Get comprehensive information about scam prevention and protection from the official IMDA website.',
      hasLink: true
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
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
                <Text style={styles.sectionIcon}>{section.icon}</Text>
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <Text style={styles.expandIcon}>
                {expandedSections[section.key] ? '▼' : '▶'}
              </Text>
            </TouchableOpacity>
            
            {expandedSections[section.key] && (
              <View style={styles.sectionContent}>
                <Text style={styles.sectionText}>{section.content}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
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
}); 