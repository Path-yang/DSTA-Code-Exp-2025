import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  isExpanded: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  title,
  description,
  isExpanded,
  onToggle,
  children
}) => (
  <TouchableOpacity style={styles.card} onPress={onToggle}>
    <View style={styles.cardHeader}>
      <View style={styles.iconContainer}>
        <Text style={styles.cardIcon}>{icon}</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
      <IconSymbol
        name={isExpanded ? 'chevron.up' : 'chevron.down'}
        size={20}
        color="#8E8E93"
      />
    </View>
    {isExpanded && (
      <View style={styles.expandedContent}>
        {children}
      </View>
    )}
  </TouchableOpacity>
);

const ChecklistItem: React.FC<{ children: React.ReactNode; urgent?: boolean }> = ({
  children,
  urgent = false
}) => (
  <View style={styles.checklistItem}>
    <View style={[styles.checkbox, urgent && styles.urgentCheckbox]}>
      <Text style={styles.checkboxText}>✓</Text>
    </View>
    <Text style={[styles.checklistText, urgent && styles.urgentText]}>{children}</Text>
  </View>
);

const ResourceLink: React.FC<{ title: string; description: string }> = ({
  title,
  description
}) => (
  <View style={styles.resourceLink}>
    <Text style={styles.resourceTitle}>{title}</Text>
    <Text style={styles.resourceDescription}>{description}</Text>
  </View>
);

export default function VictimRecoveryToolkit() {
  const [expandedCards, setExpandedCards] = useState<{ [key: string]: boolean }>({});

  const toggleCard = (cardId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleGoBack = () => router.push('/learn');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Recovery Toolkit</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.subtitle}>
            If you've been scammed, take immediate action to protect yourself and begin recovery.
          </Text>

          {/* Immediate Actions */}
          <ActionCard
            icon="🚨"
            title="Immediate Actions"
            description="Stop further damage right now"
            isExpanded={expandedCards.immediate}
            onToggle={() => toggleCard('immediate')}
          >
            <ChecklistItem urgent>Contact your bank to freeze accounts</ChecklistItem>
            <ChecklistItem urgent>Cancel all compromised cards</ChecklistItem>
            <ChecklistItem urgent>Change all passwords immediately</ChecklistItem>
            <ChecklistItem>Screenshot all evidence and communications</ChecklistItem>
            <ChecklistItem>Document transaction details and amounts</ChecklistItem>
          </ActionCard>

          {/* Financial Protection */}
          <ActionCard
            icon="💳"
            title="Financial Recovery"
            description="Secure your money and credit"
            isExpanded={expandedCards.financial}
            onToggle={() => toggleCard('financial')}
          >
            <Text style={styles.sectionSubtitle}>Dispute & Recovery:</Text>
            <ChecklistItem>File fraud reports with your bank</ChecklistItem>
            <ChecklistItem>Submit chargeback requests for card transactions</ChecklistItem>
            <ChecklistItem>Complete fraud affidavits if required</ChecklistItem>

            <Text style={styles.sectionSubtitle}>Credit Protection:</Text>
            <ChecklistItem>Place fraud alerts on credit reports</ChecklistItem>
            <ChecklistItem>Consider freezing your credit</ChecklistItem>
            <ChecklistItem>Monitor for unauthorized accounts</ChecklistItem>
          </ActionCard>

          {/* Identity Security */}
          <ActionCard
            icon="🔐"
            title="Identity Protection"
            description="Secure your personal information"
            isExpanded={expandedCards.identity}
            onToggle={() => toggleCard('identity')}
          >
            <ChecklistItem>Enable 2FA on all important accounts</ChecklistItem>
            <ChecklistItem>Check for data breaches (haveibeenpwned.com)</ChecklistItem>
            <ChecklistItem>Monitor credit reports regularly</ChecklistItem>
            <ChecklistItem>Replace compromised IDs or documents</ChecklistItem>
            <ChecklistItem>Update security questions and recovery info</ChecklistItem>
          </ActionCard>

          {/* Emotional Support */}
          <ActionCard
            icon="💚"
            title="Emotional Recovery"
            description="Take care of your mental health"
            isExpanded={expandedCards.emotional}
            onToggle={() => toggleCard('emotional')}
          >
            <ResourceLink
              title="Crisis Support"
              description="National Suicide Prevention Lifeline: 988"
            />
            <ResourceLink
              title="Scam Support Groups"
              description="Connect with other survivors online"
            />
            <ChecklistItem>Remember: This isn't your fault</ChecklistItem>
            <ChecklistItem>Consider professional counseling</ChecklistItem>
            <ChecklistItem>Practice self-compassion and patience</ChecklistItem>
          </ActionCard>

          {/* Legal Steps */}
          <ActionCard
            icon="⚖️"
            title="Legal Options"
            description="Know your rights and options"
            isExpanded={expandedCards.legal}
            onToggle={() => toggleCard('legal')}
          >
            <ResourceLink
              title="FTC Fraud Reporting"
              description="File official complaints at IdentityTheft.gov"
            />
            <ChecklistItem>Report to local law enforcement</ChecklistItem>
            <ChecklistItem>Consult a lawyer for significant losses</ChecklistItem>
            <ChecklistItem>Consider small claims court if scammer is known</ChecklistItem>
            <ChecklistItem>Keep detailed records of all reports filed</ChecklistItem>
          </ActionCard>

          {/* Prevention Education */}
          <ActionCard
            icon="🛡️"
            title="Future Prevention"
            description="Protect yourself going forward"
            isExpanded={expandedCards.prevention}
            onToggle={() => toggleCard('prevention')}
          >
            <Text style={styles.sectionSubtitle}>Red Flags to Watch:</Text>
            <ChecklistItem>Urgent demands for immediate action</ChecklistItem>
            <ChecklistItem>Requests for gift cards or wire transfers</ChecklistItem>
            <ChecklistItem>Too-good-to-be-true offers</ChecklistItem>
            <ChecklistItem>Pressure to keep secrets or not verify</ChecklistItem>

            <Text style={styles.sectionSubtitle}>Safe Practices:</Text>
            <ChecklistItem>Always verify contacts independently</ChecklistItem>
            <ChecklistItem>Never give personal info to unsolicited contacts</ChecklistItem>
          </ActionCard>

          {/* Emergency Helpline */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Text style={styles.emergencyIcon}>📞</Text>
              <Text style={styles.emergencyTitle}>Need Immediate Help?</Text>
            </View>
            <Text style={styles.emergencyText}>
              If you're in crisis or need immediate support
            </Text>
            <View style={styles.helplineContainer}>
              <Text style={styles.helplineNumber}>Police hotline: 999</Text>
              <Text style={styles.helplineNumber}>ScamShield helpline: 1799</Text>
            </View>
          </View>
        </View>
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
    backgroundColor: '#000',
  },
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: '#aaa',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardIcon: {
    fontSize: 20,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  expandedContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 16,
    marginBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#30D158',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  urgentCheckbox: {
    backgroundColor: '#FF453A',
  },
  checkboxText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checklistText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#FFFFFF',
    flex: 1,
  },
  urgentText: {
    fontWeight: '500',
  },
  resourceLink: {
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  emergencyCard: {
    backgroundColor: '#FF453A',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emergencyText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
    opacity: 0.9,
  },
  helplineContainer: {
    gap: 8,
  },
  helplineNumber: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});