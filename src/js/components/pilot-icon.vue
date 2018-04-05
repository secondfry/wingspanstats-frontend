<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    props: ['id', 'size'],
    computed: {
      sizeInt () {
        switch (this.size) {
          case 'small': return 32;
          case 'large': return 64;
          default: return 32;
        }
      },
      zkb () {
        return 'https://zkillboard.com/character/' + this.id + '/'
      },
      image () {
        return 'https://image.eveonline.com/Character/' + this.id + '_' + this.sizeInt + '.jpg'
      },
      ...mapGetters([
        'getPilotName',
      ]),
    },
  }
</script>

<template>
  <a :href="zkb" class="position-relative">
    <img :src="image" :alt="getPilotName(id)">
  </a>
</template>
