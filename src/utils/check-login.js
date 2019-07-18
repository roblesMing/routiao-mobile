import store from '@/store'
import { Dialog } from 'vant'
import router from '@/router'
export default () => {
  const { user } = store.state
  if (user) {
    return true
  } else {
    Dialog.confirm({
      title: '操作提示',
      message: '该操作需要登录，确定登录吗？'
    }).then(() => {
      router.push({ name: 'login', query: { redirect: router.currentRoute.fullPath } })
    }).catch(() => {
    // on cancel
    })
  }
}