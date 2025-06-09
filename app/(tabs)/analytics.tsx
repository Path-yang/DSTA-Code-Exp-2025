
import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ScamStats {
  totalScamsDetected: number;
  totalScamsReported: number;
  regionStats: {
    region: string;
    count: number;
    percentage: number;
  }[];
  timeStats: {
    period: string;
    count: number;
  }[];
  scamTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
  recentTrends: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
}

export default function AnalyticsScreen() {
  const navigation = useNavigation();
  const [stats, setStats] = useState<ScamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month'>('week');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://dsta-code-exp-2025.onrender.com/analytics?period=${timeRange}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Fallback to mock data if API fails
      setStats(getMockStats());
    } finally {
      setLoading(false);
    }
  };

  const getMockStats = (): ScamStats => ({
    totalScamsDetected: 1247,
    totalScamsReported: 89,
    regionStats: [
      { region: 'Central', count: 456, percentage: 36.6 },
      { region: 'East', count: 298, percentage: 23.9 },
      { region: 'West', count: 267, percentage: 21.4 },
      { region: 'North', count: 156, percentage: 12.5 },
      { region: 'Northeast', count: 70, percentage: 5.6 }
    ],
    timeStats: [
      { period: 'Mon', count: 178 },
      { period: 'Tue', count: 165 },
      { period: 'Wed', count: 201 },
      { period: 'Thu', count: 189 },
      { period: 'Fri', count: 234 },
      { period: 'Sat', count: 156 },
      { period: 'Sun', count: 124 }
    ],
    scamTypes: [
      { type: 'Phishing', count: 498, percentage: 39.9 },
      { type: 'Investment', count: 312, percentage: 25.0 },
      { type: 'Job Scam', count: 187, percentage: 15.0 },
      { type: 'Romance', count: 125, percentage: 10.0 },
      { type: 'Parcel', count: 87, percentage: 7.0 },
      { type: 'Others', count: 38, percentage: 3.1 }
    ],
    recentTrends: {
      direction: 'up',
      percentage: 12.5
    }
  });

  const handleGoHome = () => navigation.navigate('scam-detection' as never);
  const handleLearn = () => navigation.navigate('explore' as never);
  const handleAnalytics = () => {
    // Already on Analytics
  };
  const handleForum = () => navigation.navigate('forum' as never);

  const renderStatCard = (title: string, value: string, subtitle: string, trend?: { direction: 'up' | 'down' | 'stable'; percentage: number }) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      <View style={styles.statFooter}>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
        {trend && (
          <Text style={[styles.trendText, { color: trend.direction === 'up' ? '#e74c3c' : trend.direction === 'down' ? '#27ae60' : '#95a5a6' }]}>
            {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'} {trend.percentage}%
          </Text>
        )}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#000" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading analytics...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scam Analytics</Text>
        <Text style={styles.headerSubtitle}>Real-time scam detection insights</Text>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={true} indicatorStyle="white">
        
        {/* Time Range Selector */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggle, timeRange === 'week' && styles.toggleActive]}
            onPress={() => setTimeRange('week')}
          >
            <Text style={[styles.toggleText, timeRange === 'week' && styles.toggleTextActive]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggle, timeRange === 'month' && styles.toggleActive]}
            onPress={() => setTimeRange('month')}
          >
            <Text style={[styles.toggleText, timeRange === 'month' && styles.toggleTextActive]}>Month</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={styles.statsGrid}>
          {renderStatCard(
            "Scams Detected", 
            stats?.totalScamsDetected.toLocaleString() || "0", 
            "This " + timeRange,
            stats?.recentTrends
          )}
          {renderStatCard(
            "User Reports", 
            stats?.totalScamsReported.toString() || "0", 
            "Community contributed"
          )}
        </View>

        {/* Regional Breakdown */}
        <Text style={styles.sectionTitle}>Regional Distribution</Text>
        <View style={styles.chartContainer}>
          {stats?.regionStats.map((region, index) => (
            <View key={region.region} style={styles.barContainer}>
              <Text style={styles.barLabel}>{region.region}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${region.percentage}%` }]} />
              </View>
              <Text style={styles.barValue}>{region.count}</Text>
            </View>
          ))}
        </View>

        {/* Scam Types */}
        <Text style={styles.sectionTitle}>Scam Types</Text>
        <View style={styles.typesContainer}>
          {stats?.scamTypes.map((type, index) => (
            <View key={type.type} style={styles.typeItem}>
              <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(index) }]} />
              <View style={styles.typeContent}>
                <Text style={styles.typeName}>{type.type}</Text>
                <Text style={styles.typeCount}>{type.count} cases ({type.percentage}%)</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Trend */}
        <Text style={styles.sectionTitle}>Detection Trend</Text>
        <View style={styles.trendContainer}>
          {stats?.timeStats.map((day, index) => (
            <View key={day.period} style={styles.trendDay}>
              <View style={[styles.trendBar, { height: `${(day.count / Math.max(...(stats?.timeStats.map(d => d.count) || [1]))) * 100}%` }]} />
              <Text style={styles.trendLabel}>{day.period}</Text>
              <Text style={styles.trendValue}>{day.count}</Text>
            </View>
          ))}
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

const getTypeColor = (index: number) => {
  const colors = ['#e74c3c', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#95a5a6'];
  return colors[index % colors.length];
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
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
  headerSubtitle: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
    alignSelf: 'center',
  },
  toggleActive: {
    borderWidth: 1,
    borderColor: '#4a9eff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  toggle: {
    borderWidth: 1,
    borderColor: '#555',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  toggleTextActive: {
    color: '#4a9eff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleText: {
    color: '#aaa',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  statTitle: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
  },
  statValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statSubtitle: {
    color: '#666',
    fontSize: 11,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  chartContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  barLabel: {
    color: '#fff',
    fontSize: 14,
    width: 70,
  },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#333',
    borderRadius: 4,
    marginHorizontal: 10,
  },
  barFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 4,
  },
  barValue: {
    color: '#aaa',
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  typesContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  typeContent: {
    flex: 1,
  },
  typeName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  typeCount: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 2,
  },
  trendContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    marginBottom: 30,
  },
  trendDay: {
    alignItems: 'center',
    flex: 1,
  },
  trendBar: {
    backgroundColor: '#007AFF',
    width: 20,
    borderRadius: 2,
    marginBottom: 8,
    minHeight: 4,
  },
  trendLabel: {
    color: '#aaa',
    fontSize: 10,
    marginBottom: 2,
  },
  trendValue: {
    color: '#fff',
    fontSize: 9,
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
