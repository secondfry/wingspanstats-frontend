<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import AsyncImage from './async-image.vue'

  export default {
    props: ['id', 'size'],
    computed: {
      zkb () {
        return 'https://zkillboard.com/character/' + this.id + '/'
      },
      template () {
        return 'https://image.eveonline.com/Character/' + this.id
      },
      ...mapGetters([
        'getPilotName',
      ]),
    },
    components: {
      AsyncImage
    },
  }
</script>

<template>
  <a :href="zkb" class="position-relative">
    <async-image :template="template" :alt="getPilotName(id)" :size="size" format="jpg" />
  </a>
</template>
