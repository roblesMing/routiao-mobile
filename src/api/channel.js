import request from '@/utils/request'
export const getUserChannel = () => {
  return request({
    method: 'GET',
    url: 'app/v1_0/user/channels'
  })
}
export const resetUserChannels = channles => {
  return request({
    method: 'PUT',
    url: '/app/v1_0/user/channels',
    data: {
      channles
    }
  })
}
