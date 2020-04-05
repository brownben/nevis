<template>
  <main>
    <back-arrow :to="`/events/${$route.params.id}`" />
    <h1 class="mx-10 mb-1 px-1">
      Courses
    </h1>
    <div class="mx-12 mb-3">
      <router-link
        :to="`/events/${$route.params.id}/courses/create`"
        tag="button"
        class="button"
      >
        Create Course
      </router-link>
      <button class="button" @click="importXML">Import IOF XML</button>
      <button class="button" @click="getCourses">Refresh</button>
    </div>
    <template v-if="courses && courses.length > 0">
      <router-link
        v-for="course of courses"
        :key="course.id"
        :to="`/events/${$route.params.id}/courses/${course.id}/edit`"
        tag="div"
        class="my-shadow mx-12 mb-5 px-3 py-2 border-t-4 border-blue my-shadow-lg-hover"
      >
        <h2 class="pb-1">{{ course.name }}</h2>
        <p>
          <b>Length:</b>
          {{ course.length / 1000 }} km
          <b />
          <b>Climb:</b>
          {{ course.climb }} m
        </p>
        <p>
          <b>Controls:</b>
          {{ course.controls }}
        </p>
        <p>
          <b>Number of Entries:</b>
          {{ course.numberOfCompetitors }}
        </p>
      </router-link>
    </template>
  </main>
</template>

<script>
import BackArrow from '@/components/BackArrow'

export default {
  components: {
    'back-arrow': BackArrow,
  },

  data: function () {
    return {
      courses: [],
    }
  },

  mounted: function () {
    if (this.$database.connection === null || !this.$database.connected) {
      this.$router.push('/')
      this.$messages.addMessage('Problem Connecting To Database', 'error')
    } else this.getCourses()
  },

  methods: {
    getCourses: function () {
      return this.$database
        .query(
          `
      SELECT courses.*, IFNULL(COUNT(competitors.course),0) AS numberOfCompetitors
      FROM courses
      LEFT JOIN competitors ON courses.id=competitors.course
      WHERE courses.event=?
      GROUP BY courses.id
      ORDER BY courses.name`,
          this.$route.params.id
        )
        .then((result) => {
          this.courses = result
        })
        .catch(() =>
          this.$messages.addMessage('Problem Fetching Courses', 'error')
        )
    },

    importXML: function () {
      const { dialog } = this.$electron.remote
      return dialog
        .showOpenDialog({
          title: 'Nevis - Import XML Courses',
          buttonLabel: 'Import',
          properties: ['openFile'],
          filters: [
            { name: 'IOF XML 3.0', extensions: ['xml'] },
            { name: 'All Files', extensions: ['*'] },
          ],
        })
        .then((result) => {
          if (!result.canceled)
            return this.$fs.readFile(result.filePaths[0], { encoding: 'utf8' })
          else throw Error()
        })
        .then((result) =>
          this.$xml.xml2js(result, {
            compact: true,
            trim: true,
            alwaysArray: true,
            nativeType: true,
            nativeTypeAttributes: true,
          })
        )
        .then(this.processXMLImport)
        .then((result) =>
          this.$database.query(
            'INSERT INTO courses (name, length, climb, type, event, controls) VALUES ?',
            [result]
          )
        )
        .then((result) =>
          this.$messages.addMessage(`${result.affectedRows} Courses Imported`)
        )
        .then(this.getCourses)
        .catch(() =>
          this.$messages.addMessage('Problem Importing Courses', 'error')
        )
    },

    processXMLImport: function (json) {
      const eventData = json?.CourseData?.[0]?.RaceCourseData?.[0]?.Course

      return eventData.map((course) => {
        const name = course?.Name?.[0]?._text?.[0]
        const length = course?.Length?.[0]?._text?.[0]
        const climb = course?.Climb?.[0]?._text?.[0]
        const controls =
          course?.CourseControl?.filter(
            (control) => control?._attributes?.type === 'Control'
          )
            .map((control) => control?.Control?.[0]?._text)
            .filter((control) => !!control)
            .map((control) => control.toString())
            .join(',') || ''
        const type = 'linear'
        const event = this.$route.params.id

        return [name, length, climb, type, event, controls]
      })
    },
  },
}
</script>
