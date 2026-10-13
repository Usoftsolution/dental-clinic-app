import React, { useEffect, useRef, useState } from 'react';
import {
  Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Txt } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fontFamily } from '@/lib/fonts';
import { getLang, Lang, t } from '@/lib/i18n';
import { switchLanguage } from '@/lib/lang';
import { prefs } from '@/lib/storage';
import { colors, radius } from '@/lib/theme';

export default function Login() {
  const { signIn, server: savedServer } = useAuth();
  const insets = useSafeAreaInsets();
  const [server, setServer] = useState(savedServer.replace(/^https:\/\//, ''));
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loginRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  useEffect(() => {
    prefs.get('last_login').then((v) => v && setLogin(v));
  }, []);

  const submit = async () => {
    setError(null);
    if (!server.trim() || !login.trim() || !password) {
      return;
    }
    setBusy(true);
    try {
      await prefs.set('last_login', login.trim());
      await signIn(server, login.trim(), password);
    } catch (e: any) {
      setError(e?.message || t('network'));
      setBusy(false);
    }
  };

  const setLang = (lang: Lang) => {
    if (lang !== getLang()) {
      switchLanguage(lang);
    }
  };

  const field = (label: string, input: React.ReactNode) => (
    <View style={{ gap: 6 }}>
      <Txt size={14} weight="600">{label}</Txt>
      {input}
    </View>
  );
  const inputStyle = [styles.input, { fontFamily: fontFamily('400'), textAlign: getLang() === 'ar' ? 'right' as const : 'left' as const }];

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.ground }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.page, { paddingTop: insets.top + 48, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.langRow}>
          {(['en', 'ar'] as Lang[]).map((l) => (
            <Pressable
              key={l}
              onPress={() => setLang(l)}
              accessibilityRole="button"
              accessibilityState={{ selected: getLang() === l }}
              style={[styles.lang, getLang() === l && styles.langOn]}
            >
              <Txt size={14} weight="700" color={getLang() === l ? '#ffffff' : colors.ink2}>{l === 'en' ? 'English' : 'العربية'}</Txt>
            </Pressable>
          ))}
        </View>
        <View style={styles.logo}>
          <Image source={require('../../assets/logo-mark.png')} style={{ width: 34, height: 34 }} accessibilityIgnoresInvertColors />
        </View>
        <Txt size={30} weight="700" style={{ marginTop: 18 }}>{t('app_name')}</Txt>
        <Txt size={16} color={colors.muted} style={{ marginTop: 6 }}>{t('sign_in_title')}</Txt>

        <View style={{ gap: 16, marginTop: 36 }}>
          {field(t('clinic_address'), (
            <TextInput
              value={server}
              onChangeText={setServer}
              placeholder="yourclinic.odoo.com"
              placeholderTextColor="#9a929d"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="next"
              onSubmitEditing={() => loginRef.current?.focus()}
              style={inputStyle}
              accessibilityLabel={t('clinic_address')}
            />
          ))}
          {field(t('email'), (
            <TextInput
              ref={loginRef}
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              textContentType="username"
              autoComplete="username"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={inputStyle}
              accessibilityLabel={t('email')}
            />
          ))}
          {field(t('password'), (
            <TextInput
              ref={passwordRef}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="password"
              autoComplete="password"
              returnKeyType="go"
              onSubmitEditing={submit}
              style={inputStyle}
              accessibilityLabel={t('password')}
            />
          ))}
          {error ? (
            <View style={styles.error} accessibilityRole="alert">
              <Txt size={14} color={colors.dangerInk}>{error}</Txt>
            </View>
          ) : null}
          <Button label={t('sign_in')} onPress={submit} busy={busy}
            disabled={!server.trim() || !login.trim() || !password} style={{ marginTop: 8, minHeight: 54 }} />
        </View>
        <Txt size={13} color={colors.muted} style={{ marginTop: 28, lineHeight: 19 }}>{t('sign_in_hint')}</Txt>
        <Txt size={13} color={colors.muted} style={{ marginTop: 8, lineHeight: 19 }}>{t('twofa_hint')}</Txt>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 28, flexGrow: 1 },
  langRow: { flexDirection: 'row', gap: 6, alignSelf: 'flex-end', marginTop: -24, marginBottom: 12 },
  lang: { paddingHorizontal: 12, minHeight: 36, borderRadius: 18, justifyContent: 'center', backgroundColor: colors.segment },
  langOn: { backgroundColor: colors.plum },
  logo: { width: 56, height: 56, borderRadius: 16, backgroundColor: colors.plum, alignItems: 'center', justifyContent: 'center' },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: colors.line2,
    borderRadius: radius.m - 2,
    paddingHorizontal: 14,
    fontSize: 16,
    backgroundColor: colors.card,
    color: colors.ink,
  },
  error: { backgroundColor: colors.dangerSoft, borderRadius: 12, padding: 12 },
});
