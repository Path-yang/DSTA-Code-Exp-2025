import React, { createContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Modal } from 'react-native';
import { router } from 'expo-router';

export type ScoreContextType = {
    score: number;
    addScore: (points: number) => void;
    resetScore: () => void;
    showPointsPopup: (points: number) => void;
    respondedEmails: Set<string>;
    respondedMessages: Set<string>;
    respondedProducts: Set<string>;
    addRespondedEmail: (id: string) => void;
    addRespondedMessage: (id: string) => void;
    addRespondedProduct: (id: string) => void;
};

export const ScoreContext = createContext<ScoreContextType>({
    score: 0,
    addScore: () => { },
    resetScore: () => { },
    showPointsPopup: () => { },
    respondedEmails: new Set(),
    respondedMessages: new Set(),
    respondedProducts: new Set(),
    addRespondedEmail: () => { },
    addRespondedMessage: () => { },
    addRespondedProduct: () => { },
});

export function ScoreProvider({ children }: { children: React.ReactNode }) {
    const [score, setScore] = useState(0);
    const [popupVisible, setPopupVisible] = useState(false);
    const [popupPoints, setPopupPoints] = useState(0);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.3));
    const [respondedEmails, setRespondedEmails] = useState<Set<string>>(new Set());
    const [respondedMessages, setRespondedMessages] = useState<Set<string>>(new Set());
    const [respondedProducts, setRespondedProducts] = useState<Set<string>>(new Set());

    const addScore = (points: number) => setScore((prev) => prev + points);
    const resetScore = () => {
        setScore(0);
        setRespondedEmails(new Set());
        setRespondedMessages(new Set());
        setRespondedProducts(new Set());
    };

    const addRespondedEmail = (id: string) => setRespondedEmails(prev => new Set(prev).add(id));
    const addRespondedMessage = (id: string) => setRespondedMessages(prev => new Set(prev).add(id));
    const addRespondedProduct = (id: string) => setRespondedProducts(prev => new Set(prev).add(id));

    // Monitor score and navigate to finish page when reaching 70
    useEffect(() => {
        if (score >= 70) {
            // Small delay to let the popup show first
            setTimeout(() => {
                router.push('/reality-mode/finish-lvl1');
            }, 2500);
        }
    }, [score]);

    const showPointsPopup = (points: number) => {
        setPopupPoints(points);
        setPopupVisible(true);

        // Reset animations
        fadeAnim.setValue(0);
        scaleAnim.setValue(0.3);

        // Animate in
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Auto hide after 2 seconds
        setTimeout(() => {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.3,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                setPopupVisible(false);
            });
        }, 2000);
    };

    return (
        <ScoreContext.Provider value={{
            score,
            addScore,
            resetScore,
            showPointsPopup,
            respondedEmails,
            respondedMessages,
            respondedProducts,
            addRespondedEmail,
            addRespondedMessage,
            addRespondedProduct
        }}>
            {children}

            <Modal visible={popupVisible} transparent animationType="none">
                <View style={styles.popupOverlay}>
                    <Animated.View
                        style={[
                            styles.popupContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ scale: scaleAnim }],
                            },
                        ]}
                    >
                        <Text style={[
                            styles.popupText,
                            { color: popupPoints > 0 ? '#4CAF50' : '#F44336' }
                        ]}>
                            {popupPoints > 0 ? '+' : ''}{popupPoints}
                        </Text>
                        <Text style={styles.popupLabel}>
                            {popupPoints > 0 ? 'Points Gained!' : 'Points Lost!'}
                        </Text>
                    </Animated.View>
                </View>
            </Modal>
        </ScoreContext.Provider>
    );
}

const styles = StyleSheet.create({
    popupOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    popupContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 40,
        paddingVertical: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    popupText: {
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    popupLabel: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
});

// Default export to prevent Expo Router warnings
export default ScoreProvider; 