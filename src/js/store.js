import Vuex from 'vuex'

import alltime from './state/alltime'
import month from './state/month'
import pilots from './state/pilots'

const store = new Vuex.Store({
  modules: {
    alltime,
    month,
    pilots
  }
});

export default store;
