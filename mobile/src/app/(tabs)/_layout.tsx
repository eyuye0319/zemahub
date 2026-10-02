import React from 'react';
import type { ColorValue } from 'react-native';
import { Tabs } from 'expo-router/js-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../lib/theme';
import { useLanguage } from '../../lib/i18n';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function TabLayout() {
  const { t } = useLanguage();

  const icon = (name: IconName) => ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={name} size={size} color={color} />
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.gold400,
        tabBarInactiveTintColor: colors.textFaint,
        tabBarStyle: { backgroundColor: colors.burgundy950, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.background }
      }}
    >
      <Tabs.Screen name="index" options={{ title: t.tabHome, tabBarIcon: icon('home') }} />
      <Tabs.Screen name="mezmur" options={{ title: t.tabMezmur, tabBarIcon: icon('musical-notes') }} />
      <Tabs.Screen name="films" options={{ title: t.tabFilms, tabBarIcon: icon('film') }} />
      <Tabs.Screen name="saved" options={{ title: t.tabSaved, tabBarIcon: icon('heart') }} />
      <Tabs.Screen name="profile" options={{ title: t.tabProfile, tabBarIcon: icon('person-circle') }} />
    </Tabs>
  );
}
