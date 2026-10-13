import * as Device from 'expo-device';
import Constants from 'expo-constants';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';

import { call, configureApi, DeviceSettings, Me, normalizeServer } from './api';
import { getLang } from './i18n';
import { PushState, registerForPush } from './push';
import { prefs, secure } from './storage';

type AuthState = {
  ready: boolean;
  server: string;
  me: Me | null;
  device: DeviceSettings | null;
  push: PushState;
  signIn: (server: string, login: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  updateSettings: (vals: Partial<DeviceSettings> & { push_token?: string | null }) => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

const K_SERVER = 'server';
const K_TOKEN = 'token';
const K_ME = 'me';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [server, setServer] = useState('');
  const [me, setMe] = useState<Me | null>(null);
  const [device, setDevice] = useState<DeviceSettings | null>(null);
  const [push, setPush] = useState<PushState>({ status: 'unavailable', token: null });
  const signedIn = useRef(false);

  const clear = useCallback(async () => {
    signedIn.current = false;
    await secure.set(K_TOKEN, null);
    await prefs.set(K_ME, null);
    configureApi({ token: null });
    setMe(null);
    setDevice(null);
  }, []);

  const syncPush = useCallback(async () => {
    const state = await registerForPush();
    setPush(state);
    if (state.token) {
      try {
        const res = await call<{ device: DeviceSettings }>('settings', {
          push_token: state.token, platform: Platform.OS, lang: getLang(),
        });
        setDevice(res.device);
      } catch {
        // offline: the token is sent again at the next start
      }
    }
  }, []);

  const refresh = useCallback(async () => {
    const res = await call<{ me: Me; device: DeviceSettings }>('me');
    setMe(res.me);
    setDevice(res.device);
    await prefs.set(K_ME, JSON.stringify(res.me));
  }, []);

  useEffect(() => {
    configureApi({ onUnauthorized: () => { clear(); } });
    (async () => {
      const [savedServer, token, cached] = await Promise.all([prefs.get(K_SERVER), secure.get(K_TOKEN), prefs.get(K_ME)]);
      setServer(savedServer || '');
      configureApi({ server: savedServer || '', token });
      if (token && cached) {
        try {
          setMe(JSON.parse(cached));
        } catch {
          // ignore a broken cache
        }
        signedIn.current = true;
        setReady(true);
        refresh().catch(() => undefined);
        syncPush();
        return;
      }
      setReady(true);
    })();
  }, [clear, refresh, syncPush]);

  const signIn = useCallback(async (rawServer: string, login: string, password: string) => {
    const s = normalizeServer(rawServer);
    configureApi({ server: s, token: null });
    const res = await call<{ token: string; me: Me }>('login', {
      login, password, lang: getLang(), platform: Platform.OS,
      device_name: Device.deviceName || Device.modelName || Platform.OS,
      app_version: Constants.expoConfig?.version || '',
    });
    configureApi({ token: res.token });
    await Promise.all([
      prefs.set(K_SERVER, s), secure.set(K_TOKEN, res.token), prefs.set(K_ME, JSON.stringify(res.me)),
    ]);
    signedIn.current = true;
    setServer(s);
    setMe(res.me);
    refresh().catch(() => undefined);
    syncPush();
  }, [refresh, syncPush]);

  const signOut = useCallback(async () => {
    try {
      await call('logout');
    } catch {
      // signing out locally is enough when offline
    }
    await clear();
  }, [clear]);

  const updateSettings = useCallback(async (vals: Partial<DeviceSettings> & { push_token?: string | null }) => {
    const res = await call<{ device: DeviceSettings }>('settings', vals);
    setDevice(res.device);
  }, []);

  const value = useMemo(() => ({ ready, server, me, device, push, signIn, signOut, refresh, updateSettings }),
    [ready, server, me, device, push, signIn, signOut, refresh, updateSettings]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth outside AuthProvider');
  }
  return ctx;
}
