<template>
  <div id="app">
    <title-bar />
    <router-view class="scroll" />
  </div>
</template>
<script>
import TitleBar from '@/components/TitleBar.vue'

export default {
  components: {
    'title-bar': TitleBar,
  },
}
</script>
