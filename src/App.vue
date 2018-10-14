<template>
  <div id="app">
    <title-bar/>
    <router-view/>
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

<style lang="stylus" src="./assets/styles/index.styl"></style>
