<template>
  <div>
    <app-menu>
      <slot name="menu"/>
    </app-menu>
    <slot name="main"/>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu.vue'

export default {
  name: 'BaseLayout',
  components: {
    'app-menu': AppMenu,
  },
}
</script>

