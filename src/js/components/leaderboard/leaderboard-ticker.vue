<script>

  export default {
    props: ['pilot', 'type'],
    computed: {
      display () {
        switch (this.flagType) {
          case 'count': return this.pilot.value + ' deliveries';
          case 'value': return (this.pilot.value / Math.pow(10, 9)).toFixed(2) + 'B ISK';
          case 'damage': return (this.pilot.value / Math.pow(10, 6)).toFixed(2) + 'M CRPs';
          case 'dedication': return this.pilot.value + ' dedication index';
          case 'diversity': return this.pilot.value + ' diversity index';
        }
      },
      flagType () {
        return this.type.split('_').pop()
      }
    }
  }
</script>

<template>
  <span v-html="display"></span>
</template>
