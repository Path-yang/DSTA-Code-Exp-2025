import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Image, Alert } from 'react-native';
import { router } from 'expo-router';

export default function WebinarsScreen() {
  const [selectedDate, setSelectedDate] = useState('Today');

  const handleBack = () => router.push('/learn');
  const handleGoHome = () => router.push('/scam-detection');
  const handleLearn = () => router.push('/learn');
  const handleAnalytics = () => router.push('/analytics');
  const handleForum = () => router.push('/forum');

  const dateOptions = ['Today', 'This Week', 'This Month', 'Last 6 Months', 'All Time'];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const showDatePicker = () => {
    const buttons = [
      ...dateOptions.map(option => ({
        text: option,
        onPress: () => handleDateSelect(option)
      })),
      {
        text: "Cancel",
        style: "cancel" as const
      }
    ];

    Alert.alert(
      "Filter by Date",
      "Select a time period to filter recorded webinars:",
      buttons
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={styles.backText}>{'< Back'}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.headerTitle}>Webinars by cybersecurity experts</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
        indicatorStyle="white"
      >
        <Text style={styles.description}>
          Join live webinars led by cybersecurity experts, and access recorded sessions for practical advice on emerging threats.
        </Text>
        <Text style={styles.sectionTitle}>Live Webinars</Text>
        <Image source={require('@/assets/images/live webinar.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* TODO: Link to live stream */ }}>
          <Text style={styles.actionButtonText}>Watch Live</Text>
        </TouchableOpacity>

        <View style={styles.recordedHeader}>
          <Text style={styles.sectionTitle}>Recorded Webinars</Text>
          <View style={styles.datePickerContainer}>
            <Text style={styles.dateLabel}>Filter by:</Text>
            <TouchableOpacity style={styles.datePicker} onPress={showDatePicker}>
              <Text style={styles.datePickerText}>{selectedDate}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image source={require('@/assets/images/cybersec-webinar-article.jpg')} style={styles.image} />
        <TouchableOpacity style={styles.actionButton} onPress={() => {/* TODO: Open recordings */ }}>
          <Text style={styles.actionButtonText}>View Recordings</Text>
        </TouchableOpacity>

        {/* Extra spacing to ensure content is fully scrollable */}
        <View style={styles.extraSpacing} />
      </ScrollView>
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={handleGoHome}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleLearn}>
          <Text style={[styles.navIcon, styles.activeNavText]}>📚</Text>
          <Text style={[styles.navText, styles.activeNavText]}>Learn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={handleAnalytics}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={styles.navText}>Stats</Text>
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
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingHorizontal: 20, paddingVertical: 15 },
  backText: { color: '#007AFF', fontSize: 16 },
  titleContainer: { paddingHorizontal: 20, paddingBottom: 10 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center' },
  content: { paddingHorizontal: 20, paddingBottom: 200 },
  description: { color: '#aaa', fontSize: 16, textAlign: 'center', marginTop: 20 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
  navItem: { alignItems: 'center' },
  activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
  navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
  navText: { color: '#fff', fontSize: 12 },
  activeNavText: { color: '#007AFF' },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 20, marginBottom: 10 },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  actionButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  actionButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  recordedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateLabel: {
    color: '#aaa',
    fontSize: 14,
    marginRight: 8
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444'
  },
  datePickerText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 8
  },
  dropdownArrow: {
    color: '#007AFF',
    fontSize: 12
  },
  extraSpacing: {
    height: 50
  },
}); 