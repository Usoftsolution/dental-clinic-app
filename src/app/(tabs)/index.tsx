import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Empty, ErrorView, IconButton, Loading, Segmented, StateChip, Txt } from '@/components/ui';
import { ApptRow, TodayData } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { fmtDayLong, fmtTime, greeting, isoDay, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

export default function Today() {
  const { me } = useAuth();
  const insets = useSafeAreaInsets();
  const [day, setDay] = useState(() => new Date());
  const [scope, setScope] = useState<'mine' | 'all'>(me && me.doctor ? 'mine' : 'all');
  const { data, error, loading, refreshing, reload } = useApi<TodayData>(
    'today', { date: isoDay(day), scope }, { pollMs: 60000 });

  const shift = (days: number) => {
    const d = new Date(day);
    d.setDate(d.getDate() + days);
    setDay(d);
  };
  const isToday = isoDay(day) === isoDay(new Date());
  const firstName = (me?.doctor ? me.doctor.name : me?.name || '').trim();

  const header = (
    <View style={{ gap: 14, paddingBottom: 6 }}>
      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Txt size={14} weight="500" color={colors.muted}>{fmtDayLong(day)}</Txt>
          <Txt size={24} weight="700" style={{ marginTop: 2 }}>
            {isToday ? greeting(firstName) : fmtDayLong(day)}
          </Txt>
        </View>
        <IconButton icon="settings" label={t('settings')} onPress={() => router.push('/settings')} color={colors.ink2} />
      </View>
      <View style={styles.dayRow}>
        <IconButton icon="chevron-left" flip label={t('previous_day')} onPress={() => shift(-1)} bg={colors.card} />
        <Pressable
          onPress={() => setDay(new Date())}
          accessibilityRole="button"
          style={[styles.todayBtn, isToday && { backgroundColor: colors.plum }]}
        >
          <Txt size={14} weight="700" color={isToday ? '#ffffff' : colors.ink2}>{t('today')}</Txt>
        </Pressable>
        <IconButton icon="chevron-right" flip label={t('next_day')} onPress={() => shift(1)} bg={colors.card} />
      </View>
      <View style={styles.stats}>
        <Stat value={data?.counts.total} label={t('sessions_today')} />
        <Stat value={data?.counts.waiting} label={t('waiting')} color={colors.tealDark} />
        <Stat value={data?.counts.in_chair} label={t('in_chair_now')} color="#8a4b08" />
        <Stat value={data?.counts.done} label={t('done_count')} color="#22672f" />
      </View>
      {data?.can_see_all && me?.doctor ? (
        <Segmented
          value={scope}
          onChange={setScope}
          options={[{ key: 'mine', label: t('my_patients') }, { key: 'all', label: t('whole_clinic') }]}
        />
      ) : null}
    </View>
  );

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 12 }}>
      {loading && !data ? (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>{header}<Loading /></View>
      ) : error && !data ? (
        <View style={{ flex: 1, paddingHorizontal: 20 }}>{header}<ErrorView message={error} onRetry={reload} /></View>
      ) : (
        <FlatList
          data={data?.appointments || []}
          keyExtractor={(a) => String(a.id)}
          ListHeaderComponent={header}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.plum} />}
          ListEmptyComponent={<Empty text={t('nothing_today')} icon="calendar" />}
          renderItem={({ item }) => <Row a={item} showDoctor={scope === 'all' || !me?.doctor} />}
        />
      )}
    </View>
  );
}

function Stat({ value, label, color = colors.ink }: { value?: number; label: string; color?: string }) {
  return (
    <View style={styles.stat}>
      <Txt size={22} weight="700" color={color} numeric>{value ?? '–'}</Txt>
      <Txt size={12} color={colors.muted} numberOfLines={1}>{label}</Txt>
    </View>
  );
}

function Row({ a, showDoctor }: { a: ApptRow; showDoctor: boolean }) {
  const done = a.state === 'done';
  const meta = [showDoctor ? a.doctor : null, a.chair, a.alert ? t('medical_alert_short') : null].filter(Boolean).join(' · ');
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/appointment/[id]', params: { id: String(a.id) } })}
      accessibilityRole="button"
      accessibilityLabel={a.patient + ', ' + fmtTime(a.start)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
    >
      <View style={styles.time}>
        <Txt size={15} weight="600" numeric>{fmtTime(a.start)}</Txt>
        <Txt size={12} color={colors.muted} numeric>{fmtTime(a.stop)}</Txt>
      </View>
      <Card style={[styles.apptCard, a.state === 'in_chair' && styles.inChair, done && { opacity: 0.72 }]}>
        <View style={styles.apptTop}>
          <Txt size={17} weight="700" numberOfLines={1} style={{ flex: 1 }}>{a.patient}</Txt>
          <StateChip state={a.state} />
        </View>
        {a.procedure ? <Txt size={14} color={colors.ink2} style={{ marginTop: 4 }} numberOfLines={2}>{a.procedure}</Txt> : null}
        {meta ? (
          <Txt size={13} color={a.alert ? colors.dangerInk : colors.muted} style={{ marginTop: 6 }} numberOfLines={1}>{meta}</Txt>
        ) : null}
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dayRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  todayBtn: { minHeight: 40, paddingHorizontal: 18, borderRadius: 20, backgroundColor: colors.card, justifyContent: 'center' },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: 14, paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
  row: { flexDirection: 'row', gap: 12 },
  time: { width: 48, paddingTop: 14, alignItems: 'flex-end' },
  apptCard: { flex: 1, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 16 },
  inChair: { borderWidth: 2, borderColor: colors.plum },
  apptTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
