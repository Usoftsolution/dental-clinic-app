import { reloadAppAsync } from 'expo';
import { I18nManager, Platform } from 'react-native';

import { getLocales } from 'expo-localization';
import { Lang, setLang } from './i18n';
import { prefs } from './storage';

/** Read the saved language (or the phone's) and make the layout direction match it. */
export async function initLanguage(): Promise<Lang> {
  const saved = (await prefs.get('lang')) as Lang | null;
  const phone = getLocales()[0]?.languageCode === 'ar' ? 'ar' : 'en';
  const lang: Lang = saved === 'ar' || saved === 'en' ? saved : phone;
  setLang(lang);
  applyDirection(lang);
  if (Platform.OS !== 'web' && I18nManager.isRTL !== (lang === 'ar')) {
    // the native layout direction only changes after a restart
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(lang === 'ar');
    await reloadAppAsync('layout direction');
  }
  return lang;
}

function applyDirection(lang: Lang) {
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  } else {
    I18nManager.allowRTL(true);
  }
}

export async function switchLanguage(lang: Lang) {
  await prefs.set('lang', lang);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    return;
  }
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(lang === 'ar');
  await reloadAppAsync('language');
}
