import { writable } from 'svelte/store';

export const settingsStore = writable<Settings>({
  timeFormat: 'h:mm a',
  calcMethod: 'karachi',
  latitude: null,
  longitude: null,
  colorScheme: 'default',
});

export const timesStore = writable<Nullable<Prayers>>({
  fajr: null,
  sunrise: null,
  dhuhr: null,
  asr: null,
  maghrib: null,
  isha: null,
});
