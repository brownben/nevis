<template>
  <div
    class="flex w-full px-2 py-2 border-solid border-b border-blue-point4 last:border-b-0"
  >
    <label>
      <p class="font-body font-semibold text-blue flex-none px-2 select-none">
        {{ label }}
      </p>
      <input
        :checked="value"
        @change="$emit('input', $event.target.checked)"
        type="checkbox"
      />
      <span />
    </label>
  </div>
</template>

<script>
export default {
  name: 'CheckboxInput',

  props: {
    value: {
      default: false,
    },
    label: {
      type: String,
      default: '',
    },
  },
}
</script>

<style scoped>
p {
  display: inline-block;
  margin-right: 0.5rem;
}

[type='checkbox'] {
  display: none;
}

span {
  position: relative;
  display: inline-block;
  width: 0.85rem;
  height: 0.85rem;
  border: 1.5px solid #1976d266;
  transition: 0.3s ease-out;
  margin-bottom: -2px;
}

[type='checkbox']:checked + span {
  position: relative;
  display: inline-block;
  margin-left: 3px;
  width: 0.5rem;
  height: 1rem;
  border: 2px solid #1976d2;
  border-top: 0;
  border-left: 0;
  transition: 0.3s ease-in-out;
  transform: rotate(405deg);
}
</style>
