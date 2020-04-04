<template>
  <div class="dropdown-input w-full relative">
    <div
      id="visible"
      class="relative flex w-full px-2 py-2 border-solid border-b border-blue-point4 last:border-b-0"
      @click="toggle"
    >
      <label
        class="font-body text-blue font-semibold flex-none px-2 select-none"
        >{{ label }}</label
      >
      <p class="font-body outline-none flex-1 appearance-none">
        {{ currentValue }}
      </p>
      <svg
        v-show="!currentHide"
        fill="#9E9E9E"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        class="relative right-0 fill-current text-blue"
      >
        <path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z" />
        <path d="M0-.75h24v24H0z" fill="none" />
      </svg>
    </div>
    <transition name="open">
      <div
        v-show="open"
        id="dropdown"
        class="absolute w-full bg-white block select-none my-shadow z-10 text-center"
      >
        <p
          v-for="item in list"
          :key="item"
          class="block text-body h-8 p-1 hover:bg-blue-point2 select-none"
          @click="changeSelection(item)"
        >
          {{ item }}
        </p>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',

  props: {
    label: {
      type: String,
      default: '',
    },
    value: {
      default: '',
    },
    list: {
      type: Array,
      default: () => [],
    },
    hide: {
      type: Boolean,
      default: false,
    },
  },

  data: function () {
    return {
      open: false,
      currentValue: this.value,
      currentHide: this.hide,
    }
  },

  watch: {
    value: function (value) {
      this.currentValue = value
    },
    hide: function (value) {
      this.currentHide = value
    },
  },

  methods: {
    changeSelection: function (value) {
      this.open = false
      this.currentValue = value
      this.$emit('input', value)
    },

    toggle: function () {
      if (!this.currentHide) {
        this.open = !this.open
        if (this.open) this.$emit('opened')
      }
    },
  },
}
</script>
<style scoped>
.open-enter-active,
.open-leave-active {
  transition: 0.3s transform;
  transform: scaleY(1);
  transform-origin: top;
}
.open-enter,
.open-leave-to {
  transform: scaleY(0);
  transform-origin: top;
}
</style>
