import axios from 'axios'

const pilots = {
  CACHE_HIT: 'PILOTS_CACHE_HIT',
  LOAD_SUCCESS: 'PILOTS_LOAD_SUCCESS',
  LOAD_FAIL: 'PILOTS_LOAD_FAIL',
  REQUEST: 'PILOTS_REQUEST'
};

export default {
  state: {
    data: {}
  },
  getters: {
    getPilotName: state => id => {
      try { return state.data[id].name }
      catch (e) {}
    }
  },
  mutations: {
    [pilots.CACHE_HIT] (state, data) {
      state.data = data;
    },
    [pilots.LOAD_SUCCESS] (state, data) {
      state.data = data;
    },
  },
  actions: {
    loadPilotsFast ({ commit, dispatch }) {
      this._vm.$getItem('pilots')
        .then(data => {
          if (data) {
            commit(pilots.CACHE_HIT, data);
          }          
        })
        .then(() => {
          dispatch('loadPilots');
        })
        .catch(console.log.bind(console));
    },
    loadPilots ({ commit }) {
      commit(pilots.REQUEST);
      return axios
        .get('/api/pilots/')
        .then(res => {
          const ret = {}
          for (let pilot of res.data) {
            ret[pilot._id] = pilot
          }
          return ret
        })
        .then(data => {
          this._vm.$setItem('pilots', data);
          commit(pilots.LOAD_SUCCESS, data);
        })
        .catch(console.log.bind(console))
    }
  }
}
