import request from '@/utils/request'
export const getArticles = ({
  channelId, timestamp, withTop
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelId,
      timestamp,
      with_top: withTop
    }
  })
}
export const dislikesArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
export const reportArticle = ({ target, type, remark }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target,
      type,
      remark
    }
  })
}
export const getArticleDetail = articleId => {
  return request({
    method: 'GET',
    url: `/app/v1_0/articles/${articleId}`
  })
}
export const likeArticle = articleId => {
  return request({
    method: 'POST',
    url: `/app/v1_0/article/likings`,
    data: {
      target: articleId
    }
  })
}
export const unLikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/likings/${articleId}`
  })
}
export const disLikeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
export const unDisLikeArticle = articleId => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/article/dislikes/${articleId}`
  })
}
