import axios from 'axios'
import Vue from 'vue'

const events = {
  CACHE_HIT: 'PILOT_MEDALS_CACHE_HIT',
  LOAD_SUCCESS: 'PILOT_MEDALS_LOAD_SUCCESS',
  LOAD_FAIL: 'PILOT_MEDALS_LOAD_FAIL',
  REQUEST: 'PILOT_MEDALS_REQUEST'
};

export default {
  state: {
    data: {},
    isLoaded: false,
  },
  getters: {
    getPilotMedals: state => id => {
      try { return state.data[id].medals }
      catch (e) {}
    },
    getPilotCategoryMedals: (state, getters) => (id, category) => {
      try { return getters.getPilotMedals(id)[category]; }
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
    loadPilotMedalsFast ({ commit, dispatch }) {
      this._vm.$getItem('pilot_medals')
        .then(data => {
          if (data) {
            commit(events.CACHE_HIT, data);
          }
        })
        .then(() => {
          dispatch('loadPilotMedals');
        })
        .catch(console.log.bind(console));
    },
    loadPilotMedals ({ commit }) {
      commit(events.REQUEST);
      return axios
        .get('/api/pilot/medals/')
        .then(res => {
          const ret = {};
          for (let pilot of res.data) {
            ret[pilot._id] = pilot
          }
          return ret
        })
        .then(data => {
          this._vm.$setItem('pilot_medals', data);
          commit(events.LOAD_SUCCESS, data);
        })
        .catch(console.log.bind(console))
    }
  }
}
