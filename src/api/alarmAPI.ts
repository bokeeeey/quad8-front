import { getCookie } from '@/libs/manageCookie';

const BASE_URL = process.env.NEXT_PUBLIC_KEYDEUK_API_BASE_URL;

export const getAlarm = async () => {
  const token = await getCookie('accessToken');
  try {
    const response = await fetch(`${BASE_URL}/api/v1/alarm`, {
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const { data } = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const postAlarmRead = async (alarmId: number) => {
  const token = await getCookie('accessToken');
  try {
    await fetch(`${BASE_URL}/api/v1/alarm/maskAsRead/${alarmId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteAlarm = async (alarmId: number) => {
  const token = await getCookie('accessToken');
  try {
    await fetch(`${BASE_URL}/api/v1/alarm/${alarmId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    throw error;
  }
};
