'use server';

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const deleteCookie = (key: string) => {
  const cookieStore = cookies();
  cookieStore.delete(key);
};

export const getCookie = (key: string, req?: NextRequest): string | null => {
  const cookieStore = req ? req.cookies : cookies();
  const value = cookieStore.get(key)?.value ?? null;
  return value;
};

export const setCookie = (key: string, value: string) => {
  const defaultOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 1000,
    path: '/',
  };

  const cookieStore = cookies();
  cookieStore.set(key, value, defaultOptions);
};
