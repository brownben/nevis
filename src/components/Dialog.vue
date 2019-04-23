<template>
  <div class="dialog">
    <div class="card">
      <h1>{{ heading }}</h1>
      <p>{{ message }}</p>
      <div class="buttons">
        <slot :confirmAction="confirmAction">
          <button class="cancel" @click="confirmAction(false)">{{ cancel }}</button>
          <button @click="confirmAction(true)">{{ confirm }}</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dialog',

  props: {
    'heading': {
      type: String,
      default: '',
    },
    'message': {
      type: String,
      default: '',
    },
    'confirm': {
      type: String,
      default: '',
    },
    'cancel': {
      type: String,
      default: 'Cancel',
    },
    'value': {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    confirmAction: function (value) { this.$emit('close', value) },
  },
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers'

.dialog
  position: fixed
  top: 35px
  left: 0
  z-index: 25
  display: flex
  justify-content: center
  align-items: center
  width: 100vw
  height: calc(100vh - 35px)
  background-color: alpha(black, 0.3)
  transition: 0.3s

  .card
    padding: 1.5rem
    min-width: 35rem
    max-width: 55%
    height: auto
    background-color: white
    box-shadow(2)

    @media (max-width: 39rem)
      min-width: 80vw
      max-width: 80vw

    h1
      padding: 0.25rem 0
      color: main-color

    p
      padding: 0.5rem 0 1rem

    .buttons
      float: right

      button
        margin-left: 0.75rem
        padding: 0.35rem 0.75rem
        border: 1px solid main-color
        background-color: white
        color: main-color
        font-weight: 500
        font-size: 1rem
        transition: 0.5s

        &:hover
          background-color: main-color
          color: white

        &.cancel
          border: none
          color: #A0A0A0

          &:hover
            background-color: #f4f4f4
</style>
