<script>
  import moment from 'moment'
  import { mapActions, mapGetters, mapState } from 'vuex'

  import { EventBus } from '../event-bus'

  import Leaderboard from './leaderboard.vue'
  import MonthSummary from './view-month/summary.vue'
  import NavigationBar from './navigation-bar.vue'
  import PilotIconWithMedals from './pilot-icon-with-medals.vue'
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
        arePilotMedalsLoaded: state => state.pilot_medals.isLoaded,
        arePilotNamesLoaded: state => state.pilot_names.isLoaded,
        summary: state => state.month.summary,
      }),
      ...mapGetters([
        'getIsMonthLoaded',
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
      moment () {
        if (this.yearData && this.monthData) {
          return moment(this.yearData + '-' + this.monthData);
        }

        return moment();
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
        'loadMonth',
        'loadPilotMedalsFast',
        'loadPilotNamesFast',
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
      if (!this.getIsMonthLoaded(this.date)) {
        this.loadMonth(this.date);
      }

      if (!this.arePilotNamesLoaded) {
        this.loadPilotNamesFast();
      }

      if (!this.arePilotMedalsLoaded) {
        this.loadPilotMedalsFast();
      }

      EventBus.$on('month', ({ year, month }) => {
        this.setMonth(year, month);
        this.loadMonth(this.date);
      });
    },
    destroyed () {
      EventBus.$off('month');
    },
    components: {
      Leaderboard,
      MonthSummary,
      NavigationBar,
      PilotIconWithMedals,
      ShipIcon,
      WeaponIcon
    },
  }
</script>

<template>
  <div>
    <div class="font-weight-bold text-center my-3">
      {{ monthName }}, YC1{{ yearShort }}
    </div>
    <month-summary />
    <div class="month-leaderboards">
      <leaderboard
        type="value"
        title="Employee of the Month"
        title-description="Most ISK destroyed"
      />
      <leaderboard
        type="solo-value_value"
        title="Top Lone Enterprising Agent"
        title-description="Most ISK destroyed solo"
      />
      <leaderboard
        type="count"
        title="Deliveries"
      />
      <leaderboard
        type="solo-count_count"
        title="Solo"
        title-description="As it goes by zKillboard's solo rules"
      />
      <leaderboard type="zkb_points" />
    </div>
    <div
      v-if="dedicated"
      class="text-center my-3"
    >
      <pilot-icon-with-medals
        :id="dedicated.character_id"
        category="dedication"
      />
      {{ getPilotName(dedicated.character_id) }} | Most dedicated pilot
      <span class="d-none d-md-inline">|</span><br class="d-block d-md-none">
      {{ dedicated.value }} deliveries on
      <ship-icon :id="dedicated.match.ship_type_id" /><weapon-icon :id="dedicated.match.weapon_type_id" />
    </div>
    <div
      v-if="diverse"
      class="text-center my-3"
    >
      <pilot-icon-with-medals
        :id="diverse.character_id"
        category="diversity"
      />
      {{ getPilotName(diverse.character_id) }} | Most diverse pilot
      <span class="d-none d-md-inline">|</span><br class="d-block d-md-none">
      {{ diverse.value }} diversity index<br>
      <ship-icon
        v-for="id in diverseShips"
        :id="id"
        :key="'r' + id"
      /><br>
      <weapon-icon
        v-for="id in diverseWeapons"
        :id="id"
        :key="'t' + id"
      />
    </div>
    <navigation-bar />
    <div class="month-leaderboards">
      <leaderboard
        v-for="data, category in leaderboards"
        :key="category"
        :type="category"
      />
    </div>
  </div>
</template>

<style lang="scss">
  .month-leaderboards {
    display: grid;
    grid-row-gap: 0.5em;

    @include media-breakpoint-up(md) {
      grid-template-columns: 1fr 1fr;
    }

    @include media-breakpoint-up(lg) {
      grid-template-columns: 1fr;
    }
  }
</style>
