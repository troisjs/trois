import { createApp } from 'vue';
import App from './App.vue';
import TroisJSPlugin from './plugin.js';
import './index.css';

const app = createApp(App);
app.use(TroisJSPlugin);
app.mount('#app');
