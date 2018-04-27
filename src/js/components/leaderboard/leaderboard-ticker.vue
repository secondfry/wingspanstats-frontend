<script>
  export default {
    props: ['pilot', 'category'],
    computed: {
      display () {
        switch (this.categoryArr) {
          case 'count': return this.pilot.value + ' deliveries';
          case 'value': return (this.pilot.value / Math.pow(10, 9)).toFixed(2) + 'B ISK';
          case 'damage': return (this.pilot.value / Math.pow(10, 6)).toFixed(2) + 'M CRPs';
          case 'dedication': return this.pilot.value + ' dedication index';
          case 'diversity': return this.pilot.value + ' diversity index';
          case 'points': return this.pilot.value + ' ZPs';
          default: return this.pilot.value;
        }
      },
      categoryArr () {
        return this.category.split('_').pop()
      }
    }
  }
</script>

<template>
  <span v-html="display"></span>
</template>
