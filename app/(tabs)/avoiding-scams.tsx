import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AvoidingScamsScreen() {
    const handleBack = () => router.push('/learn');
    const handleGoHome = () => router.push('/scam-detection');
    const handleLearn = () => router.push('/learn');
    const handleAnalytics = () => router.push('/analytics');
    const handleForum = () => router.push('/forum');

    const items = [
        { icon: 'hand.raised.fill', iconBg: '#e74c3c', title: 'Be Skeptical', description: 'Doubt unsolicited Offers or Requests' },
        { icon: 'phone.fill', iconBg: '#e67e22', title: 'Verify Contact', description: 'Confirm Identity of the Contact before answering' },
        { icon: 'lock.fill', iconBg: '#e74c3c', title: "Don't Share Sensitive Info", description: 'Keep your Personal or Financial info private' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Avoiding Scams</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <IconSymbol name="hand.raised.fill" size={80} color="#f1c40f" style={styles.mainIcon} />
                <Text style={styles.mainTitle}>Stay Safe and Vigilant</Text>
                <Text style={styles.mainSubtitle}>Follow the following steps to protect yourself from scams</Text>
                {items.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <View style={[styles.iconContainer, { backgroundColor: item.iconBg }]}>
                            <IconSymbol name={item.icon} size={24} color="#fff" />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.itemTitle}>{item.title}</Text>
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        </View>
                    </View>
                ))}
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
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
    backText: { color: '#007AFF', fontSize: 16, marginRight: 10 },
    headerTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    content: { paddingHorizontal: 20, paddingBottom: 120, alignItems: 'center' },
    mainIcon: { marginVertical: 20 },
    mainTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
    mainSubtitle: { color: '#aaa', fontSize: 16, textAlign: 'center', marginBottom: 20 },
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 12, padding: 15, marginBottom: 15 },
    iconContainer: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
    textContainer: { flex: 1 },
    itemTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    itemDescription: { color: '#aaa', fontSize: 14, marginTop: 4 },
    bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
    navItem: { alignItems: 'center' },
    activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
    navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
    navText: { color: '#fff', fontSize: 12 },
    activeNavText: { color: '#007AFF' },
}); 