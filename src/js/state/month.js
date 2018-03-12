import axios from 'axios'

const month_events = {
  CACHE_HIT: 'MONTH_CACHE_HIT',
  LOAD_SUCCESS: 'MONTH_LOAD_SUCCESS',
  LOAD_FAIL: 'MONTH_LOAD_FAIL',
  REQUEST: 'MONTH_REQUEST'
};

export default {
  state: {
    leaderboards: {}
  },
  getters: {
    getCategory: state => category => {
      try { return state.leaderboards[category] }
      catch (e) {}
    },
    getFirstInCategory: (state, getters) => category => {
      try { return getters.getCategory(category)[0] }
      catch (e) {}
    }
  },
  mutations: {
    [month_events.CACHE_HIT] (state, data) {
      state.leaderboards = data;
    },
    [month_events.LOAD_SUCCESS] (state, data) {
      state.leaderboards = data;
    },
  },
  actions: {
    loadMonthCache ({ commit, dispatch }, { year, month }) {
      return this._vm.$getItem('month-' + year + '-' + month)
        .then(data => {
          if (data) {
            commit(month_events.CACHE_HIT, data);
            return true;
          } else {
            dispatch('loadMonth', { year, month })
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
    loadMonth ({ commit }, { year, month }) {
      commit(month_events.REQUEST);
      return axios
        .get('/api/year/' + year + '/month/' + month + '/')
        .then(res => res.data.leaderboards)
        .then(data => {
          this._vm.$setItem('month-' + year + '-' + month, data);
          commit(month_events.LOAD_SUCCESS, data);
        })
        .catch(console.log.bind(console))
    }
  }
}
