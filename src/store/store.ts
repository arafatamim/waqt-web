import { writable } from 'svelte/store';
import { CalculationMethod } from 'adhan';

export type ColorScheme = 'default' | 'dark' | 'light';

export type CalculationMethodType = keyof typeof CalculationMethod;

export type Settings = {
  timeFormat: string;
  calcMethod: CalculationMethodType;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  colorScheme: ColorScheme;
};

export type Prayers = {
  fajr: Date | null;
  sunrise: Date | null;
  dhuhr: Date | null;
  asr: Date | null;
  maghrib: Date | null;
  isha: Date | null;
};

export const settings = writable<Settings>({
  timeFormat: 'h:mm a',
  calcMethod: 'Karachi',
  city: null,
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
