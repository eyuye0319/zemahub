import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Image } from 'expo-image';
import { colors } from '../lib/theme';
import { useLanguage } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';
import { Button, Field } from '../components/ui';

export default function AuthScreen() {
  const { t } = useLanguage();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const isRegister = mode === 'register';

  const submit = async () => {
    setError('');
    setSubmitting(true);
    try {
      if (isRegister) await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
      if (router.canGoBack()) router.back();
      else router.replace('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>{isRegister ? t.registerTitle : t.signInTitle}</Text>
        <Text style={styles.subtitle}>{t.authSubtitle}</Text>

        {isRegister ? (
          <Field label={t.name} value={name} onChangeText={setName} autoComplete="name" />
        ) : null}
        <Field label={t.email} value={email} onChangeText={setEmail} keyboardType="email-address" autoComplete="email" />
        <Field
          label={t.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder={isRegister ? t.passwordHint : undefined}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button title={submitting ? t.pleaseWait : isRegister ? t.register : t.signIn} onPress={submit} disabled={submitting} />

        <Pressable
          onPress={() => {
            setMode(isRegister ? 'login' : 'register');
            setError('');
          }}
          style={{ padding: 12 }}
        >
          <Text style={styles.switch}>{isRegister ? t.haveAccount : t.noAccount}</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: 24, gap: 14 },
  logo: { width: 64, height: 64, borderRadius: 16, alignSelf: 'center', marginTop: 8 },
  title: { color: colors.gold300, fontSize: 22, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: colors.textMuted, fontSize: 13, textAlign: 'center', lineHeight: 19, marginBottom: 6 },
  error: { color: colors.danger, fontSize: 13 },
  switch: { color: colors.gold400, textAlign: 'center', fontWeight: '600' }
});
