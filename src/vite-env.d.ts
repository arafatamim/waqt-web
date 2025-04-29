/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module 'virtual:pwa-register';

declare module 'simple-svelte-autocomplete';

declare module 'svelte-icons/*' {
  import type { SvelteComponentTyped } from 'svelte';

  export default class Icon extends SvelteComponentTyped<{
    size?: number | string;
    color?: string;
    class?: string;
    [key: string]: any;
  }> {}
}
