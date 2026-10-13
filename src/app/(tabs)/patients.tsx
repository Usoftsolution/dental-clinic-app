import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, Empty, Txt } from '@/components/ui';
import { call } from '@/lib/api';
import { fontFamily } from '@/lib/fonts';
import { isRTL, ltr, t } from '@/lib/i18n';
import { colors } from '@/lib/theme';

type Row = { id: number; name: string; code: string; phone: string; age: number | false; alert: string };

export default function Patients() {
  const insets = useSafeAreaInsets();
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<Row[]>([]);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const timer = setTimeout(async () => {
      try {
        const res = await call<{ patients: Row[] }>('patients', { q });
        if (alive) {
          setRows(res.patients);
          setError(null);
        }
      } catch (e: any) {
        if (alive) {
          setError(e?.message);
        }
      } finally {
        if (alive) {
          setBusy(false);
        }
      }
    }, q ? 300 : 0);
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [q]);

  return (
    <View style={{ flex: 1, paddingTop: insets.top + 12 }}>
      <View style={{ paddingHorizontal: 20, gap: 12, paddingBottom: 10 }}>
        <Txt size={26} weight="700">{t('patients')}</Txt>
        <View style={styles.search}>
          <Feather name="search" size={18} color={colors.muted} />
          <TextInput
            value={q}
            onChangeText={(v) => {
              setBusy(true);
              setQ(v);
            }}
            placeholder={t('search_patients')}
            placeholderTextColor="#9a929d"
            autoCorrect={false}
            style={[styles.input, { fontFamily: fontFamily('400'), textAlign: isRTL() ? 'right' : 'left' }]}
            accessibilityLabel={t('search_patients')}
            clearButtonMode="while-editing"
          />
          {busy ? <ActivityIndicator color={colors.plum} /> : null}
        </View>
      </View>
      <FlatList
        data={rows}
        keyExtractor={(r) => String(r.id)}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24, gap: 8 }}
        ListEmptyComponent={busy ? null : <Empty text={error || (q ? t('no_patients') : t('type_to_search'))} icon="users" />}
        renderItem={({ item }) => (
          <Card
            onPress={() => router.push({ pathname: '/patient/[id]', params: { id: String(item.id) } })}
            accessibilityLabel={item.name}
            style={styles.row}
          >
            <View style={styles.avatar}>
              <Txt size={15} weight="700" color={colors.plum}>
                {item.name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()}
              </Txt>
            </View>
            <View style={{ flex: 1 }}>
              <Txt size={16} weight="700" numberOfLines={1}>{item.name}</Txt>
              <Txt size={13} color={colors.muted} numeric numberOfLines={1}>
                {[item.code ? ltr(item.code) : null, item.phone ? ltr(item.phone) : null, item.age ? t('years', { n: item.age }) : null].filter(Boolean).join(' · ')}
              </Txt>
              {item.alert ? <Txt size={13} color={colors.dangerInk} numberOfLines={1}>{item.alert}</Txt> : null}
            </View>
            <Feather name={isRTL() ? 'chevron-left' : 'chevron-right'} size={20} color={colors.line2} />
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.card, borderWidth: 1,
    borderColor: colors.line2, borderRadius: 14, paddingHorizontal: 14, height: 50,
  },
  input: { flex: 1, fontSize: 16, color: colors.ink, height: 48 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderRadius: 16 },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: colors.plumSoft, alignItems: 'center', justifyContent: 'center' },
});
