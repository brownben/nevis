<template>
  <div class="text-input">
    <label :for="label">{{ label }}</label>
    <input :value="value" type="text" :name="label" @input="$emit('input', $event.target.value)">
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',

  props: {
    'value': {
      type: String,
      default: '',
    },
    'label': {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped lang="stylus">
@import '../assets/styles/helpers'

.text-input
  display: flex
  box-sizing: border-box
  padding: 0.75rem 1rem
  width: 100%
  border-bottom: 1px solid alpha(main-color, 0.4)

  &:last-child
    border-bottom: 0

label
  margin-right: 1rem
  width: auto
  color: main-color
  font-size: 1rem

input
  flex-grow: 1
  flex-shrink: 2
  outline: 0
  border: 0
  font-size: 1rem
</style>
