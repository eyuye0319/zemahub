import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, radius } from '../lib/theme';
import { useLanguage } from '../lib/i18n';

/** Top bar shared by the tab screens: logo, language switch and search. */
export default function AppHeader({ title }: { title?: string }) {
  const { lang, setLang } = useLanguage();
  return (
    <View style={styles.header}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.brand} numberOfLines={1}>
        {title ?? (lang === 'am' ? 'ዜማሀብ' : 'ZemaHub')}
      </Text>
      <Pressable onPress={() => setLang(lang === 'am' ? 'en' : 'am')} style={styles.langToggle} hitSlop={6}>
        <Text style={styles.langText}>{lang === 'am' ? 'EN' : 'አማ'}</Text>
      </Pressable>
      <Pressable onPress={() => router.push('/search')} style={styles.iconButton} hitSlop={6}>
        <Ionicons name="search" size={20} color={colors.gold400} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.burgundy950,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  logo: { width: 34, height: 34, borderRadius: 9 },
  brand: { flex: 1, color: colors.gold400, fontSize: 20, fontWeight: '800', letterSpacing: 0.5 },
  langToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border
  },
  langText: { color: colors.gold300, fontWeight: '700', fontSize: 12 },
  iconButton: { padding: 8, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border }
});
