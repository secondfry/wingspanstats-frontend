<script>
  import AsyncImage from './async-image.vue'

  export default {
    components: {
      AsyncImage
    },
    props: ['id'],
    computed: {
      template () {
        return 'https://imageserver.eveonline.com/Render/' + this.id
      }
    },
  }
</script>

<template>
  <async-image
    :template="template"
    size="small"
    format="png"
  />
</template>
