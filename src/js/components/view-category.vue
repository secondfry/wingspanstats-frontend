<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import LeaderboardTicker from './leaderboard/leaderboard-ticker.vue';

  import leaderboards from '../components/view-month/registry-leaderboards'

  export default {
    computed: {
      ...mapState({
        arePilotNamesLoaded: state => state.pilot_names.isLoaded,
        pilots: function (state) { return state.category[this.type].data },
      }),
      ...mapGetters([
        'getPilotName',
      ]),
      type () {
        return this.$route.params.category;
      },
      title() {
        return leaderboards[this.type].name;
      }
    },
    methods: {
      ...mapActions([
        'loadCategoryFast',
        'loadPilotNamesFast',
      ])
    },
    created () {
      this.loadCategoryFast({ category: this.type });

      if (!this.arePilotNamesLoaded) {
        this.loadPilotNamesFast();
      }
    },
    components: {
      LeaderboardTicker
    }
  }
</script>

<template>
  <div>
    <div class="font-weight-bold text-center my-3" v-html="title"></div>
    <table class="table table-sm">
      <thead class="thead-dark">
        <th>##</th>
        <th>Pilot</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr v-for="pilot, index in pilots" :key="pilot.character_id">
          <td>{{ index + 1 }}</td>
          <td>{{ getPilotName(pilot.character_id) }}</td>
          <td><leaderboard-ticker :pilot="pilot" :category="type"></leaderboard-ticker></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
