<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  export default {
    props: ['id', 'size'],
    data () {
      return {
        loadImage: false
      }
    },
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
        if (!this.loadImage)
          return null;

        return 'https://image.eveonline.com/Character/' + this.id + '_' + this.sizeInt + '.jpg'
      },
      sizeIntClass () {
        switch (this.sizeInt) {
          case 32: return 'pi-32';
          case 64: return 'pi-64';
          default: return 'pi-32';
        }
      },
      ...mapGetters([
        'getPilotName',
      ]),
    },
    mounted () {
      this.loadImage = true;
    },
  }
</script>

<template>
  <a :href="zkb" class="position-relative">
    <img :src="image" :alt="getPilotName(id)" :class="sizeIntClass">
  </a>
</template>

<style lang="scss">
  .pi-32 {
    width: 32px;
    height: 32px;
  }
  .pi-64 {
    width: 64px;
    height: 64px;
  }
</style>
