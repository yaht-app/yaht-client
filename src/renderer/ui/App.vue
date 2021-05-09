<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
@import 'styles/global';
@import '~animate.css';

#app {
  @apply bg-white;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
