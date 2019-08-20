<!--
  Up and Down Arrows for Table

  The arrows for the table indicating sort preference and direction. The data is passed through props and watched for changes.
-->

<template>
  <div class="up-down-arrows">
    <svg :class="{ active: (active && !ascending) }" class="fill-current" viewBox="0 0 24 24">
      <path d="M7 14l5-5 5 5z" />
    </svg>
    <svg :class="{ active: (active && ascending) }" class="fill-current" viewBox="0 0 24 24">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'UpDownArrows',

  props: {
    'active': {
      type: Boolean,
      default: false,
    },

    'ascending': {
      type: Boolean,
      default: false,
    },
  },
}
</script>
<style scoped>
.up-down-arrows {
  display: inline-block;
  height: 20px;
}
svg {
  position: relative;
  display: block;
  height: 18px;
}
svg:first-child {
  bottom: -2px;
}
svg:last-child {
  top: -10px;
}
</style>
