import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { MediaComment, MediaType } from '../lib/types';
import { api } from '../lib/api';
import { colors, radius } from '../lib/theme';
import { timeAgo, useLanguage } from '../lib/i18n';
import { useAuth } from '../context/AuthContext';

export default function CommentsSection({ type, id }: { type: MediaType; id: string }) {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [comments, setComments] = useState<MediaComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api<{ comments: MediaComment[] }>(`/api/comments/${type}/${id}`)
      .then((data) => !cancelled && setComments(data.comments))
      .catch(() => !cancelled && setComments([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  const post = async () => {
    if (!text.trim()) return;
    setPosting(true);
    setError('');
    try {
      const comment = await api<MediaComment>(`/api/comments/${type}/${id}`, { method: 'POST', body: { text } });
      setComments((prev) => [comment, ...prev]);
      setText('');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setPosting(false);
    }
  };

  const remove = (commentId: string) =>
    Alert.alert(t.delete, t.deleteCommentConfirm, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: async () => {
          try {
            await api(`/api/comments/${commentId}`, { method: 'DELETE' });
            setComments((prev) => prev.filter((c) => c.id !== commentId));
          } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
          }
        }
      }
    ]);

  return (
    <View style={styles.wrap}>
      {user ? (
        <View style={styles.form}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t.commentPlaceholder}
            placeholderTextColor={colors.textFaint}
            style={styles.input}
            multiline
            maxLength={1000}
          />
          <Pressable onPress={post} disabled={posting || !text.trim()} style={[styles.send, (!text.trim() || posting) && { opacity: 0.5 }]}>
            {posting ? <ActivityIndicator color={colors.burgundy950} /> : <Ionicons name="send" size={18} color={colors.burgundy950} />}
          </Pressable>
        </View>
      ) : (
        <Pressable onPress={() => router.push('/auth')} style={styles.signIn}>
          <Ionicons name="log-in-outline" size={18} color={colors.gold300} />
          <Text style={styles.signInText}>{t.signInToComment}</Text>
        </Pressable>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator color={colors.gold400} style={{ marginTop: 16 }} />
      ) : comments.length === 0 ? (
        <Text style={styles.empty}>{t.commentsEmpty}</Text>
      ) : (
        comments.map((c) => (
          <View key={c.id} style={styles.comment}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{c.userName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.commentHead}>
                <Text style={styles.commentName} numberOfLines={1}>
                  {c.userName}
                  <Text style={styles.commentTime}>{'  '}{timeAgo(c.createdAt, t)}</Text>
                </Text>
                {user && (user.id === c.userId || isAdmin) ? (
                  <Pressable hitSlop={10} onPress={() => remove(c.id)}>
                    <Ionicons name="trash-outline" size={16} color={colors.textFaint} />
                  </Pressable>
                ) : null}
              </View>
              <Text style={styles.commentText}>{c.text}</Text>
            </View>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  form: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.burgundy950,
    color: colors.text,
    fontSize: 14
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.gold500,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signIn: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.borderStrong
  },
  signInText: { color: colors.gold300, fontWeight: '700' },
  error: { color: colors.danger, fontSize: 13 },
  empty: { color: colors.textFaint, fontStyle: 'italic', fontSize: 13 },
  comment: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.burgundy800,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: { color: colors.gold400, fontWeight: '800' },
  commentHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  commentName: { flex: 1, color: colors.text, fontWeight: '700', fontSize: 13 },
  commentTime: { color: colors.textFaint, fontWeight: '400', fontSize: 11 },
  commentText: { color: colors.textMuted, fontSize: 14, marginTop: 2, lineHeight: 20 }
});
