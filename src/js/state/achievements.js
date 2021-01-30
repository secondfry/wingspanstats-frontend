import axios from 'axios';
import localforage from 'localforage';

import default_state from '../components/view-achievements/registry';

const real_default_state = JSON.parse(JSON.stringify(default_state));

const events = {
  CACHE_HIT: 'ACHIEVEMENTS_CACHE_HIT',
  LOAD_SUCCESS: 'ACHIEVEMENTS_LOAD_SUCCESS',
  LOAD_FAIL: 'ACHIEVEMENTS_LOAD_FAIL',
  REQUEST: 'ACHIEVEMENTS_REQUEST'
};

export default {
  state: {
    data: {
      ...real_default_state
    },
    isLoaded: false
  },
  mutations: {
    [events.CACHE_HIT] (state, data) {
      for (let key of Object.keys(real_default_state)) {
        state.data[key].data = [];
      }

      for (let pilot of data) {
        for (let achievement of pilot.achievements) {
          const key = achievement.id;
          state.data[key].data.push({character_id: pilot._id, killmail: achievement.killmail})
        }
      }
      state.isLoaded = true;
    },
    [events.LOAD_SUCCESS] (state, data) {
      for (let key of Object.keys(real_default_state)) {
        state.data[key].data = [];
      }

      for (let pilot of data) {
        for (let achievement of pilot.achievements) {
          const key = achievement.id;
          state.data[key].data.push({character_id: pilot._id, killmail: achievement.killmail})
        }
      }
      state.isLoaded = true;
    },
  },
  actions: {
    loadAchievementsFast ({ commit, dispatch }) {
      localforage.getItem('achievements')
        .then(data => {
          if (data) {
            commit(events.CACHE_HIT, data);
          }
        })
        .then(() => {
          dispatch('loadAchievements');
        })
        .catch(console.log.bind(console));
    },
    loadAchievements ({ commit }) {
      commit(events.REQUEST);
      return axios
        .get('/api/achievements/')
        .then(res => {
          localforage.setItem('achievements', res.data);
          commit(events.LOAD_SUCCESS, res.data);
        })
        .catch(console.log.bind(console))
    }
  }
}
