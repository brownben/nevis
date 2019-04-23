<template>
  <div class="menu">
    <img src="@/assets/images/NevisWhiteBorder.png" alt="Nevis Logo">
    <h1>Nevis</h1>
    <p>Version: 4.0.0-beta</p>
    <template v-if="!$slots.default">
      <router-link to="/dashboard" :class="{active: $route.path.includes('/dashboard')}">Home</router-link>
      <router-link to="/entries" :class="{active: $route.path.includes('/entries')}">Entries</router-link>
      <router-link to="/courses" :class="{active: $route.path.includes('/courses')}">Courses</router-link>
      <router-link to="/download" :class="{active: $route.path.includes('/download')}">Download</router-link>
      <router-link
        to="/safety-check"
        :class="{active: $route.path.includes('/safety-check')}"
      >
        Safety Check
      </router-link>
      <router-link to="/results" :class="{active: $route.path.includes('/results')}">Results</router-link>
    </template>
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Menu',
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers'

.menu
  position: fixed
  top: 35px
  left: 0
  box-sizing: border-box
  width: 250px
  height: calc(100vh - 35px)
  background-color: main-color
  color: white
  text-align: center
  box-shadow()
  no-user-select()

  @media (max-width: 1000px)
    width: 220px

  img
    padding: 0.25rem 0 0
    height: 6rem

  p
    padding-bottom: 1rem
    color: white
    font-size: 0.75rem

  button, a
    display: block
    box-sizing: border-box
    padding: 0.5rem 0.1rem
    width: 100%
    outline: 0
    border: 0
    background-color: main-color
    color: white
    text-decoration: none
    font-weight: 300
    font-size: 1rem
    font-family: Montserrat
    transition: 0.3s

    &.active
      padding-left: calc(0.25rem - 4px)
      border-left: 4px solid white
      background-color: alpha(white, 0.1)

    &:hover
      background-color: alpha(white, 0.1)
</style>
