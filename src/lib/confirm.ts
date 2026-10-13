import { Alert, Platform } from 'react-native';

import { t } from './i18n';

/** Yes/No question; resolves true when confirmed. */
export function confirm(message: string, confirmLabel?: string): Promise<boolean> {
  if (Platform.OS === 'web') {
    return Promise.resolve(typeof window !== 'undefined' ? window.confirm(message) : true);
  }
  return new Promise((resolve) => {
    Alert.alert('', message, [
      { text: t('cancel'), style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel || t('confirm'), onPress: () => resolve(true) },
    ], { cancelable: true, onDismiss: () => resolve(false) });
  });
}

export function notify(message: string) {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.alert(message);
    }
    return;
  }
  Alert.alert('', message);
}
