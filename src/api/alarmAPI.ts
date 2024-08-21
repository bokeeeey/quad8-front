import { AlarmAPIDataType } from '@/types/alarmType';
import { baseAPI } from './interceptor/interceptor';

export const getAlarm = async () => {
  try {
    const { data } = await baseAPI.get<AlarmAPIDataType>('/api/v1/alarm', {
      cache: 'no-cache',
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const postAlarmRead = async (alarmId: number) => {
  try {
    await baseAPI.post(`/api/v1/alarm/maskAsRead/${alarmId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteAlarm = async (alarmId: number[]) => {
  try {
    await baseAPI.delete(`/api/v1/alarm`, {
      body: JSON.stringify(alarmId),
    });
  } catch (error) {
    throw error;
  }
};
