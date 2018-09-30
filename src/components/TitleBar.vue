<template>
    <div>
        <p>Nevis</p>
        <button v-on:click="close()">
            <svg color=" white" width="10" height="10">
                <path d="M 0,0 0,0.7 4.3,5 0,9.3 0,10 0.7,10 5,5.7 9.3,10 10,10 10,9.3 5.7,5 10,0.7 10,0 9.3,0 5,4.3 0.7,0 Z"></path>
            </svg>
        </button>
        <button v-on:click="maximize()">
            <svg color="white" width="10" height="10" v-if="!maximized">
                <path d="M 0,0 0,10 10,10 10,0 Z M 1,1 9,1 9,9 1,9 Z"></path>
            </svg>
            <svg color="white" width="10" height="10" v-if="maximized">
                <path d="m 2,1e-5 0,2 -2,0 0,8 8,0 0,-2 2,0 0,-8 z m 1,1 6,0 0,6 -1,0 0,-5 -5,0 z m -2,2 6,0 0,6 -6,0 z"></path>
            </svg>
        </button>
        <button v-on:click="minimize()">
            <svg color="white" width="10" height="10">
                <path d="M 0,5 10,5 10,6 0,6 Z"></path>
            </svg>
        </button>
    </div>
</template>

<script>
export default {
    name: "TitleBar",
    data: function () {
        return {
            maximized: false,
        }
    },
    methods: {
        close: () => { window.close() },
        maximize: function () { this.$electron.ipcRenderer.send('window', 'maximize') },
        minimize: function () { this.$electron.ipcRenderer.send('window', 'minimize') },
    },
    mounted () {
        this.$electron.ipcRenderer.on('window', (event, data) => { this.maximized = data === 'maximized' })
    }
};
</script>

<style scoped lang="stylus">
div
    width:100%
    height:35px
    color:white
    background:#0D47A1
    -webkit-user-select: none
    -webkit-app-region: drag
    user-select: none

    p
        font-family: 'Montserrat'
        font-style: normal
        font-weight: 300
        line-height: normal
        font-size: 16px
        float:left
        margin:7px 0 7px 12px

    button
        height:100%
        width:50px
        float:right
        border:0
        outline:0
        padding:0
        fill:white
        background:none
        -webkit-app-region: no-drag
        transition:.5s

        &:hover
            background-color:#1565C0

    #close
        &:hover
            background-color:#D32F2F

@media(max-width:230px)
    #titlebar
        #maximize, #minimize
            display:none

</style>
