import App from './App.svelte';
import '@fontsource/poppins/latin-400.css';
import './styles/_base.scss';
import { registerSW } from 'virtual:pwa-register';
import { mount } from "svelte";

registerSW();

const app = mount(App, {
  target: document.getElementById('app')!,
});

export default app;
