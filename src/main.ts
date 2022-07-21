import App from './App.svelte';
import '@fontsource/poppins/latin-400.css';
import './styles/_base.scss';
import { registerSW } from 'virtual:pwa-register';

registerSW();

const app = new App({
  target: document.getElementById('app')!,
});

export default app;
