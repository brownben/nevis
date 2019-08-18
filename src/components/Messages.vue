
<template>
  <div
    is="transition-group"
    v-show="messages.length > 0"
    id="messages"
    name="list"
    mode="out-in"
    class="fixed bottom-0 right-0 w-auto p-3"
  >
    <p
      v-for="message of messages"
      :key="message.id"
      :class="message.type"
      class="bg-white text-center shadow mt-3 p-2 px-3 w-full"
      @click="clear(message.id)"
    >
      <span v-if="message.type === 'error'" class="text-red">Error: {{ message.text }}</span>
      <span v-else-if="message.type === 'warning'" class="text-orange">Warning: {{ message.text }}</span>
      <span v-else class="text-blue">{{ message.text }}</span>
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

<style scoped >
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease-out;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
