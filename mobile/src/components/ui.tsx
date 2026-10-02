// Small shared UI building blocks.
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CategoryInfo } from '../lib/types';
import { colors, radius } from '../lib/theme';
import { useLanguage } from '../lib/i18n';

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionAccent} />
      <Text style={styles.sectionTitle}>{title}</Text>
      {action && onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={styles.sectionAction}>{action} ›</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function CategoryChips({
  categories,
  selected,
  onSelect
}: {
  categories: CategoryInfo[];
  selected: string;
  onSelect: (id: string) => void;
}) {
  const { t, pick } = useLanguage();
  const items = [{ id: 'all', label: t.all }, ...categories.map((c) => ({ id: c.id, label: pick(c.nameAmharic, c.nameEnglish) }))];
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      {items.map((c) => {
        const active = c.id === selected;
        return (
          <Pressable key={c.id} onPress={() => onSelect(c.id)} style={[styles.chip, active && styles.chipActive]}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{c.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Loading / error placeholder. Explains the free server's cold start if loading takes a while. */
export function StateView({ loading, error, onRetry }: { loading: boolean; error?: string; onRetry?: () => void }) {
  const { t } = useLanguage();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <View style={styles.state}>
      {loading ? (
        <>
          <ActivityIndicator color={colors.gold400} size="large" />
          <Text style={styles.stateText}>{slow ? t.wakingServer : t.loading}</Text>
        </>
      ) : (
        <>
          <Text style={styles.stateText}>{error}</Text>
          {onRetry ? <Button title={t.retry} onPress={onRetry} /> : null}
        </>
      )}
    </View>
  );
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        variant === 'danger' && styles.buttonDanger,
        (pressed || disabled) && { opacity: 0.6 }
      ]}
    >
      <Text style={[styles.buttonText, variant !== 'primary' && styles.buttonTextAlt]}>{title}</Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ gap: 6 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.textFaint} autoCapitalize="none" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.burgundy950,
    color: colors.text,
    fontSize: 15
  },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  sectionAccent: { width: 4, height: 18, borderRadius: 2, backgroundColor: colors.gold500 },
  sectionTitle: { flex: 1, color: colors.text, fontSize: 17, fontWeight: '800' },
  sectionAction: { color: colors.gold400, fontSize: 13, fontWeight: '600' },
  chips: { gap: 8, paddingHorizontal: 16, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface
  },
  chipActive: { backgroundColor: colors.gold500, borderColor: colors.gold400 },
  chipText: { color: colors.textMuted, fontSize: 13, fontWeight: '600' },
  chipTextActive: { color: colors.burgundy950 },
  state: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 32 },
  stateText: { color: colors.textMuted, fontSize: 14, textAlign: 'center', lineHeight: 21 },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    backgroundColor: colors.gold500,
    alignItems: 'center'
  },
  buttonSecondary: { backgroundColor: colors.surfaceRaised, borderWidth: 1, borderColor: colors.borderStrong },
  buttonDanger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(248,113,113,0.5)' },
  buttonText: { color: colors.burgundy950, fontSize: 15, fontWeight: '800' },
  buttonTextAlt: { color: colors.gold300 }
});
