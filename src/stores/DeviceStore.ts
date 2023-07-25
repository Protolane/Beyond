import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

interface DeviceStore {
  uuid: string;
}

export const useDeviceStore = create(
  persist<DeviceStore>(
    (set, get) => ({
      uuid: uuid.v4().toString(),
    }),
    {
      name: 'device',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
