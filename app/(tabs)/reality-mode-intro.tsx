import React, { useEffect, useRef, useCallback } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground, ScrollView, Animated, Dimensions } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const maxRadius = Math.sqrt(width * width + height * height) / 2;

export default function RealityModeIntro() {
    const circleScale = useRef(new Animated.Value(0)).current;
    const contentOpacity = useRef(new Animated.Value(0)).current;
    const exitOverlayOpacity = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);

    useFocusEffect(
        useCallback(() => {
            // Reset scroll position to top
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: false });
            }

            // Reset animation values to initial state
            circleScale.setValue(0);
            contentOpacity.setValue(0);
            exitOverlayOpacity.setValue(0);

            // Start the fade-in animation immediately
            Animated.sequence([
                Animated.timing(circleScale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(contentOpacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }, [circleScale, contentOpacity, exitOverlayOpacity])
    );

    const handleStartTraining = () => {
        // Trigger exit animation before navigating
        Animated.timing(exitOverlayOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            // Navigate after animation completes
            router.push('./reality-mode-landing-lvl1');
        });
    };

    const handleBack = () => {
        router.push('/learn');
    };



    return (
        <View style={styles.background}>
            {/* Main content - always present */}
            <ImageBackground
                source={require('@/assets/images/reality-wallpaper.png')}
                style={styles.background}
            >
                <SafeAreaView style={styles.container}>
                    <Animated.View style={{ opacity: contentOpacity }}>

                        <ScrollView
                            ref={scrollViewRef}
                            contentContainerStyle={styles.scrollContent}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.content}>
                                <Text style={styles.title}>Reality Mode</Text>
                                <Text style={styles.subtitle}>Immersive Cybersecurity Training</Text>

                                <View style={styles.descriptionCard}>
                                    <Text style={styles.description}>
                                        Welcome to Reality Mode! Experience realistic smartphone simulations where you'll encounter
                                        real-world phishing attempts, scam messages, and fraudulent marketplace listings.
                                    </Text>
                                </View>

                                <View style={styles.objectiveSection}>
                                    <View style={styles.sectionHeader}>
                                        <FontAwesome name="trophy" size={20} color="#FFD700" />
                                        <Text style={styles.objectiveTitle}>Scoring System</Text>
                                    </View>
                                    <View style={styles.objectiveCard}>
                                        <Text style={styles.objectiveText}>
                                            • Correctly report threats: +10 points{'\n'}
                                            • Falling for threats: -10 points{'\n'}
                                            • Trusting safe sources: +10 points{'\n'}
                                            • False reporting: -5 points{'\n'}
                                            • Ignoring threats: 0 points{'\n'}
                                            • Avoid falling for scams: Stay protected!
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.tipsSection}>
                                    <View style={styles.sectionHeader}>
                                        <FontAwesome name="lightbulb-o" size={20} color="#FFA500" />
                                        <Text style={styles.tipsTitle}>Pro Tips</Text>
                                    </View>
                                    <View style={styles.tipsCard}>
                                        <Text style={styles.tip}>• Look for suspicious email addresses and URLs</Text>
                                        <Text style={styles.tip}>• Be wary of urgent language and pressure tactics</Text>
                                        <Text style={styles.tip}>• Check for spelling errors and poor grammar</Text>
                                        <Text style={styles.tip}>• Verify deals that seem too good to be true</Text>
                                        <Text style={styles.tip}>• Trust your instincts - when in doubt, report it!</Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.startButton} onPress={handleStartTraining}>
                                    <View style={styles.startButtonContent}>
                                        <FontAwesome name="rocket" size={18} color="#fff" />
                                        <Text style={styles.startButtonText}>Start Training</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </Animated.View>
                </SafeAreaView>
            </ImageBackground>

            {/* Black overlay that fades out */}
            <Animated.View style={[styles.overlay, {
                opacity: circleScale.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0]
                })
            }]} pointerEvents="none" />

            {/* Exit overlay that fades in when navigating */}
            <Animated.View style={[styles.overlay, {
                opacity: exitOverlayOpacity,
                zIndex: 60
            }]} pointerEvents="none" />

            {/* Back button positioned above all layers */}
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000',
        zIndex: 50,
    },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
    },
    backButton: {
        position: 'absolute',
        top: 60,
        left: 20,
        zIndex: 100, // Higher z-index to appear above all animation layers
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
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    subtitle: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        marginBottom: 25,
        opacity: 0.9,
        textShadowColor: 'rgba(0, 0, 0, 0.7)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    descriptionCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
        width: '100%',
    },
    description: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 24,
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
    objectiveSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        gap: 10,
    },
    objectiveTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 0,
        textAlign: 'center',
    },
    objectiveCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        padding: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    objectiveText: {
        fontSize: 16,
        color: '#fff',
        marginBottom: 10,
        lineHeight: 30,
    },
    tipsSection: {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 30,
        width: '100%',
    },
    tipsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 0,
        textAlign: 'center',
    },
    tipsCard: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 10,
        padding: 15,
        borderLeftWidth: 4,
        borderLeftColor: '#ffc107',
    },
    tip: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 8,
        lineHeight: 20,
    },
    startButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 18,
        paddingHorizontal: 50,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    startButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    startButtonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
}); 