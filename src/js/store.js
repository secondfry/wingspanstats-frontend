import Vuex from 'vuex'

import alltime from './state/alltime'
import category from './state/category'
import month from './state/month'
import pilots from './state/pilots'

const store = new Vuex.Store({
  modules: {
    alltime,
    category,
    month,
    pilots
  }
});

export default store;
