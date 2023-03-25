/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'virtual:pwa-register';

type ColorScheme = 'default' | 'dark' | 'light';

type Settings = {
  timeFormat: string;
  calcMethod: string;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  colorScheme: ColorScheme;
};

type Prayers = {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
};
