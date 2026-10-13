import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { Button, Card, ErrorView, Loading, MedicalAlert, StateChip, Txt } from '@/components/ui';
import { call, Card as CardData } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { notify } from '@/lib/confirm';
import { fmtDate, fmtDayTime, stateLabel, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

const STEPS = ['draft', 'confirmed', 'arrived', 'in_chair', 'done'];

export default function Appointment() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { me } = useAuth();
  const insets = useSafeAreaInsets();
  const { data, setData, error, loading, refreshing, reload } = useApi<CardData>('appointment', { id: Number(id) });
  const [moving, setMoving] = useState<string | null>(null);

  const move = async (target: string) => {
    if (!data || !data.moves.includes(target) || moving) {
      return;
    }
    setMoving(target);
    try {
      const res = await call<CardData>('appointment_move', { id: data.id, target });
      setData({ ...data, ...res });
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
    } catch (e: any) {
      notify(e?.message);
    } finally {
      setMoving(null);
    }
  };

  if (loading && !data) {
    return <View style={{ flex: 1 }}><Header title={t('appointment')} /><Loading /></View>;
  }
  if (!data) {
    return <View style={{ flex: 1 }}><Header title={t('appointment')} /><ErrorView message={error || ''} onRetry={reload} /></View>;
  }
  const cur = STEPS.indexOf(data.state);
  const phoneDigits = data.phone.replace(/[^\d+]/g, '');
  const waDigits = phoneDigits.replace(/^\+/, '').replace(/^0/, '964');
  const closed = data.state === 'done' || data.state === 'cancelled';

  const fact = (label: string, value: React.ReactNode) => (
    <View style={styles.fact}>
      <Txt size={15} color={colors.muted} style={styles.factLabel}>{label}</Txt>
      <View style={{ flex: 1 }}>{typeof value === 'string' ? <Txt size={15}>{value}</Txt> : value}</View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('appointment')} />
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={reload} tintColor={colors.plum} />}
      >
        <Card style={{ gap: 14, borderRadius: 20 }}>
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <Txt size={13} color={colors.muted} numeric>{data.name}</Txt>
              <Txt size={24} weight="700" style={{ marginTop: 2 }}>{data.patient}</Txt>
            </View>
            <StateChip state={data.state} style={{ marginTop: 4 }} />
          </View>

          <View style={styles.steps} accessibilityRole="radiogroup">
            {STEPS.map((s, i) => {
              const canMove = data.moves.includes(s);
              const past = data.state !== 'cancelled' && i < cur;
              const current = i === cur;
              return (
                <Pressable
                  key={s}
                  onPress={() => move(s)}
                  disabled={!canMove || !!moving}
                  accessibilityRole="button"
                  accessibilityLabel={canMove ? t('set_to', { s: stateLabel(s) }) : stateLabel(s)}
                  accessibilityState={{ selected: current, disabled: !canMove }}
                  style={[
                    styles.step,
                    past && { backgroundColor: colors.plumSoft },
                    current && { backgroundColor: colors.plum },
                    canMove && styles.stepMovable,
                    moving === s && { opacity: 0.5 },
                  ]}
                >
                  <Txt size={13} weight="700" color={current ? '#ffffff' : past || canMove ? colors.plum : colors.muted}>
                    {stateLabel(s)}
                  </Txt>
                </Pressable>
              );
            })}
          </View>

          <View style={{ gap: 10 }}>
            {fact(t('doctor'), (
              <Txt size={15}><Txt size={15} weight="700">{data.doctor}</Txt>{data.specialty ? ' · ' + data.specialty : ''}</Txt>
            ))}
            {fact(t('time'), fmtDayTime(data.start, data.stop))}
            {data.chair ? fact(t('chair'), data.chair) : null}
            {fact(t('procedure'), data.procedure || data.type)}
            {data.phone ? fact(t('phone'), (
              <Txt size={15} color={colors.teal} onPress={() => Linking.openURL('tel:' + phoneDigits)}>{data.phone}</Txt>
            )) : null}
            {fact(t('balance_due'), data.balance > 0
              ? <Txt size={15} weight="700" color={colors.danger} numeric>{data.balance_label}</Txt>
              : <Txt size={15} color={colors.muted}>{t('nothing_due')}</Txt>)}
          </View>
          {data.alert ? <MedicalAlert text={data.alert} /> : null}
        </Card>

        <View style={styles.quick}>
          <Quick icon={<Feather name="phone" size={20} color={colors.teal} />} label={t('call')}
            disabled={!phoneDigits} onPress={() => Linking.openURL('tel:' + phoneDigits)} />
          <Quick icon={<MaterialCommunityIcons name="whatsapp" size={22} color={colors.teal} />} label={t('whatsapp')}
            disabled={!phoneDigits} onPress={() => Linking.openURL('https://wa.me/' + waDigits)} />
          {me?.show_lab !== false ? (
            <Quick icon={<MaterialCommunityIcons name="flask-outline" size={22} color={colors.teal} />} label={t('lab_request')}
              onPress={() => router.push({ pathname: '/lab-request/[id]', params: { id: String(data.id) } })} />
          ) : null}
        </View>

        {data.last_visit ? (
          <Card style={{ gap: 6, paddingVertical: 14 }}>
            <Txt size={13} weight="700" color={colors.muted}>{t('last_visit', { date: fmtDate(data.last_visit.date) })}</Txt>
            {data.last_visit.notes ? <Txt size={15} style={{ lineHeight: 21 }}>{data.last_visit.notes}</Txt> : null}
            {data.last_visit.plan ? (
              <Txt size={15} style={{ lineHeight: 21 }}><Txt size={15} weight="700">{t('next_plan')}: </Txt>{data.last_visit.plan}</Txt>
            ) : null}
          </Card>
        ) : null}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label={closed ? t('view_session') : t('open_session')}
          onPress={() => router.push({ pathname: '/session/[id]', params: { id: String(data.id) } })}
          style={{ flex: 1 }}
          disabled={data.state === 'cancelled'}
        />
        <Button
          label={t('patient_file')}
          kind="secondary"
          onPress={() => router.push({ pathname: '/patient/[id]', params: { id: String(data.patient_id) } })}
          style={{ flex: 1 }}
        />
      </View>
    </View>
  );
}

function Quick({ icon, label, onPress, disabled }: { icon: React.ReactNode; label: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [styles.quickBtn, disabled && { opacity: 0.4 }, pressed && { opacity: 0.75 }]}
    >
      {icon}
      <Txt size={13} weight="600">{label}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  steps: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  step: { minHeight: 34, paddingHorizontal: 10, borderRadius: 6, backgroundColor: colors.segment, justifyContent: 'center' },
  stepMovable: { borderWidth: 1, borderColor: '#d8c4d2', borderStyle: 'dashed' },
  fact: { flexDirection: 'row', gap: 8 },
  factLabel: { width: 104 },
  quick: { flexDirection: 'row', gap: 8 },
  quickBtn: {
    flex: 1, minHeight: 64, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line,
    alignItems: 'center', justifyContent: 'center', gap: 4,
  },
  footer: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: '#e8e2e6',
  },
});
