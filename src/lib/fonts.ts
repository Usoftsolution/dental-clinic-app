import { Figtree_400Regular } from '@expo-google-fonts/figtree/400Regular';
import { Figtree_500Medium } from '@expo-google-fonts/figtree/500Medium';
import { Figtree_600SemiBold } from '@expo-google-fonts/figtree/600SemiBold';
import { Figtree_700Bold } from '@expo-google-fonts/figtree/700Bold';
import { IBMPlexSansArabic_400Regular } from '@expo-google-fonts/ibm-plex-sans-arabic/400Regular';
import { IBMPlexSansArabic_500Medium } from '@expo-google-fonts/ibm-plex-sans-arabic/500Medium';
import { IBMPlexSansArabic_600SemiBold } from '@expo-google-fonts/ibm-plex-sans-arabic/600SemiBold';
import { IBMPlexSansArabic_700Bold } from '@expo-google-fonts/ibm-plex-sans-arabic/700Bold';

import { getLang } from './i18n';

export const fontAssets = {
  Figtree_400Regular, Figtree_500Medium, Figtree_600SemiBold, Figtree_700Bold,
  IBMPlexSansArabic_400Regular, IBMPlexSansArabic_500Medium, IBMPlexSansArabic_600SemiBold, IBMPlexSansArabic_700Bold,
};

export type Weight = '400' | '500' | '600' | '700';

const names: Record<Weight, string> = { '400': '400Regular', '500': '500Medium', '600': '600SemiBold', '700': '700Bold' };

export function fontFamily(weight: Weight = '400') {
  return (getLang() === 'ar' ? 'IBMPlexSansArabic_' : 'Figtree_') + names[weight];
}
