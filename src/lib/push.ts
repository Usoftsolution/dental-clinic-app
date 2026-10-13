import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { colors } from './theme';

export type PushState = { status: 'granted' | 'denied' | 'unavailable'; token: string | null };

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

export function projectId(): string | undefined {
  const id = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
  return id || undefined;
}

/** Ask for permission (once) and return this phone's Expo push token. */
export async function registerForPush(): Promise<PushState> {
  if (Platform.OS === 'web' || !Device.isDevice) {
    return { status: 'unavailable', token: null };
  }
  if (Platform.OS === 'android') {
    // must match the channelId the Odoo add-on sends ("clinic")
    await Notifications.setNotificationChannelAsync('clinic', {
      name: 'Clinic',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: colors.plum,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  let granted = current.granted;
  if (!granted && current.canAskAgain) {
    granted = (await Notifications.requestPermissionsAsync()).granted;
  }
  if (!granted) {
    return { status: 'denied', token: null };
  }
  const id = projectId();
  if (!id) {
    console.warn('No EAS projectId in app.json: run "eas init" to enable push notifications.');
    return { status: 'unavailable', token: null };
  }
  try {
    const token = (await Notifications.getExpoPushTokenAsync({ projectId: id })).data;
    return { status: 'granted', token };
  } catch (e) {
    console.warn('Could not get a push token', e);
    return { status: 'unavailable', token: null };
  }
}

export type PushTarget = { screen?: string; id?: number };

export function targetOf(response: Notifications.NotificationResponse | null): PushTarget | null {
  const data = response?.notification?.request?.content?.data as PushTarget | undefined;
  return data && data.screen ? data : null;
}
