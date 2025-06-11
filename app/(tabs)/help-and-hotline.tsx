import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar, Linking } from 'react-native';
import { router } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function HelpAndHotlineScreen() {
    const handleBack = () => router.push('/learn');

    const handleEmergency = () => Linking.openURL('tel:999');
    const handleHelpline = () => Linking.openURL('tel:1799');
    const handleWebsite = () => Linking.openURL('https://www.scamshield.gov.sg');
    const handleCouncil = () => Linking.openURL('tel:62524101');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#000" />
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Text style={styles.backText}>{'< Back'}</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quick Hotlines</Text>
            </View>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <Text style={styles.subTitle}>Scam Related Resources in Singapore</Text>
                <Text style={styles.description}>Get supports or report scams through these official websites and hotlines</Text>
                <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergency}>
                    <Text style={styles.emergencyButtonText}>In Case of Emergency, call 999</Text>
                </TouchableOpacity>
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>Anti Scam Helpline</Text>
                    <TouchableOpacity onPress={handleHelpline}>
                        <Text style={styles.listAction}>1799</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>Visit ScamShield Website</Text>
                    <TouchableOpacity onPress={handleWebsite}>
                        <Text style={styles.listLink}>ScamShield</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.separator} />
                <View style={styles.listItem}>
                    <Text style={styles.listTitle}>National Crime Prevention Council</Text>
                    <TouchableOpacity onPress={handleCouncil}>
                        <Text style={styles.listAction}>6252 4101</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: {
        padding: 15,
        backgroundColor: '#000',
        position: 'relative'
    },
    backButton: {
        zIndex: 10,
        position: 'relative'
    },
    backText: { color: '#007AFF', fontSize: 16 },
    headerTitle: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 15,
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 0,
        zIndex: 1
    },
    content: { paddingHorizontal: 20, paddingBottom: 20 },
    subTitle: { color: '#fff', fontSize: 16, marginBottom: 5 },
    description: { color: '#aaa', fontSize: 14, marginBottom: 20 },
    emergencyButton: { backgroundColor: '#e74c3c', borderRadius: 8, paddingVertical: 15, paddingHorizontal: 20, alignItems: 'center', marginBottom: 20 },
    emergencyButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    listTitle: { color: '#fff', fontSize: 16 },
    listAction: { color: '#007AFF', fontSize: 16, fontWeight: 'bold' },
    listLink: { color: '#007AFF', fontSize: 16, textDecorationLine: 'underline', fontWeight: 'bold' },
    separator: { height: 1, backgroundColor: '#444', marginVertical: 10 },
}); 