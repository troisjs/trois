<template>
  <div class="app">
    <ul class="navbar">
      <li v-for="t in tests" :key="t" @click="test=t">{{ t }}</li>
    </ul>
    <component :is="test" />
  </div>
</template>

<script>
import Demo1 from './components/demos/Demo1.vue';
import Demo2 from './components/demos/Demo2.vue';
import Demo3 from './components/demos/Demo3.vue';
import Slider1 from './components/demos/Slider1.vue';
import DemoGLTF from './components/demos/DemoGLTF.vue';

export default {
  name: 'App',
  components: {
    Demo1, Demo2, Demo3, Slider1, DemoGLTF,
  },
  data() {
    return {
      tests: ['Demo1', 'Demo2', 'Demo3', 'Slider1', 'DemoGLTF'],
      test: 'Demo1',
    };
  },
};
</script>

<style lang="scss">
.app {
  .navbar {
    position: fixed;
    margin: 0;
    padding: 0;
    width: 100%;
    color: #fff;
    text-align: center;
    font-size: 14px;

    li {
      display: inline-block;
      margin: 1em;
      padding: 5px;
      background: rgba(255, 255, 255, 0.5);
      color: #000;
      border-radius: 5px;;
      cursor: pointer;
      transition: background-color 0.4s;
      &:hover {
        background: rgba(255, 255, 255, 1);
      }
    }
  }

  canvas {
    display: block;
  }
}
</style>
