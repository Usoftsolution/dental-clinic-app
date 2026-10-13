import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Card, Chip, Empty, ErrorView, Loading, Segmented, Txt } from '@/components/ui';
import { call, LabOrder } from '@/lib/api';
import { confirm, notify } from '@/lib/confirm';
import { fmtDate, parseDate, t } from '@/lib/i18n';
import { colors, labColors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

type Tab = 'lab' | 'back' | 'warranty';
type LabData = { tab: Tab; counts: { lab: number; back: number }; orders: LabOrder[] };

function badge(o: LabOrder, tab: Tab): { label: string; c: [string, string] } {
  if (tab === 'warranty') {
    const key = o.warranty_status === 'expiring' ? 'expiring' : o.warranty_status === 'expired' ? 'expired' : 'active';
    return { label: t(key === 'expiring' ? 'w_expiring' : key === 'expired' ? 'w_expired' : 'w_active'), c: labColors[key] };
  }
  if (o.state === 'sent') {
    return o.overdue ? { label: t('lab_overdue'), c: labColors.overdue } : { label: t('lab_sent'), c: labColors.sent };
  }
  if (o.state === 'received') {
    return { label: t('lab_received'), c: labColors.received };
  }
  if (o.state === 'rejected') {
    return { label: t('lab_rejected'), c: labColors.rejected };
  }
  return { label: t('lab_delivered'), c: labColors.delivered };
}

function daysLate(due: string | false) {
  const d = parseDate(due);
  if (!d) {
    return 0;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((today.getTime() - d.getTime()) / 86400000);
}

export default function Lab() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('lab');
  const { data, error, loading, refreshing, reload, silentReload } = useApi<LabData>('lab', { tab });

  const fitted = async (o: LabOrder) => {
    if (!(await confirm(t('fitted_confirm'), t('mark_fitted')))) {
      return;
    }
    try {
      await call('lab_deliver', { id: o.id });
      silentReload();
    } catch (e: any) {
      notify(e?.message);
    }
  };

  const tabs = [
    { key: 'lab' as Tab, label: t('tab_at_lab') + (data ? ' · ' + data.counts.lab : '') },
    { key: 'back' as Tab, label: t('tab_back') + (data ? ' · ' + data.counts.back : '') },
    { key: 'warranty' as Tab, label: t('tab_warranty') },
  ];

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 12 }}>
      <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 10 }}>
        <Txt size={26} weight="700">{t('lab_title')}</Txt>
        <Segmented value={tab} onChange={setTab} options={tabs} />
      </View>
      {loading && !data ? <Loading /> : error && !data ? <ErrorView message={error} onRetry={reload} /> : (
        <FlatList
          data={data?.tab === tab ? data.orders : []}
          keyExtractor={(o) => String(o.id)}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.plum} />}
          ListEmptyComponent={loading ? <Loading /> : <Empty text={t('no_lab')} icon="package" />}
          renderItem={({ item: o }) => {
            const b = badge(o, tab);
            const work = o.work + (o.teeth.length ? ' ' + o.teeth.join(', ') : '');
            let line = '';
            let late = false;
            if (tab === 'warranty') {
              line = t('warranty_until', { d: fmtDate(o.warranty_end) });
            } else if (o.state === 'sent') {
              const n = daysLate(o.date_due);
              late = o.overdue && n > 0;
              line = t('due_on', { d: fmtDate(o.date_due, false) }) + (late ? ' · ' + (n === 1 ? t('day_late') : t('days_late', { n })) : '') +
                (o.shade ? ' · ' + o.shade : '');
            } else {
              line = o.state === 'rejected' && o.mismatch ? o.mismatch.split('\n')[0] : t('back_on', { d: fmtDate(o.date_received, false) });
              late = o.state === 'rejected';
            }
            return (
              <Card
                style={{ gap: 6 }}
                onPress={o.appointment_id
                  ? () => router.push({ pathname: '/appointment/[id]', params: { id: String(o.appointment_id) } })
                  : () => router.push({ pathname: '/patient/[id]', params: { id: String(o.patient_id) } })}
                accessibilityLabel={work + ', ' + o.patient}
              >
                <View style={styles.top}>
                  <Txt size={13} color={colors.muted} style={{ flex: 1 }} numberOfLines={1} numeric>{o.ref} · {o.lab}</Txt>
                  <Chip label={b.label} bg={b.c[0]} fg={b.c[1]} />
                </View>
                <Txt size={17} weight="700">{work}</Txt>
                <Txt size={14} color={colors.ink2}>{o.patient} · {o.doctor}</Txt>
                <Txt size={14} weight="600" color={late ? colors.danger : colors.muted}>
                  {line}{o.remakes ? ' · ' + t('remakes', { n: o.remakes }) : ''}
                </Txt>
                {o.state === 'received' && tab === 'back' ? (
                  <Button label={t('mark_fitted')} onPress={() => fitted(o)} style={{ marginTop: 6, minHeight: 44 }} />
                ) : null}
              </Card>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
