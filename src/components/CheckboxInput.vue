<template>
  <div class="checkbox-input">
    <label>
      {{ label }}
      <input v-model="output" :onchange="onChange()" type="checkbox">
      <span />
    </label>
  </div>
</template>

<script>
export default {
  name: 'CheckboxInput',

  props: {
    'state': {
      type: Boolean,
      default: false,
    },
    'label': {
      type: String,
      default: '',
    },
  },

  data: function () {
    return {
      output: this.state,
    }
  },

  watch: {
    state (value) {
      this.output = value
    },
  },

  methods: {
    onChange: function () { this.$emit('changed', this.output) },
  },
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers.styl'

.checkbox-input
  margin-bottom: 20px
  padding: 0
  padding-top: 2px
  height: 0

  input
    display: none

  label
    position: relative
    margin: 0
    width: 50px
    color: black
    font-size: 16px
    font-family: Montserrat
    transition: 0.45s ease-out
    user-select: none
    -webkit-user-select: none

    &:not(:first-child)
      margin-left: 20px

  span
    position: relative
    display: inline-block
    margin-left: 10px
    width: 10px
    height: 10px
    border: 1px solid alpha(main-color, 0.5)
    transition: 0.3s ease-out

  [type='checkbox']:checked+span
    position: relative
    display: inline-block
    margin-left: 13px
    width: 6px
    height: 12px
    border: 1.5px solid main-color
    border-top: 0
    border-left: 0
    transition: 0.3s ease-in-out
    transform: rotate(405deg)
</style>
