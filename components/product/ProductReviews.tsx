import { useState } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/Text';
import { PressableScale } from '@/components/ui/Motion';
import { reviewsApi } from '@/lib/data/endpoints';
import { toast } from '@/lib/store/toastStore';
import { Colors } from '@/constants/colors';

function Stars({ n, size = 12, onPick }: { n: number; size?: number; onPick?: (v: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 2 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons key={i} name={i <= n ? 'star' : 'star-outline'} size={size} color="#E8A838" onPress={onPick ? () => onPick(i) : undefined} />
      ))}
    </View>
  );
}

export function ProductReviews({ productId }: { productId: string }) {
  const qc = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: ['reviews', productId], queryFn: () => reviewsApi.list(productId) });
  const [writing, setWriting] = useState(false);
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await reviewsApi.create(productId, { rating, body: body.trim() });
      setBody(''); setRating(5); setWriting(false);
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
      toast.success('Review posted — thank you!');
    } catch {
      toast.error('Could not post your review.');
    } finally {
      setSubmitting(false);
    }
  };

  const markHelpful = (id: string) => {
    reviewsApi.helpful(id).catch(() => {});
    qc.setQueryData(['reviews', productId], (old: any) => old?.map((r: any) => (r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r)));
  };

  const list = reviews ?? [];
  const avg = list.length ? (list.reduce((n, r) => n + r.rating, 0) / list.length).toFixed(1) : '0.0';

  return (
    <View style={s.wrap}>
      <View style={s.head}>
        <View>
          <Text style={s.title}>Reviews</Text>
          {!!list.length && (
            <View style={s.avgRow}>
              <Stars n={Math.round(Number(avg))} size={13} />
              <Text style={s.avgText}>{avg} · {list.length} review{list.length === 1 ? '' : 's'}</Text>
            </View>
          )}
        </View>
        <PressableScale style={s.writeBtn} onPress={() => setWriting(v => !v)}>
          <Ionicons name={writing ? 'close' : 'create-outline'} size={14} color={Colors.brand.plum} />
          <Text style={s.writeText}>{writing ? 'Cancel' : 'Write'}</Text>
        </PressableScale>
      </View>

      {writing && (
        <View style={s.form}>
          <Text style={s.formLabel}>Your rating</Text>
          <Stars n={rating} size={26} onPick={setRating} />
          <TextInput
            style={s.input}
            placeholder="Share what you thought…"
            placeholderTextColor={Colors.text.muted}
            value={body}
            onChangeText={setBody}
            multiline
          />
          <PressableScale style={[s.submitBtn, (!body.trim() || submitting) && { opacity: 0.5 }]} onPress={submit} disabled={!body.trim() || submitting}>
            {submitting ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={s.submitText}>Post Review</Text>}
          </PressableScale>
        </View>
      )}

      {isLoading ? (
        <ActivityIndicator style={{ marginVertical: 20 }} color={Colors.brand.plum} />
      ) : list.length === 0 ? (
        <Text style={s.empty}>No reviews yet — be the first.</Text>
      ) : (
        list.map(r => (
          <View key={r.id} style={s.card}>
            <View style={s.cardHead}>
              <Text style={s.author}>{r.author}</Text>
              <Stars n={r.rating} />
            </View>
            {r.title ? <Text style={s.reviewTitle}>{r.title}</Text> : null}
            <Text style={s.body}>{r.body}</Text>
            <PressableScale style={s.helpful} onPress={() => markHelpful(r.id)}>
              <Ionicons name="thumbs-up-outline" size={12} color={Colors.text.muted} />
              <Text style={s.helpfulText}>Helpful ({r.helpfulCount})</Text>
            </PressableScale>
          </View>
        ))
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { marginTop: 8 },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text.primary },
  avgRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  avgText: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: Colors.text.muted },
  writeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: Colors.blush, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  writeText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.brand.plum },
  form: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, gap: 10, marginBottom: 14 },
  formLabel: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: Colors.text.secondary },
  input: { minHeight: 70, borderWidth: 1.5, borderColor: Colors.border.light, borderRadius: 12, padding: 12, fontFamily: 'DMSans_400Regular', fontSize: 13.5, color: Colors.text.primary, textAlignVertical: 'top' },
  submitBtn: { height: 44, borderRadius: 12, backgroundColor: Colors.brand.plum, alignItems: 'center', justifyContent: 'center' },
  submitText: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: '#FFFFFF' },
  empty: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.muted, marginVertical: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, marginBottom: 10, gap: 6 },
  cardHead: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  author: { fontFamily: 'DMSans_700Bold', fontSize: 13.5, color: Colors.text.primary },
  reviewTitle: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Colors.text.primary },
  body: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Colors.text.secondary, lineHeight: 19 },
  helpful: { flexDirection: 'row', alignItems: 'center', gap: 5, alignSelf: 'flex-start', marginTop: 4 },
  helpfulText: { fontFamily: 'DMSans_500Medium', fontSize: 11.5, color: Colors.text.muted },
});
