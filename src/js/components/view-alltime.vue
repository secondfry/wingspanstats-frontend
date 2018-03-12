<script>
  import { mapActions, mapState } from 'vuex'

  import logo from '../../files/logo.png'

  export default {
    computed: {
      ...mapState({
        isLoaded: state => state.alltime.isLoaded,
        value: state => (state.alltime.data.value / Math.pow(10, 12)).toFixed(2),
        count: state => state.alltime.data.count,
        damage: state => (state.alltime.data.damage / Math.pow(10, 9)).toFixed(2)
      }),
    },
    methods: {
      ...mapActions([
        'loadAlltimeFast'
      ])
    },
    created () {
      if (!this.isLoaded) {
        this.loadAlltimeFast();
      }
    },
    data () {
      return {
        logo: logo
      }
    },
  }
</script>

<template>
  <div class="alltime-wrap my-3">
    <img :src="logo" class="alltime-logo img-fluid" alt="Wingspan Delivery Services logo">
    <div class="alltime-border"></div>
    <div id="alltime-data">
      <div>
        <strong>{{ value }}T ISK</strong> estimate
      </div>
      <div>
        <strong>{{ count }}</strong> deliveries
      </div>
      <div>
        <strong>{{ damage }}B <abbr title="Customer's Resistance Points">CRP</abbr></strong> dealt with
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .alltime-wrap {
    display: grid;
    grid-template-columns: minmax(min-content, 340px) 0.5em auto;
    justify-content: center;
    align-items: center;
    grid-column-gap: 1em;
  }
  .alltime-border {
    width: 100%;
    height: 100%;
    background: $color-wingspan;
  }
</style>
