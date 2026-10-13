import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { ToothChart } from '@/components/ToothChart';
import { Button, Card, ErrorView, Loading, Pill, Txt } from '@/components/ui';
import { ApptRow, call, LabOrder } from '@/lib/api';
import { notify } from '@/lib/confirm';
import { fontFamily } from '@/lib/fonts';
import { isRTL, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

type Options = {
  appointment: ApptRow;
  work_types: { id: number; name: string; lead_days: number; warranty_months: number }[];
  labs: { id: number; name: string }[];
  teeth: string[];
};

export default function LabRequest() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data, error, loading, reload } = useApi<Options>('lab_options', { id: Number(id) });
  const [work, setWork] = useState<number | null>(null);
  const [lab, setLab] = useState<number | null>(null);
  const [teeth, setTeeth] = useState<string[]>([]);
  const [shade, setShade] = useState('');
  const [instructions, setInstructions] = useState('');
  const [busy, setBusy] = useState<'send' | 'draft' | null>(null);

  if (loading && !data) {
    return <View style={{ flex: 1 }}><Header title={t('new_lab')} /><Loading /></View>;
  }
  if (!data) {
    return <View style={{ flex: 1 }}><Header title={t('new_lab')} /><ErrorView message={error || ''} onRetry={reload} /></View>;
  }

  const labId = lab ?? (data.labs.length === 1 ? data.labs[0].id : null);
  const save = async (send: boolean) => {
    if (!work || !labId) {
      notify(t('need_lab'));
      return;
    }
    setBusy(send ? 'send' : 'draft');
    try {
      const res = await call<LabOrder>('lab_create', {
        id: data.appointment.id, work_type_id: work, lab_id: labId, teeth, shade, instructions, send,
      });
      notify(t('lab_created', { ref: res.ref }));
      router.back();
    } catch (e: any) {
      notify(e?.message);
      setBusy(null);
    }
  };
  const inputBase = { fontFamily: fontFamily('400'), textAlign: isRTL() ? 'right' as const : 'left' as const };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header title={t('new_lab')} subtitle={data.appointment.patient} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12 }} keyboardShouldPersistTaps="handled">
        <Card style={{ gap: 10 }}>
          <Txt size={15} weight="700">{t('work_type')}</Txt>
          <View style={styles.wrap}>
            {data.work_types.map((w) => <Pill key={w.id} label={w.name} on={work === w.id} onPress={() => setWork(w.id)} />)}
          </View>
        </Card>
        <Card style={{ gap: 10 }}>
          <Txt size={15} weight="700">{t('laboratory')}</Txt>
          <View style={styles.wrap}>
            {data.labs.map((l) => <Pill key={l.id} label={l.name} on={labId === l.id} onPress={() => setLab(l.id)} />)}
          </View>
        </Card>
        <Card style={{ paddingHorizontal: 12, gap: 8 }}>
          <Txt size={15} weight="700" style={{ paddingHorizontal: 4 }}>
            {teeth.length ? t('selected', { t: [...teeth].sort().join(', ') }) : t('tap_teeth')}
          </Txt>
          <ToothChart mode="select" selected={teeth} available={data.teeth}
            onPress={(n) => setTeeth((c) => (c.includes(n) ? c.filter((x) => x !== n) : [...c, n]))} />
        </Card>
        <Card style={{ gap: 10 }}>
          <TextInput value={shade} onChangeText={setShade} placeholder={t('shade')} placeholderTextColor="#9a929d"
            autoCapitalize="characters" style={[styles.input, inputBase]} accessibilityLabel={t('shade')} />
          <TextInput value={instructions} onChangeText={setInstructions} placeholder={t('instructions')}
            placeholderTextColor="#9a929d" multiline style={[styles.input, { minHeight: 96, textAlignVertical: 'top' }, inputBase]}
            accessibilityLabel={t('instructions')} />
        </Card>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button label={t('save_draft')} kind="secondary" onPress={() => save(false)} busy={busy === 'draft'} style={{ flex: 1 }} />
        <Button label={t('send_to_lab')} onPress={() => save(true)} busy={busy === 'send'} style={{ flex: 1 }} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  input: {
    borderWidth: 1, borderColor: colors.line2, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, color: colors.ink, minHeight: 46,
  },
  footer: {
    flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: '#e8e2e6',
  },
});
