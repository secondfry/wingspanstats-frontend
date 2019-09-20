import axios from 'axios'

import sleep from '../utility/sleep'

import default_state from '../components/view-month/registry-leaderboards'
const real_default_state = JSON.parse(JSON.stringify(default_state));

const events = {
  CACHE_HIT: 'MONTH_CACHE_HIT',
  LOAD_SUCCESS: 'MONTH_LOAD_SUCCESS',
  LOAD_FAIL: 'MONTH_LOAD_FAIL',
  PATCH: 'MONTH_PATCH',
  FINISHER: 'MONTH_FINISHER',
  REQUEST: 'MONTH_REQUEST',
};

export default {
  state: {
    ...real_default_state,
    summary: {
      count: null,
      damage: null,
      value: null
    },
    isLoaded: false
  },
  getters: {
    getIsMonthLoaded: state => date => {
      try { return state[date].isLoaded; }
      catch (e) { return false; }
    },
    getCategory: state => category => {
      try { return state[category].data }
      catch (e) {}
    },
    getFirstInCategory: (state, getters) => category => {
      try { return getters.getCategory(category)[0] }
      catch (e) {}
    },
  },
  mutations: {
    [events.PATCH] (state, { year, month, category, data }) {
      if (!state[category]) {
        // We don't display some categories on client
        return;
      }

      state[category].data = data;
    },
    [events.FINISHER] (state, { year, month, data }) {
      state.summary = data.summary;
      state.isLoaded = true;
    },
  },
  actions: {
    async loadMonth ({ commit, dispatch }, { year, month }) {
      const statusCache = await dispatch('loadMonthFromCache', { year, month });
      if (statusCache && moment().diff(moment().year(year).month(month), 'months') > 1) {
        return;
      }

      return await dispatch('loadMonthFromAPI', { year, month });
    },
    async loadMonthFromCache ({ dispatch }, { year, month }) {
      const data = await this._vm.$getItem('month-' + year + '-' + month);
      if (!data) {
        return false;
      }

      await dispatch('startCascade', { year, month, data });
      return true;
    },
    async loadMonthFromAPI ({ dispatch }, { year, month }) {
      commit(events.REQUEST);
      const res = await axios.get('/api/month/' + year + '/' + month + '/');
      const data = res.data;
      if (!data) {
        return false;
      }

      await this._vm.$setItem('month-' + year + '-' + month, data);
      await dispatch('startCascade', { year, month, data });
      return true;
    },
    async startCascade ({ commit, dispatch }, { year, month, data }) {
      for (let category of Object.keys(data)) {
        if (category === 'summary') {
          continue;
        }

        await dispatch('applyCategory', { year, month, category, data: data[category] });
      }

      commit(events.FINISHER, { year, month, data });
    },
    async applyCategory ({ commit }, { year, month, category, data }) {
      commit(events.PATCH, { year, month, category, data });
      await sleep(0);
    },
  }
}
