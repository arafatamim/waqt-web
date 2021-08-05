/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'virtual:pwa-register';

type Nullable<T> = {
  [P in keyof T]: T[P] | null;
};

type ColorScheme = 'default' | 'dark' | 'light';
