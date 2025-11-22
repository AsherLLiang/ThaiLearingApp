// src/constants/typography.ts
export const Typography = {
    playfairRegular: 'PlayfairDisplay_400Regular',
    playfairBold: 'PlayfairDisplay_700Bold',
    notoSerifRegular: 'NotoSerifSC_400Regular',
    notoSerifBold: 'NotoSerifSC_700Bold',
    sarabunRegular: 'Sarabun_400Regular',
    sarabunBold: 'Sarabun_700Bold',
    // Font sizes
    h1: 32,
    h2: 24,
    h3: 20,
    body: 16,
    caption: 14,
    small: 12,
    // Font weights (as string for fontWeight property)
    regular: '400' as const,
    semibold: '600' as const,
    bold: '700' as const,
  } as const;