<script>
  import AsyncImage from './async-image.vue'

  export default {
    props: ['id'],
    computed: {
      template () {
        return 'https://imageserver.eveonline.com/Type/' + this.id
      }
    },
    components: {
      AsyncImage
    },
  }
</script>

<template>
  <async-image :template="template" size="small" format="png" />
</template>
