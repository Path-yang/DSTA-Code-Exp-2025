import React, { useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import { ScoreContext } from './_ScoreContext';

export default function FinishLevel1() {
    const { score, resetScore } = useContext(ScoreContext);

    const handleBackToHome = () => {
        resetScore();
        router.push('/learn');
    };

    const handleContinue = () => {
        // For now, just go back to reality mode home
        router.push('/reality-mode');
    };

    return (
        <ImageBackground
            source={require('@/assets/images/reality-wallpaper.png')}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.congratsTitle}>🎉 Congratulations!</Text>
                    <Text style={styles.levelComplete}>Level 1 Complete</Text>

                    <View style={styles.scoreCard}>
                        <Text style={styles.finalScoreLabel}>Final Score</Text>
                        <Text style={styles.finalScore}>{score}</Text>
                        <Text style={styles.scoreDesc}>
                            {score >= 90 ? 'Excellent! You\'re a cybersecurity expert!' :
                                score >= 80 ? 'Great job! You have strong security awareness!' :
                                    'Good work! You successfully completed the training!'}
                        </Text>
                    </View>

                    <View style={styles.achievements}>
                        <Text style={styles.achievementsTitle}>🏆 Achievements Unlocked</Text>
                        <View style={styles.achievementsList}>
                            <Text style={styles.achievement}>✅ Phishing Email Detective</Text>
                            <Text style={styles.achievement}>✅ SMS Scam Spotter</Text>
                            <Text style={styles.achievement}>✅ E-commerce Safety Expert</Text>
                            <Text style={styles.achievement}>✅ Level 1 Master</Text>
                        </View>
                    </View>

                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
                            <Text style={styles.continueButtonText}>Continue Training</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.homeButton} onPress={handleBackToHome}>
                            <Text style={styles.homeButtonText}>Back to Main Menu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        width: '100%',
        maxWidth: 400,
    },
    congratsTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
        textAlign: 'center',
    },
    levelComplete: {
        fontSize: 24,
        fontWeight: '600',
        color: '#333',
        marginBottom: 25,
        textAlign: 'center',
    },
    scoreCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 15,
        padding: 20,
        marginBottom: 25,
        alignItems: 'center',
        width: '100%',
    },
    finalScoreLabel: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    finalScore: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: 10,
    },
    scoreDesc: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    achievements: {
        marginBottom: 30,
        width: '100%',
    },
    achievementsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    achievementsList: {
        backgroundColor: '#fff3cd',
        borderRadius: 10,
        padding: 15,
    },
    achievement: {
        fontSize: 14,
        color: '#856404',
        marginBottom: 5,
        fontWeight: '500',
    },
    buttons: {
        width: '100%',
        gap: 15,
    },
    continueButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    continueButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    homeButton: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#4CAF50',
    },
    homeButtonText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 