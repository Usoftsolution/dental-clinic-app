import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '@/lib/i18n';
import { colors } from '@/lib/theme';
import { IconButton, Txt } from './ui';

/** Top bar of pushed screens: back arrow, title, optional right-hand content. */
export function Header({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingTop: insets.top + 6 }]}>
      <IconButton
        icon="chevron-left"
        flip
        label={t('back')}
        onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
      />
      <View style={{ flex: 1 }}>
        <Txt size={17} weight="700" numberOfLines={1}>{title}</Txt>
        {subtitle ? <Txt size={13} color={colors.muted} numberOfLines={1}>{subtitle}</Txt> : null}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingBottom: 6,
    backgroundColor: colors.ground,
  },
});
