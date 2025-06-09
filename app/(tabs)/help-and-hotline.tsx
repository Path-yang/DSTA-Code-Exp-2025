import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Linking } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HelpAndHotlineScreen() {
    const handleBack = () => router.push('/learn');
    const handleGoHome = () => router.push('/scam-detection');
    const handleLearn = () => router.push('/learn');
    const handleAnalytics = () => router.push('/analytics');
    const handleForum = () => router.push('/forum');

    const handleEmergency = () => Linking.openURL('tel:999');
    const handleHelpline = () => Linking.openURL('tel:1799');
    const handleWebsite = () => Linking.openURL('https://www.scamshield.gov.sg');
    const handleCouncil = () => Linking.openURL('tel:62524101');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Help & Hotline</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.subTitle}>Scam Related Resources in Singapore</Text>
                <Text style={styles.description}>Get supports or report scams through these official websites and hotlines</Text>
                <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
                    <Text style={styles.emergencyButtonText}>In Case of Emergency, call 999</Text>
                </TouchableOpacity>
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>Anti Scam Helpline</Text>
                    <TouchableOpacity onPress={handleHelpline}>
                        <Text style={styles.listAction}>1799</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>Visit ScamShield Website</Text>
                    <TouchableOpacity onPress={handleWebsite}>
                        <Text style={styles.listLink}>Click Here to visit ScamShield website</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>National Crime Prevention Council</Text>
                    <TouchableOpacity onPress={handleCouncil}>
                        <Text style={styles.listAction}>6252 4101</Text>
                    </TouchableOpacity>
                </View>
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
    content: { paddingHorizontal: 20, paddingBottom: 120 },
    subTitle: { color: '#fff', fontSize: 16, marginBottom: 5 },
    description: { color: '#aaa', fontSize: 14, marginBottom: 20 },
    emergencyButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
    emergencyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    listTitle: { color: '#fff', fontSize: 16 },
    listAction: { color: '#007AFF', fontSize: 16 },
    listLink: { color: '#007AFF', fontSize: 16, textDecorationLine: 'underline' },
    separator: { height: 1, backgroundColor: '#444', marginVertical: 10 },
    bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
    navItem: { alignItems: 'center' },
    activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
    navIcon: { fontSize: 20, marginBottom: 5, color: '#fff' },
    navText: { color: '#fff', fontSize: 12 },
    activeNavText: { color: '#007AFF' },
}); 