<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    computed: {
      ...mapState({
        isLoaded: state => state.month.isLoaded,
        value: state => {
          try {
            return (state.month.summary.value / Math.pow(10, 9)).toFixed(2)
          } catch (e) {}
        },
        count: state => {
          try {
            return state.month.summary.count
          } catch (e) {}
        },
        average: state => {
          try {
            return (state.month.summary.value / state.month.summary.count / Math.pow(10, 6)).toFixed(2)
          } catch (e) {}
        },
        damage: state => {
          try {
            return (state.month.summary.damage / Math.pow(10, 6)).toFixed(2)
          } catch (e) {}
        }
      }),
    },
  }
</script>

<template>
  <div class="summary-month-wrap my-3">
    <div>
      <strong>{{ value }}B ISK</strong> estimate
    </div>
    <div class="alltime-border"></div>
    <div>
      <strong>{{ count }}</strong> deliveries
    </div>
    <div class="alltime-border"></div>
    <div>
      <strong>{{ average }}M ISK</strong> average
    </div>
    <div class="alltime-border"></div>
    <div>
      <strong>{{ damage }}M <abbr title="Customer's Resistance Points">CRP</abbr></strong> dealt with
    </div>
  </div>
</template>

<style lang="scss">
  .summary-month-wrap {
    display: grid;
    grid-template-columns: max-content;
    grid-auto-columns: 0.25em max-content;
    justify-content: center;
    align-items: center;
    grid-column-gap: 0.5em;

    grid-auto-flow: row;
    text-align: center;

    @include media-breakpoint-up(md) {
      grid-auto-flow: column;
      text-align: inherit;
    }
  }
</style>
