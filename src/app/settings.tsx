import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native';

import { Header } from '@/components/Header';
import { Button, Card, Txt } from '@/components/ui';
import { call } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { confirm, notify } from '@/lib/confirm';
import { getLang, Lang, t } from '@/lib/i18n';
import { switchLanguage } from '@/lib/lang';
import { colors } from '@/lib/theme';

export default function Settings() {
  const { me, server, device, push, updateSettings, signOut } = useAuth();
  const [sending, setSending] = useState(false);

  const toggle = (key: 'notify_arrived' | 'notify_booking' | 'notify_lab') => async (value: boolean) => {
    try {
      await updateSettings({ [key]: value });
    } catch (e: any) {
      notify(e?.message);
    }
  };

  const setLang = async (lang: Lang) => {
    if (lang === getLang()) {
      return;
    }
    try {
      await updateSettings({ lang });
    } catch {
      // the server copy only decides the language of push messages
    }
    switchLanguage(lang);
  };

  const test = async () => {
    setSending(true);
    try {
      await call('push_test');
      notify(t('test_sent'));
    } catch (e: any) {
      notify(e?.message);
    } finally {
      setSending(false);
    }
  };

  const out = async () => {
    if (await confirm(t('sign_out_confirm'), t('sign_out'))) {
      await signOut();
    }
  };

  const row = (label: string, key: 'notify_arrived' | 'notify_booking' | 'notify_lab') => (
    <View style={styles.row}>
      <Txt size={15} style={{ flex: 1 }}>{label}</Txt>
      <Switch
        value={!!device?.[key]}
        onValueChange={toggle(key)}
        disabled={!device}
        trackColor={{ true: colors.teal, false: colors.line2 }}
        accessibilityLabel={label}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header title={t('settings')} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12 }}>
        <Card style={{ gap: 4 }}>
          <Txt size={13} color={colors.muted}>{t('signed_in_as')}</Txt>
          <Txt size={17} weight="700">{me?.name}</Txt>
          <Txt size={14} color={colors.muted}>{me?.company} · {server.replace(/^https?:\/\//, '')}</Txt>
        </Card>

        <Card style={{ gap: 10 }}>
          <Txt size={15} weight="700">{t('language')}</Txt>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {(['en', 'ar'] as Lang[]).map((l) => {
              const on = getLang() === l;
              return (
                <Pressable
                  key={l}
                  onPress={() => setLang(l)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: on }}
                  style={[styles.lang, on && { backgroundColor: colors.plum, borderColor: colors.plum }]}
                >
                  <Txt size={15} weight="700" color={on ? '#ffffff' : colors.ink2}>{l === 'en' ? 'English' : 'العربية'}</Txt>
                </Pressable>
              );
            })}
          </View>
          <Txt size={13} color={colors.muted}>{t('restart_lang')}</Txt>
        </Card>

        <Card style={{ gap: 4 }}>
          <Txt size={15} weight="700" style={{ marginBottom: 4 }}>{t('notifications')}</Txt>
          {row(t('notif_arrived'), 'notify_arrived')}
          {row(t('notif_booking'), 'notify_booking')}
          {me?.show_lab !== false ? row(t('notif_lab'), 'notify_lab') : null}
          {push.status === 'denied' ? (
            <Pressable onPress={() => Linking.openSettings()} accessibilityRole="link" style={styles.warn}>
              <Txt size={14} color="#8a4b08">{t('notif_off')}</Txt>
            </Pressable>
          ) : null}
          {push.status === 'unavailable' || Platform.OS === 'web' ? (
            <Txt size={13} color={colors.muted} style={{ marginTop: 6 }}>{t('notif_unavailable')}</Txt>
          ) : null}
          {device?.push ? (
            <Button label={t('send_test')} kind="outline" icon="bell" onPress={test} busy={sending} style={{ marginTop: 10 }} />
          ) : null}
        </Card>

        <Button label={t('sign_out')} kind="danger" icon="log-out" onPress={out} />
        <Txt size={12} color={colors.muted} style={{ textAlign: 'center' }}>
          {t('version', { v: Constants.expoConfig?.version || '1.0.0' })}
        </Txt>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48 },
  lang: {
    flex: 1, minHeight: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.line2,
    alignItems: 'center', justifyContent: 'center',
  },
  warn: { backgroundColor: '#fbe6c9', borderRadius: 10, padding: 10, marginTop: 8 },
});
