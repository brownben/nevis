<template>
  <div id="app">
    <title-bar />
    <router-view />
  </div>
</template>

<script>
import TitleBar from "@/components/TitleBar.vue";

export default {
  components: {
    "title-bar": TitleBar
  }
};
</script>

<style lang="stylus">
  @font-face
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 300;
    src: local('Montserrat Light'), local('Montserrat-Light'), url('./assets/MontserratLight.woff2')

  @font-face
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: local('Montserrat'), local('Montserrat'), url('./assets/Montserrat.woff2')

  body, #app
    margin: 0
    padding: 0

  h1, h2, h3, h4, h5, h6
    color:#0D47A1
    font-family: 'Montserrat'
    font-style: normal
    font-weight: 400
    line-height: normal

  p
    font-family: 'Montserrat'
    font-style: normal
    font-weight: 300
    line-height: normal

  a
    color: #0D47A1
    font-family: 'Montserrat'
    font-style: normal
    font-weight: 300
    line-height: normal

</style>
