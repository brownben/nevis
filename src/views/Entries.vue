<template>
  <base-layout>
    <div slot="menu">
      <router-link to="/entries/add">Add Entry</router-link>
      <router-link to="/dashboard" class="back">Back</router-link>
    </div>
    <div slot="main" class="main">
      <div class="card">
        <label>Name:</label>
        <input v-model="name">
        <label>SI Card Number:</label>
        <input v-model="siid">
        <label>Course:</label>
        <dropdown-input :list="courses" @changed="dropdownChanged"/>
      </div>
      <transition name="fade">
        <div v-if="competitors && competitors.length > 0" class="card">
          <table>
            <tbody>
              <tr>
                <th>Name</th>
                <th>SI Card</th>
                <th>Course</th>
              </tr>
            </tbody>
            <tbody is="transition-group" name="fade">
              <router-link
                v-for="competitor of competitors"
                :to="'/entries/update/' + competitor._id"
                :key="competitor._id"
                tag="tr"
              >
                <td>{{ competitor.name }}</td>
                <td>{{ competitor.siid }}</td>
                <td>{{ competitor.course }}</td>
              </router-link>
            </tbody>
          </table>
        </div>
      </transition>
    </div>
  </base-layout>
</template>

<script>
import BaseLayout from '@/components/BaseLayout.vue'
import DropdownInput from '@/components/DropdownInput.vue'

export default {
  components: {
    'base-layout': BaseLayout,
    'dropdown-input': DropdownInput,
  },

  data: () => ({
    name: '',
    siid: '',
    course: '',
    courses: [],
  }),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Error: Not Connected to the Database', 'error')
    }
  },
  methods: {
    dropdownChanged: function (value) { this.course = value },
  },
  asyncComputed: {
    competitors: function () {
      return this.$database.searchCompetitors(this.name, this.siid, this.course)
        .catch(error => this.$messages.addMessage('Error: ' + error.message, 'error'))
    },
  },
}
</script>
