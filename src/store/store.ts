import { writable } from 'svelte/store';

export type Settings = {
  timeFormat: string;
  calcMethod: string;
  latitude: number | null;
  longitude: number | null;
  colorScheme: ColorScheme;
};

export const settingsStore = writable<Settings>({
  timeFormat: 'h:mm a',
  calcMethod: 'karachi',
  latitude: null,
  longitude: null,
  colorScheme: 'default',
});

export type Prayers = {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
};

export const timesStore = writable<Nullable<Prayers>>({
  fajr: null,
  sunrise: null,
  dhuhr: null,
  asr: null,
  maghrib: null,
  isha: null,
});
