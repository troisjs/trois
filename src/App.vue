<template>
  <div class="app">
    <ul class="navbar">
      <li v-for="t in tests" :key="t" @click="test=t">{{ t }}</li>
    </ul>
    <component :is="test" />
  </div>
</template>

<script>
import Test1 from './components/Test1.vue';
import Test2 from './components/Test2.vue';
import Test3 from './components/Test3.vue';

export default {
  name: 'App',
  components: {
    Test1, Test2, Test3,
  },
  data() {
    return {
      tests: ['Test1', 'Test2', 'Test3'],
      test: 'Test1',
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
      cursor: pointer;
    }
  }
}
</style>
