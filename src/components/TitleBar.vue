<template>
  <div id="titlebar" class="h-8 bg-blue text-white">
    <h4 class="p-1 pl-2 float-left text-base">Nevis</h4>
    <button id="close" class="h-full w-12 hover:bg-red float-right" @click="close()">
      <svg fill="white" width="10" height="10">
        <path
          d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"
        />
      </svg>
    </button>
    <button class="h-full w-12 hover:bg-blue-accent float-right" @click="maximize()">
      <svg v-if="!maximized" fill="white" width="10" height="10">
        <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z" />
      </svg>
      <svg v-if="maximized" fill="white" width="10" height="10">
        <path
          d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"
        />
      </svg>
    </button>
    <button class="h-full w-12 hover:bg-blue-accent float-right" @click="minimize()">
      <svg fill="white" width="10" height="10">
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
    this.$electron.ipcRenderer.on('window', this.setMaximized)
  },

  methods: {
    close: () => window.close(),
    maximize: function () { this.$electron.ipcRenderer.send('window', 'maximize') },
    minimize: function () { this.$electron.ipcRenderer.send('window', 'minimize') },
    setMaximized: function (event, data) { this.maximized = data === 'maximized' },
  },
}
</script>

<style scoped>
#titlebar {
  user-select: none;
  -webkit-app-region: drag;
}

button {
  -webkit-app-region: no-drag;
}
</style>
