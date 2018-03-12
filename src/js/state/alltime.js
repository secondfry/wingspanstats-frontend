import axios from 'axios'

const alltime = {
  CACHE_HIT: 'ALLTIME_CACHE_HIT',
  LOAD_SUCCESS: 'ALLTIME_LOAD_SUCCESS',
  LOAD_FAIL: 'ALLTIME_LOAD_FAIL',
  REQUEST: 'ALLTIME_REQUEST'
};

export default {
  state: {
    data: {
      value: undefined,
      count: undefined,
      damage: undefined
    },
    isLoaded: false,
  },
  mutations: {
    [alltime.CACHE_HIT] (state, data) {
      state.data = data;
      state.isLoaded = true;
    },
    [alltime.LOAD_SUCCESS] (state, data) {
      state.data = data;
      state.isLoaded = true;
    },
  },
  actions: {
    loadAlltimeFast ({ commit, dispatch }) {
      this._vm.$getItem('alltime')
        .then(data => {
          if (data) {
            commit(alltime.CACHE_HIT, data);
          }
        })
        .then(() => {
          dispatch('loadAlltime');
        })
        .catch(console.log.bind(console));
    },
    loadAlltime ({ commit }) {
      commit(alltime.REQUEST);
      return axios
        .get('/api/summary/')
        .then(res => {
          this._vm.$setItem('alltime', res.data);
          commit(alltime.LOAD_SUCCESS, res.data);
        })
        .catch(console.log.bind(console))
    }
  }
}
