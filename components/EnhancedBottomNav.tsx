import React, { useRef, useEffect, useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useSegments } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '../app/context/UserContext';

interface NavItem {
    id: string;
    label: string;
    icon: string;
    route: string;
    onPress?: () => void;
}

interface EnhancedBottomNavProps {
    activeTab?: string;
    onTabPress?: (tabId: string) => void;
}

const { width } = Dimensions.get('window');

// Hook to determine current active tab based on route
const useCurrentTab = () => {
    const segments = useSegments();
    const currentPath = '/' + segments.join('/');

    if (currentPath.includes('/scam-detection') || currentPath === '/(tabs)') {
        return 'home';
    } else if (currentPath.includes('/learn')) {
        return 'learn';
    } else if (currentPath.includes('/analytics')) {
        return 'analytics';
    } else if (currentPath.includes('/forum')) {
        return 'forum';
    } else if (currentPath.includes('/my-info')) {
        return 'myInfo';
    }
    return 'home'; // default
};

export default function EnhancedBottomNav({ activeTab: propActiveTab, onTabPress }: EnhancedBottomNavProps) {
    const { isGuestMode } = useUser();
    
    const navItems: NavItem[] = [
        { id: 'home', label: 'Home', icon: 'home', route: '/scam-detection' },
        { id: 'learn', label: 'Learn', icon: 'book', route: '/learn' },
        { id: 'analytics', label: 'Analytics', icon: 'bar-chart', route: '/analytics' },
        { id: 'forum', label: 'Forum', icon: 'comments', route: '/forum' },
        { id: 'myInfo', label: 'My Info', icon: 'user', route: '/(tabs)/my-info' },
    ];

    const insets = useSafeAreaInsets();
    const currentTabFromRoute = useCurrentTab();
    const activeTab = propActiveTab || currentTabFromRoute;

    // Show login prompt for guest users trying to access restricted pages
    const showLoginPrompt = (tabLabel: string) => {
        Alert.alert(
            "Login Required",
            `To access ${tabLabel}, you need to login to your account. Would you like to login now?`,
            [
                {
                    text: "No",
                    style: "cancel",
                    onPress: () => {
                        // Keep user on home page
                        router.push('/scam-detection');
                    }
                },
                {
                    text: "Yes",
                    onPress: () => {
                        // Direct to login page
                        router.push('/');
                    }
                }
            ]
        );
    };

    const activeIndexRef = useRef(0);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const scaleAnimations = useRef(
        navItems.map(() => new Animated.Value(1))
    ).current;

    // Initialize the indicator position on mount
    useEffect(() => {
        const initialIndex = navItems.findIndex(item => item.id === activeTab);
        if (initialIndex !== -1) {
            activeIndexRef.current = initialIndex;
            slideAnimation.setValue(initialIndex);
        }
    }, []);

    useEffect(() => {
        const activeIndex = navItems.findIndex(item => item.id === activeTab);
        if (activeIndex !== -1 && activeIndex !== activeIndexRef.current) {
            activeIndexRef.current = activeIndex;

            // Enhanced smooth sliding animation
            Animated.spring(slideAnimation, {
                toValue: activeIndex,
                useNativeDriver: true,
                tension: 120,
                friction: 7,
                velocity: 0,
            }).start();
        }
    }, [activeTab, slideAnimation]);

    const handlePress = (item: NavItem, index: number) => {
        // Improved scale animation on press
        Animated.sequence([
            Animated.timing(scaleAnimations[index], {
                toValue: 0.9,
                duration: 80,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnimations[index], {
                toValue: 1,
                useNativeDriver: true,
                tension: 300,
                friction: 10,
            }),
        ]).start();

        // Check if guest user is trying to access restricted pages
        if (isGuestMode && item.id !== 'home') {
            showLoginPrompt(item.label);
            return;
        }

        // Custom onPress or default navigation
        if (onTabPress) {
            onTabPress(item.id);
        }
        if (item.onPress) {
            item.onPress();
        } else {
            router.push(item.route as any);
        }
    };

    const indicatorTranslateX = slideAnimation.interpolate({
        inputRange: navItems.map((_, index) => index),
        outputRange: navItems.map((_, index) => {
            const tabWidth = width / navItems.length;
            const indicatorWidth = 50;
            return (tabWidth * index) + (tabWidth - indicatorWidth) / 2;
        }),
        extrapolate: 'clamp',
    });

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom * 0.3, 2) }]}>
            {/* Gradient overlay for seamless blending */}
            <View style={styles.gradientOverlay} />

            {/* Active Tab Indicator */}
            <Animated.View
                style={[
                    styles.activeIndicator,
                    {
                        transform: [{ translateX: indicatorTranslateX }],
                    },
                ]}
            />

            {/* Navigation Items */}
            <View style={styles.navContainer}>
                {navItems.map((item, index) => {
                    const isActive = activeTab === item.id;

                    return (
                        <Animated.View
                            key={item.id}
                            style={[
                                styles.navItemContainer,
                                { transform: [{ scale: scaleAnimations[index] }] },
                            ]}
                        >
                            <TouchableOpacity
                                style={[
                                    styles.navItem,
                                    isActive && styles.activeNavItem,
                                ]}
                                onPress={() => handlePress(item, index)}
                                activeOpacity={0.7}
                            >
                                <View style={[
                                    styles.iconContainer,
                                    isActive && styles.activeIconContainer,
                                ]}>
                                    <FontAwesome
                                        name={item.icon as any}
                                        size={isActive ? 24 : 22}
                                        color={isActive ? '#fff' : '#999'}
                                    />
                                </View>
                                <Text
                                    style={[
                                        styles.navText,
                                        isActive && styles.activeNavText,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#000',
        paddingTop: 4,
        position: 'relative',
    },
    gradientOverlay: {
        position: 'absolute',
        top: -15,
        left: 0,
        right: 0,
        height: 15,
        backgroundColor: 'transparent',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -6 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        height: 3,
        width: 50,
        backgroundColor: '#007AFF',
        borderRadius: 1.5,
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 4,
    },
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingTop: 6,
    },
    navItemContainer: {
        flex: 1,
        alignItems: 'center',
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
        paddingHorizontal: 8,
        borderRadius: 10,
        minHeight: 42,
    },
    activeNavItem: {
        backgroundColor: 'rgba(0, 122, 255, 0.15)',
        transform: [{ scale: 1.05 }],
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 3,
        padding: 4,
        borderRadius: 8,
    },
    activeIconContainer: {
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        shadowColor: '#007AFF',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    navText: {
        fontSize: 9,
        fontWeight: '500',
        color: '#999',
        textAlign: 'center',
        marginTop: 0.5,
    },
    activeNavText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 9,
    },
}); 