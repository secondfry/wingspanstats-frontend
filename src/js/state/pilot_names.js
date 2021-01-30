import axios from 'axios';
import localforage from 'localforage';

const events = {
  CACHE_HIT: 'PILOT_NAMES_CACHE_HIT',
  LOAD_SUCCESS: 'PILOT_NAMES_LOAD_SUCCESS',
  LOAD_FAIL: 'PILOT_NAMES_LOAD_FAIL',
  REQUEST: 'PILOT_NAMES_REQUEST'
};

export default {
  state: {
    data: {},
    isLoaded: false,
  },
  getters: {
    getPilotName: state => id => {
      try { return state.data[id].name }
      catch (e) {}
    }
  },
  mutations: {
    [events.CACHE_HIT] (state, data) {
      state.data = data;
      state.isLoaded = true;
    },
    [events.LOAD_SUCCESS] (state, data) {
      state.data = data;
      state.isLoaded = true;
    },
  },
  actions: {
    loadPilotNamesFast ({ commit, dispatch }) {
      localforage.getItem('pilot_names')
        .then(data => {
          if (data) {
            commit(events.CACHE_HIT, data);
          }
        })
        .then(() => {
          dispatch('loadPilotNames');
        })
        .catch(console.log.bind(console));
    },
    loadPilotNames ({ commit }) {
      commit(events.REQUEST);
      return axios
        .get('/api/pilot/names/')
        .then(res => {
          const ret = {};
          for (let pilot of res.data) {
            ret[pilot._id] = pilot
          }
          return ret
        })
        .then(data => {
          localforage.setItem('pilot_names', data);
          commit(events.LOAD_SUCCESS, data);
        })
        .catch(console.log.bind(console))
    }
  }
}
