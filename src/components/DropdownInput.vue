<template>
  <div class="dropdown-input">
    <select v-model="output" :onchange="onChange()">
      <option v-for="item in list" :key="item">{{ item }}</option>
    </select>
    <label>
      <svg fill="#9E9E9E" height="24" viewBox="0 0 24 24" width="24">
        <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/>
        <path d="M0-.75h24v24H0z" fill="none"/>
      </svg>
    </label>
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',
  props: {
    'initial': {
      type: String,
      default: '',
    },
    'list': {
      type: Array,
      default: [],
    },
  },
  data: () => ({
    output: '',
  }),
  watch: {
    initial (value) {
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

.dropdown-input
  margin-bottom: -20px

  select
    margin: 3px 0 5px
    padding: 4px
    width: 100%
    outline: 0
    border: 1px solid alpha(main-color, 0.5)
    color: black
    font-size: 16px
    font-family: Montserrat
    -webkit-appearance: none

    &:focus
      border: 1px solid main-color

  select:focus+label
    svg
      fill: main-color

  svg
    position: relative
    top: -30px
    right: calc(-100% + 25px)
    transition: 0.3s ease-out
</style>
