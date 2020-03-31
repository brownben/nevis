<template>
  <div
    class="fixed top-0 pt-8 flex w-full h-full bg-blue-point4 flex-col justify-around content-center select-none"
  >
    <div
      class="-mt-16 relative bg-white justify-around content-center text-center flex-none shadow-md mx-12 sm:mx-16 md:mx-20 px-3 pt-2 pb-3 select-none"
    >
      <h1>Multiple Records Found</h1>
      <p v-if="listOfRecords.length > 5" class="select-none">
        More Than 5 Records Were Found - Only the First 5 Are Displayed. Please
        Try Narrowing Your Criteria
      </p>
      <table class="w-full font-body mt-1">
        <tr class="font-heading text-center hover:bg-blue-light">
          <th>Name</th>
          <th>SIID</th>
          <th>Club</th>
          <th>Age Class</th>
        </tr>
        <tr
          v-for="record of trimmedListOfRecords"
          :key="record.id"
          @click="confirmAction(record)"
          class="text-center even:bg-blue-lightest hover:bg-blue-light"
        >
          <td>{{ record.name }}</td>
          <td>{{ record.siid }}</td>
          <td>{{ record.club }}</td>
          <td>{{ calculateAgeClass(record.gender, record.yearOfBirth) }}</td>
        </tr>
      </table>

      <button
        @click="confirmAction(false)"
        class="bg-white text-blue border border-blue font-heading px-4 py-1 mr-2 mt-3 select-none hover:bg-blue-point2"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script>
import ageClassFunctions from '@/scripts/ageClass'

export default {
  name: 'ConfirmationDialog',

  props: {
    listOfRecords: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    trimmedListOfRecords: function() {
      if (this.listOfRecords.length > 5) return this.listOfRecords.slice(0, 5)
      else return this.listOfRecords
    },
  },

  methods: {
    confirmAction: function(value) {
      this.$emit('close', value)
    },
    calculateAgeClass: (gender, ageClass) =>
      ageClassFunctions(gender, ageClass),
  },
}
</script>
