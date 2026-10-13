import { router } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Empty, ErrorView, IconButton, Loading, Segmented, Txt } from '@/components/ui';
import { Figures } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { fmtRange, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

type Period = 'month' | 'last_month' | 'year';

function compact(n: number) {
  if (Math.abs(n) >= 1e6) {
    return (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + 'M';
  }
  if (Math.abs(n) >= 1e3) {
    return Math.round(n / 1e3) + 'K';
  }
  return String(Math.round(n));
}

export default function Me() {
  const { me } = useAuth();
  const insets = useSafeAreaInsets();
  const [period, setPeriod] = useState<Period>('month');
  const { data, error, loading, refreshing, reload } = useApi<Figures>('figures', { period });
  const max = Math.max(1, ...(data?.weeks || []).map((w) => w.value));
  const lastWithValue = (data?.weeks || []).reduce((acc, w, i) => (w.value > 0 ? i : acc), -1);

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 12 }}>
      <View style={styles.head}>
        <View style={{ flex: 1 }}>
          <Txt size={26} weight="700">{t('my_figures')}</Txt>
          <Txt size={14} color={colors.muted} numberOfLines={1}>
            {data?.whole_clinic ? t('clinic_figures') : me?.doctor ? me.doctor.name + (me.doctor.specialty ? ' · ' + me.doctor.specialty : '') : me?.name}
          </Txt>
        </View>
        <IconButton icon="settings" label={t('settings')} onPress={() => router.push('/settings')} color={colors.ink2} />
      </View>
      <View style={{ paddingHorizontal: 20, paddingBottom: 10 }}>
        <Segmented<Period>
          value={period}
          onChange={setPeriod}
          options={[{ key: 'month', label: t('this_month') }, { key: 'last_month', label: t('last_month') }, { key: 'year', label: t('this_year') }]}
        />
      </View>
      {loading && !data ? <Loading /> : error && !data ? <ErrorView message={error} onRetry={reload} /> : data && !data.linked ? (
        <Empty text={t('not_linked')} icon="user-x" />
      ) : data ? (
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.plum} />}
        >
          <Card>
            <Txt size={14} color={colors.muted}>{t('income_invoiced')}</Txt>
            <Txt size={30} weight="700" numeric>{data.invoiced.label}</Txt>
            <Txt size={14} color={colors.muted} numeric>
              {data.invoiced.value - data.collected.value > 0.5
                ? t('collected_due', { c: data.collected.label, d: compact(data.invoiced.value - data.collected.value) })
                : data.invoiced.value ? t('all_collected') : ' '}
            </Txt>
          </Card>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Card style={{ flex: 1, padding: 14 }}>
              {data.my_share ? (
                <>
                  <Txt size={13} color={colors.muted}>{t('my_share', { r: data.my_rate ?? 0 })}</Txt>
                  <Txt size={19} weight="700" numeric>{data.my_share.label}</Txt>
                </>
              ) : (
                <>
                  <Txt size={13} color={colors.muted}>{t('outstanding')}</Txt>
                  <Txt size={19} weight="700" numeric>{data.due.label}</Txt>
                </>
              )}
            </Card>
            <Card style={{ flex: 1, padding: 14 }}>
              <Txt size={13} color={colors.muted}>{t('sessions_done')}</Txt>
              <Txt size={19} weight="700" numeric>{data.sessions_done}</Txt>
            </Card>
          </View>

          {data.weeks.length ? (
            <Card style={{ gap: 12 }} accessibilityLabel={t('income_by_week')}>
              <Txt size={15} weight="700">{t('income_by_week')}</Txt>
              <View style={styles.bars}>
                {data.weeks.map((w, i) => {
                  const h = Math.max(2, Math.round((w.value / max) * 110));
                  return (
                    <View key={w.from} style={styles.barCol}>
                      <Txt size={12} weight="700" numeric>{w.value ? compact(w.value) : ''}</Txt>
                      <View style={[styles.bar, { height: h, backgroundColor: i === lastWithValue ? colors.teal : '#9fcfcd' }]} />
                    </View>
                  );
                })}
              </View>
              <View style={styles.barLabels}>
                {data.weeks.map((w) => (
                  <Txt key={w.from} size={11.5} color={colors.muted} style={styles.barLabel} numberOfLines={1}>
                    {fmtRange(w.from, w.to)}
                  </Txt>
                ))}
              </View>
            </Card>
          ) : null}

          <Card style={{ gap: 10 }}>
            <Txt size={15} weight="700">{t('top_procedures')}</Txt>
            {data.procedures.length ? data.procedures.slice(0, 6).map((p) => (
              <View key={p.name} style={styles.procRow}>
                <Txt size={15} style={{ flex: 1 }} numberOfLines={1}>{p.name}</Txt>
                <Txt size={14} color={colors.muted} numeric>× {p.count}</Txt>
                <Txt size={15} weight="600" style={{ minWidth: 92, textAlign: 'right' }} numeric>{p.label}</Txt>
              </View>
            )) : <Txt size={14} color={colors.muted}>{t('no_data')}</Txt>}
          </Card>
        </ScrollView>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, paddingHorizontal: 20, paddingBottom: 12 },
  bars: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 140 },
  barCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  bar: { width: '100%', maxWidth: 44, borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  barLabels: { flexDirection: 'row', gap: 10, borderTopWidth: 1, borderTopColor: '#e8e2e6', paddingTop: 6 },
  barLabel: { flex: 1, textAlign: 'center' },
  procRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
});
