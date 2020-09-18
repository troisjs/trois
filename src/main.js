import { createApp } from 'vue';
import { TroisJSVuePlugin } from './plugin.js';
import App from './App.vue';
import './index.css';

const app = createApp(App);
app.use(TroisJSVuePlugin);
app.mount('#app');
