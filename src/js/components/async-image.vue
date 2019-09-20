<script>
  export default {
    props: ['template', 'size', 'alt', 'format'],
    data () {
      return {
        loadImage: false
      }
    },
    computed: {
      image () {
        if (!this.loadImage)
          return null;

        return `${this.template}_${this.sizeInt}.${this.format}`;
      },
      sizeInt () {
        switch (this.size) {
          case 'small': return 32;
          case 'large': return 64;
          default: return 32;
        }
      },
      sizeIntClass () {
        switch (this.sizeInt) {
          case 32: return 'pi-32';
          case 64: return 'pi-64';
          default: return 'pi-32';
        }
      },
    },
    mounted () {
      this.loadImage = true;
    },
  }
</script>

<template>
  <img :src="image" :class="sizeIntClass" :alt="alt">
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
