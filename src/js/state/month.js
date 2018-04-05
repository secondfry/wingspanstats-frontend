import axios from 'axios'

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
    getCategory: state => category => {
      try { return state[category].data }
      catch (e) {}
    },
    getFirstInCategory: (state, getters) => category => {
      try { return getters.getCategory(category)[0] }
      catch (e) {}
    }
  },
  mutations: {
    [events.PATCH] (state, { category, data }) {
      if (!state[category]) {
        // We don't display some categories on client
        return;
      }

      state[category].data = data;
    },
    [events.FINISHER] (state, data) {
      state.summary = data.summary;
      state.isLoaded = true;
    },
    [events.CACHE_HIT] (state, data) {
      for (let category of Object.keys(data)) {
        if (!state[category] || category === 'summary') {
          // We don't display some categories on client
          continue;
        }

        requestAnimationFrame(() => {
          state[category].data = data[category];
        });
      }
      state.summary = data.summary;
      state.isLoaded = true;
    },
    [events.LOAD_SUCCESS] (state, data) {
      for (let category of Object.keys(data)) {
        if (!state[category] || category === 'summary') {
          // We don't display some categories on client
          continue;
        }

        state[category].data = data[category];
      }
      state.summary = data.summary;
      state.isLoaded = true;
    },
  },
  actions: {
    loadMonthCache ({ commit, dispatch }, { year, month }) {
      return this._vm.$getItem('month-' + year + '-' + month)
        .then(data => {
          if (data) {
            dispatch('startCascade', data);
            return true;
          } else {
            dispatch('loadMonth', { year, month });
            return false;
          }
        })
        .catch(console.log.bind(console));
    },
    loadMonthFast ({ commit, dispatch }, { year, month }) {
      return dispatch('loadMonthCache', { year, month })
        .then(status => {
          if (status) {
            return dispatch('loadMonth', { year, month });
          }          
        })
        .catch(console.log.bind(console));
    },
    loadMonth ({ commit, dispatch }, { year, month }) {
      commit(events.REQUEST);
      return axios
        .get('/api/month/' + year + '/' + month + '/')
        .then(res => res.data)
        .then(data => {
          this._vm.$setItem('month-' + year + '-' + month, data);
          dispatch('startCascade', data);
        })
        .catch(console.log.bind(console))
    },
    startCascade ({ commit, dispatch }, data) {
      for (let category of Object.keys(data)) {
        if (category === 'summary') {
          continue;
        }

        dispatch('applyCategory', { category, data: data[category] });
      }

      commit(events.FINISHER, data);
    },
    applyCategory ({ commit }, { category, data }) {
      commit(events.PATCH, { category, data });
    },
  }
}
