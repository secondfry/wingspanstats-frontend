<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import PilotIcon from './pilot-icon.vue'
  import LeaderboardTicker from './leaderboard/leaderboard-ticker.vue'

  import iconPlane from '../../files/plane.svg'
  import iconGrave from '../../files/grave.svg'
  import iconSwords from '../../files/swords.svg'
  import leaderboards from './view-month/registry-leaderboards'
  const realLeaderboards = JSON.parse(JSON.stringify(leaderboards));

  export default {
    props: ['type', 'title'],
    data () {
      return {
        iconGrave,
        iconPlane,
        iconSwords,
        leaderboards: realLeaderboards,
        userPlace: null,
      }
    },
    computed: {
      ...mapState({
        userId: state => state.user.user.id,
      }),
      ...mapGetters([
        'getPilotName',
        'getCategory',
        'hasUser',
      ]),
      typeArray () {
        return this.type.split('_');
      },
      isShipCategory () {
        const check = new Set(['driver', 'killer']);
        return this.typeArray.length === 3 && check.has(this.typeArray[1]);
      },
      isWeaponCategory () {
        return this.typeArray.length === 3 && this.typeArray[1] === 'user';
      },
      isValueCategory () {
        return this.typeArray[this.typeArray.length - 1] === 'value' && this.typeArray[0] !== 'value';
      },
      isShowingTip () {
        return (this.isShipCategory || this.isWeaponCategory) && !this.isValueCategory;
      },
      icon () {
        if (this.isWeaponCategory) {
          return this.iconSwords;
        }

        if (!this.isShipCategory) {
          return undefined;
        }

        switch (this.typeArray[1]) {
          case 'driver': return this.iconPlane;
          case 'killer': return this.iconGrave;
          default: return undefined;
        }
      },
      _title () {
        if (this.title) {
          return this.title;
        }

        if (this.isValueCategory) {
          return '';
        }

        const data = this.leaderboards[this.type];
        if (!data || !data.name) {
          return this.type;
        }

        return data.name;
      },
      text () {
        if (this.isValueCategory) {
          return '';
        }

        const data = this.leaderboards[this.type];
        if (!data || !data.empty) {
          return '';
        }

        return data.empty;
      },
      places () {
        this.userPlace = null;

        const ret = {1: [], 2: [], 3: []};
        const tmp = this.getCategory(this.type);

        if (!tmp.length) {
          return ret;
        }

        if (this.hasUser) {
          ret[4] = [];
        }

        for (let item of tmp) {
          if (item.place > 3 && (!this.hasUser || this.userPlace)) {
            break;
          }

          if (this.userId === item.character_id) {
            this.userPlace = item.place;
            ret[4].push(item);
          }

          if (item.place < 4) {
            ret[item.place].push(item);
          }
        }

        return ret;
      },
      url () {
        return '/category/' + this.type;
      }
    },
    methods: {
      getPlaceClass (place) {
        switch (place) {
          case 1: return 'place-gold';
          case 2: return 'place-silver';
          case 3: return 'place-bronze';
          case 4: return 'place-wingspan';
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
      checkPlaces (places) {
        if (places['1'].length) {
          return true;
        }

        return false
      },
      navigate (e) {
        e.preventDefault();
        this.$router.push({
          name: 'category',
          params: {
            category: this.type
          }
        });
      }
    },
    components: {
      LeaderboardTicker,
      PilotIcon
    }
  }
</script>

<template>
  <div :class="[{ tracking: hasUser }, 'leaderboard-wrap']">
    <div class="leaderboard-actions">
      <div class="font-weight-bold" v-html="_title"></div>
      <small>
        <span v-if="isShowingTip" class="leaderboard-ship-tip text-muted">
          <img :src="icon" class="leaderboard-icon">
          {{ typeArray[0] }}
        </span>
        <a :href="url" @click="navigate">Overview ({{ typeArray[typeArray.length - 1] }})</a>
      </small>
    </div>
    <div :class="['leaderboard-places', { tracking: index === 3 }]" v-for="(list, index) of places" v-if="list.length">
      <div :class="['place', getListSizeClass(list)]" v-for="pilot in list">
        <div :class="['h-100', getPlaceClass(pilot.place)]"></div>
        <pilot-icon :id="pilot.character_id" :type="getListSize(list)" :category="type"></pilot-icon>
        <a class="place-name ml-2">
          {{ getPilotName(pilot.character_id) }}
          <br v-if="list.length == 1 || hasUser">
          <span v-if="list.length != 1 && !hasUser">–</span>
          <leaderboard-ticker :type="type" :pilot="pilot"></leaderboard-ticker>
        </a>
      </div>
    </div>
    <div class="leaderboard-message text-center" v-if="!checkPlaces(places)">{{ text }}</div>
  </div>
</template>

<style lang="scss">
  .leaderboard-wrap {
    display: grid;

    @include media-breakpoint-up(md) {
      grid-template: "text first second third" / 1fr 3fr 3fr 3fr;
      grid-column-gap: 0.5em;

      &.tracking {
        grid-template: "text first second third tracking" / 4fr 9fr 9fr 9fr 9fr;
      }
    }
  }
  .leaderboard-ship-tip {
    display: grid;
    grid-template-columns: min-content min-content;
    grid-column-gap: 0.5em;
    align-items: center;
    line-height: 1;
  }
  .leaderboard-icon {
    width: 15px;
  }
  .leaderboard-places {
    display: grid;
    grid-row-gap: 0.5em;

    &.tracking {
      @include media-breakpoint-up(md) {
        grid-area: tracking;
      }
    }
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
    grid-area: 2 / 1;
    display: grid;
    align-items: center;

    @include media-breakpoint-up(md) {
      grid-area: 1 / 2 / 1 / 10;
    }
  }
</style>
