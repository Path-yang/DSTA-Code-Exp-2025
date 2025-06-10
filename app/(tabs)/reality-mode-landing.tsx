import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function RealityModeLanding() {
    const handleStartMission = () => {
        router.push('./reality-mode');
    };

    const handleBack = () => {
        router.push('./reality-mode-intro');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/reality-wallpaper.png')}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        <Text style={styles.title}>🛡️ Welcome to Level 1</Text>

                        <View style={styles.storyCard}>
                            <Text style={styles.story}>
                                You've just been recruited as a <Text style={styles.boldText}>Cyber Guardian Trainee</Text>.{'\n\n'}
                                <Text style={styles.boldText}>Your mission:</Text> Explore simulated apps — Email, Messages, and a Shopping Platform — to detect online scams.
                                Make smart choices: report suspicious items, avoid risky clicks, and trust the right sources.{'\n\n'}
                                Some are safe. Some are traps.
                            </Text>
                        </View>

                        <View style={styles.featuresSection}>
                            <Text style={styles.featuresTitle}>🎯 What You'll Practice</Text>

                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>📧</Text>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Email Security</Text>
                                    <Text style={styles.featureDesc}>Identify phishing emails and suspicious links</Text>
                                </View>
                            </View>

                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>💬</Text>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>SMS Protection</Text>
                                    <Text style={styles.featureDesc}>Spot smishing attempts and malicious messages</Text>
                                </View>
                            </View>

                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>🛒</Text>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>E-commerce Safety</Text>
                                    <Text style={styles.featureDesc}>Recognize scam listings and fraudulent sellers</Text>
                                </View>
                            </View>

                            <View style={styles.feature}>
                                <Text style={styles.featureIcon}>🌐</Text>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>Web Browsing</Text>
                                    <Text style={styles.featureDesc}>Navigate suspicious websites safely</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.goalSection}>
                            <Text style={styles.goal}>
                                Score <Text style={styles.targetScore}>70 points</Text> or higher to complete Level 1
                            </Text>
                        </View>

                        <View style={styles.hintSection}>
                            <Text style={styles.hint}>💡 Hint: Not every app hides a threat. Choose wisely.</Text>
                        </View>

                        <TouchableOpacity style={styles.startButton} onPress={handleStartMission}>
                            <Text style={styles.startButtonText}>Start Mission</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
    backText: { color: '#007AFF', fontSize: 16, fontWeight: '600' },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 120,
        paddingBottom: 40,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 25,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    storyCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 24,
        marginBottom: 25,
        width: '100%',
    },
    story: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        lineHeight: 24,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#007bff',
    },
    featuresSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureIcon: {
        fontSize: 24,
        marginRight: 15,
        width: 35,
        textAlign: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 14,
        color: '#666',
    },
    goalSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    goal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    targetScore: {
        color: '#4CAF50',
        fontSize: 20,
        fontWeight: 'bold',
    },
    hintSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        width: '100%',
    },
    hint: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'center',
    },
    startButton: {
        backgroundColor: '#007bff',
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 