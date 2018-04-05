<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import PilotIconWithMedals from '../pilot-icon-with-medals.vue'
  import LeaderboardTicker from '../leaderboard/leaderboard-ticker.vue'

  export default {
    props: ['category', 'pilot', 'listLength'],
    computed: {
      ...mapGetters([
        'getPilotName',
        'hasUser',
      ]),
      placeClass () {
        switch (this.pilot.place) {
          case 1: return 'place-gold';
          case 2: return 'place-silver';
          case 3: return 'place-bronze';
          case 4: return 'place-wingspan';
          default: return 'place-haxxor';
        }
      },
      size () {
        switch (this.listLength) {
          case 1: return 'large';
          default: return 'small';
        }
      },
      sizeClass () {
        switch (this.listLength) {
          case 1: return 'place-large';
          default: return 'place-small';
        }
      },
      change () {
        if (this.pilot.change === false || this.pilot.change === 0) {
          return '';
        }

        return this.pilot.change;
      },
      glyphClass () {
        if (this.pilot.change > 0) {
          return 'glyphicon glyphicon-chevron-up text-success';
        }

        if (this.pilot.change < 0) {
          return 'glyphicon glyphicon-chevron-down text-danger';
        }

        if (this.pilot.change === 0) {
          return 'glyphicon glyphicon-pause text-muted';
        }

        return 'glyphicon glyphicon-asterisk text-muted';
      }
    },
    components: {
      PilotIconWithMedals,
      LeaderboardTicker
    }
  }
</script>

<template>
  <div :class="['place', sizeClass]">
    <div :class="['h-100', placeClass]"></div>
    <pilot-icon-with-medals :id="pilot.character_id" :size="size" :category="category"></pilot-icon-with-medals>
    <a class="place-name ml-2">
      {{ getPilotName(pilot.character_id) }}
      <br v-if="size === 'large' || hasUser">
      <span v-if="size === 'small' && !hasUser">–</span>
      <leaderboard-ticker :category="category" :pilot="pilot"></leaderboard-ticker>
      <div>
        Place: #{{ pilot.place }} <small><span :class="glyphClass"></span> {{ change }}</small>
      </div>
    </a>
  </div>
</template>
