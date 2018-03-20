import Vuex from 'vuex'

import achievements from './state/achievements'
import alltime from './state/alltime'
import category from './state/category'
import month from './state/month'
import pilots from './state/pilots'
import user from './state/user'

const store = new Vuex.Store({
  modules: {
    achievements,
    alltime,
    category,
    month,
    pilots,
    user,
  }
});

export default store;
