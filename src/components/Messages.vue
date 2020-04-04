<template>
  <div
    is="transition-group"
    v-show="messages.length > 0"
    id="messages"
    name="list"
    mode="out-in"
    class="fixed bottom-0 right-0 w-auto p-3 min-w-1/4 z-30"
  >
    <p
      v-for="message of messages"
      :key="message.id"
      :class="message.type"
      class="text-center font-body font-semibold my-shadow mt-3 p-3 px-6 w-full select-none z-30"
      @click="clear(message.id)"
    >
      <span v-if="message.type === 'error'">Error:</span>
      <span v-else-if="message.type === 'warning'">Warning:</span>
      {{ message.text }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'Messages',
  data: function () {
    return {
      messages: this.$messages.messages,
    }
  },

  methods: {
    clear: function (id) {
      this.$messages.removeMessage(id)
    },
  },
}
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}
</style>
