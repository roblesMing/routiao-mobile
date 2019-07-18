import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
import router from '@/router'
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})
request.defaults.transformResponse = [function (data) {
  try {
    return JSONbig.parse(data)
  } catch (err) {
    return data
  }
}]
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
}, async function (err) {
  if (err.response.status === 401) {
    const user = store.state.user
    if (!user) {
      router.push({
        name: 'login'
      })
      return
    }
    try {
      const { data } = await axios({
        method: 'PUT',
        url: 'http://ttapi.research.itcast.cn/app/v1_0/authorizations',
        headers: {
          Authorization: `Bearer ${user.refresh_token}`
        }
      })
      store.commit('setUser', {
        token: data.data.token,
        refresh_token: user.refresh_token
      })
      return request(err.config)
    } catch (refreshErr) {
      router.push({
        name: 'login'
      })
    }
  }
  return Promise.reject(err)
})
export default request
