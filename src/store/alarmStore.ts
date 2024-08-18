import { AlarmDataType } from '@/types/alarmType';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AlarmStoreType {
  alarm: AlarmDataType[];
  addAlarm: (newAlarm: AlarmDataType) => void;
  deleteAlarm: (id: number) => void;
  readAlarm: (id: number) => void;
  deleteAllAlarm: () => void;
}

export const useProductAlarmStore = create<AlarmStoreType>()(
  persist(
    (set) => ({
      alarm: [],

      addAlarm: (newAlarm) => set((prev) => ({ alarm: [newAlarm, ...prev.alarm] })),
      deleteAlarm: (id) => set((prev) => ({ alarm: prev.alarm.filter((alarm) => alarm.id !== id) })),
      readAlarm: (id) =>
        set((prev) => ({
          alarm: prev.alarm.map((alarmData) => (alarmData.id !== id ? alarmData : { ...alarmData, isRead: true })),
        })),
      deleteAllAlarm: () => set(() => ({ alarm: [] })),
    }),
    { name: 'productAlarmStore' },
  ),
);

export const useEventAlarmStore = create<AlarmStoreType>()(
  persist(
    (set) => ({
      alarm: [],
      addAlarm: (newAlarm) => set((prev) => ({ alarm: [newAlarm, ...prev.alarm] })),
      deleteAlarm: (id) => set((prev) => ({ alarm: prev.alarm.filter((alarm) => alarm.id !== id) })),
      readAlarm: (id) =>
        set((prev) => ({
          alarm: prev.alarm.map((alarmData) => (alarmData.id !== id ? alarmData : { ...alarmData, isRead: true })),
        })),
      deleteAllAlarm: () => set(() => ({ alarm: [] })),
    }),
    { name: 'eventAlarmStorage' },
  ),
);
