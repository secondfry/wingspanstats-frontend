<script>
  import moment from 'moment'

  import { EventBus } from '../event-bus'

  export default {
    data () {
      return {
        year: 2014,
        month: '07',
        today: moment()
      }
    },
    methods: {
      navigate (e) {
        EventBus.$emit('month', {
          year: e.target.dataset.year,
          month: e.target.dataset.month
        });
        this.removeActive();
        this.addActive(e.target);
        this.scroll(e.target);
      },
      getMonths () {
        return document.getElementsByClassName('month');
      },
      removeActive () {
        const months = this.getMonths();
        for (let month of months) {
          month.classList.remove('active');
        }
      },
      addActive (node) {
        node.classList.add('active');
      },
      scroll (node) {
        const nodeOffset = node.offsetLeft;
        const scrollerWidth = this.$refs.scroller.scrollWidth;
        const timelineWidth = this.$refs.timeline.clientWidth;
        if(nodeOffset > scrollerWidth - timelineWidth / 2) {
          this.$refs.timeline.scrollLeft = scrollerWidth - timelineWidth;
        } else if(nodeOffset < timelineWidth / 2) {
          this.$refs.timeline.scrollLeft = 0;
        } else {
          this.$refs.timeline.scrollLeft = nodeOffset + node.clientWidth / 2 - timelineWidth / 2;
        }
      },
    },
    computed: {
      years () {
        const timestamp = moment(this.year + '-' + this.month);

        const ret = {};
        do {
          const year = timestamp.year()
          const months = [];
          do {
            months.push(timestamp.clone());
            timestamp.add(1, 'month');
          } while (this.today > timestamp && timestamp.month() != 0)
          
          ret[year] = months;
        } while (this.today > timestamp)

        //
        // Why do-while here and while-do everythere else?
        // Don't ask, I've spent 4 hours debugging this shit
        // 
        // https://i.imgur.com/pxlJ14y.png
        // https://i.imgur.com/6vjHQre.gifv
        // https://i.imgur.com/d1qbreJ.png
        // https://i.imgur.com/K8hLwMA.png
        // 

        return ret;
      },
    },
    mounted () {
      const months = this.getMonths();
      const monthNode = months[months.length - 1];
      this.addActive(monthNode);
      this.scroll(monthNode);
    }
  }
</script>

<template>
  <div class="timeline my-3" ref="timeline">
    <div class="scroller" ref="scroller">
      <div v-for="months, year in years" class="year px-3">
        <div class="text-center">{{ year }}</div>
        <div class="months-wrap">
          <div v-for="month in months" @click="navigate" class="month py-1 px-3" :data-year="month.year()" :data-month="month.month() + 1">{{ month.format('MMM') }}</div>
        </div>
      </div>
    </div>    
  </div>
</template>

<style lang="scss">
  .timeline {
    position: relative;
    height: 100px;
    overflow-x: scroll;
    overflow-y: hidden;
    border: 1px solid #818a91;
  }
  .scroller {
    position: absolute;
    white-space: nowrap;
    padding: .5rem 1rem;
    transition: 1s ease-in-out;
  }
  .year {
    display: inline-grid;
    grid-template-rows: min-content min-content;
    grid-row-gap: 0.25em;
    border-right: 1px solid #818a91;

    &:first-child {
      border-left: 1px solid #818a91;
    }
  }
  .months-wrap {
    display: grid;
    grid-template-columns: 1fr;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
    grid-column-gap: 0.25em;
  }
  .month {
    display: grid;
    align-items: center;
    justify-items: center;
    border: 1px solid #97b0f8;
    background: #d5ddf6;
    border-radius: .25rem;

    &.active {
      border-color: #ffc200;
      background-color: #fff785;
    }
  }
</style>
