<template>
  <svg
    class="text-blue fill-current hover:text-blue-accent h-8 -ml-8 p-1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    @click="go"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
  </svg>
</template>
<script>
export default {
  name: 'BackArrow',
  props: {
    'to': {
      type: String,
      default: '',
    },
    'disable': {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    go: function () {
      if (this.disable) this.$emit('clicked')
      else if (this.to !== '') this.$router.push(this.to)
      else this.$router.go(-1)
    },
  },
}
</script>
