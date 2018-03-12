<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    props: ['id', 'name', 'type'],
    computed: {
      size () {
        switch (this.type) {
          case 'small': return 32;
          case 'large': return 64;
          default: return 32;
        }
      },
      zkb () {
        return 'https://zkillboard.com/character/' + this.id + '/'
      },
      image () {
        return 'https://image.eveonline.com/Character/' + this.id + '_' + this.size + '.jpg'
      },
    },
  }
</script>

<template>
  <a :href="zkb" class="position-relative">
    <img :src="image">
  </a>
</template>
