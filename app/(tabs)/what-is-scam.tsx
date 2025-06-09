import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function WhatIsScamScreen() {
    const handleBack = () => {
        router.push('/learn');
    };

    const handleGoHome = () => router.push('/scam-detection');
    const handleLearn = () => router.push('/learn');
    const handleAnalytics = () => router.push('/analytics');
    const handleForum = () => router.push('/forum');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>What is a scam?</Text>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Understand Scams and{`\n`}Protect yourself</Text>
                        <IconSymbol size={60} name="shield.fill" color="#e74c3c" />
                    </View>
                    <Text style={styles.cardSubtitle}>Learn how scammers trick people and how to stay safe</Text>
                    <View style={styles.definitionContainer}>
                        <Text style={styles.definitionTitle}>Definition</Text>
                        <Text style={styles.definitionText}>
                            A scam is a dishonest scheme used to trick people into giving away money, personal information, or access to their accounts. Scam can
                            come in forms of emails, text messages, phone calls or fake websites.
                        </Text>
                    </View>
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
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backText: {
        color: '#007AFF',
        fontSize: 16,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        flex: 1,
    },
    cardSubtitle: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 15,
    },
    definitionContainer: {
        backgroundColor: '#333',
        borderRadius: 8,
        padding: 15,
    },
    definitionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    definitionText: {
        color: '#ddd',
        fontSize: 14,
        lineHeight: 20,
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
        color: '#fff',
    },
    navText: {
        color: '#fff',
        fontSize: 12,
    },
    activeNavText: {
        color: '#007AFF',
    },
}); 