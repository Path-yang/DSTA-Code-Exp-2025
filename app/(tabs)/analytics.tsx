import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AnalyticsScreen() {
  const navigation = useNavigation();

  const handleGoHome = () => navigation.navigate('scam-detection' as never);
  const handleLearn = () => navigation.navigate('explore' as never);
  const handleAnalytics = () => {
    // Already on Analytics
  };
  const handleForum = () => navigation.navigate('forum' as never);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true} indicatorStyle="white">
        {/* Date selector & toggles */}
        <View style={styles.selectorContainer}>
          <View style={styles.dateSelector}>
            <Text style={styles.dateIcon}>📅</Text>
            <TouchableOpacity><Text style={styles.arrow}>{'<'}</Text></TouchableOpacity>
            <Text style={styles.dateText}>01 Nov 18 – 01 Aug 2019</Text>
            <TouchableOpacity><Text style={styles.arrow}>{'>'}</Text></TouchableOpacity>
          </View>
          <View style={styles.toggleContainer}>
            <TouchableOpacity style={styles.toggleActive}>
              <Text style={styles.toggleTextActive}>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.toggle}>
              <Text style={styles.toggleText}>Month</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Total Scams */}
        <Text style={[styles.sectionTitle, {marginBottom: 20}]}>Total Scams</Text>
        <View style={styles.chartWrapper}>
          <Image source={require('@/assets/images/total-scams.png')} style={styles.chartImage1} />
        </View>

        {/* Scam Type Breakdown */}
        <Text style={[styles.sectionTitle, {marginBottom: 0}]}>Scam Type Breakdown</Text>
        <View style={[styles.chartWrapper, {marginTop: -10}]}>
          <Image source={require('@/assets/images/types-of-scams.png')} style={styles.chartImage2} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleLearn}>
          <Text style={styles.navIcon}>📚</Text>
          <Text style={styles.navText}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleAnalytics}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Analytics</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleForum}>
          <Text style={styles.navIcon}>💬</Text>
          <Text style={styles.navText}>Forum</Text>
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  dateIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  arrow: {
    color: '#fff',
    fontSize: 16,
    marginHorizontal: 6,
  },
  dateText: {
    color: '#fff',
    fontSize: 14,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginLeft: 10,
  },
  toggleActive: {
    borderWidth: 1,
    borderColor: '#4a9eff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggle: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  toggleTextActive: {
    color: '#4a9eff',
    fontSize: 14,
  },
  toggleText: {
    color: '#fff',
    fontSize: 14,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  chartWrapper: {
    alignItems: 'center',
    marginBottom: 30,
  },
  chartImage1: {
    width: 350,
    height: 180,
    resizeMode: 'contain',
  },
  chartImage2: {
    width: 350,
    height: 280,
    resizeMode: 'contain',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  navText: {
    color: '#fff',
    fontSize: 12,
  },
  activeNavText: {
    color: '#007AFF',
  },
}); 