<template>
  <div class="dialog">
    <div class="card">
      <h2>{{ heading }}</h2>
      <p>{{ message }}</p>
      <div class="buttons">
        <slot :confirmAction="confirmAction">
          <button @click="confirmAction(true)">{{ confirm }}</button>
          <button @click="confirmAction(false)">{{ cancel }}</button>
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
@import '../assets/styles/helpers.styl'

.dialog
  position: fixed
  top: 35px
  left: 0
  z-index: 10
  display: inline-block
  width: 100vw
  height: 100vh
  background-color: alpha(main-color, 0)
  vertical-align: middle

  .card
    box-sizing: border-box
    padding: 0.5rem 15%
    width: 100%
    box-shadow(2)

  button
    margin: 0.3rem
    padding: 0.3rem 0.6rem
    outline: 0
    border: 1px main-color solid
    background-color: white
    color: main-color
    transition: 0.3s
    user-select: none
    -webkit-user-select: none
    default-font()

    &:first-child
      margin-left: 0

    &:hover
      background-color: main-color
      color: white
</style>
