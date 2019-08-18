<template>
  <div>
    <div class="bg-gradient text-center w-full shadow-md mb-3">
      <img src="@/assets/images/Nevis Logo.png" alt="Nevis Logo" class="h-40 py-5" />
      <h1 class="pb-4 text-3xl text-white">Welcome to Nevis</h1>
    </div>
    <div class="mx-10 mb-3">
      <button class="button" @click="connect">Connect</button>
      <router-link tag="button" class="button" to="/about">About</router-link>
    </div>
    <div class="shadow mx-10">
      <text-input v-model.trim="server" label="Server:" />
      <text-input v-model.trim="port" label="Port:" />
      <text-input v-model.trim="username" label="Username:" />
      <text-input v-model.trim="password" label="Password:" type="password" />
      <text-input v-model.trim="database" label="Database:" />
    </div>
  </div>
</template>

<script>
import TextInput from '@/components/TextInput'

export default {
  components: {
    'text-input': TextInput,
  },

  data: function () {
    return {
      server: 'localhost',
      port: '3306',
      username: 'sa',
      password: 'orienteer',
      database: 'nevis',
    }
  },

  methods: {
    connect: function () {
      this.$database.connection = this.$mysql.createConnection({
        connectionLimit: 10,
        host: this.server,
        port: this.port,
        user: this.username,
        password: this.password,
        database: this.database,
      })
      return this.$database.connect()
        .then(() => {
          this.$database.connected = true
          this.$router.push('/events')
        })
        .catch(error => this.$messages.addMessage(error, 'error'))
    },
  },
}
</script>
