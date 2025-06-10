import React, { useState, useContext } from 'react';
import { router } from 'expo-router';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Alert,
    StyleSheet,
    Modal,
    Button,
    SafeAreaView
} from 'react-native';
import { ScoreContext } from './_ScoreContext';

type Email = {
    id: string;
    subject: string;
    sender: string;
    body: string;
    isPhishing: boolean;
    url?: string;
};

const emailData: Email[] = [
    {
        id: '1',
        subject: 'Reset your password now',
        sender: 'it-support@m1crosoft-updates.com',
        body: 'Your account is about to expire. Click here to reset your password: http://m1crosoft-reset.com',
        isPhishing: true,
    },
    {
        id: '2',
        subject: 'Team Sync Tomorrow',
        sender: 'hr@sigmashield.com',
        body: 'Reminder: All-hands meeting at 10 AM. Link to Zoom https://www.zoom.com/meeting/link',
        isPhishing: false,
    },
];

export default function RealityModeEmail() {
    const { addScore, showPointsPopup, respondedEmails, addRespondedEmail } = useContext(ScoreContext);
    const handleBack = () => router.back();
    const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const handleLinkClick = () => {
        if (!selectedEmail) return;
        const initialUrl = selectedEmail.url ?? selectedEmail.body.match(/https?:\/\/[^\s]+/)?.[0] ?? '';
        addRespondedEmail(selectedEmail.id);
        setSelectedEmail(null);
        router.push({ pathname: '/reality-mode/browser', params: { initialUrl } });
    };

    const renderEmailBody = (body: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const parts = body.split(urlRegex);

        return parts.map((part, index) => {
            if (urlRegex.test(part)) {
                return (
                    <Text
                        key={index}
                        style={styles.hyperlink}
                        onPress={handleLinkClick}
                    >
                        {part}
                    </Text>
                );
            }
            return <Text key={index}>{part}</Text>;
        });
    };

    const handleResponse = (type: 'report' | 'ignore') => {
        if (!selectedEmail) return;

        let message = '';
        let points = 0;

        if (selectedEmail.isPhishing && type === 'report') {
            message = '✅ Correct! That was a phishing email.';
            points = 10;
        } else if (!selectedEmail.isPhishing && type === 'report') {
            message = '❌ That email was legitimate. Be careful not to overreport.';
            points = -5;
        } else if (selectedEmail.isPhishing && type === 'ignore') {
            message = "😐 You ignored the message. But you could've reported it for better protection.";
            points = 0;
        } else {
            message = 'You ignored a legitimate email.';
            points = -5;
        }

        addScore(points);
        showPointsPopup(points);
        setFeedback(message);
        addRespondedEmail(selectedEmail.id);
        setSelectedEmail(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Inbox</Text>
            <FlatList
                data={emailData.filter(email => !respondedEmails.has(email.id))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.emailItem} onPress={() => setSelectedEmail(item)}>
                        <Text style={styles.subject}>{item.subject}</Text>
                        <Text style={styles.sender}>{item.sender}</Text>
                    </TouchableOpacity>
                )}
            />

            <Modal visible={!!selectedEmail} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    {selectedEmail && (
                        <View style={styles.emailDetail}>
                            <Text style={styles.modalSubject}>{selectedEmail.subject}</Text>
                            <Text style={styles.modalSender}>From: {selectedEmail.sender}</Text>
                            <Text style={styles.modalBody}>
                                {renderEmailBody(selectedEmail.body)}
                            </Text>

                            <View style={styles.buttons}>
                                <Button title="🙈 Ignore" onPress={() => handleResponse('ignore')} />
                                <Button title="🚨 Report" color="crimson" onPress={() => handleResponse('report')} />
                            </View>

                            <Button title="Close" onPress={() => setSelectedEmail(null)} />
                        </View>
                    )}
                </View>
            </Modal>

            {feedback && (
                <View style={styles.feedbackBox}>
                    <Text>{feedback}</Text>
                    <Button title="OK" onPress={() => setFeedback(null)} />
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingVertical: 20, paddingHorizontal: 40, backgroundColor: '#eef2f5' },
    backButton: { marginBottom: 10 },
    backText: { color: '#007AFF', fontSize: 16, marginLeft: 10 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
    emailItem: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 2,
    },
    subject: { fontWeight: '600', fontSize: 16 },
    sender: { color: '#555' },
    modalContainer: {
        flex: 1,
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
    },
    emailDetail: {
        backgroundColor: '#fff',
        padding: 25,
        width: '85%',
        borderRadius: 12,
        elevation: 5,
    },
    modalSubject: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
    modalSender: { marginBottom: 10 },
    modalBody: { marginBottom: 20 },
    hyperlink: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 5,
        gap: 60,
    },
    feedbackBox: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
}); 