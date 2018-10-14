<template>
  <div class="menu">
    <slot/>
  </div>
</template>

<script>
export default {
  name: 'Menu',
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers.styl'

.menu
  position: fixed
  top: 35px
  left: 0
  width: 180px
  height: 100%
  background-color: white
  box-shadow(0.1)
  position: fixed
  overflow-y: hidden
  user-select: none
  -webkit-user-select: none

  ::-webkit-scrollbar
    display: none

  div
    height: calc(100% - 17px)

a, button
  display: block
  box-sizing: border-box
  margin: 0
  padding: 7px
  width: 100%
  outline: 0
  border: 0
  background-color: white
  color: main-color
  text-align: center
  text-decoration: none
  font-size: 16px
  transition: 0.3s
  user-select: none
  -webkit-user-select: none
  default-font()
  user-select: none
  -webkit-user-select: none

  &:first-child
    margin-top: 5px

  &:hover
    background-color: main-color
    color: white

.back
  position: absolute
  bottom: 43px
</style>
