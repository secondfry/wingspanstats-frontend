import Vuex from 'vuex'

import achievements from './state/achievements'
import alltime from './state/alltime'
import category from './state/category'
import month from './state/month'
import pilot_medals from './state/pilot_medals'
import pilot_names from './state/pilot_names'
import user from './state/user'

const store = new Vuex.Store({
  modules: {
    achievements,
    alltime,
    category,
    month,
    pilot_medals,
    pilot_names,
    user,
  }
});

export default store;
