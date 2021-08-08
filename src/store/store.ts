import { writable } from 'svelte/store';
import { CalculationMethod } from 'adhan';

export const settings = writable<Settings>({
  timeFormat: 'h:mm a',
  calcMethod: CalculationMethod.Karachi().method,
  latitude: null,
  longitude: null,
  colorScheme: 'default',
});

export const times = writable<Prayers>({
  fajr: null,
  sunrise: null,
  dhuhr: null,
  asr: null,
  maghrib: null,
  isha: null,
});
