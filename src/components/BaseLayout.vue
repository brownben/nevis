<template>
  <div id="main-content">
    <app-menu>
      <slot name="menu" />
    </app-menu>
    <div id="main-container">
      <messages />
      <main>
        <slot name="main" />
      </main>
    </div>
  </div>
</template>

<script>
import AppMenu from '@/components/AppMenu'
import Messages from '@/components/Messages'

export default {
  name: 'BaseLayout',
  components: {
    'app-menu': AppMenu,
    'messages': Messages,
  },
}
</script>
<style lang="stylus" scoped>
#main-content
  height: 100%

#main-container
  overflow-x: hidden
  overflow-y: auto
  margin-left: 180px
  width: calc(100% - 180px)
  height: calc(100% - 35px)
</style>

