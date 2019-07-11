import axios from 'axios'
import store from '@/store'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
request.interceptors.request.use(function (config) {
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (err) {
  return Promise.reject(err)
})
request.interceptors.response.use(function (response) {
  if (response.data && response.data.data) {
    return response.data.data
  } else {
    return response.data
  }
}, function (err) {
  return Promise.reject(err)
})
export default request
