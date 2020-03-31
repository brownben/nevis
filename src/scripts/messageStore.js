export default {
  messages: [],
  id: 0,

  addMessage: function(value, type = 'info') {
    const id = this.id
    this.id += 1

    this.messages.push({
      id: id,
      type: type,
      text: value,
    })

    if (type === 'info')
      setTimeout(
        id => {
          this.removeMessage(id)
        },
        30000,
        id
      )
  },

  clearMessages: function() {
    this.messages.splice(0, this.messages.length)
  },

  removeMessage: function(id) {
    this.messages.splice(
      this.messages.map(message => message.id).indexOf(id),
      1
    )
  },
}
