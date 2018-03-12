<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import PilotIcon from './pilot-icon.vue'
  import LeaderboardTicker from './leaderboard/leaderboard-ticker.vue'

  import leaderboards from './view-month/registry-leaderboards'

  export default {
    props: ['type', 'title'],
    computed: {
      ...mapState({
        state: state => state.month.leaderboards,
        pilots: state => state.pilots.data
      }),
      ...mapGetters([
        'getPilotName',
      ]),
      _title () {
        if (this.title) {
          return this.title;
        }

        if (this.type.split('_').pop() === 'value' && this.type.split('_').pop() !== this.type) {
          return '';
        }

        const data = leaderboards[this.type];
        if (!data || !data.name) {
          return this.type;
        }

        return data.name;
      },
      text () {
        if (this.type.split('_').pop() === 'value' && this.type.split('_').pop() !== this.type) {
          return '';
        }

        const data = leaderboards[this.type];
        if (!data || !data.name) {
          return '';
        }

        return data.empty;
      },
      key () {
        return this.type;
      },
      data () {
        const ret = {1: [], 2: [], 3: []};

        if (!Object.keys(this.state).length) {
          return ret;
        }

        for (let item of this.state[this.key]) {
          if (item.place > 3) {
            break;
          }

          ret[item.place].push(item);
        }
        
        return ret;
      },
    },
    methods: {
      getPlaceClass (place) {
        switch (place) {
          case 1: return 'place-gold';
          case 2: return 'place-silver';
          case 3: return 'place-bronze';
          default: return 'place-wingspan';
        }
      },
      getListSizeClass (list) {
        switch (list.length) {
          case 1: return 'place-large';
          default: return 'place-small';
        }
      },
      getListSize (list) {
        switch (list.length) {
          case 1: return 'large';
          default: return 'small';
        }
      },
      checkData (data) {
        if (data['1'].length) {
          return true;
        }

        return false
      }
    },
    components: {
      LeaderboardTicker,
      PilotIcon
    }
  }
</script>

<template>
  <div class="leaderboard-wrap">
    <div class="font-weight-bold" v-html="_title"></div>
    <div class="leaderboard-places" v-for="list in data" v-if="list.length">
      <div :class="['place', getListSizeClass(list)]" v-for="pilot in list">
        <div :class="['h-100', getPlaceClass(pilot.place)]"></div>
        <pilot-icon :id="pilot.character_id" :type="getListSize(list)" :category="key"></pilot-icon>
        <a class="place-name ml-2">
          {{ getPilotName(pilot.character_id) }}
          <br v-if="list.length == 1">
          <span v-if="list.length != 1">–</span>
          <leaderboard-ticker :data="pilot"></leaderboard-ticker>
        </a>
      </div>
    </div>
    <div class="leaderboard-message text-center" v-if="!checkData(data)">{{ text }}</div>
  </div>

</template>

<style lang="scss">
  .leaderboard-wrap {
    display: grid;

    @include media-breakpoint-up(md) {
      grid-template-columns: 1fr 3fr 3fr 3fr;
      grid-column-gap: 0.5em;
    }
  }
  .leaderboard-places {
    display: grid;
    grid-row-gap: 0.5em;
  }
  .place {
    display: grid;
    align-items: center;

    &.place-small {
      grid-template-columns: 0.5em 32px auto;
    }
    &.place-large {
      grid-template-columns: 0.5em 64px auto;
      min-height: 72px;
    }
  }
  .place-gold {
    background: $color-first;
  }
  .place-silver {
    background: $color-second;
  }
  .place-bronze {
    background: $color-third;
  }
  .place-wingspan {
    background: $color-wingspan;
  }
  .leaderboard-message {
    grid-area: 1 / 2 / 1 / 5;
  }
</style>
