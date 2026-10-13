import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { isRTL, Key, t } from '@/lib/i18n';
import { colors, toothColors } from '@/lib/theme';
import { Txt } from './ui';

const UPPER = ['18', '17', '16', '15', '14', '13', '12', '11', '21', '22', '23', '24', '25', '26', '27', '28'];
const LOWER = ['48', '47', '46', '45', '44', '43', '42', '41', '31', '32', '33', '34', '35', '36', '37', '38'];
const DARK_TEXT = new Set(['healthy', 'crown', 'implant', 'planned', 'missing']);

type Props = {
  states?: Record<string, string>;
  selected?: string[];
  onPress?: (tooth: string) => void;
  mode?: 'view' | 'select';
  available?: string[];
};

/**
 * Adult FDI chart. Always drawn in the anatomical orientation (patient's right on the
 * viewer's left), also in Arabic: rows are reversed before an RTL layout flips them back.
 */
export function ToothChart({ states = {}, selected = [], onPress, mode = 'view', available }: Props) {
  const order = (row: string[]) => (isRTL() ? [...row].reverse() : row);
  const row = (teeth: string[]) => (
    <View style={styles.row}>
      {order(teeth).map((n, i) => {
        const state = states[n] || 'healthy';
        const c = toothColors[state] || toothColors.healthy;
        const on = selected.includes(n);
        const disabled = available && !available.includes(n);
        const fill = mode === 'select' && on ? colors.plum : c.fill;
        const textColor = mode === 'select' && on ? '#ffffff' : DARK_TEXT.has(state) ? colors.ink2 : '#ffffff';
        return (
          <React.Fragment key={n}>
          {i === 8 ? <View style={styles.midline} /> : null}
          <Pressable
            disabled={!onPress || disabled}
            onPress={() => onPress && onPress(n)}
            accessibilityRole="button"
            accessibilityLabel={t('tooth', { n }) + ', ' + t(('ts_' + state) as Key)}
            accessibilityState={{ selected: on }}
            style={[
              styles.tooth,
              mode === 'select' ? styles.toothSelect : null,
              { backgroundColor: fill, borderColor: mode === 'select' && on ? colors.plum : c.border, borderStyle: c.dashed && !(mode === 'select' && on) ? 'dashed' : 'solid' },
              mode === 'view' && on ? styles.ring : null,
              disabled ? { opacity: 0.35 } : null,
            ]}
          >
            <Txt size={10.5} weight="700" color={textColor} numeric>{n}</Txt>
          </Pressable>
          </React.Fragment>
        );
      })}
    </View>
  );
  const labels = (a: string, b: string) => (
    <View style={styles.labels}>
      <Txt size={12} weight="600" color={colors.muted}>{isRTL() ? b : a}</Txt>
      <Txt size={12} weight="600" color={colors.muted}>{isRTL() ? a : b}</Txt>
    </View>
  );
  return (
    <View style={{ gap: 6 }}>
      {labels(t('upper_right'), t('upper_left'))}
      {row(UPPER)}
      <View style={styles.divider} />
      {row(LOWER)}
      {labels(t('lower_right'), t('lower_left'))}
    </View>
  );
}

export function ToothLegend({ states }: { states: Record<string, string> }) {
  const present = ['caries', 'filled', 'rct', 'crown', 'implant', 'planned', 'missing'].filter((s) =>
    Object.values(states).includes(s));
  if (!present.length) {
    return null;
  }
  return (
    <View style={styles.legend}>
      {present.map((s) => {
        const c = toothColors[s];
        return (
          <View key={s} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: c.fill, borderColor: c.border, borderStyle: c.dashed ? 'dashed' : 'solid' }]} />
            <Txt size={12.5} color={colors.ink2}>{t(('ts_' + s) as Key)}</Txt>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  tooth: {
    flex: 1,
    height: 34,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toothSelect: { height: 42 },
  ring: { borderWidth: 2.5, borderColor: colors.ink },
  labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 },
  midline: { width: 4 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 4 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, rowGap: 6, marginTop: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  swatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 1 },
});
