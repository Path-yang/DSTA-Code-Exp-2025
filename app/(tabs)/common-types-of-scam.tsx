import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function CommonTypesOfScamScreen() {
    const handleBack = () => router.push('/learn');
    const handleGoHome = () => router.push('/scam-detection');
    const handleLearn = () => router.push('/learn');
    const handleAnalytics = () => router.push('/analytics');
    const handleForum = () => router.push('/forum');

    const scams = [
        { title: 'Fake Job Offer', description: "Hi, I'm HR from Shopeee..." },
        { title: 'Investment Scam', description: "Hi, I'm HR from Shopeee. We are hiring..." },
        { title: 'Parcel Scam', description: 'Your Parcel is held at SingPost...' },
        { title: 'Fake Bank Alert', description: 'UOB: Suspicious login detected...' },
        { title: 'Impersonation Scam', description: 'This is Officer Tan from SPF...' },
        { title: 'Love/Relationship Scam', description: 'This is Officer Tan from SPF...' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Common Types of Scams</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {scams.map((item, index) => (
                    <View key={index} style={styles.itemContainer}>
                        <View style={styles.bullet} />
                        <View style={styles.textContainer}>
                            <Text style={styles.scamTitle}>{item.title}</Text>
                            <Text style={styles.scamDescription}>{item.description}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={handleGoHome}>
                    <FontAwesome name="home" size={20} color="#fff" style={styles.navIcon} />
                    <Text style={styles.navText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.navItem, styles.activeNavItem]} onPress={handleLearn}>
                    <FontAwesome name="book" size={20} color="#007AFF" style={styles.navIcon} />
                    <Text style={[styles.navText, styles.activeNavText]}>Learn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handleAnalytics}>
                    <FontAwesome name="bar-chart" size={20} color="#fff" style={styles.navIcon} />
                    <Text style={styles.navText}>Analytics</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handleForum}>
                    <FontAwesome name="comments" size={20} color="#fff" style={styles.navIcon} />
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
    itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#333', borderRadius: 12, padding: 15, marginBottom: 15 },
    bullet: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#555', marginRight: 10 },
    textContainer: { flex: 1 },
    scamTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    scamDescription: { color: '#aaa', fontSize: 14, marginTop: 4 },
    bottomNav: { flexDirection: 'row', backgroundColor: '#2a2a2a', paddingVertical: 10, paddingHorizontal: 20, justifyContent: 'space-around' },
    navItem: { alignItems: 'center' },
    activeNavItem: { borderBottomWidth: 2, borderBottomColor: '#007AFF' },
    navIcon: { marginBottom: 5 },
    navText: { color: '#fff', fontSize: 12 },
    activeNavText: { color: '#007AFF' },
}); 