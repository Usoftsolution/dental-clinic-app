import { Feather } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { ToothChart } from '@/components/ToothChart';
import { Button, Card, ErrorView, Loading, Pill, StateChip, Txt } from '@/components/ui';
import { call, SessionData } from '@/lib/api';
import { confirm, notify } from '@/lib/confirm';
import { fontFamily } from '@/lib/fonts';
import { isRTL, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { useApi } from '@/lib/useApi';

const PROC_PREVIEW = 6;

export default function Session() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { data, setData, error, loading, reload } = useApi<SessionData>('session', { id: Number(id) });
  const [teeth, setTeeth] = useState<string[]>([]);
  const [diag, setDiag] = useState<number | null>(null);
  const [proc, setProc] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [planned, setPlanned] = useState(false);
  const [query, setQuery] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [notes, setNotes] = useState<string | null>(null);
  const [busy, setBusy] = useState<'add' | 'finish' | null>(null);

  const procedures = useMemo(() => {
    const all = data?.procedures || [];
    const q = query.trim().toLowerCase();
    if (q) {
      return all.filter((p) => p.name.toLowerCase().includes(q));
    }
    return showAll ? all : all.slice(0, PROC_PREVIEW);
  }, [data, query, showAll]);

  if (loading && !data) {
    return <View style={{ flex: 1 }}><Header title={t('session')} /><Loading /></View>;
  }
  if (!data) {
    return <View style={{ flex: 1 }}><Header title={t('session')} /><ErrorView message={error || ''} onRetry={reload} /></View>;
  }

  const toggle = (n: string) => setTeeth((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));
  const sorted = [...teeth].sort();

  const add = async () => {
    if (!sorted.length) {
      notify(t('need_tooth'));
      return;
    }
    if (!diag && !proc) {
      notify(t('need_choice'));
      return;
    }
    setBusy('add');
    try {
      const res = await call<SessionData>('session_add', {
        id: data.appointment.id, teeth: sorted, diagnosis_id: diag, product_id: proc, note, planned,
      });
      setData(res);
      setTeeth([]);
      setNote('');
      setPlanned(false);
    } catch (e: any) {
      notify(e?.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async (lineId: number) => {
    if (!(await confirm(t('remove_confirm'), t('remove')))) {
      return;
    }
    try {
      setData(await call<SessionData>('session_remove', { id: data.appointment.id, line_id: lineId }));
    } catch (e: any) {
      notify(e?.message);
    }
  };

  const finish = async () => {
    if (!(await confirm(t('finish_confirm'), t('finish')))) {
      return;
    }
    setBusy('finish');
    try {
      const res = await call<{ amount: string }>('session_finish', { id: data.appointment.id, notes: notesValue });
      notify(t('finished', { amount: res.amount }));
      router.back();
    } catch (e: any) {
      notify(e?.message);
      setBusy(null);
    }
  };

  const a = data.appointment;
  const notesValue = notes ?? data.notes ?? '';
  const inputBase = { fontFamily: fontFamily('400'), textAlign: isRTL() ? 'right' as const : 'left' as const };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header
        title={a.patient}
        subtitle={[t('session'), a.chair].filter(Boolean).join(' · ')}
        right={<View style={{ marginEnd: 8 }}><StateChip state={a.state} /></View>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12 }} keyboardShouldPersistTaps="handled">
        {data.closed ? (
          <View style={styles.closed}><Feather name="lock" size={16} color={colors.muted} /><Txt size={14} color={colors.ink2}>{t('closed')}</Txt></View>
        ) : (
          <>
            <Card style={{ paddingHorizontal: 12, gap: 8 }}>
              <View style={styles.cardHead}>
                <Txt size={15} weight="700" style={{ flex: 1 }}>{t('step_teeth')}</Txt>
                <Txt size={13} color={colors.muted}>{sorted.length ? t('selected', { t: sorted.join(', ') }) : t('tap_teeth')}</Txt>
              </View>
              <ToothChart mode="select" states={data.states} selected={teeth} onPress={toggle} available={data.teeth} />
            </Card>

            <Card style={{ gap: 10 }}>
              <Txt size={15} weight="700">{t('step_diagnosis')}</Txt>
              <View style={styles.wrap}>
                {data.diagnoses.map((d) => (
                  <Pill key={d.id} label={d.name} on={diag === d.id} onPress={() => setDiag(diag === d.id ? null : d.id)} />
                ))}
              </View>
            </Card>

            <Card style={{ gap: 10 }}>
              <Txt size={15} weight="700">{t('step_procedure')}</Txt>
              {data.procedures.length > PROC_PREVIEW ? (
                <View style={styles.search}>
                  <Feather name="search" size={16} color={colors.muted} />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder={t('search_procedures')}
                    placeholderTextColor="#9a929d"
                    style={[styles.searchInput, inputBase]}
                    accessibilityLabel={t('search_procedures')}
                  />
                </View>
              ) : null}
              {procedures.map((p) => {
                const on = proc === p.id;
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => setProc(on ? null : p.id)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: on }}
                    style={[styles.proc, on && styles.procOn]}
                  >
                    <Txt size={15} weight="600" style={{ flex: 1 }}>{p.name}</Txt>
                    <Txt size={14} color={colors.ink2} numeric>{p.price_label}</Txt>
                  </Pressable>
                );
              })}
              {!query && !showAll && data.procedures.length > PROC_PREVIEW ? (
                <Pressable onPress={() => setShowAll(true)} accessibilityRole="button" style={{ minHeight: 40, justifyContent: 'center' }}>
                  <Txt size={14} weight="700" color={colors.teal}>{t('show_all', { n: data.procedures.length })}</Txt>
                </Pressable>
              ) : null}
            </Card>

            <Card style={{ gap: 10 }}>
              <Txt size={15} weight="700">{t('step_notes')}</Txt>
              <TextInput
                value={note}
                onChangeText={setNote}
                placeholder={t('entry_note')}
                placeholderTextColor="#9a929d"
                style={[styles.input, inputBase]}
                accessibilityLabel={t('entry_note')}
              />
              <View style={styles.switchRow}>
                <Txt size={14} color={colors.ink2} style={{ flex: 1 }}>{t('plan_only')}</Txt>
                <Switch value={planned} onValueChange={setPlanned} trackColor={{ true: colors.teal, false: colors.line2 }}
                  accessibilityLabel={t('plan_only')} />
              </View>
              <Button label={t('add_entry')} kind="outline" icon="plus" onPress={add} busy={busy === 'add'} />
            </Card>
          </>
        )}

        <Card style={{ gap: 8 }}>
          <Txt size={15} weight="700">{t('this_session')}</Txt>
          {data.lines.length ? data.lines.map((l) => (
            <View key={l.id} style={styles.lineRow}>
              <Txt size={14} weight="700" style={{ width: 56 }} numeric>{l.teeth.join(',')}</Txt>
              <View style={{ flex: 1 }}>
                <Txt size={14}>{[l.diagnosis, l.procedure].filter(Boolean).join(' · ')}{l.status === 'planned' ? ' (' + t('planned_tag') + ')' : ''}</Txt>
                {l.note ? <Txt size={13} color={colors.muted}>{l.note}</Txt> : null}
              </View>
              <Txt size={14} numeric>{l.amount}</Txt>
              {!data.closed ? (
                <Pressable onPress={() => remove(l.id)} accessibilityRole="button" accessibilityLabel={t('remove')} hitSlop={8} style={styles.trash}>
                  <Feather name="trash-2" size={16} color={colors.muted} />
                </Pressable>
              ) : null}
            </View>
          )) : <Txt size={14} color={colors.muted}>—</Txt>}
        </Card>

        {!data.closed ? (
          <Card style={{ gap: 10 }}>
            <Txt size={15} weight="700">{t('session_notes')}</Txt>
            <TextInput
              value={notesValue}
              onChangeText={setNotes}
              placeholder={t('session_notes_ph')}
              placeholderTextColor="#9a929d"
              multiline
              onBlur={() => call('session_notes', { id: data.appointment.id, notes: notesValue }).catch(() => undefined)}
              style={[styles.input, styles.multiline, inputBase]}
              accessibilityLabel={t('session_notes')}
            />
          </Card>
        ) : null}
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={{ flex: 1 }}>
          <Txt size={13} color={colors.muted}>{t('session_total')}</Txt>
          <Txt size={20} weight="700" numeric>{data.total.label}</Txt>
        </View>
        {!data.closed ? (
          <Button label={t('finish')} onPress={finish} busy={busy === 'finish'} disabled={!data.lines.length} />
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  closed: { flexDirection: 'row', gap: 8, alignItems: 'center', backgroundColor: colors.segment, borderRadius: 12, padding: 12 },
  cardHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, paddingHorizontal: 4 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: colors.line2,
    borderRadius: 12, paddingHorizontal: 12, height: 44,
  },
  searchInput: { flex: 1, fontSize: 15, color: colors.ink, height: 42 },
  proc: {
    flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48, paddingHorizontal: 14,
    borderRadius: 12, borderWidth: 1, borderColor: '#e3dce1', backgroundColor: colors.card,
  },
  procOn: { borderColor: colors.teal, backgroundColor: colors.tealSoft },
  input: {
    borderWidth: 1, borderColor: colors.line2, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
    fontSize: 15, color: colors.ink, minHeight: 46,
  },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  lineRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, borderTopWidth: 1, borderTopColor: '#f0ebee', paddingTop: 8 },
  trash: { width: 32, height: 28, alignItems: 'center', justifyContent: 'center' },
  footer: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 12,
    backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: '#e8e2e6',
  },
});
