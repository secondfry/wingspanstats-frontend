<script>
  export default {
    props: ['id'],
    computed: {
      image () {
        return 'https://imageserver.eveonline.com/Render/' + this.id + '_32.png'
      }
    }
  }
</script>

<template>
  <img :src="image">
</template>
