<script>
  import moment from 'moment'
  import { mapActions, mapGetters, mapState } from 'vuex'

  import registry from '../components/view-achievements/registry'
  const realRegistry = JSON.parse(JSON.stringify(registry));

  export default {
    data () {
      return {
        registry: realRegistry
      }
    },
    computed: {
      ...mapState({
        arePilotNamesLoaded: state => state.pilot_names.isLoaded,
        isAchievementsLoaded: state => state.achievements.isLoaded,
        state: state => state.achievements.data,
      }),
      ...mapGetters([
        'getPilotName',
      ]),
      sorted () {
        const ret = {};
        for (let id of Object.keys(this.state)) {
          ret[id] = JSON.parse(JSON.stringify(this.state[id]));
          ret[id].data.sort((a, b) => {
            return moment(a.killmail.killmail_time) - moment(b.killmail.killmail_time);
          })
        }
        return ret;
      }
    },
    methods: {
      ...mapActions([
        'loadAchievementsFast',
        'loadPilotNamesFast',
      ]),
      makeZkbLink (id) {
        return 'https://zkillboard.com/kill/' + id + '/';
      }
    },
    created () {
      if (!this.isAchievementsLoaded) {
        this.loadAchievementsFast();
      }

      if (!this.arePilotNamesLoaded) {
        this.loadPilotNamesFast();
      }
    },
    components: {}
  }
</script>

<template>
  <div>
    <div v-for="achievement of sorted">
      <div
        class="font-weight-bold text-center mt-3"
        v-text="achievement.title"
      />
      <div
        class="font-weight-bold text-center mb-3 small"
        v-text="achievement.description"
      />
      <table class="table table-sm">
        <thead class="thead-dark">
          <tr>
            <th>Pilot</th>
            <th>Date</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line of achievement.data">
            <td>{{ getPilotName(line.character_id) }}</td>
            <td>{{ line.killmail.killmail_time }}</td>
            <td><a :href="makeZkbLink(line.killmail._id)">zKillboard</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
