'use client';

import { PropsWithChildren, createContext, useCallback, useMemo, useState } from 'react';
import { KEY, TEN_KEY } from '@/constants/keyboardData';

interface StepContextType {
  currentStep: 'board' | 'switch' | 'keyCap';
  updateCurrentStep: (data: 'board' | 'switch' | 'keyCap') => void;
}

interface KeyboardDataType {
  keyboardType: 'tkl' | 'full' | null;
  texture: 'metal' | 'plastic' | null;
  boardColor: string | null /* color */;
  switchType: 'blue' | 'red' | 'brown' | 'black' | null;
  baseKeyColor: string | null;
  hasPointKeyCap: boolean;
  pointKeyType: string | null;
  pointKeyColor: string | null;
  price: number;
  option: string[];
  individualColor: { [key: string]: string } | null;
}

interface KeyboardDataContextType {
  keyboardData: KeyboardDataType;
  updateIndividualKey: (key: string, value: string) => void;
  updateOption: (optionId: string) => void;
  updateData: (key: keyof KeyboardDataType, value: KeyboardDataType[keyof KeyboardDataType]) => void;
}

interface KeyColorType {
  [key: string]: string;
}

interface KeyColorContextType {
  keyColorData: KeyColorType;
  updateKeyColor: (key: string, value: string) => void;
}

export const StepContext = createContext<StepContextType>({
  currentStep: 'board',
  updateCurrentStep: () => {},
});

export const KeyboardDataContext = createContext<KeyboardDataContextType>({
  keyboardData: {
    keyboardType: null,
    texture: null,
    boardColor: null,
    switchType: null,
    baseKeyColor: null,
    hasPointKeyCap: false,
    pointKeyType: null,
    pointKeyColor: null,
    price: 0,
    option: [],
    individualColor: null,
  },
  updateIndividualKey: () => {},
  updateOption: () => {},
  updateData: () => {},
});

export const KeyColorContext = createContext<KeyColorContextType>({
  keyColorData: {},
  updateKeyColor: () => {},
});

export function StepContextProvider({ children }: PropsWithChildren) {
  const [currentStep, setCurrentStep] = useState<'board' | 'switch' | 'keyCap'>('board');

  const updateCurrentStep = useCallback((step: 'board' | 'switch' | 'keyCap') => {
    setCurrentStep(step);
  }, []);

  const contextValue = useMemo(() => ({ currentStep, updateCurrentStep }), [currentStep, updateCurrentStep]);
  return <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>;
}

export function KeyboardDataContextProvider({ children }: PropsWithChildren) {
  const [data, setData] = useState<KeyboardDataType>({
    keyboardType: null,
    texture: null,
    boardColor: null,
    switchType: null,
    baseKeyColor: null,
    hasPointKeyCap: false,
    pointKeyType: null,
    pointKeyColor: null,
    price: 0,
    option: [],
    individualColor: null,
  });

  const updateIndividualKey = useCallback((key: string, value: string) => {
    setData((prev) => {
      const prevColor = { ...prev.individualColor };
      if (value === prev.baseKeyColor) {
        delete prevColor[key];
      } else {
        Object.assign(prevColor, { [key]: value });
      }
      return { ...prev, individualColor: { ...prevColor } };
    });
  }, []);

  const updateOption = useCallback((optionId: string) => {
    setData((prev) => {
      const filteredList = prev.option.filter((id) => id !== optionId);
      if (filteredList.length !== prev.option.length) {
        return { ...prev, option: filteredList };
      }
      return { ...prev, option: [...prev.option, optionId] };
    });
  }, []);

  const updateData = useCallback((key: keyof KeyboardDataType, value: KeyboardDataType[keyof KeyboardDataType]) => {
    if (key === 'individualColor' || key === 'option') {
      return;
    }
    setData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(
    () => ({ keyboardData: data, updateIndividualKey, updateOption, updateData }),
    [data, updateIndividualKey, updateOption, updateData],
  );

  return <KeyboardDataContext.Provider value={value}>{children}</KeyboardDataContext.Provider>;
}

export function KeyColorContextProvider({ children }: PropsWithChildren) {
  const [keyColorData, setKeyColorData] = useState<KeyColorType>(() => {
    const color = {};
    [...KEY, ...TEN_KEY].forEach((key) => Object.assign(color, { [key]: '#ffffff' }));
    return color;
  });

  const updateKeyColor = useCallback((key: string, value: string) => {
    setKeyColorData((prev) => ({ ...prev, [key]: value }));
  }, []);

  const value = useMemo(() => ({ keyColorData, updateKeyColor }), [keyColorData, updateKeyColor]);
  return <KeyColorContext.Provider value={value}>{children}</KeyColorContext.Provider>;
}
