import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { call } from './api';

type State<T> = { key: string | null; data: T | null; error: string | null };

/**
 * Load an endpoint; reload when `body` changes, when the screen comes back into view,
 * and every `pollMs` while it is visible. Keeps the last data while a reload runs.
 */
export function useApi<T>(endpoint: string, body: Record<string, unknown>, opts: { pollMs?: number } = {}) {
  const bodyJson = JSON.stringify(body);
  const key = endpoint + bodyJson;
  const [state, setState] = useState<State<T>>({ key: null, data: null, error: null });
  const [refreshing, setRefreshing] = useState(false);
  const pollMs = opts.pollMs || 0;

  const fetchNow = useCallback(async (quiet: boolean) => {
    try {
      const res = await call<T>(endpoint, JSON.parse(bodyJson));
      setState({ key, data: res, error: null });
    } catch (e: any) {
      setState((s) => (quiet && s.data ? s : { key, data: s.data, error: e?.message || 'Error' }));
    } finally {
      setRefreshing(false);
    }
  }, [endpoint, bodyJson, key]);

  useEffect(() => {
    fetchNow(false);
  }, [fetchNow]);

  const firstFocus = useRef(true);
  useFocusEffect(useCallback(() => {
    if (firstFocus.current) {
      firstFocus.current = false;
    } else {
      fetchNow(true);
    }
    if (!pollMs) {
      return undefined;
    }
    const timer = setInterval(() => fetchNow(true), pollMs);
    return () => clearInterval(timer);
  }, [fetchNow, pollMs]));

  const setData = useCallback((data: T) => setState((s) => ({ ...s, data })), []);

  return {
    data: state.data,
    setData,
    error: state.key === key ? state.error : null,
    loading: state.key !== key,
    refreshing,
    reload: () => {
      setRefreshing(true);
      fetchNow(false);
    },
    silentReload: () => fetchNow(true),
  };
}
