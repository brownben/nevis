<template>
  <div id="app">
    <title-bar />
    <messages />
    <router-view class="scroll" />
  </div>
</template>
<script>
import TitleBar from '@/components/TitleBar.vue'
import Messages from '@/components/Messages.vue'

export default {
  components: {
    'title-bar': TitleBar,
    'messages': Messages,
  },
}
</script>
