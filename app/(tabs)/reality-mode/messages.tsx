import React, { useState, useContext } from 'react';
import {
    SafeAreaView,
    StatusBar,
    FlatList,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Button
} from 'react-native';
import { router } from 'expo-router';
import { ScoreContext } from './_ScoreContext';

type Message = {
    id: string;
    from: string;
    body: string;
    isPhishing: boolean;
    url?: string;
};

const messageData: Message[] = [
    {
        id: '1',
        from: 'FedEx',
        body: 'Your package is on hold. Pay customs fee here: http://fake-fedex-tracker.com',
        isPhishing: true,
    },
    {
        id: '2',
        from: 'Mom',
        body: 'Dinner tonight at 6? Which pizza do you want? https://www.pizzahut.com.sg/order/pizza-delivery',
        isPhishing: false,
    },
    {
        id: '3',
        from: 'BankAlert',
        body: 'Suspicious login detected. Click here to secure your account: http://secure-yourbank-login.com',
        isPhishing: true,
    },
];

export default function RealityModeMessages() {
    const [selectedMsg, setSelectedMsg] = useState<Message | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const { addScore, showPointsPopup, respondedMessages, addRespondedMessage } = useContext(ScoreContext);
    const handleBack = () => router.back();
    const handleLinkClick = () => {
        if (!selectedMsg) return;
        const initialUrl = selectedMsg.url ?? selectedMsg.body.match(/https?:\/\/[^\s]+/)?.[0] ?? '';
        // Don't mark as responded when clicking link - only when submitting info in browser
        setSelectedMsg(null);
        router.push({
            pathname: '/reality-mode/browser',
            params: {
                initialUrl,
                sourceType: 'message',
                sourceId: selectedMsg.id
            }
        });
    };

    const renderMessageBody = (body: string) => {
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
        if (!selectedMsg) return;
        let message = '';
        let points = 0;
        if (selectedMsg.isPhishing && type === 'report') {
            message = '✅ Correct! That message is a smishing attempt.';
            points = 10;
        } else if (!selectedMsg.isPhishing && type === 'report') {
            message = '❌ Incorrect. This message is harmless.';
            points = -5;
        } else {
            message = selectedMsg.isPhishing
                ? '⚠️ Missed Opportunity: You ignored a smishing message.'
                : '👍 Fine. No action needed on a safe message.';
            points = 0;
        }
        addScore(points);
        showPointsPopup(points);
        setFeedback(message);
        addRespondedMessage(selectedMsg.id);
        setSelectedMsg(null);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafc" />
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Text style={styles.backText}>{'< Back'}</Text>
            </TouchableOpacity>
            <Text style={styles.header}>Messages</Text>
            <FlatList
                data={messageData.filter(message => !respondedMessages.has(message.id))}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.message} onPress={() => setSelectedMsg(item)}>
                        <Text style={styles.from}>{item.from}</Text>
                        <Text numberOfLines={1}>{item.body}</Text>
                    </TouchableOpacity>
                )}
            />
            <Modal visible={!!selectedMsg} animationType="slide" transparent>
                <View style={styles.modalContainer}>
                    {selectedMsg && (
                        <View style={styles.messageDetail}>
                            <Text style={styles.modalFrom}>From: {selectedMsg.from}</Text>
                            <Text style={styles.modalBody}>
                                {renderMessageBody(selectedMsg.body)}
                            </Text>
                            <View style={styles.buttons}>
                                <Button title="🙈 Ignore" onPress={() => handleResponse('ignore')} />
                                <Button title="🚨 Report" color="crimson" onPress={() => handleResponse('report')} />
                            </View>
                            <Button title="Close" onPress={() => setSelectedMsg(null)} />
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
    container: { flex: 1, padding: 20, backgroundColor: '#f9fafc' },
    backButton: { marginBottom: 10 },
    backText: { color: '#007AFF', fontSize: 16, marginLeft: 10 },
    header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, marginLeft: 10 },
    message: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        borderRadius: 8,
        elevation: 1,
    },
    from: { fontWeight: '600', marginBottom: 3 },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageDetail: {
        backgroundColor: '#fff',
        padding: 25,
        width: '85%',
        borderRadius: 12,
        elevation: 4,
    },
    modalFrom: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
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
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 3,
        alignItems: 'center',
    },
}); 