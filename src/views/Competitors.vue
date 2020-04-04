<template>
  <main>
    <back-arrow :to="`/events/${$route.params.id}`" />
    <h1 class="mx-10 mb-1 px-1">
      Entries
    </h1>
    <div class="mx-12 mb-3">
      <router-link
        :to="`/events/${$route.params.id}/competitors/create`"
        tag="button"
        class="button"
      >
        Create Entry
      </router-link>
      <button class="button" @click="refresh">Refresh</button>
    </div>
    <div
      v-if="allCompetitors && allCompetitors.length > 0"
      class="my-shadow mx-12 mb-5"
    >
      <h3 class="px-4 pt-2 text-blue select-none">
        Search Entries
      </h3>
      <text-input v-model="filterName" label="Name:" />
      <text-input v-model="filterSIID" label="SI Card:" />
      <dropdown-input
        v-model="filterCourse"
        :list="listOfCourseNames"
        label="Course:"
      />
    </div>
    <div
      v-if="competitors && competitors.length > 0"
      class="my-shadow mx-12 mb-3 p-2"
    >
      <table class="w-full font-body">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th @click="changeSortBy('name')">
            Name
            <up-down-arrows
              :active="sortBy === 'name'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th @click="changeSortBy('siid')">
            SI Card
            <up-down-arrows
              :active="sortBy === 'siid'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th class="hidden md:table-cell" @click="changeSortBy('ageClass')">
            Age Class
            <up-down-arrows
              :active="sortBy === 'ageClass'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th @click="changeSortBy('course')">
            Course
            <up-down-arrows
              :active="sortBy === 'course'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
          <th class="hidden lg:table-cell" @click="changeSortBy('club')">
            Club
            <up-down-arrows
              :active="sortBy === 'club'"
              :ascending="sortDirection === 'ASC'"
            />
          </th>
        </tr>
        <tbody is="transition-group" name="fade">
          <router-link
            v-for="competitor of competitors"
            :key="competitor.id"
            :to="`/events/${$route.params.id}/competitors/${competitor.id}/edit`"
            tag="tr"
            class="text-center odd:bg-blue-lightest hover:bg-blue-light"
          >
            <td>{{ competitor.name }}</td>
            <td>{{ competitor.siid }}</td>
            <td class="hidden md:table-cell">{{ competitor.ageClass }}</td>
            <td>{{ competitor.courseName }}</td>
            <td class="hidden lg:table-cell">{{ competitor.club }}</td>
          </router-link>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'
import TextInput from '@/components/TextInput'
import DropdownInput from '@/components/DropdownInput'
import UpDownArrows from '@/components/UpDownArrows'

export default {
  components: {
    'back-arrow': BackArrow,
    'text-input': TextInput,
    'dropdown-input': DropdownInput,
    'up-down-arrows': UpDownArrows,
  },

  data: function () {
    return {
      allCompetitors: [],
      competitors: [],
      listOfCourseNames: [],
      filterName: '',
      filterSIID: '',
      filterCourse: '',
      sortBy: 'id',
      sortDirection: 'DESC',
    }
  },

  watch: {
    filterName: function () {
      this.getCompetitors()
    },
    filterSIID: function () {
      this.getCompetitors()
    },
    filterCourse: function () {
      this.getCompetitors()
    },
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else this.refresh()
  },

  methods: {
    refresh: function () {
      this.getCourses()
      this.getCompetitors()
      this.getAllCompetitors()
    },
    changeSortBy: function (field) {
      if (this.sortBy === field && this.sortDirection === 'ASC')
        this.sortDirection = 'DESC'
      else if (this.sortBy === field) this.sortDirection = 'ASC'
      this.sortBy = field
      this.getCompetitors()
    },

    getCompetitors: function () {
      return this.$database
        .query(
          `
      SELECT competitors.*, courses.name AS courseName
      FROM competitors
      LEFT JOIN courses ON  courses.id=competitors.course
      WHERE courses.event=? AND competitors.event=?
        AND competitors.name LIKE '%${this.filterName}%'
        AND competitors.siid LIKE '%${this.filterSIID}%'
        AND courses.name LIKE '%${this.filterCourse}%'
      UNION
      SELECT competitors.*, '' AS courseName
      FROM competitors
      WHERE ISNULL(competitors.course)
        AND competitors.name LIKE '%${this.filterName}%'
        AND competitors.siid LIKE '%${this.filterSIID}%'
      ORDER BY ${this.sortBy} ${this.sortDirection}`,
          [this.$route.params.id, this.$route.params.id]
        )
        .then((result) => {
          this.competitors = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Entries', 'error')
        )
    },

    getAllCompetitors: function () {
      return this.$database
        .query(`SELECT * FROM competitors WHERE competitors.event=?`, [
          this.$route.params.id,
        ])
        .then((result) => {
          this.allCompetitors = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Entries', 'error')
        )
    },

    getCourses: function () {
      return this.$database
        .query('SELECT * FROM courses WHERE event=?', this.$route.params.id)
        .then((result) => {
          this.listOfCourseNames = result.map((course) => course.name)
          this.listOfCourseNames.unshift('')
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Courses', 'error')
        )
    },
  },
}
</script>
