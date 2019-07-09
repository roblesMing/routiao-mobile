import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import { Button, Tabbar, TabbarItem, NavBar, Field, CellGroup, Loading, List, Tab, Tabs, PullRefresh, Cell } from 'vant'
Vue.config.productionTip = false
Vue.use(Button).use(Tabbar).use(TabbarItem).use(NavBar).use(Field).use(CellGroup).use(Loading).use(List).use(Tab).use(Tabs).use(PullRefresh).use(Cell)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
