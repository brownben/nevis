<template>
  <div
    class="flex w-full px-2 py-2 border-solid border-b border-blue-point4 last:border-b-0"
  >
    <label
      :for="label"
      class="font-body font-semibold text-blue flex-none px-2 select-none"
      >{{ label }}</label
    >
    <input
      :name="label"
      :value="value"
      :type="inputType"
      class="font-body outline-none flex-1 appearance-none"
      @input="$emit('input', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  name: 'DropdownInput',

  props: {
    value: {
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  },

  computed: {
    inputType: function () {
      if (this.type === 'password') return 'password'
      else return 'text'
    },
  },
}
</script>
