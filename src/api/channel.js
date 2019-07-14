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
export const getAllChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/channels'
  })
}
export const deleteUserChannel = channelId => {
  return request({
    method: 'DELETE',
    url: `app/v1_0/user/channels/${channelId}`
  })
}
export const updateUserChannel = channels => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/channels`,
    data: {
      channels
    }
  })
}
