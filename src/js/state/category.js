import axios from 'axios'

import default_state from '../components/view-month/registry-leaderboards'
const real_default_state = JSON.parse(JSON.stringify(default_state));

const events = {
  CACHE_HIT: 'CATEGORY_CACHE_HIT',
  LOAD_SUCCESS: 'CATEGORY_LOAD_SUCCESS',
  LOAD_FAIL: 'CATEGORY_LOAD_FAIL',
  REQUEST: 'CATEGORY_REQUEST'
};

export default {
  state: {
    ...real_default_state
  },
  mutations: {
    [events.CACHE_HIT] (state, { category, data }) {
      state[category].data = data;
    },
    [events.LOAD_SUCCESS] (state, { category, data }) {
      state[category].data = data;
    },
  },
  actions: {
    loadCategoryCache ({ commit, dispatch }, { category }) {
      return this._vm.$getItem([ category, 'alltime' ].join('-'))
        .then(data => {
          if (data) {
            commit(events.CACHE_HIT, { category, data });
            return true;
          } else {
            dispatch('loadCategory', { category });
            return false;
          }
        })
        .catch(console.log.bind(console));
    },
    loadCategoryFast ({ commit, dispatch }, { category }) {
      return dispatch('loadCategoryCache', { category })
        .then(status => {
          if (status) {
            return dispatch('loadCategory', { category });
          }
        })
        .catch(console.log.bind(console));
    },
    loadCategory ({ commit }, { category }) {
      commit(events.REQUEST);
      return axios
        .get('/api/category/' + category + '/')
        .then(res => res.data)
        .then(data => {
          this._vm.$setItem([ category, 'alltime' ].join('-'), data);
          commit(events.LOAD_SUCCESS, { category, data });
        })
        .catch(console.log.bind(console))
    }
  }
}
