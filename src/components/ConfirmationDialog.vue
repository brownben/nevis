<template>
  <div
    class="fixed top-0 pt-8 flex w-full h-full bg-blue-point4 flex-col justify-around content-center select-none"
  >
    <div
      class="-mt-16 bg-white justify-around content-center flex-none my-shadow-lg mx-12 sm:mx-16 md:mx-20 px-3 pt-2 pb-3 text-center select-none"
    >
      <h1>{{ heading }}</h1>
      <p class="my-1 select-none">{{ message }}</p>
      <button
        @click="confirmAction(false)"
        class="w-1/3 sm:w-1/4 m-1 mt-2 py-1 px-3 text-blue font-heading border border-solid border-blue hover:bg-blue-point4"
      >
        {{ cancel }}
      </button>
      <button
        @click="confirmAction(true)"
        class="w-1/3 sm:w-1/4 m-1 mt-2 py-1 px-3 bg-blue text-white font-heading hover:bg-blue-point8 border border-solid border-blue"
      >
        {{ confirm }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmationDialog',

  props: {
    heading: {
      type: String,
      default: '',
    },
    message: {
      type: String,
      default: '',
    },
    confirm: {
      type: String,
      default: '',
    },
    cancel: {
      type: String,
      default: 'Cancel',
    },
  },

  methods: {
    confirmAction: function(value) {
      this.$emit('close', value)
    },
  },
}
</script>
