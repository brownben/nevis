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
      <div v-if="competitors && competitors.length > 0" class="card">
        <table>
          <tbody>
            <tr>
              <th @click="sortBy('name')">Name</th>
              <th @click="sortBy('siid')">SI Card</th>
              <th @click="sortBy('course')">Course</th>
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
    sortByField: 'name',
    reverseSort: false,
  }),
  created: function () {
    if (this.$database.database === null) {
      this.$router.push('/')
      this.$messages.addMessage('Not Connected to the Database', 'error')
    }
  },
  methods: {
    dropdownChanged: function (value) { this.course = value },
    sortBy: function (field) {
      if (this.sortByField === field) this.reverseSort = !this.reverseSort
      this.sortByField = field
    },
  },
  asyncComputed: {
    competitors: function () {
      return this.$database.searchCompetitors(this.name, this.siid, this.course, this.sortByField, this.reverseSort)
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
    courses: function () {
      return this.$database.getCourses()
        .then(data => {
          let courses = data.map(course => course.doc.name)
          courses.unshift('')
          return courses
        })
        .catch(error => this.$messages.addMessage(error.message, 'error'))
    },
  },
}
</script>
