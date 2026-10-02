import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { API_URL } from '../../lib/api';
import { colors, radius } from '../../lib/theme';
import { useLanguage } from '../../lib/i18n';
import { useAuth } from '../../context/AuthContext';
import AppHeader from '../../components/AppHeader';
import { Button, Field } from '../../components/ui';

export default function ProfileScreen() {
  const { t, lang, setLang } = useLanguage();
  const { user, isAdmin, logout, changePassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  const submitPassword = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await changePassword(current, next);
      setCurrent('');
      setNext('');
      setMessage({ text: t.passwordChanged, ok: true });
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : String(err), ok: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <AppHeader title={t.tabProfile} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {/* Account card */}
        <View style={styles.card}>
          <View style={[styles.avatar, isAdmin && styles.avatarAdmin]}>
            <Ionicons name={isAdmin ? 'shield' : 'person'} size={26} color={isAdmin ? colors.burgundy950 : colors.gold400} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user ? user.name : t.guest}</Text>
            {user ? <Text style={styles.email}>{user.email}</Text> : null}
            {user ? (
              <Text style={[styles.role, isAdmin && { color: colors.gold400 }]}>{isAdmin ? t.roleAdmin : t.roleUser}</Text>
            ) : null}
          </View>
        </View>

        {!user ? (
          <>
            <Text style={styles.hint}>{t.authSubtitle}</Text>
            <Button title={t.signIn} onPress={() => router.push('/auth')} />
          </>
        ) : null}

        {/* Language */}
        <Text style={styles.sectionLabel}>{t.appLanguage}</Text>
        <View style={styles.segment}>
          {(['am', 'en'] as const).map((l) => (
            <Pressable key={l} onPress={() => setLang(l)} style={[styles.segmentItem, lang === l && styles.segmentActive]}>
              <Text style={[styles.segmentText, lang === l && styles.segmentTextActive]}>{l === 'am' ? 'አማርኛ' : 'English'}</Text>
            </Pressable>
          ))}
        </View>

        {isAdmin ? (
          <View style={styles.adminBox}>
            <Text style={styles.hint}>{t.adminHint}</Text>
            <Button title={t.openWebsite} variant="secondary" onPress={() => Linking.openURL(API_URL)} />
          </View>
        ) : null}

        {user ? (
          <>
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.rowButton}>
              <Ionicons name="key-outline" size={18} color={colors.gold400} />
              <Text style={styles.rowButtonText}>{t.changePassword}</Text>
              <Ionicons name={showPassword ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textFaint} />
            </Pressable>
            {showPassword ? (
              <View style={styles.passwordBox}>
                <Field label={t.currentPassword} value={current} onChangeText={setCurrent} secureTextEntry />
                <Field label={t.newPassword} value={next} onChangeText={setNext} secureTextEntry placeholder={t.passwordHint} />
                {message ? <Text style={{ color: message.ok ? colors.success : colors.danger }}>{message.text}</Text> : null}
                <Button title={saving ? t.pleaseWait : t.changePassword} onPress={submitPassword} disabled={saving || !current || next.length < 6} />
              </View>
            ) : null}

            <Button title={t.signOut} variant="danger" onPress={logout} />
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 40 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.burgundy800,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarAdmin: { backgroundColor: colors.gold500 },
  name: { color: colors.text, fontSize: 18, fontWeight: '800' },
  email: { color: colors.textFaint, fontSize: 13, marginTop: 2 },
  role: { color: colors.textMuted, fontSize: 12, fontWeight: '700', marginTop: 4 },
  hint: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
  sectionLabel: { color: colors.textFaint, fontSize: 12, fontWeight: '700', marginTop: 6 },
  segment: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.burgundy950,
    borderWidth: 1,
    borderColor: colors.border
  },
  segmentItem: { flex: 1, paddingVertical: 10, borderRadius: radius.sm, alignItems: 'center' },
  segmentActive: { backgroundColor: colors.gold500 },
  segmentText: { color: colors.textMuted, fontWeight: '700' },
  segmentTextActive: { color: colors.burgundy950 },
  adminBox: {
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: 'rgba(212,175,55,0.08)'
  },
  rowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  rowButtonText: { flex: 1, color: colors.text, fontWeight: '700' },
  passwordBox: { gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.surface }
});
