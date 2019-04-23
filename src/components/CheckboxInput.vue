<template>
  <div class="checkbox-input">
    <label>
      <p>{{ label }}</p>
      <input :checked="value" type="checkbox" @change="$emit('input', $event.target.checked)">
      <span />
    </label>
  </div>
</template>

<script>
export default {
  name: 'CheckboxInput',

  props: {
    'value': {
      type: Boolean,
      default: false,
    },
    'label': {
      type: String,
      default: '',
    },
    'size': {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers'

.checkbox-input
  padding: 0.75rem 1rem
  width: 100%

  p
    display: inline-block
    margin-right: 1rem
    width: auto
    color: main-color

  [type='checkbox']
    display: none

  span
    position: relative
    display: inline-block
    width: 10px
    height: 10px
    border: 1px solid alpha(#bdbdbd, 0.5)
    transition: 0.3s ease-out

  [type='checkbox']:checked+span
    position: relative
    display: inline-block
    margin-left: 3px
    width: 6px
    height: 12px
    border: 1.5px solid main-color
    border-top: 0
    border-left: 0
    transition: 0.3s ease-in-out
    transform: rotate(405deg)
</style>
