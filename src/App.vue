<template>
  <div id="app">
    <title-bar />
    <messages />

    <router-view class="scroll pb-3" />
  </div>
</template>
<script>
import TitleBar from '@/components/TitleBar'
import Messages from '@/components/Messages'

export default {
  components: {
    'title-bar': TitleBar,
    'messages': Messages,
  },
}
</script>
