import { createApp } from 'vue';
import { TroisJSVuePlugin } from './plugin.js';
import App from './App.vue';

const app = createApp(App);
app.use(TroisJSVuePlugin);
app.mount('#app');
