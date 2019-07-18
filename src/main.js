import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'

import VeeValidate, { Validator } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN'
import relativeTime from '@/filters/relative-time'
import checkLogin from './utils/check-login'
Vue.use(Lazyload)
Vue.use(VeeValidate, {
  events: ''
})
Vue.filter('relativeTime', relativeTime)
// Validator.localize('zh_CN', zhCN)
Validator.localize('zh_CN', zhCN)
Vue.use(Vant)
Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(resolve, time)
  })
}
Vue.prototype.$checkLogin = checkLogin
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
