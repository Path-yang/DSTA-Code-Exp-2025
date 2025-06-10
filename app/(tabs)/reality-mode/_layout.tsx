import React from 'react';
import { Stack } from 'expo-router';
import { ScoreProvider } from './_ScoreContext';

export default function RealityModeLayout() {
    return (
        <ScoreProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ScoreProvider>
    );
} 