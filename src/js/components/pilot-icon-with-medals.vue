<script>
  import { mapActions, mapGetters, mapState } from 'vuex'

  import PilotIcon from './pilot-icon.vue'

  export default {
    props: ['id', 'category', 'size'],
    computed: {
      ...mapGetters([
        'getPilotCategoryMedals',
        'getPilotName',
      ]),
      chevronSize () {
        switch (this.size) {
          case 'small': return 3;
          case 'large': return 5;
          default: return 3;
        }
      },
      medals () {
        return this.getPilotCategoryMedals(this.id, this.category);
      },
      styles () {
        const medals = this.getPilotCategoryMedals(this.id, this.category);
        const ret = {1: '', 2: '', 3: '', 4: ''};

        if (!medals) {
          return ret;
        }

        let i = 1;
        while (i < 5) {
          if (medals[i] === 0) {
            i++;
            continue;
          }

          const height = this.chevronSize * 2 + medals[i] * this.chevronSize / 5 * 2;
          const width = this.chevronSize * 2;
          const corner_height = height - this.chevronSize;
          const clip = [
            '0 0',
            width + 'px 0',
            width + 'px ' + corner_height + 'px',
            this.chevronSize + 'px ' + height + 'px',
            '0 ' + corner_height + 'px',
          ];

          ret[i] = 'height: ' + height + 'px;';
          ret[i] += 'clip-path: polygon(' + clip.join(',') + ');';
          i++;
        }
        return ret;
      },
      titles () {
        const medals = this.getPilotCategoryMedals(this.id, this.category);
        const ret = {1: '', 2: '', 3: '', 4: ''};

        if (!medals) {
          return ret;
        }

        let i = 1;
        while (i < 5) {
          if (medals[i] === 0) {
            i++;
            continue;
          }

          ret[i] = this.getPilotName(this.id)
            + ' has ' + medals[i] + ' ' + this.placeToText(i) + ' medal(s)'
            + ' in ' + this.category + ' category';
          i++;
        }
        return ret;
      }
    },
    methods: {
      placeToText (place) {
        switch (place) {
          case 1: return 'gold';
          case 2: return 'silver';
          case 3: return 'bronze';
          case 4: return 'Wingspan';
          default: return 'haxxor';
        }
      },
      hasMedals (place) {
        try { return !!this.medals[place]; }
        catch (e) {}
        return false;
      }
    },
    components: {
      PilotIcon
    },
  }
</script>

<template>
  <div class="position-relative d-inline-block">
    <pilot-icon
      :id="id"
      :size="size"
    />
    <div class="chevrons">
      <div
        v-if="hasMedals(1)"
        class="smpl-tt"
        :title="titles[1]"
      >
        <div
          :style="styles[1]"
          class="chevron place-gold"
        />
      </div>
      <div
        v-if="hasMedals(2)"
        class="smpl-tt"
        :title="titles[2]"
      >
        <div
          :style="styles[2]"
          class="chevron place-silver"
        />
      </div>
      <div
        v-if="hasMedals(3)"
        class="smpl-tt"
        :title="titles[3]"
      >
        <div
          :style="styles[3]"
          class="chevron place-bronze"
        />
      </div>
      <div
        v-if="hasMedals(4)"
        class="smpl-tt"
        :title="titles[4]"
      >
        <div
          :style="styles[4]"
          class="chevron place-wingspan"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .chevrons {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    display: grid;
    grid-auto-flow: column;
    justify-content: start;

    padding-left: 3px;
    grid-column-gap: 3px;

    .place-large & {
      padding-left: 5px;
      grid-column-gap: 5px;
    }

    .place-small & {
      padding-left: 3px;
      grid-column-gap: 3px;
    }
  }
  .chevron {
    text-align: center;
    line-height: 1;
    display: grid;
    align-items: end;
    padding-bottom: 3px;

    width: 6px;

    .place-large & {
      width: 10px;
    }

    .place-small & {
      width: 6px;
    }
  }
</style>