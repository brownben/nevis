<template>
  <div is="transition-group" v-show="messages.length > 0" id="messages" name="list">
    <p
      v-for="message of messages"
      :key="message.id"
      :class="message.type"
      @click="clear(message.id)"
    >
      <span v-if="message.type === 'error'">Error:</span>
      <span v-if="message.type === 'warning'">Warning:</span>
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

<style scoped lang="stylus">
@import '../assets/styles/helpers.styl'

#messages
  display: grid
  box-sizing: border-box
  padding: 15px
  padding-bottom: 0
  width: 100%
  grid-gap: 10px

p
  margin: 0
  padding: 10px
  text-align: center
  box-shadow(1)
  default-font()

.info
  color: main-color

.error
  color: red

.warning
  color: orange

.list-enter-active, .list-leave-active
  transition: all 0.3s

.list-enter, .list-leave-to /* .list-leave-active below version 2.1.8 */
  opacity: 0
  transform: translateX(-10px)
</style>
