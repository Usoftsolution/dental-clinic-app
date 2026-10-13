import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router/js-tabs';
import React from 'react';

import { useAuth } from '@/lib/auth';
import { fontFamily } from '@/lib/fonts';
import { t } from '@/lib/i18n';
import { colors } from '@/lib/theme';

export default function TabsLayout() {
  const { me } = useAuth();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.plum,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: fontFamily('600'), fontSize: 12 },
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: '#e8e2e6', height: 64, paddingTop: 6 },
        sceneStyle: { backgroundColor: colors.ground },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: t('today'), tabBarIcon: ({ color }) => <Feather name="calendar" size={23} color={color} /> }}
      />
      <Tabs.Screen
        name="patients"
        options={{ title: t('patients'), tabBarIcon: ({ color }) => <Feather name="users" size={23} color={color} /> }}
      />
      <Tabs.Screen
        name="lab"
        options={{
          title: t('lab'),
          href: me?.show_lab === false ? null : undefined,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="flask-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="me"
        options={{ title: t('my_figures'), tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={23} color={color} /> }}
      />
    </Tabs>
  );
}
