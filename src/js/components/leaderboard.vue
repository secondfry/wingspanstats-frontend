<script>
  import { mapActions, mapGetters, mapState } from 'vuex';

  import LeaderboardPilot from './leaderboard/leaderboard-pilot.vue';

  import iconPlane from '../../files/plane.svg';
  import iconGrave from '../../files/grave.svg';
  import iconSwords from '../../files/swords.svg';
  import { getLeaderboard } from './view-month/registry-leaderboards';

  export default {
    props: ['type', 'title', 'title-description'],
    data () {
      return {
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
          return iconSwords;
        }

        if (!this.isShipCategory) {
          return undefined;
        }

        switch (this.typeArray[1]) {
          case 'driver': return iconPlane;
          case 'killer': return iconGrave;
          default: return undefined;
        }
      },
      _title () {
        if (this.title) {
          if (!this.titleDescription)
            return this.title;

          return `<abbr title="${this.titleDescription}">${this.title}</abbr>`;
        }

        if (this.isValueCategory) {
          return '';
        }

        const data = getLeaderboard(this.type);
        if (!data || !data.name) {
          return this.type;
        }

        return data.name;
      },
      text () {
        if (!this.titleDescription && this.isValueCategory) {
          return '';
        }

        const data = getLeaderboard(this.type);
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
      },
    },
    components: {
      LeaderboardPilot,
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
    <div :class="[{ tracking: index === '4' }, 'leaderboard-places']" v-for="(list, index) of places" v-if="list.length">
      <leaderboard-pilot :pilot="pilot" :listLength="list.length" :category="type" v-for="pilot in list" :key="pilot.character_id"></leaderboard-pilot>
    </div>
    <div class="leaderboard-message text-center" v-if="!checkPlaces(places)">{{ text }}</div>
  </div>
</template>

<style lang="scss">
  .leaderboard-wrap {
    display: grid;

    @include media-breakpoint-up(lg) {
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

    .bg-night & {
      filter: invert(1);
    }
  }
  .leaderboard-places {
    display: grid;
    grid-row-gap: 0.5em;

    &.tracking {
      @include media-breakpoint-up(lg) {
        grid-area: tracking;
      }
    }
  }
  .leaderboard-message {
    grid-area: 2 / 1;
    display: grid;
    align-items: center;

    @include media-breakpoint-up(lg) {
      grid-area: 1 / 2 / 1 / 10;
    }
  }
</style>
