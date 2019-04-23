
<template>
  <div is="transition-group" v-show="messages.length > 0" id="messages" name="list" mode="out-in">
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
@import '../assets/styles/helpers'

#messages
  position: fixed
  right: 0.75rem
  bottom: 0.75rem
  z-index: 10
  no-user-select()

  @media (max-width: 700px)
    width: calc(100% - 1.5rem)

p
  margin: 0
  margin-top: 0.5rem
  padding: 0.75rem 2rem
  background-color: white
  color: white
  text-align: center
  font-weight: 500
  font-size: 1rem
  font-family: Montserrat
  box-shadow()

.info
  color: main-color

.error
  color: red

.warning
  color: orange

.list-enter-active, .list-leave-active
  transition: all 0.5s ease-out

.list-enter, .list-leave-to
  opacity: 0
  transform: translateX(10px)

.fade-enter-active, .fade-leave-active
  transition: opacity 0.5s

.fade-enter, .fade-leave-to
  opacity: 0
</style>
