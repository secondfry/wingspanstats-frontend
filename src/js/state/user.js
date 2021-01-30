import localforage from 'localforage';

const events = {
  RIVAL_ADD: 'RIVAL_ADD',
  RIVALS_RESET: 'RIVALS_RESET',
  TRACK: 'USER_TRACK',
  TRACK_CACHE_HIT: 'TRACK_CACHE_HIT',
  SETTINGS_SET_NIGHT: 'SETTINGS_SET_NIGHT',
  SETTINGS_CACHE_HIT: 'SETTINGS_CACHE_HIT',
};

export default {
  state: {
    user: {
      id: null
    },
    rivals: [],
    settings: {
      darkMode: false,
    }
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
    },
    [events.SETTINGS_SET_NIGHT] (state, isDark) {
      state.settings.darkMode = isDark;
    },
    [events.SETTINGS_CACHE_HIT] (state, data) {
      state.settings.darkMode = data.isDark;
    },
  },
  actions: {
    async loadUserId ({ commit }) {
      const data = await localforage.getItem('user');
      if (!data) {
        return;
      }

      commit(events.TRACK_CACHE_HIT, data.id);
    },
    async trackUserId ({ commit }, id) {
      await localforage.setItem('user', { id });
      return commit(events.TRACK, id);
    },
    addRival ({ commit }, id) {
      return commit(events.RIVAL_ADD, id);
    },
    resetRivals ({ commit }) {
      return commit(events.RIVALS_RESET);
    },
    async loadSettings ({ commit }) {
      const data = await localforage.getItem('settings');
      if (!data) {
        return;
      }

      commit(events.SETTINGS_CACHE_HIT, data);
    },
    async setNight ({ commit }, isDark) {
      localStorage.isDark = isDark;
      document.body.style.background = '';

      await localforage.setItem('settings', { isDark });
      return commit(events.SETTINGS_SET_NIGHT, isDark);
    }
  }
}
