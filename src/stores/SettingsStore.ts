import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {}

export const useSettingsStore = create(
  persist<SettingsStore>((set, get) => ({}), {
    name: 'settings',
    storage: createJSONStorage(() => AsyncStorage),
  })
);
