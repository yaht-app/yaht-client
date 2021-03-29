import { interfaces } from 'inversify';

declare module 'vue/types/vue' {
  import Container = interfaces.Container;

  interface Vue {
    $container: Container;
  }
}
