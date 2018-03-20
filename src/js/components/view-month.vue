<script>
  import moment from 'moment'
  import { mapActions, mapGetters, mapState } from 'vuex'

  import { EventBus } from '../event-bus'

  import Leaderboard from './leaderboard.vue'
  import NavigationBar from './navigation-bar.vue'
  import PilotIcon from './pilot-icon.vue'
  import ShipIcon from './ship-icon.vue'
  import WeaponIcon from './weapon-icon.vue'

  import leaderboards from './view-month/registry-leaderboards'
  const realLeaderboards = JSON.parse(JSON.stringify(leaderboards));

  export default {
    props: ['month', 'year'],
    data () {
      return {
        monthData: this.month || moment().month() + 1,
        yearData: this.year || moment().year(),
        leaderboards: realLeaderboards
      }
    },
    computed: {
      ...mapState({
        isMonthLoaded: state => state.month.isLoaded,
        arePilotsLoaded: state => state.pilots.isLoaded,
      }),
      ...mapGetters([
        'getFirstInCategory',
        'getPilotName',
      ]),
      dedicated () {
        return this.getFirstInCategory('dedication')
      },
      diverse () {
        return this.getFirstInCategory('diversity')
      },
      diverseShips () {
        if (this.diverse) {
          return this.sort(this.diverse.ship_type_ids);
        }
      },
      diverseWeapons () {
        if (this.diverse) {
          return this.sort(this.diverse.weapon_type_ids);
        }
      },
      today () {
        return moment()
      },
      moment () {
        if (this.yearData && this.monthData) {
          return moment(this.yearData + '-' + this.monthData);
        }

        return this.today;
      },
      date: function () {
        if (this.monthData && this.yearData) {
          return { year: this.yearData, month: this.monthData }
        }

        return { year: this.moment.year(), month: this.moment.month() + 1 }
      },
      monthName () {
        return this.moment.format('MMMM')
      },
      yearShort() {
        return this.moment.format('YY')
      },
    },
    methods: {
      ...mapActions([
        'loadMonthCache',
        'loadMonthFast',
        'loadPilotsFast',
      ]),
      setMonth (year, month) {
        this.monthData = Number(month);
        this.yearData = Number(year);
      },
      sort (arr) {
        return arr.sort(function(a, b) {
          return +/\d+/.exec(a)[0] - +/\d+/.exec(b)[0];
        });
      }
    },
    created () {
      if (!this.isMonthLoaded) {
        this.loadMonthFast(this.date);
      }

      if (!this.arePilotsLoaded) {
        this.loadPilotsFast();
      }

      EventBus.$on('month', ({ year, month }) => {
        this.setMonth(year, month);
        if (this.today.diff(moment().year(year).month(month), 'months') > 1) {
          this.loadMonthCache(this.date);
        } else {
          this.loadMonthFast(this.date);
        }        
      });
    },
    destroyed () {
      EventBus.$off('month');
    },
    components: {
      Leaderboard,
      NavigationBar,
      PilotIcon,
      ShipIcon,
      WeaponIcon
    },
  }
</script>

<template>
  <div>
    <div class="font-weight-bold text-center my-3">{{ monthName }}, YC1{{ yearShort }}</div>
    <div class="month-leaderboards">
      <leaderboard type="count" title="Deliveries"></leaderboard>
      <leaderboard type="value" title="Estimate"></leaderboard>
      <leaderboard type="damage"></leaderboard>
      <leaderboard type="solo_count" title="Solo"></leaderboard>
    </div>
    <div v-if="dedicated" class="text-center my-3">
      <pilot-icon :id="dedicated.character_id" name="swaglord"></pilot-icon>
      {{ getPilotName(dedicated.character_id) }} | Most dedicated pilot
      <span class="d-none d-md-inline">|</span><br class="d-block d-md-none">
      {{ dedicated.value }} deliveries on
      <ship-icon :id="dedicated.match.ship_type_id"></ship-icon><weapon-icon :id="dedicated.match.weapon_type_id"></weapon-icon>
    </div>
    <div v-if="diverse" class="text-center my-3">
      <pilot-icon :id="diverse.character_id"></pilot-icon>
      {{ getPilotName(diverse.character_id) }} | Most diverse pilot
      <span class="d-none d-md-inline">|</span><br class="d-block d-md-none">
      {{ diverse.value }} diversity index<br>
      <ship-icon v-for="id in diverseShips" :key="'r' + id" :id="id"></ship-icon><br>
      <weapon-icon v-for="id in diverseWeapons" :key="'t' + id" :id="id"></weapon-icon>
    </div>
    <navigation-bar></navigation-bar>
    <div class="month-leaderboards">
      <leaderboard v-for="data, category in leaderboards" :key="category" :type="category"></leaderboard>
    </div>
  </div>
</template>

<style lang="scss">
  .month-leaderboards {
    display: grid;
    grid-row-gap: 0.5em;
  }
</style>
