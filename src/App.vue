<template>
  <div id="app">
    <title-bar />
    <messages />
    <div id="main-container">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>
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

<style lang="stylus">
@import './assets/styles/index'

#main-container
  position: absolute
  top: 35px
  left: 0
  overflow-x: hidden
  overflow-y: auto
  box-sizing: border-box
  padding: 0 10vw
  width: 100vw
  height: calc(100vh - 35px)

  @media (max-width: 1250px)
    padding: 0 7.5vw

  @media (max-width: 1000px)
    padding: 0 5vw

  @media (max-width: 700px)
    padding: 0 2.5rem

.fade-enter-active
  transition: all 0.3s ease

.fade-leave-active
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1)

.slide-fade-enter, .slide-fade-leave-to
  opacity: 0
</style>
