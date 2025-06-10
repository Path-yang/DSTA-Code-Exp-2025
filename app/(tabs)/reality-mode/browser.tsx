import React, { useState, useContext } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Button, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScoreContext } from './_ScoreContext';

// Simulated websites to visit (based on URLs from Email/SMS)
const fakeSites: Record<string, { title: string; url: string; content: string; isPhishing: boolean; logo?: any }> = {
    'http://m1crosoft-reset.com': {
        title: 'Microsoft Account Password Reset',
        url: 'http://m1crosoft-reset.com',
        content:
            'Your account will be locked soon! Please enter your credentials below to reset your password.',
        isPhishing: true,
    },
    'https://www.zoom.com/meeting/link': {
        title: 'Zoom Meeting',
        url: 'https://www.zoom.com/meeting/link',
        content: 'Log in to join the meeting.',
        isPhishing: false,
    },
    'http://fake-fedex-tracker.com': {
        title: 'FedEx Package Tracking',
        url: 'http://fake-fedex-tracker.com',
        content:
            'Your package is on hold due to customs. Please pay the fee immediately to receive it.',
        isPhishing: true,
    },
    'https://www.pizzahut.com.sg/order/pizza-delivery': {
        title: 'Pizza Hut',
        url: 'https://www.pizzahut.com.sg/order/pizza-delivery',
        content: 'Order your pizza and have it delivered to you doorstep, or self-collect at your nearest store, 50% off 2 pizzas! Log in for HUT rewards.',
        isPhishing: false,
    },
    'http://secure-yourbank-login.com': {
        title: 'YourBank Secure Login',
        url: 'http://secure-yourbank-login.com',
        content:
            'Suspicious activity detected. Login now to secure your account.',
        isPhishing: true,
    },
    'http://trusted-site.com': {
        title: 'Trusted Company Portal',
        url: 'http://trusted-site.com',
        content: 'Welcome to your trusted company portal. No threats detected here.',
        isPhishing: false,
    },
    'http://sigmashield.com': {
        title: 'SigmaShield Official',
        url: 'http://sigmashield.com',
        content: 'Welcome to Sigma Shield. Download our app now! Available on the App Store and Google Play. Log in and scan before you get scammed.',
        isPhishing: false,
        logo: require('@/assets/images/sigmashield-logo.jpeg'),
    },
};

export default function BrowserSimulation() {
    const { addScore, showPointsPopup } = useContext(ScoreContext);
    const params = useLocalSearchParams<{ initialUrl: string }>();
    const initialUrl = params.initialUrl ?? 'http://sigmashield.com';
    const [currentUrl, setCurrentUrl] = useState<string>(initialUrl);
    const router = useRouter();
    const onExit = () => router.back();
    const [feedback, setFeedback] = useState<string | null>(null);
    const site = fakeSites[currentUrl] || { title: 'Unknown Site', url: currentUrl, content: 'This site is not recognized.', isPhishing: false };

    const handleAction = (action: 'submit') => {
        let message = '';
        let points = 0;

        if (action === 'submit') {
            if (site.isPhishing) {
                message = '🚨 Danger! You just submitted your info to a phishing site.';
                points = -10;
            } else {
                message = '✅ Info submitted safely.';
                points = 10;
            }
        }

        setFeedback(message);
        addScore(points);
        showPointsPopup(points);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={onExit} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.url}>{site.url}</Text>

            <ScrollView style={styles.contentBox}>
                <Text style={styles.title}>{site.title}</Text>
                {site.logo && <Image source={site.logo} style={styles.logo} resizeMode="contain" />}
                <Text>{site.content}</Text>
                {site.isPhishing && <Text style={styles.warning}>⚠️ Warning: Suspicious URL and content detected!</Text>}
            </ScrollView>

            <View style={styles.buttons}>
                <Button title="Submit Info" onPress={() => handleAction('submit')} />
            </View>

            {feedback && (
                <View style={styles.feedbackBox}>
                    <Text>{feedback}</Text>
                    <Button title="OK" onPress={() => { setFeedback(null); router.back(); }} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f2f4f7' },
    logo: { width: '100%', height: 200, marginBottom: 15 },
    backButton: { marginBottom: 10 },
    backText: { color: '#007AFF', fontSize: 16, marginLeft: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
    url: { color: '#555', marginBottom: 15, fontStyle: 'italic', marginLeft: 10 },
    contentBox: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 3 },
    warning: { marginTop: 15, color: 'red', fontWeight: 'bold' },
    buttons: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
    feedbackBox: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: '#fff', borderRadius: 12, padding: 15, elevation: 5, alignItems: 'center' },
}); 