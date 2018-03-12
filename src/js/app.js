import Vue from 'vue'
import Vuex from 'vuex'
import VueLocalForage from 'vue-localforage'
import store from './store'

import ViewAllTime from './components/view-alltime.vue'
import ViewMonth from './components/view-month.vue'

Vue.use(Vuex);
Vue.use(VueLocalForage);

const app = new Vue({
  store,
  el: '#root',
  components: {
    ViewAllTime,
    ViewMonth
  }
});
