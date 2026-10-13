import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, TextProps, TextStyle, View, ViewStyle,
} from 'react-native';

import { fontFamily, Weight } from '@/lib/fonts';
import { isRTL, stateLabel, t } from '@/lib/i18n';
import { colors, radius, stateColors } from '@/lib/theme';

type TxtProps = TextProps & {
  size?: number;
  weight?: Weight;
  color?: string;
  style?: StyleProp<TextStyle>;
  numeric?: boolean;
};

/** Text in the app font (Figtree for English, IBM Plex Sans Arabic for Arabic). */
export function Txt({ size = 15, weight = '400', color = colors.ink, style, numeric, ...rest }: TxtProps) {
  return (
    <Text
      {...rest}
      style={[
        { fontFamily: fontFamily(weight), fontSize: size, color, textAlign: 'auto' },
        numeric ? { fontVariant: ['tabular-nums'] } : null,
        style,
      ]}
    />
  );
}

export function Card({ children, style, onPress, accessibilityLabel }: {
  children: React.ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void; accessibilityLabel?: string;
}) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={({ pressed }) => [styles.card, style, pressed && { opacity: 0.85 }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Chip({ label, bg, fg, style }: { label: string; bg: string; fg: string; style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }, style]}>
      <Txt size={12} weight="700" color={fg}>{label}</Txt>
    </View>
  );
}

export function StateChip({ state, style }: { state: string; style?: StyleProp<ViewStyle> }) {
  const c = stateColors[state] || stateColors.draft;
  return <Chip label={stateLabel(state)} bg={c[0]} fg={c[1]} style={style} />;
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary' | 'outline' | 'danger';
  disabled?: boolean;
  busy?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, kind = 'primary', disabled, busy, icon, style }: ButtonProps) {
  const bg = kind === 'primary' ? colors.teal : kind === 'secondary' ? colors.segment : kind === 'danger' ? colors.dangerSoft : colors.card;
  const fg = kind === 'primary' ? '#ffffff' : kind === 'outline' ? colors.tealDark : kind === 'danger' ? colors.dangerInk : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!(disabled || busy), busy: !!busy }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg },
        kind === 'outline' && { borderWidth: 1.5, borderColor: colors.teal },
        (disabled || busy) && { opacity: 0.55 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {busy ? <ActivityIndicator color={fg} /> : (
        <View style={styles.buttonInner}>
          {icon ? <Feather name={icon} size={18} color={fg} /> : null}
          <Txt size={16} weight="700" color={fg}>{label}</Txt>
        </View>
      )}
    </Pressable>
  );
}

export function IconButton({ icon, onPress, label, color = colors.ink, bg, size = 22, flip }: {
  icon: keyof typeof Feather.glyphMap; onPress: () => void; label: string; color?: string; bg?: string; size?: number; flip?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.iconButton, bg ? { backgroundColor: bg } : null, pressed && { opacity: 0.7 }]}
    >
      <Feather name={icon} size={size} color={color} style={flip && isRTL() ? { transform: [{ scaleX: -1 }] } : undefined} />
    </Pressable>
  );
}

export function Segmented<T extends string>({ options, value, onChange, style }: {
  options: { key: T; label: string }[]; value: T; onChange: (key: T) => void; style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.segmented, style]} accessibilityRole="tablist">
      {options.map((o) => {
        const on = o.key === value;
        return (
          <Pressable
            key={o.key}
            onPress={() => onChange(o.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.segment, on && styles.segmentOn]}
          >
            <Txt size={14} weight="700" color={on ? colors.ink : colors.muted} numberOfLines={1}>{o.label}</Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Pill({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      style={[styles.pill, on ? { backgroundColor: colors.tealSoft, borderColor: colors.teal } : null]}
    >
      <Txt size={14} weight="600" color={on ? colors.tealDark : colors.ink2}>{label}</Txt>
    </Pressable>
  );
}

export function MedicalAlert({ text }: { text: string }) {
  return (
    <View style={styles.alert} accessibilityRole="alert">
      <Feather name="alert-triangle" size={16} color={colors.dangerInk} style={{ marginTop: 2 }} />
      <Txt size={14} color={colors.dangerInk} style={{ flex: 1, lineHeight: 20 }}>
        <Txt size={14} weight="700" color={colors.dangerInk}>{t('medical_alert')}: </Txt>{text}
      </Txt>
    </View>
  );
}

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.plum} size="large" />
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={[styles.center, { padding: 24, gap: 16 }]}>
      <Feather name="wifi-off" size={32} color={colors.muted} />
      <Txt size={16} color={colors.ink2} style={{ textAlign: 'center' }}>{message}</Txt>
      {onRetry ? <Button label={t('retry')} onPress={onRetry} kind="outline" style={{ minWidth: 160 }} /> : null}
    </View>
  );
}

export function Empty({ text, icon = 'inbox' }: { text: string; icon?: keyof typeof Feather.glyphMap }) {
  return (
    <View style={[styles.center, { paddingVertical: 48, gap: 10 }]}>
      <Feather name={icon} size={28} color={colors.line2} />
      <Txt size={15} color={colors.muted} style={{ textAlign: 'center' }}>{text}</Txt>
    </View>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Txt size={15} weight="700">{children}</Txt>;
}

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.l,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  button: {
    minHeight: 50,
    borderRadius: radius.m,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonInner: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: colors.segment,
    borderRadius: 12,
    padding: 3,
    gap: 3,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  segmentOn: { backgroundColor: colors.card },
  pill: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line2,
    backgroundColor: colors.card,
    justifyContent: 'center',
  },
  alert: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    padding: 12,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
