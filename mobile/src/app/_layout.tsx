import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LanguageProvider } from '../lib/i18n';
import { AuthProvider } from '../context/AuthContext';
import { CatalogProvider } from '../context/CatalogContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { colors } from '../lib/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <CatalogProvider>
            <FavoritesProvider>
              <StatusBar style="light" />
              <Stack
                screenOptions={{
                  headerStyle: { backgroundColor: colors.burgundy950 },
                  headerTintColor: colors.gold300,
                  headerTitleStyle: { fontWeight: '700' },
                  contentStyle: { backgroundColor: colors.background }
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="media/[type]/[id]" options={{ title: '' }} />
                <Stack.Screen name="search" options={{ title: '' }} />
                <Stack.Screen name="auth" options={{ presentation: 'modal', title: '' }} />
              </Stack>
            </FavoritesProvider>
          </CatalogProvider>
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
