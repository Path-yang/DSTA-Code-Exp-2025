import React, { useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Animated } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function RealityModeLanding() {
    const overlayOpacity = useRef(new Animated.Value(1)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            // Reset scroll position to top
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: false });
            }

            // Reset animation values to initial state
            overlayOpacity.setValue(1);
            contentOpacity.setValue(0);

            // Start the fade-in animation immediately
            Animated.sequence([
                Animated.timing(overlayOpacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [overlayOpacity, contentOpacity])
    );

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

                <Animated.View style={{ flex: 1, opacity: contentOpacity }}>
                    <ScrollView
                        ref={scrollViewRef}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.content}>
                            <View style={styles.titleContainer}>
                                <FontAwesome name="shield" size={28} color="#4CAF50" />
                                <Text style={styles.title}>Welcome to Level 1</Text>
                            </View>

                            <View style={styles.storyCard}>
                                <Text style={styles.story}>
                                    You've just been recruited as a <Text style={styles.boldText}>Cyber Guardian Trainee</Text>.{'\n\n'}
                                    <Text style={styles.boldText}>Your mission:</Text> Explore simulated apps — Email, Messages, and a Shopping Platform — to detect online scams.
                                    Make smart choices: report suspicious items, avoid risky clicks, and trust the right sources.{'\n\n'}
                                    Some are safe. Some are traps.
                                </Text>
                            </View>

                            <View style={styles.featuresSection}>
                                <View style={styles.featuresTitleContainer}>
                                    <FontAwesome name="bullseye" size={20} color="#FFD700" />
                                    <Text style={styles.featuresTitle}>What You'll Practice in this Level</Text>
                                </View>

                                <View style={styles.feature}>
                                    <View style={styles.featureIconContainer}>
                                        <FontAwesome name="envelope" size={24} color="#4CAF50" />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>Email Security</Text>
                                        <Text style={styles.featureDesc}>Identify phishing emails and suspicious links</Text>
                                    </View>
                                </View>

                                <View style={styles.feature}>
                                    <View style={styles.featureIconContainer}>
                                        <FontAwesome name="comments" size={24} color="#2196F3" />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>SMS Protection</Text>
                                        <Text style={styles.featureDesc}>Spot smishing attempts and malicious messages</Text>
                                    </View>
                                </View>

                                <View style={styles.feature}>
                                    <View style={styles.featureIconContainer}>
                                        <FontAwesome name="shopping-cart" size={24} color="#FF9800" />
                                    </View>
                                    <View style={styles.featureContent}>
                                        <Text style={styles.featureTitle}>E-commerce Safety</Text>
                                        <Text style={styles.featureDesc}>Recognize scam listings and fraudulent sellers</Text>
                                    </View>
                                </View>

                                <View style={styles.feature}>
                                    <View style={styles.featureIconContainer}>
                                        <FontAwesome name="globe" size={24} color="#9C27B0" />
                                    </View>
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
                                <View style={styles.hintTextContainer}>
                                    <FontAwesome name="lightbulb-o" size={16} color="#FFC107" />
                                    <Text style={styles.hint}>Hint: Not every app hides a threat. Choose wisely.</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.startButton} onPress={handleStartMission}>
                                <Text style={styles.startButtonText}>Start Mission</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Animated.View>
            </SafeAreaView>

            {/* Black overlay that fades out */}
            <Animated.View style={[styles.overlay, {
                opacity: overlayOpacity
            }]} pointerEvents="none" />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 25,
    },
    backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 25,
        gap: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    storyCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 24,
        marginBottom: 25,
        width: '100%',
    },
    story: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    featuresSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    featuresTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 10,
    },
    featuresTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    feature: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    featureIconContainer: {
        marginRight: 15,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    featureContent: {
        flex: 1,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 2,
    },
    featureDesc: {
        fontSize: 14,
        color: '#ccc',
    },
    goalSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    goal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
    },
    targetScore: {
        color: '#4CAF50',
        fontSize: 20,
        fontWeight: 'bold',
    },
    hintSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        width: '100%',
    },
    hintTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    hint: {
        fontSize: 14,
        fontStyle: 'italic',
        color: '#ccc',
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
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 50,
    },
}); 