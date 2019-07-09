import axios from 'axios'
const request = axios.create({
  baseURL: 'http://toutiao.course.itcast.cn'
})
request.interceptors.request.use(function (config) {
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
