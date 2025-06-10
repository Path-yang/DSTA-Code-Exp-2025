import React, { useContext } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, StatusBar, ImageBackground, Image } from 'react-native';
import { router } from 'expo-router';
import { ScoreContext } from './_ScoreContext';

export default function RealityModeHome() {
    const { score, resetScore } = useContext(ScoreContext);
    const handleNavigateEmail = () => router.push('/reality-mode/email');
    const handleNavigateMessages = () => router.push('/reality-mode/messages');
    const handleNavigateBrowser = () => router.push('/reality-mode/browser');
    const handleNavigateCarousell = () => router.push('/reality-mode/carousell');

    return (
        <ImageBackground
            source={require('@/assets/images/reality-wallpaper.png')}
            style={styles.background}
        >
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <TouchableOpacity onPress={() => { resetScore(); router.push('/learn'); }} style={styles.exitTopButton}>
                    <Text style={styles.exitTopText}>Exit</Text>
                </TouchableOpacity>
                <Text style={styles.globalScore}>Score: {score}</Text>
                <View style={styles.grid}>
                    <TouchableOpacity style={styles.iconWrapper} onPress={handleNavigateEmail}>
                        <Image source={require('@/assets/images/mail-icon.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Mail</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper} onPress={handleNavigateMessages}>
                        <Image source={require('@/assets/images/messages-icon.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Messages</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper} onPress={handleNavigateBrowser}>
                        <Image source={require('@/assets/images/browser-icon.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Safari</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper} onPress={handleNavigateCarousell}>
                        <Image source={require('@/assets/images/carosell-icon.png')} style={styles.iconImage} />
                        <Text style={styles.iconLabel}>Carosell</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.dock}>
                    <TouchableOpacity style={styles.dockIcon} onPress={handleNavigateEmail}>
                        <Image source={require('@/assets/images/mail-icon.png')} style={styles.dockImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dockIcon} onPress={handleNavigateMessages}>
                        <Image source={require('@/assets/images/messages-icon.png')} style={styles.dockImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dockIcon} onPress={handleNavigateBrowser}>
                        <Image source={require('@/assets/images/browser-icon.png')} style={styles.dockImage} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dockIcon} onPress={handleNavigateCarousell}>
                        <Image source={require('@/assets/images/carosell-icon.png')} style={styles.dockImage} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover' },
    container: { flex: 1, backgroundColor: 'transparent' },
    exitTopButton: {
        position: 'absolute',
        top: 60,
        right: 10,
        backgroundColor: '#e74c3c',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        zIndex: 10,
    },
    exitTopText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
    globalScore: { color: '#fff', fontSize: 16, textAlign: 'center', marginVertical: 10 },
    grid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: '5%', paddingVertical: '3%', justifyContent: 'space-between', alignContent: 'flex-start' },
    iconWrapper: { width: '22%', height: 90, marginVertical: '3%', alignItems: 'center' },
    iconEmoji: { fontSize: 36, marginBottom: 6, backgroundColor: 'rgba(255,255,255,0.3)', padding: 10, borderRadius: 18 },
    iconLabel: { color: '#000', fontSize: 12 },
    iconImage: { width: 70, height: 70, marginBottom: 6, borderRadius: 12 },
    dock: { flexDirection: 'row', justifyContent: 'space-evenly', backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 8, marginHorizontal: '5%', borderRadius: 20 },
    dockIcon: { width: 70, alignItems: 'center' },
    dockEmoji: { fontSize: 28 },
    dockImage: { width: 70, height: 70, borderRadius: 12 },
}); 