import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { Header } from '@/components/Header';
import { ToothChart, ToothLegend } from '@/components/ToothChart';
import { Card, Chip, Empty, ErrorView, Loading, MedicalAlert, Segmented, StateChip, Txt } from '@/components/ui';
import { Patient as PatientData } from '@/lib/api';
import { fmtDate, fmtDayTime, isoDay, Key, ltr, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

type Tab = 'chart' | 'history' | 'invoices';

export default function Patient() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, error, loading, refreshing, reload } = useApi<PatientData>('patient', { id: Number(id) });
  const [tab, setTab] = useState<Tab>('chart');
  const [tooth, setTooth] = useState<string | null>(null);

  if (loading && !data) {
    return <View style={{ flex: 1 }}><Header title={t('patient_file')} /><Loading /></View>;
  }
  if (!data) {
    return <View style={{ flex: 1 }}><Header title={t('patient_file')} /><ErrorView message={error || ''} onRetry={reload} /></View>;
  }
  const initials = data.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const info = [
    data.code ? t('file_no', { c: ltr(data.code) }) : null,
    data.age ? t('years', { n: data.age }) : null,
    data.blood_group ? ltr(data.blood_group.toUpperCase()) : null,
    data.phone ? ltr(data.phone) : null,
  ].filter(Boolean).join(' · ');
  const today = isoDay(new Date());
  const todayAppt = data.next.find((a) => a.start && isoDay(new Date(a.start)) === today);
  const selected = tooth || Object.keys(data.history)[0] || null;
  const toothLines = selected ? data.history[selected] || [] : [];
  const toothState = selected ? data.states[selected] || 'healthy' : 'healthy';

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('patient_file')} />
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.plum} />}
      >
        <View style={styles.who}>
          <View style={styles.avatar}><Txt size={20} weight="700" color={colors.plum}>{initials}</Txt></View>
          <View style={{ flex: 1 }}>
            <Txt size={22} weight="700">{data.name}</Txt>
            <Txt size={14} color={colors.muted} style={{ marginTop: 2 }} numeric>{info}</Txt>
          </View>
        </View>
        {data.alert ? <MedicalAlert text={data.alert} /> : null}
        {todayAppt ? (
          <Card onPress={() => router.push({ pathname: '/session/[id]', params: { id: String(todayAppt.id) } })}
            style={styles.todayCard}>
            <View style={{ flex: 1 }}>
              <Txt size={13} color={colors.muted}>{t('today')} · {fmtDayTime(todayAppt.start, todayAppt.stop)}</Txt>
              <Txt size={16} weight="700">{t('open_session')}</Txt>
            </View>
            <StateChip state={todayAppt.state} />
          </Card>
        ) : null}

        <Segmented<Tab>
          value={tab}
          onChange={setTab}
          options={[{ key: 'chart', label: t('chart') }, { key: 'history', label: t('history') }, { key: 'invoices', label: t('invoices') }]}
        />

        {tab === 'chart' ? (
          <>
            <Card style={{ paddingHorizontal: 12 }}>
              <ToothChart states={data.states} selected={selected ? [selected] : []} onPress={setTooth} />
              <ToothLegend states={data.states} />
            </Card>
            {selected ? (
              <Card style={{ gap: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
                  <Txt size={18} weight="700">{t('tooth', { n: selected })}</Txt>
                  <Txt size={14} color={colors.muted}>{t(('ts_' + toothState) as Key)}</Txt>
                </View>
                {toothLines.length ? toothLines.map((l, i) => (
                  <View key={i} style={styles.line}>
                    <Txt size={14} color={colors.muted} style={{ width: 92 }} numeric>{fmtDate(l.date)}</Txt>
                    <Txt size={14} style={{ flex: 1, lineHeight: 20 }}>
                      {l.text}{l.doctor ? ' · ' + l.doctor : ''}{l.status === 'planned' ? ' (' + t('planned_tag') + ')' : ''}
                    </Txt>
                  </View>
                )) : <Txt size={14} color={colors.muted}>{t('no_treatment')}</Txt>}
              </Card>
            ) : null}
            {data.next.length ? (
              <Card style={{ gap: 10 }}>
                <Txt size={15} weight="700">{t('upcoming')}</Txt>
                {data.next.map((a) => (
                  <View key={a.id} style={styles.nextRow}>
                    <Txt size={14} style={{ flex: 1 }}>{fmtDayTime(a.start)} · {a.doctor}</Txt>
                    <StateChip state={a.state} />
                  </View>
                ))}
              </Card>
            ) : null}
          </>
        ) : null}

        {tab === 'history' ? (
          data.visits.length ? data.visits.map((v) => (
            <Card key={v.id} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Txt size={13} color={colors.muted} style={{ flex: 1 }}>{fmtDate(v.date)} · {v.doctor}</Txt>
                <Txt size={13} weight="600" numeric>{v.amount}</Txt>
              </View>
              <Txt size={16} weight="700">{v.title}</Txt>
              {v.notes ? <Txt size={14} color={colors.ink2} style={{ lineHeight: 20 }}>{v.notes}</Txt> : null}
            </Card>
          )) : <Empty text={t('no_visits')} icon="file-text" />
        ) : null}

        {tab === 'invoices' ? (
          <>
            <Card style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flex: 1 }}>
                <Txt size={13} color={colors.muted}>{t('balance_due')}</Txt>
                <Txt size={24} weight="700" color={data.balance.value > 0 ? colors.danger : colors.ink} numeric>
                  {data.balance.value > 0 ? data.balance.label : t('nothing_due')}
                </Txt>
              </View>
            </Card>
            {data.invoices.length ? data.invoices.map((i) => (
              <Card key={i.id} style={styles.invoice}>
                <View style={{ flex: 1 }}>
                  <Txt size={15} weight="600">{i.name}</Txt>
                  <Txt size={13} color={colors.muted}>{fmtDate(i.date)}</Txt>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Txt size={15} weight="600" numeric>{i.amount}</Txt>
                  {i.paid
                    ? <Chip label={t('paid')} bg="#dcf1df" fg="#22672f" />
                    : <Chip label={t('due_amount', { a: i.due })} bg={colors.dangerSoft} fg={colors.dangerInk} />}
                </View>
              </Card>
            )) : <Empty text={t('no_invoices')} icon="file" />}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  who: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingTop: 4 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.plumSoft, alignItems: 'center', justifyContent: 'center' },
  todayCard: { flexDirection: 'row', alignItems: 'center', gap: 8, borderColor: colors.teal, borderWidth: 1.5 },
  line: { flexDirection: 'row', gap: 10 },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  invoice: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
});
