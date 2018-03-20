const events = {
  RIVAL_ADD: 'RIVAL_ADD',
  RIVALS_RESET: 'RIVALS_RESET',
  TRACK: 'USER_TRACK',
  TRACK_CACHE_HIT: 'TRACK_CACHE_HIT',
};

export default {
  state: {
    user: {
      id: null
    },
    rivals: []
  },
  getters: {
    hasUser: state => !!state.user.id
  },
  mutations: {
    [events.TRACK_CACHE_HIT] (state, id) {
      state.user.id = id;
    },
    [events.TRACK] (state, id) {
      state.user.id = id;
    },
    [events.RIVAL_ADD] (state, id) {
      state.rivals.push({ id });
    },
    [events.RIVALS_RESET] (state) {
      state.rivals = [];
    }
  },
  actions: {
    loadUserId ({ commit }) {
      return this._vm.$getItem('user')
        .then(data => {
          if (data) {
            commit(events.TRACK_CACHE_HIT, data.id);
          }
        })
        .catch(console.log.bind(console));
    },
    trackUserId ({ commit }, id) {
      this._vm.$setItem('user', { id });
      return commit(events.TRACK, id);
    },
    addRival ({ commit }, id) {
      return commit(events.RIVAL_ADD, id);
    },
    resetRivals ({ commit }) {
      return commit(events.RIVALS_RESET);
    }
  }
}
