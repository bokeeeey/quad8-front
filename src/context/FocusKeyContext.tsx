'use client';

import type { CustomKeyboardKeyTypes } from '@/types/customKeyboardType';
import type { Color } from '@react-three/fiber';
import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';

interface FocusKeyContextType {
  focusKey: CustomKeyboardKeyTypes | null;
  currentPointKeyColor: Color;
  updateCurrentPointKeyColor: (value: Color) => void;
  updateFocusKey: (value: CustomKeyboardKeyTypes | null) => void;
}

export const FocusKeyContext = createContext<FocusKeyContextType>({
  focusKey: null,
  currentPointKeyColor: '#ffffff',
  updateCurrentPointKeyColor: () => {},
  updateFocusKey: () => {},
});

export function FocusKeyContextProvider({ children }: PropsWithChildren) {
  const [focusKey, setFocusKey] = useState<CustomKeyboardKeyTypes | null>(null);
  const [currentPointKeyColor, setCurrentPointKeyColor] = useState<Color>('#ffffff');

  const updateCurrentPointKeyColor = useCallback((value: Color) => {
    setCurrentPointKeyColor(value);
  }, []);

  const updateFocusKey = useCallback((value: CustomKeyboardKeyTypes | null) => {
    setFocusKey(value);
  }, []);

  const value = useMemo(
    () => ({ focusKey, currentPointKeyColor, updateFocusKey, updateCurrentPointKeyColor }),
    [focusKey, currentPointKeyColor, updateFocusKey, updateCurrentPointKeyColor],
  );

  return <FocusKeyContext.Provider value={value}>{children}</FocusKeyContext.Provider>;
}
