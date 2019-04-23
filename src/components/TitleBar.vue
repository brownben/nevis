<template>
  <div>
    <p>Nevis</p>
    <button id="close" @click="close()">
      <svg color=" white" width="10" height="10">
        <path
          d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"
        />
      </svg>
    </button>
    <button @click="maximize()">
      <svg v-if="!maximized" color="white" width="10" height="10">
        <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
      </svg>
      <svg v-if="maximized" color="white" width="10" height="10">
        <path
          d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"
        />
      </svg>
    </button>
    <button @click="minimize()">
      <svg color="white" width="10" height="10">
        <path d="M 0,5 10,5 10,6 0,6 Z" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'TitleBar',

  data: () => ({
    maximized: false,
  }),

  mounted: function () {
    this.$electron.ipcRenderer.on('window', (event, data) => { this.maximized = data === 'maximized' })
  },

  methods: {
    close: () => window.close(),
    maximize: function () { this.$electron.ipcRenderer.send('window', 'maximize') },
    minimize: function () { this.$electron.ipcRenderer.send('window', 'minimize') },
  },
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers'

div
  position: fixed
  top: 0
  left: 0
  z-index: 5
  width: 100vw
  height: 35px
  background: main-color
  color: white
  user-select: none
  -webkit-user-select: none
  -webkit-app-region: drag

  p
    float: left
    margin: 7px 0 7px 12px
    default-font()
    font-size: 16px
    line-height: normal

  button
    float: right
    padding: 0
    width: 50px
    height: 100%
    outline: 0
    border: 0
    background: none
    transition: 0.3s ease-out
    fill: white
    -webkit-app-region: no-drag

    &:hover
      background-color: accent-color

  #close
    &:hover
      background-color: #D32F2F
</style>
