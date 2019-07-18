<template>
  <div class="more-action">
      <van-button icon='star-o'
      :disabled='article.aut_id?false:true'
      round
      :loading='isLikeLoading'
      :type="isLike ? 'danger' : 'default'"
      @click='handleLike'
      >{{isLike?"取消":""}}点赞</van-button>
      <van-button icon='delete'
      :disabled='article.aut_id?false:true'
      round
      :loading='isDisLikeLoading'
      @click='handleDisLike'
      :type='isDisLike ? "danger" : "default"'
      >{{isDisLike?"取消":""}}不喜欢</van-button>
  </div>
</template>
<script>
import { likeArticle, disLikeArticle, unLikeArticle, unDisLikeArticle } from '@/api/article'
export default {
  name: 'AuthInfo',
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      isLikeLoading: false,
      isDisLikeLoading: false
    }
  },
  computed: {
    isLike () {
      return this.article.attitude === 1
    },
    isDisLike () {
      return this.article.attitude === 0
    }
  },
  created () {},
  methods: {
    async handleLike () {
      try {
        if (!this.$checkLogin()) {
          return
        }
        this.isLikeLoading = true
        const articleId = this.article.art_id
        if (this.isLike) {
          console.log(1111)
          await unLikeArticle(articleId)
          this.article.attitude = -1
        }
        else {
          console.log(2222)
          await likeArticle(articleId)
          this.article.attitude = 1
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isLikeLoading = false
    },
    async handleDisLike () {
      try {
        if (!this.$checkLogin()) {
          return
        }
        this.isDisLikeLoading = true
        const articleId = this.article.art_id
        if (this.isDisLike) {
          await unDisLikeArticle(articleId)
          this.article.attitude = -1
        }
        else {
          await disLikeArticle(articleId)
          this.article.attitude = 0
        }
      } catch (err) {
        this.$toast.fail('操作失败')
      }
      this.isDisLikeLoading = false
    }
  }
}
</script>
<style lang='less' scoped>
.more-action {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}
</style>
