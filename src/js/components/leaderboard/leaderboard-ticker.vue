<script>

  export default {
    props: ['data'],
    computed: {
      display () {
        switch (this.flagType) {
          case 'count': return this.data.value + ' deliveries';
          case 'value': return (this.data.value / Math.pow(10, 9)).toFixed(2) + 'B ISK';
          case 'damage': return (this.data.value / Math.pow(10, 6)).toFixed(2) + 'M CRPs';
          case 'dedication': return this.data.value + ' dedication index';
          case 'diversity': return this.data.value + ' diversity index';
        }
      },
      flagType () {
        return this.data._id.flag.split('_').pop()
      }
    }
  }
</script>

<template>
  <span v-html="display"></span>
</template>
