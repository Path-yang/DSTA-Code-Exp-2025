import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface ScamStats {
  totalScamsDetected: number;
  totalScamsReported: number;
  totalBlocked: number;
  accuracy: number;
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
  hourlyActivity: {
    hour: string;
    count: number;
  }[];
  topTargets: {
    demographic: string;
    count: number;
    percentage: number;
  }[];
  preventionStats: {
    warningsSent: number;
    linksBlocked: number;
    reportsProcessed: number;
    falsePositives: number;
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
    totalScamsDetected: 287,
    totalScamsReported: 23,
    totalBlocked: 195,
    accuracy: 91.2,
    regionStats: [
      { region: 'Central', count: 89, percentage: 31.0 },
      { region: 'West', count: 67, percentage: 23.3 },
      { region: 'East', count: 58, percentage: 20.2 },
      { region: 'North', count: 44, percentage: 15.3 },
      { region: 'Northeast', count: 29, percentage: 10.1 }
    ],
    timeStats: [
      { period: 'Mon', count: 34 },
      { period: 'Tue', count: 42 },
      { period: 'Wed', count: 56 },
      { period: 'Thu', count: 38 },
      { period: 'Fri', count: 61 },
      { period: 'Sat', count: 31 },
      { period: 'Sun', count: 25 }
    ],
    scamTypes: [
      { type: 'Phishing', count: 115, percentage: 40.1 },
      { type: 'Investment', count: 63, percentage: 22.0 },
      { type: 'Job Scam', count: 46, percentage: 16.0 },
      { type: 'Romance', count: 29, percentage: 10.1 },
      { type: 'Parcel', count: 20, percentage: 7.0 },
      { type: 'Others', count: 14, percentage: 4.9 }
    ],
    recentTrends: {
      direction: 'up',
      percentage: 15.3
    },
    hourlyActivity: [
      { hour: '6AM', count: 8 },
      { hour: '9AM', count: 23 },
      { hour: '12PM', count: 41 },
      { hour: '3PM', count: 38 },
      { hour: '6PM', count: 52 },
      { hour: '9PM', count: 67 },
      { hour: '12AM', count: 34 }
    ],
    topTargets: [
      { demographic: 'Ages 25-34', count: 78, percentage: 27.2 },
      { demographic: 'Ages 35-44', count: 65, percentage: 22.6 },
      { demographic: 'Ages 45-54', count: 54, percentage: 18.8 },
      { demographic: 'Ages 55+', count: 47, percentage: 16.4 },
      { demographic: 'Ages 18-24', count: 43, percentage: 15.0 }
    ],
    preventionStats: {
      warningsSent: 156,
      linksBlocked: 195,
      reportsProcessed: 23,
      falsePositives: 12
    }
  });

  const handleGoHome = () => navigation.navigate('scam-detection' as never);
  const handleLearn = () => navigation.navigate('learn' as never);
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
            "Blocked Threats", 
            stats?.totalBlocked.toString() || "0", 
            "Automatically blocked"
          )}
        </View>

        <View style={styles.statsGrid}>
          {renderStatCard(
            "Detection Accuracy", 
            (stats?.accuracy.toString() || "0") + "%", 
            "Model performance"
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

        {/* Detection Trend */}
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

        {/* Hourly Activity */}
        <Text style={styles.sectionTitle}>Peak Activity Hours</Text>
        <View style={styles.trendContainer}>
          {stats?.hourlyActivity.map((hour, index) => (
            <View key={hour.hour} style={styles.trendDay}>
              <View style={[styles.trendBar, { 
                height: `${(hour.count / Math.max(...(stats?.hourlyActivity.map(h => h.count) || [1]))) * 100}%`,
                backgroundColor: '#f39c12'
              }]} />
              <Text style={styles.trendLabel}>{hour.hour}</Text>
              <Text style={styles.trendValue}>{hour.count}</Text>
            </View>
          ))}
        </View>

        {/* Prevention Statistics */}
        <Text style={styles.sectionTitle}>Prevention Impact</Text>
        <View style={styles.preventionGrid}>
          <View style={styles.preventionCard}>
            <Text style={styles.preventionNumber}>{stats?.preventionStats.warningsSent}</Text>
            <Text style={styles.preventionLabel}>Warnings Sent</Text>
          </View>
          <View style={styles.preventionCard}>
            <Text style={styles.preventionNumber}>{stats?.preventionStats.linksBlocked}</Text>
            <Text style={styles.preventionLabel}>Links Blocked</Text>
          </View>
          <View style={styles.preventionCard}>
            <Text style={styles.preventionNumber}>{stats?.preventionStats.reportsProcessed}</Text>
            <Text style={styles.preventionLabel}>Reports Processed</Text>
          </View>
          <View style={styles.preventionCard}>
            <Text style={[styles.preventionNumber, { color: '#e74c3c' }]}>{stats?.preventionStats.falsePositives}</Text>
            <Text style={styles.preventionLabel}>False Positives</Text>
          </View>
        </View>

        {/* Target Demographics */}
        <Text style={styles.sectionTitle}>Most Targeted Demographics</Text>
        <View style={styles.chartContainer}>
          {stats?.topTargets.map((target, index) => (
            <View key={target.demographic} style={styles.barContainer}>
              <Text style={styles.barLabel}>{target.demographic}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { 
                  width: `${target.percentage}%`,
                  backgroundColor: '#9b59b6'
                }]} />
              </View>
              <Text style={styles.barValue}>{target.count}</Text>
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
  preventionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
  },
  preventionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
  },
  preventionNumber: {
    color: '#27ae60',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preventionLabel: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'center',
  },
});
