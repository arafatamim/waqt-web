/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'virtual:pwa-register';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ColorScheme = 'default' | 'dark' | 'light';

type CalcMethod =
  | 'karachi'
  | 'mwl'
  | 'egypt'
  | 'makkah'
  | 'kuwait'
  | 'isna'
  | 'singapore'
  | 'turkey'
  | 'mcw';

type Settings = {
  timeFormat: string;
  calcMethod: CalcMethod;
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
