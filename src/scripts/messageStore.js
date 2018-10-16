export default {
  messages: [],
  id: 0,
  addMessage: function (value, type = 'info') {
    this.messages.push({
      id: this.id,
      type: type,
      text: value,
    })
    this.id += 1
  },
  clearMessages: function () {
    this.messages.splice(0, this.messages.length)
  },
  removeMessage: function (id) {
    this.messages.splice(this.messages.map(message => message.id).indexOf(id), 1)
  },
}
